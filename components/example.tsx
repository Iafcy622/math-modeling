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
  ScatterDataPoint,
  ChartOptions,
  ChartData,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { generateData, polyfit1d } from "@/lib/generate";
import KaTeX from "@/components/katex-expression";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ScatterController,
  Title,
  Tooltip,
  Legend
);

export default function Example() {
  const pts: ScatterDataPoint[] = [
    { x: 1, y: 8.1 },
    { x: 2, y: 22.1 },
    { x: 3, y: 60.1 },
    { x: 4, y: 165 },
  ];
  const [xValues, yValues] = generateData("50.87 * x - 63.35", 0, 5, 0.5);

  const { a, b } = polyfit1d(pts);

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

  return (
    <main>
      <div className="grid grid-cols-2 w-full py-4">
        <div className="w-full">
          {/* <Table>
            <TableCaption>Data points</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>x</TableHead>
                <TableHead>y</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pts.map((pt) => {
                return (
                  <TableRow>
                    <TableCell>{pt.x}</TableCell>
                    <TableCell>{pt.y}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table> */}
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
        <div className="w-full">
          <Chart type="line" data={data} options={options} />
        </div>
      </div>
    </main>
  );
}
