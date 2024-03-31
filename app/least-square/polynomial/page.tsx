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
import { generateData, polyfit } from "@/lib/generate";
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

export default function Page() {
  const alphabet = ["a", "b", "c", "d", "e", "f"];

  const pts = [
    { x: 1, y: 8 },
    { x: 2, y: 12 },
    { x: 3, y: 9 },
    { x: 4, y: 3 },
    { x: 5, y: 7 },
    { x: 6, y: 2 },
  ];

  const [order, setOrder] = useState(1);

  const { param, expression, evalExpression } = polyfit(pts, order);

  const [xValues, yValues] = generateData(evalExpression, 0, 7, 0.5);

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

  return (
    <>
      <h1 className="text-2xl my-4">Least-squares Criterion (Polynomial)</h1>
      <Separator />

      <div className="grid grid-cols-2 gap-6 mt-6">
        <div className="py-4">
          <form className="mb-8">
            <Label htmlFor="order">Order : {order}</Label>
            <Slider
              className="mb-4"
              defaultValue={[order]}
              max={5}
              min={1}
              step={1}
              id="order"
              onValueChange={([val]) => setOrder(val)}
            />
          </form>

          <span className="text-xl">Model function: </span>
          <KaTeX
            texExpression={`f(x)=${expression}`}
            className="mt-2 text-lg"
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
          texExpression={`\\text{Assume the model function is }f(x;${alphabet
            .slice(0, order + 1)
            .join(",")})=${alphabet
            .slice(0, order + 1)
            .map(
              (char, i) =>
                char +
                (order - i > 1 ? `x^${order - i}` : order - i == 1 ? "x" : "")
            )
            .join("+")}`}
          className="mt-6 text-lg"
        />
        <KaTeX
          texExpression="\displaystyle\text{We would like to minimize }S(a,b) = \sum_{i=1}^m (y_i-f(x_i))^2"
          className="mt-2 text-lg"
        />

        <KaTeX
          texExpression={
            "\\begin{cases}" +
            alphabet
              .slice(0, order + 1)
              .map((char, i) =>
                order - i > 1
                  ? `\\displaystyle \\cfrac{\\partial S}{\\partial ${char}} = \\sum_{i=1}^m (-2x_i^${
                      order - i
                    }(y_i-f(x_i))) = 0`
                  : order - i == 1
                  ? `\\displaystyle \\cfrac{\\partial S}{\\partial ${char}} = \\sum_{i=1}^m (-2x_i(y_i-f(x_i))) = 0`
                  : `\\displaystyle \\cfrac{\\partial S}{\\partial ${char}} = \\sum_{i=1}^m (-2(y_i-f(x_i))) = 0`
              )
              .join("\\\\") +
            "\\end{cases}"
          }
        />

        <KaTeX
          texExpression={`\\therefore ${param.map(
            (p, i) => `${alphabet[i]}=${p.toFixed(2)}`
          )}`}
          className="mt-2 text-lg"
        />
        <KaTeX
          texExpression={`\\text{Our model function is }f(x)=${expression}`}
          className="mt-2 text-lg"
        />
      </div>
    </>
  );
}
