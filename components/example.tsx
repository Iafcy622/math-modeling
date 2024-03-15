"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ScatterController,
  LineController,
  ScatterDataPoint,
  ChartOptions,
  ChartData,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { generateData, polyfit1d } from "@/lib/generate";
import KaTeX from "@/components/katex-expression";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ScatterController,
  LineController,
  Title,
  Tooltip,
  Legend
);

export default function Example() {
  const [pts, setPts] = useState([
    { x: 1, y: 2 },
    { x: 2, y: 3 },
    { x: 3, y: 6 },
  ]);

  const { a, b } = polyfit1d(pts);

  const [xValues, yValues] = generateData(`${a} * x + ${b}`, 0, 4);

  const options: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 1.25,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Least-squares criterion",
      },
    },
    scales: {
      y: {
        suggestedMax: 8,
        suggestedMin: 0,
        beginAtZero: true,
      },
    },
  };

  const data: ChartData = {
    labels: xValues,
    datasets: [
      {
        type: "line" as const,
        label: "y=f(x)",
        data: yValues,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        type: "scatter" as const,
        label: "data",
        data: pts,
        backgroundColor: "rgb(9, 249, 242)",
      },
    ],
  };

  function handleInputChange(val: number, x: number) {
    setPts(pts.map((pt) => (pt.x == x ? { x, y: val } : pt)));
  }

  return (
    <>
      <h1 className="text-2xl my-4">Least-squares Criterion (Linear)</h1>
      <Separator />

      <div className="grid grid-cols-2 gap-6 mt-6">
        <div className="py-4">
          <form className="mb-8">
            <Label htmlFor="y1">y1</Label>
            <Slider
              className="mb-4"
              defaultValue={[pts[0].y]}
              max={6}
              step={1}
              id="y1"
              onValueChange={([val]) => handleInputChange(val, 1)}
            />
            <Label htmlFor="y2">y2</Label>
            <Slider
              className="mb-4"
              defaultValue={[pts[1].y]}
              max={6}
              step={1}
              id="y2"
              onValueChange={([val]) => handleInputChange(val, 2)}
            />
            <Label htmlFor="y3">y3</Label>
            <Slider
              className="mb-4"
              defaultValue={[pts[2].y]}
              max={6}
              step={1}
              id="y3"
              onValueChange={([val]) => handleInputChange(val, 3)}
            />
          </form>

          <span className="text-xl">Model function: </span>
          <KaTeX
            texExpression={`f(x)=${a.toFixed(2)}x ${
              b > 0 ? "+" : "-"
            } ${Math.abs(b).toFixed(2)}`}
            className="inline text-xl"
          />
        </div>
        <div>
          <Chart type="line" data={data} options={options} height={400} />
        </div>
      </div>
      <div className="mt-12">
        <h2 className="text-2xl my-4">Derive the model</h2>
        <Separator />
        <KaTeX
          texExpression="\text{Assume the model function is }f(x;a,b)=ax+b"
          className="mt-6 text-lg"
        />
        <KaTeX
          texExpression="\displaystyle\text{We would like to minimize }S(a,b) = \sum_{i=1}^m (y_i-ax_i-b)^2"
          className="mt-2 text-lg"
        />
        <KaTeX texExpression="\displaystyle \cfrac{\partial S}{\partial a} = \sum_{i=1}^m (-2x_i(y_i-ax_i-b)) = 0" />
        <KaTeX texExpression="\displaystyle \cfrac{\partial S}{\partial b} = \sum_{i=1}^m (-2(y_i-ax_i-b)) = 0" />
        <KaTeX
          texExpression={`\\therefore a=${a.toFixed(2)}, b=${b.toFixed(2)}`}
          className="mt-2 text-lg"
        />
        <KaTeX
          texExpression={`\\text{Our model function is }f(x)=${a.toFixed(2)}x ${
            b > 0 ? "+" : "-"
          } ${Math.abs(b).toFixed(2)}`}
          className="mt-2 text-lg"
        />
      </div>
    </>
  );
}
