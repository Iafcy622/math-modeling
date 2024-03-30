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

  i1 = Math.floor(i1);
  i2 = Math.ceil(i2);

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

export function polyfit(
  data: Point[],
  order: number
): { param: number[]; expression: string; evalExpression: string } {
  const n = data.length;
  const sumX = [];

  for (let i = order * 2; i > 0; i--) {
    let temp = 0;
    for (let j = 0; j < n; j++) {
      temp += Math.pow(data[j].x, i);
    }
    sumX.push(temp);
  }
  sumX.push(n);

  const arrA = [];
  for (let i = 0; i < order + 1; i++) {
    arrA.push(sumX.slice(i, i + order + 1));
  }

  const arrB = [];
  for (let i = order; i >= 0; i--) {
    let temp = 0;
    for (let j = 0; j < n; j++) {
      temp += Math.pow(data[j].x, i) * data[j].y;
    }
    arrB.push(temp);
  }

  const A = math.matrix(arrA);
  const B = math.matrix(arrB);
  const res = math.multiply(math.inv(A), B);

  const param = [];
  let expression = "";
  let evalExpression = "";
  for (let i = 0; i < order + 1; i++) {
    param.push(res.get([i]));

    if (res.get([i]) >= 0 && i != 0) {
      expression += "+";
      evalExpression += "+";
    }
    if (i == order) {
      expression += `${res.get([i]).toFixed(2)}`;
      evalExpression += `${res.get([i]).toFixed(2)}`;
    } else if (i == order - 1) {
      expression += `${res.get([i]).toFixed(2)}x`;
      evalExpression += `${res.get([i]).toFixed(2)} * x`;
    } else {
      expression += `${res.get([i]).toFixed(2)}x^${order - i}`;
      evalExpression += `${res.get([i]).toFixed(2)} * x**${order - i}`;
    }
  }

  return {
    param,
    expression,
    evalExpression,
  };
}
