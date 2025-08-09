import { CalculatorButton } from "@/components/Calculator/CalculatorButton";
import { CalculatorDisplay } from "@/components/Calculator/CalculatorDisplay";
import { useCalculator } from "@/hooks/useCalculator";
import { useState } from "react";

export const ScientificCalculator = () => {
  const {
    display,
    expression,
    inputNumber,
    inputDecimal,
    clear,
    performOperation,
    performEquals,
    performFunction
  } = useCalculator();

  const [isSecondFunction, setIsSecondFunction] = useState(false);

  const handleScientificFunction = (func: string) => {
    const inputValue = parseFloat(display);
    let result: number;

    switch (func) {
      case 'sin':
        result = Math.sin(inputValue * Math.PI / 180);
        break;
      case 'cos':
        result = Math.cos(inputValue * Math.PI / 180);
        break;
      case 'tan':
        result = Math.tan(inputValue * Math.PI / 180);
        break;
      case 'ln':
        result = Math.log(inputValue);
        break;
      case 'log':
        result = Math.log10(inputValue);
        break;
      case 'e^x':
        result = Math.exp(inputValue);
        break;
      case 'x^y':
        performOperation('^');
        return;
      case 'π':
        result = Math.PI;
        break;
      case 'e':
        result = Math.E;
        break;
      default:
        performFunction(func);
        return;
    }

    // Update display with result
    const newDisplay = String(result);
    // This would need to be integrated with the calculator state
    console.log(`${func}(${inputValue}) = ${result}`);
  };

  const handleButtonPress = (value: string) => {
    if (value >= '0' && value <= '9') {
      inputNumber(value);
    } else if (value === '.') {
      inputDecimal();
    } else if (value === 'C') {
      clear();
      setIsSecondFunction(false);
    } else if (value === '=') {
      performEquals();
    } else if (['+', '-', '×', '÷', '^'].includes(value)) {
      performOperation(value);
    } else if (['√', 'x²', '1/x', '%', '+/-'].includes(value)) {
      performFunction(value);
    } else if (value === '2nd') {
      setIsSecondFunction(!isSecondFunction);
    } else {
      handleScientificFunction(value);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-bg p-4 pb-20">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6 text-foreground">
          الآلة الحاسبة العلمية
        </h1>
        
        <CalculatorDisplay value={display} expression={expression} />
        
        <div className="grid grid-cols-5 gap-2 text-sm">
          {/* Row 1: Scientific functions */}
          <CalculatorButton 
            value="2nd" 
            onClick={handleButtonPress} 
            variant={isSecondFunction ? "operator" : "function"} 
          />
          <CalculatorButton value={isSecondFunction ? "sin⁻¹" : "sin"} onClick={handleButtonPress} variant="function" />
          <CalculatorButton value={isSecondFunction ? "cos⁻¹" : "cos"} onClick={handleButtonPress} variant="function" />
          <CalculatorButton value={isSecondFunction ? "tan⁻¹" : "tan"} onClick={handleButtonPress} variant="function" />
          <CalculatorButton value="π" onClick={handleButtonPress} variant="function" />
          
          {/* Row 2 */}
          <CalculatorButton value="x^y" onClick={handleButtonPress} variant="function" />
          <CalculatorButton value={isSecondFunction ? "10^x" : "ln"} onClick={handleButtonPress} variant="function" />
          <CalculatorButton value={isSecondFunction ? "e^x" : "log"} onClick={handleButtonPress} variant="function" />
          <CalculatorButton value="√" onClick={handleButtonPress} variant="function" />
          <CalculatorButton value="e" onClick={handleButtonPress} variant="function" />
          
          {/* Row 3 */}
          <CalculatorButton value="C" onClick={handleButtonPress} variant="function" />
          <CalculatorButton value="+/-" onClick={handleButtonPress} variant="function" />
          <CalculatorButton value="%" onClick={handleButtonPress} variant="function" />
          <CalculatorButton value="÷" onClick={handleButtonPress} variant="operator" />
          <CalculatorButton value="x²" onClick={handleButtonPress} variant="function" />
          
          {/* Row 4 */}
          <CalculatorButton value="7" onClick={handleButtonPress} variant="number" />
          <CalculatorButton value="8" onClick={handleButtonPress} variant="number" />
          <CalculatorButton value="9" onClick={handleButtonPress} variant="number" />
          <CalculatorButton value="×" onClick={handleButtonPress} variant="operator" />
          <CalculatorButton value="1/x" onClick={handleButtonPress} variant="function" />
          
          {/* Row 5 */}
          <CalculatorButton value="4" onClick={handleButtonPress} variant="number" />
          <CalculatorButton value="5" onClick={handleButtonPress} variant="number" />
          <CalculatorButton value="6" onClick={handleButtonPress} variant="number" />
          <CalculatorButton value="-" onClick={handleButtonPress} variant="operator" />
          <CalculatorButton value="(" onClick={handleButtonPress} variant="function" />
          
          {/* Row 6 */}
          <CalculatorButton value="1" onClick={handleButtonPress} variant="number" />
          <CalculatorButton value="2" onClick={handleButtonPress} variant="number" />
          <CalculatorButton value="3" onClick={handleButtonPress} variant="number" />
          <CalculatorButton value="+" onClick={handleButtonPress} variant="operator" />
          <CalculatorButton value=")" onClick={handleButtonPress} variant="function" />
          
          {/* Row 7 */}
          <CalculatorButton 
            value="0" 
            onClick={handleButtonPress} 
            variant="number" 
            className="col-span-2" 
          />
          <CalculatorButton value="." onClick={handleButtonPress} variant="number" />
          <CalculatorButton value="=" onClick={handleButtonPress} variant="equals" className="col-span-2" />
        </div>
      </div>
    </div>
  );
};