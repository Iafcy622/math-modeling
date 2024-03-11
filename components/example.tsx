"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
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
    { x: 1, y: 8.1 },
    { x: 2, y: 22.1 },
    { x: 3, y: 60.1 },
    { x: 4, y: 165 },
  ]);

  const { a, b } = polyfit1d(pts);

  const xs = pts.map((pt) => pt.x);
  const [xValues, yValues] = generateData(
    `${a} * x + ${b}`,
    Math.min(...xs) - 1,
    Math.max(...xs) + 1,
    0.5
  );

  const options: ChartOptions = {
    responsive: true,
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

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement>,
    pt: ScatterDataPoint,
    field: "x" | "y"
  ) {
    const newPts = pts.map((p) => {
      if (p.x == pt.x && p.y == pt.y) {
        pt[field] = Number(e.target.value);
        return pt;
      } else {
        return p;
      }
    });
    setPts(newPts);
  }

  return (
    <main>
      <h1 className="text-2xl text-center mb-4">
        Least-squares Criterion (Linear)
      </h1>
      <div className="w-1/2 mx-auto">
        <Chart type="line" data={data} options={options} />
      </div>
      <div className="grid grid-cols-2 w-full py-4">
        <div>
          <KaTeX
            texExpression="\text{Assume the model function is }f(x;a,b)=ax+b"
            className="mt-6"
          />
          <KaTeX
            texExpression="\displaystyle\text{We would like to minimize }S(a,b) = \sum_{i=1}^m (y_i-ax_i-b)^2"
            className="mt-2"
          />
          <KaTeX texExpression="\displaystyle \cfrac{\partial S}{\partial a} = \sum_{i=1}^m (-2x_i(y_i-ax_i-b)) = 0" />
          <KaTeX texExpression="\displaystyle \cfrac{\partial S}{\partial b} = \sum_{i=1}^m (-2(y_i-ax_i-b)) = 0" />
          <KaTeX
            texExpression={`\\therefore a=${a.toFixed(2)}, b=${b.toFixed(2)}`}
            className="mt-2"
          />
          <KaTeX
            texExpression={`\\text{Our model function is }f(x)=${a.toFixed(
              2
            )}x ${b > 0 ? "+" : "-"} ${Math.abs(b).toFixed(2)}`}
            className="mt-2"
          />
        </div>
        <Table>
          <TableCaption>Data points</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>x</TableHead>
              <TableHead>y</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pts.map((pt, i) => {
              return (
                <TableRow key={i}>
                  <TableCell>
                    <Input
                      type="number"
                      step={0.5}
                      className="p-4 rounded-none focus-visible:ring-0 ring-0"
                      value={pt.x}
                      onChange={(e) => handleInputChange(e, pt, "x")}
                      onKeyDown={(e) => e.preventDefault()}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step={1}
                      className="p-4 rounded-none focus-visible:ring-0 ring-0"
                      value={pt.y}
                      onChange={(e) => handleInputChange(e, pt, "y")}
                      onKeyDown={(e) => e.preventDefault()}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
