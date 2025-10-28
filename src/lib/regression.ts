import { House } from './supabase';

interface Matrix {
  rows: number;
  cols: number;
  data: number[][];
}

function createMatrix(rows: number, cols: number): Matrix {
  return {
    rows,
    cols,
    data: Array(rows).fill(0).map(() => Array(cols).fill(0))
  };
}

function transpose(matrix: Matrix): Matrix {
  const result = createMatrix(matrix.cols, matrix.rows);
  for (let i = 0; i < matrix.rows; i++) {
    for (let j = 0; j < matrix.cols; j++) {
      result.data[j][i] = matrix.data[i][j];
    }
  }
  return result;
}

function multiply(a: Matrix, b: Matrix): Matrix {
  if (a.cols !== b.rows) {
    throw new Error('Matrix dimensions do not match for multiplication');
  }

  const result = createMatrix(a.rows, b.cols);
  for (let i = 0; i < a.rows; i++) {
    for (let j = 0; j < b.cols; j++) {
      let sum = 0;
      for (let k = 0; k < a.cols; k++) {
        sum += a.data[i][k] * b.data[k][j];
      }
      result.data[i][j] = sum;
    }
  }
  return result;
}

function inverse(matrix: Matrix): Matrix {
  const n = matrix.rows;
  if (n !== matrix.cols) {
    throw new Error('Matrix must be square for inversion');
  }

  const augmented = createMatrix(n, 2 * n);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      augmented.data[i][j] = matrix.data[i][j];
    }
    augmented.data[i][n + i] = 1;
  }

  for (let i = 0; i < n; i++) {
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(augmented.data[k][i]) > Math.abs(augmented.data[maxRow][i])) {
        maxRow = k;
      }
    }

    [augmented.data[i], augmented.data[maxRow]] = [augmented.data[maxRow], augmented.data[i]];

    const pivot = augmented.data[i][i];
    if (Math.abs(pivot) < 1e-10) {
      throw new Error('Matrix is singular and cannot be inverted');
    }

    for (let j = 0; j < 2 * n; j++) {
      augmented.data[i][j] /= pivot;
    }

    for (let k = 0; k < n; k++) {
      if (k !== i) {
        const factor = augmented.data[k][i];
        for (let j = 0; j < 2 * n; j++) {
          augmented.data[k][j] -= factor * augmented.data[i][j];
        }
      }
    }
  }

  const result = createMatrix(n, n);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      result.data[i][j] = augmented.data[i][n + j];
    }
  }

  return result;
}

export interface RegressionModel {
  coefficients: number[];
  intercept: number;
  rSquared: number;
  featureNames: string[];
}

export function trainModel(houses: House[]): RegressionModel {
  const n = houses.length;
  const features = 7;

  const X = createMatrix(n, features + 1);
  const y = createMatrix(n, 1);

  for (let i = 0; i < n; i++) {
    X.data[i][0] = 1;
    X.data[i][1] = houses[i].square_feet;
    X.data[i][2] = houses[i].bedrooms;
    X.data[i][3] = houses[i].bathrooms;
    X.data[i][4] = houses[i].year_built;
    X.data[i][5] = houses[i].lot_size;
    X.data[i][6] = houses[i].garage_spaces;
    X.data[i][7] = houses[i].location_score;
    y.data[i][0] = houses[i].actual_price;
  }

  const Xt = transpose(X);
  const XtX = multiply(Xt, X);
  const XtX_inv = inverse(XtX);
  const Xty = multiply(Xt, y);
  const beta = multiply(XtX_inv, Xty);

  const intercept = beta.data[0][0];
  const coefficients = beta.data.slice(1).map(row => row[0]);

  let totalSS = 0;
  let residualSS = 0;
  const meanY = y.data.reduce((sum, row) => sum + row[0], 0) / n;

  for (let i = 0; i < n; i++) {
    let predicted = intercept;
    for (let j = 0; j < features; j++) {
      predicted += coefficients[j] * X.data[i][j + 1];
    }

    residualSS += Math.pow(y.data[i][0] - predicted, 2);
    totalSS += Math.pow(y.data[i][0] - meanY, 2);
  }

  const rSquared = 1 - (residualSS / totalSS);

  return {
    coefficients,
    intercept,
    rSquared,
    featureNames: ['square_feet', 'bedrooms', 'bathrooms', 'year_built', 'lot_size', 'garage_spaces', 'location_score']
  };
}

export function predict(model: RegressionModel, input: Omit<House, 'id' | 'actual_price' | 'created_at'>): number {
  let price = model.intercept;
  price += model.coefficients[0] * input.square_feet;
  price += model.coefficients[1] * input.bedrooms;
  price += model.coefficients[2] * input.bathrooms;
  price += model.coefficients[3] * input.year_built;
  price += model.coefficients[4] * input.lot_size;
  price += model.coefficients[5] * input.garage_spaces;
  price += model.coefficients[6] * input.location_score;
  return Math.max(0, price);
}
