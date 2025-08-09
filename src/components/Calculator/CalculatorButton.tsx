
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSound } from "@/hooks/useSound";
import { useSettings } from "@/hooks/useSettings";
import { useState } from "react";

interface CalculatorButtonProps {
  value: string;
  onClick: (value: string) => void;
  variant?: "number" | "operator" | "function" | "equals";
  className?: string;
  disabled?: boolean;
}

export const CalculatorButton = ({ 
  value, 
  onClick, 
  variant = "number", 
  className,
  disabled = false 
}: CalculatorButtonProps) => {
  const { playButtonSound, playOperatorSound, playEqualsSound } = useSound();
  const { vibrationEnabled } = useSettings();
  const [isPressed, setIsPressed] = useState(false);

  const getVariantClasses = () => {
    switch (variant) {
      case "number":
        return "bg-calc-number text-foreground border-b-4 border-r-2 border-gray-400 shadow-lg hover:shadow-xl hover:shadow-primary/20";
      case "operator":
        return "bg-calc-operator text-primary-foreground border-b-4 border-r-2 border-purple-700 shadow-lg hover:shadow-xl hover:shadow-primary/30";
      case "function":
        return "bg-calc-function text-primary-foreground border-b-4 border-r-2 border-pink-700 shadow-lg hover:shadow-xl hover:shadow-accent/30";
      case "equals":
        return "bg-calc-equals text-primary-foreground border-b-4 border-r-2 border-green-700 shadow-lg hover:shadow-xl hover:shadow-green-500/30";
      default:
        return "bg-calc-number text-foreground border-b-4 border-r-2 border-gray-400 shadow-lg hover:shadow-xl hover:shadow-primary/20";
    }
  };

  const getPressedVariantClasses = () => {
    switch (variant) {
      case "number":
        return "border-b-2 border-r-1 border-gray-300 transform translate-y-1 translate-x-0.5";
      case "operator":
        return "border-b-2 border-r-1 border-purple-600 transform translate-y-1 translate-x-0.5";
      case "function":
        return "border-b-2 border-r-1 border-pink-600 transform translate-y-1 translate-x-0.5";
      case "equals":
        return "border-b-2 border-r-1 border-green-600 transform translate-y-1 translate-x-0.5";
      default:
        return "border-b-2 border-r-1 border-gray-300 transform translate-y-1 translate-x-0.5";
    }
  };

  const handleClick = () => {
    // Play sound based on button type
    switch (variant) {
      case "operator":
        playOperatorSound();
        break;
      case "equals":
        playEqualsSound();
        break;
      default:
        playButtonSound();
        break;
    }

    // Vibration feedback
    if (vibrationEnabled && 'vibrate' in navigator) {
      navigator.vibrate(30);
    }

    // Animation feedback
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 100);

    // Execute original onClick
    onClick(value);
  };

  return (
    <Button
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        "h-14 text-lg font-bold rounded-lg transition-all duration-200 relative overflow-hidden group",
        "hover:scale-105 hover:-translate-y-1 hover:translate-x-1",
        "active:duration-75",
        isPressed ? getPressedVariantClasses() : getVariantClasses(),
        className
      )}
    >
      <span className={cn(
        "relative z-10 transition-all duration-75",
        isPressed && "scale-95"
      )}>
        {value}
      </span>
      {/* Glow effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 blur-sm" />
    </Button>
  );
};
