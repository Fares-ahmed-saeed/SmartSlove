
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Eye, EyeOff } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export interface Equation {
  id: string;
  expression: string;
  color: string;
  visible: boolean;
  label: string;
}

interface EquationManagerProps {
  equations: Equation[];
  onEquationsChange: (equations: Equation[]) => void;
}

const colors = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
  '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'
];

export const EquationManager = ({ equations, onEquationsChange }: EquationManagerProps) => {
  const { t } = useTranslation();

  const addEquation = () => {
    const newEquation: Equation = {
      id: Date.now().toString(),
      expression: 'x^2',
      color: colors[equations.length % colors.length],
      visible: true,
      label: `f${equations.length + 1}(x)`
    };
    onEquationsChange([...equations, newEquation]);
  };

  const updateEquation = (id: string, updates: Partial<Equation>) => {
    onEquationsChange(equations.map(eq => 
      eq.id === id ? { ...eq, ...updates } : eq
    ));
  };

  const removeEquation = (id: string) => {
    onEquationsChange(equations.filter(eq => eq.id !== id));
  };

  const toggleVisibility = (id: string) => {
    updateEquation(id, { visible: !equations.find(eq => eq.id === id)?.visible });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg">{t('equations')}</CardTitle>
        <Button onClick={addEquation} size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-1" />
          {t('addEquation')}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {equations.map((equation, index) => (
          <div key={equation.id} className="flex items-center gap-2 p-3 border rounded-lg">
            <div 
              className="w-4 h-4 rounded-full border-2"
              style={{ backgroundColor: equation.color }}
            />
            <div className="flex-1 space-y-2">
              <Input
                placeholder={`${equation.label} =`}
                value={equation.expression}
                onChange={(e) => updateEquation(equation.id, { expression: e.target.value })}
                className="text-sm"
              />
            </div>
            <Button
              onClick={() => toggleVisibility(equation.id)}
              size="sm"
              variant="ghost"
            >
              {equation.visible ? 
                <Eye className="h-4 w-4" /> : 
                <EyeOff className="h-4 w-4" />
              }
            </Button>
            {equations.length > 1 && (
              <Button
                onClick={() => removeEquation(equation.id)}
                size="sm"
                variant="ghost"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
