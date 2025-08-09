
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface CalculatorDisplayProps {
  value: string;
  expression?: string;
  className?: string;
}

export const CalculatorDisplay = ({ value, expression, className }: CalculatorDisplayProps) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (value !== displayValue) {
      setIsAnimating(true);
      setTimeout(() => {
        setDisplayValue(value);
        setIsAnimating(false);
      }, 100);
    }
  }, [value, displayValue]);

  return (
    <Card className={cn(
      "bg-calc-display p-6 mb-6 min-h-[120px] flex flex-col justify-end",
      "shadow-inner border-2 border-border/50",
      "backdrop-blur-sm bg-opacity-90",
      className
    )}>
      {/* Expression display */}
      {expression && (
        <div className="text-right text-sm text-muted-foreground mb-2 font-mono opacity-70">
          {expression}
        </div>
      )}
      
      {/* Main value display */}
      <div className={cn(
        "text-right text-4xl font-bold text-foreground font-mono",
        "transition-all duration-150 ease-out",
        "min-h-[50px] flex items-end justify-end",
        isAnimating && "scale-110 text-primary animate-pulse"
      )}>
        <span className={cn(
          "inline-block transition-transform duration-150",
          isAnimating && "animate-bounce"
        )}>
          {displayValue}
        </span>
      </div>
      
      {/* Animated underline */}
      <div className={cn(
        "h-1 bg-gradient-to-r from-primary to-accent rounded-full mt-2 transition-all duration-300",
        isAnimating ? "w-full opacity-100" : "w-0 opacity-0"
      )} />
    </Card>
  );
};
