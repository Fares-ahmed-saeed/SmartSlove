
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";
import { EquationManager, Equation } from "@/components/GraphingCalculator/EquationManager";
import { InteractiveGraph } from "@/components/GraphingCalculator/InteractiveGraph";
import { ImportantPoints } from "@/components/GraphingCalculator/ImportantPoints";
import { findRoots, findIntersections, ImportantPoint } from "@/utils/mathUtils";

export const GraphingCalculator = () => {
  const { t } = useTranslation();
  const [equations, setEquations] = useState<Equation[]>([{
    id: '1',
    expression: 'x^2',
    color: '#3b82f6',
    visible: true,
    label: 'f₁(x)'
  }]);
  const [xMin, setXMin] = useState(-10);
  const [xMax, setXMax] = useState(10);
  const [yMin, setYMin] = useState(-10);
  const [yMax, setYMax] = useState(10);
  const [importantPoints, setImportantPoints] = useState<ImportantPoint[]>([]);

  const calculateImportantPoints = () => {
    const points: ImportantPoint[] = [];
    const visibleEquations = equations.filter(eq => eq.visible);

    // Find roots for each equation
    visibleEquations.forEach((equation) => {
      const roots = findRoots(equation.expression, xMin, xMax);
      roots.forEach((root, index) => {
        points.push({
          ...root,
          type: 'root',
          label: `${equation.label} root ${index + 1}`,
          equations: [equation.expression]
        });
      });
    });

    // Find intersections between equations
    for (let i = 0; i < visibleEquations.length; i++) {
      for (let j = i + 1; j < visibleEquations.length; j++) {
        const eq1 = visibleEquations[i];
        const eq2 = visibleEquations[j];
        const intersections = findIntersections(eq1.expression, eq2.expression, xMin, xMax);
        intersections.forEach((intersection, index) => {
          points.push({
            ...intersection,
            type: 'intersection',
            label: `${eq1.label} ∩ ${eq2.label}`,
            equations: [eq1.expression, eq2.expression]
          });
        });
      }
    }

    setImportantPoints(points);
  };

  useEffect(() => {
    calculateImportantPoints();
  }, [equations, xMin, xMax, yMin, yMax]);

  const handleRangeChange = (newXMin: number, newXMax: number, newYMin: number, newYMax: number) => {
    setXMin(newXMin);
    setXMax(newXMax);
    setYMin(newYMin);
    setYMax(newYMax);
  };

  return (
    <div className="min-h-screen bg-gradient-bg p-4 pb-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6 text-foreground">
          {t('graphingCalculator')}
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <EquationManager 
              equations={equations}
              onEquationsChange={setEquations}
            />
            
            <ImportantPoints points={importantPoints} />
          </div>
          
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('graph')}</CardTitle>
              </CardHeader>
              <CardContent>
                <InteractiveGraph
                  equations={equations}
                  xMin={xMin}
                  xMax={xMax}
                  yMin={yMin}
                  yMax={yMax}
                  importantPoints={importantPoints}
                  onRangeChange={handleRangeChange}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
