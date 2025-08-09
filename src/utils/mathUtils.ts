
export interface Point {
  x: number;
  y: number;
}

export interface ImportantPoint extends Point {
  type: 'root' | 'intersection' | 'extremum';
  equations?: string[];
  label: string;
}

export const findRoots = (equation: string, xMin: number, xMax: number): Point[] => {
  const roots: Point[] = [];
  const step = (xMax - xMin) / 1000;
  
  for (let x = xMin; x <= xMax; x += step) {
    const y = evaluateFunction(x, equation);
    const yNext = evaluateFunction(x + step, equation);
    
    // Check for sign change (root crossing)
    if (!isNaN(y) && !isNaN(yNext) && y * yNext < 0) {
      // Use bisection method for more accurate root finding
      let a = x;
      let b = x + step;
      for (let i = 0; i < 10; i++) {
        const mid = (a + b) / 2;
        const yMid = evaluateFunction(mid, equation);
        if (Math.abs(yMid) < 0.001) break;
        if (y * yMid < 0) {
          b = mid;
        } else {
          a = mid;
        }
      }
      roots.push({ x: (a + b) / 2, y: 0 });
    }
  }
  
  return roots;
};

export const findIntersections = (eq1: string, eq2: string, xMin: number, xMax: number): Point[] => {
  const intersections: Point[] = [];
  const step = (xMax - xMin) / 1000;
  
  for (let x = xMin; x <= xMax; x += step) {
    const y1 = evaluateFunction(x, eq1);
    const y2 = evaluateFunction(x, eq2);
    const y1Next = evaluateFunction(x + step, eq1);
    const y2Next = evaluateFunction(x + step, eq2);
    
    const diff = y1 - y2;
    const diffNext = y1Next - y2Next;
    
    if (!isNaN(diff) && !isNaN(diffNext) && diff * diffNext < 0) {
      // Use bisection method for intersection
      let a = x;
      let b = x + step;
      for (let i = 0; i < 10; i++) {
        const mid = (a + b) / 2;
        const yMid1 = evaluateFunction(mid, eq1);
        const yMid2 = evaluateFunction(mid, eq2);
        const diffMid = yMid1 - yMid2;
        if (Math.abs(diffMid) < 0.001) break;
        if (diff * diffMid < 0) {
          b = mid;
        } else {
          a = mid;
        }
      }
      const xIntersect = (a + b) / 2;
      const yIntersect = evaluateFunction(xIntersect, eq1);
      intersections.push({ x: xIntersect, y: yIntersect });
    }
  }
  
  return intersections;
};

export const evaluateFunction = (x: number, expr: string): number => {
  try {
    let expression = expr
      .replace(/x/g, `(${x})`)
      .replace(/\^/g, '**')
      .replace(/sin/g, 'Math.sin')
      .replace(/cos/g, 'Math.cos')
      .replace(/tan/g, 'Math.tan')
      .replace(/log/g, 'Math.log10')
      .replace(/ln/g, 'Math.log')
      .replace(/sqrt/g, 'Math.sqrt')
      .replace(/pi/g, 'Math.PI')
      .replace(/e/g, 'Math.E');
    
    return eval(expression);
  } catch {
    return NaN;
  }
};
