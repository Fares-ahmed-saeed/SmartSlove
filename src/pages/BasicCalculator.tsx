import { CalculatorButton } from "@/components/Calculator/CalculatorButton";
import { CalculatorDisplay } from "@/components/Calculator/CalculatorDisplay";
import { useCalculator } from "@/hooks/useCalculator";

export const BasicCalculator = () => {
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

  const handleButtonPress = (value: string) => {
    if (value >= '0' && value <= '9') {
      inputNumber(value);
    } else if (value === '.') {
      inputDecimal();
    } else if (value === 'C') {
      clear();
    } else if (value === '=') {
      performEquals();
    } else if (['+', '-', '×', '÷'].includes(value)) {
      performOperation(value);
    } else if (['√', 'x²', '1/x', '%', '+/-'].includes(value)) {
      performFunction(value);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-bg p-4 pb-20">
      <div className="max-w-sm mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6 text-foreground">
          الآلة الحاسبة الأساسية
        </h1>
        
        <CalculatorDisplay value={display} expression={expression} />
        
        <div className="grid grid-cols-4 gap-3">
          {/* Row 1: Functions */}
          <CalculatorButton value="C" onClick={handleButtonPress} variant="function" />
          <CalculatorButton value="+/-" onClick={handleButtonPress} variant="function" />
          <CalculatorButton value="%" onClick={handleButtonPress} variant="function" />
          <CalculatorButton value="÷" onClick={handleButtonPress} variant="operator" />
          
          {/* Row 2 */}
          <CalculatorButton value="7" onClick={handleButtonPress} variant="number" />
          <CalculatorButton value="8" onClick={handleButtonPress} variant="number" />
          <CalculatorButton value="9" onClick={handleButtonPress} variant="number" />
          <CalculatorButton value="×" onClick={handleButtonPress} variant="operator" />
          
          {/* Row 3 */}
          <CalculatorButton value="4" onClick={handleButtonPress} variant="number" />
          <CalculatorButton value="5" onClick={handleButtonPress} variant="number" />
          <CalculatorButton value="6" onClick={handleButtonPress} variant="number" />
          <CalculatorButton value="-" onClick={handleButtonPress} variant="operator" />
          
          {/* Row 4 */}
          <CalculatorButton value="1" onClick={handleButtonPress} variant="number" />
          <CalculatorButton value="2" onClick={handleButtonPress} variant="number" />
          <CalculatorButton value="3" onClick={handleButtonPress} variant="number" />
          <CalculatorButton value="+" onClick={handleButtonPress} variant="operator" />
          
          {/* Row 5 */}
          <CalculatorButton 
            value="0" 
            onClick={handleButtonPress} 
            variant="number" 
            className="col-span-2" 
          />
          <CalculatorButton value="." onClick={handleButtonPress} variant="number" />
          <CalculatorButton value="=" onClick={handleButtonPress} variant="equals" />
        </div>
      </div>
    </div>
  );
};