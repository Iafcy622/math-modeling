import { Point } from "chart.js";
import { create, all } from "mathjs";

const math = create(all, {});

export function generateData(
  value: string,
  i1: number,
  i2: number,
  step: number = 1
) {
  const xValues: number[] = [];
  const yValues: number[] = [];

  for (let x = i1; x <= i2; x += step) {
    yValues.push(eval(value));
    xValues.push(x);
  }

  return [xValues, yValues];
}

export function polyfit1d(data: Point[]): { a: number; b: number } {
  const xValues = data.map((d) => d.x);
  const yValues = data.map((d) => d.y);

  const A = math.matrix([
    [
      xValues.reduce((acc, curr) => acc + curr * curr, 0),
      xValues.reduce((acc, curr) => acc + curr, 0),
    ],
    [xValues.reduce((acc, curr) => acc + curr, 0), xValues.length],
  ]);
  const B = math.matrix([
    xValues.map((x, i) => x * yValues[i]).reduce((acc, curr) => acc + curr, 0),
    yValues.reduce((acc, curr) => acc + curr, 0),
  ]);

  const res = math.multiply(math.inv(A), B);

  return { a: res.get([0]), b: res.get([1]) };
}
