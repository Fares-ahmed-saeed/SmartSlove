import { CalculatorButton } from "@/components/Calculator/CalculatorButton";
import { CalculatorDisplay } from "@/components/Calculator/CalculatorDisplay";
import { CalculatorHistory } from "@/components/Calculator/CalculatorHistory";
import { useCalculator } from "@/hooks/useCalculator";
import { useCalculatorHistory } from "@/hooks/useCalculatorHistory";
import { useKeyboardInput } from "@/hooks/useKeyboardInput";
import { useTranslation } from "@/hooks/useTranslation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Keyboard } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const CalculatorPage = () => {
  const { t } = useTranslation();
  const {
    display,
    expression,
    inputNumber,
    inputDecimal,
    backspace,
    clear,
    performOperation,
    performEquals,
    performFunction
  } = useCalculator();

  const {
    history,
    savedResults,
    addToHistory,
    saveResult,
    removeFromSaved,
    clearHistory,
    clearSaved
  } = useCalculatorHistory();

  const [isScientific, setIsScientific] = useState(false);
  const [isSecondFunction, setIsSecondFunction] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

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
      const result = performEquals();
      if (result) {
        addToHistory(result.expression, result.result);
      }
    } else if (['+', '-', '×', '÷', '^'].includes(value)) {
      performOperation(value);
    } else if (['√', 'x²', '1/x', '%', '+/-'].includes(value)) {
      performFunction(value);
    } else if (value === '2nd') {
      setIsSecondFunction(!isSecondFunction);
    } else if (value === 'Scientific') {
      setIsScientific(!isScientific);
    } else {
      handleScientificFunction(value);
    }
  };

  const handleEqualsWithHistory = () => {
    const result = performEquals();
    if (result) {
      addToHistory(result.expression, result.result);
    }
  };

  const handleUseResult = (result: string) => {
    clear();
    inputNumber(result);
  };

  // Keyboard support
  useKeyboardInput({
    onNumberInput: inputNumber,
    onOperatorInput: performOperation,
    onDecimalInput: inputDecimal,
    onEquals: handleEqualsWithHistory,
    onClear: clear,
    onBackspace: backspace
  });

  return (
    <div className="min-h-screen bg-gradient-bg p-4 pb-20">
      <div className={cn("mx-auto", isScientific ? "max-w-6xl" : "max-w-4xl")}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            {isScientific ? t('scientificCalculator') : t('basicCalculator')}
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={cn(
                "px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium",
                showHistory 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {t('history')}
            </button>
            <button
              onClick={() => handleButtonPress('Scientific')}
              className={cn(
                "px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium",
                isScientific 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {isScientific ? t('basic') : t('scientific')}
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={cn("lg:col-span-2", showHistory && "lg:col-span-2")}>
            <CalculatorDisplay value={display} expression={expression} />
            
            {isScientific ? (
              <div className="grid grid-cols-5 gap-2 text-sm">
                <CalculatorButton 
                  value="2nd" 
                  onClick={handleButtonPress} 
                  variant={isSecondFunction ? "operator" : "function"} 
                />
                <CalculatorButton value={isSecondFunction ? "sin⁻¹" : "sin"} onClick={handleButtonPress} variant="function" />
                <CalculatorButton value={isSecondFunction ? "cos⁻¹" : "cos"} onClick={handleButtonPress} variant="function" />
                <CalculatorButton value={isSecondFunction ? "tan⁻¹" : "tan"} onClick={handleButtonPress} variant="function" />
                <CalculatorButton value="π" onClick={handleButtonPress} variant="function" />
                
                <CalculatorButton value="x^y" onClick={handleButtonPress} variant="function" />
                <CalculatorButton value={isSecondFunction ? "10^x" : "ln"} onClick={handleButtonPress} variant="function" />
                <CalculatorButton value={isSecondFunction ? "e^x" : "log"} onClick={handleButtonPress} variant="function" />
                <CalculatorButton value="√" onClick={handleButtonPress} variant="function" />
                <CalculatorButton value="e" onClick={handleButtonPress} variant="function" />
                
                <CalculatorButton value="C" onClick={handleButtonPress} variant="function" />
                <CalculatorButton value="+/-" onClick={handleButtonPress} variant="function" />
                <CalculatorButton value="%" onClick={handleButtonPress} variant="function" />
                <CalculatorButton value="÷" onClick={handleButtonPress} variant="operator" />
                <CalculatorButton value="x²" onClick={handleButtonPress} variant="function" />
                
                <CalculatorButton value="7" onClick={handleButtonPress} variant="number" />
                <CalculatorButton value="8" onClick={handleButtonPress} variant="number" />
                <CalculatorButton value="9" onClick={handleButtonPress} variant="number" />
                <CalculatorButton value="×" onClick={handleButtonPress} variant="operator" />
                <CalculatorButton value="1/x" onClick={handleButtonPress} variant="function" />
                
                <CalculatorButton value="4" onClick={handleButtonPress} variant="number" />
                <CalculatorButton value="5" onClick={handleButtonPress} variant="number" />
                <CalculatorButton value="6" onClick={handleButtonPress} variant="number" />
                <CalculatorButton value="-" onClick={handleButtonPress} variant="operator" />
                <CalculatorButton value="(" onClick={handleButtonPress} variant="function" />
                
                <CalculatorButton value="1" onClick={handleButtonPress} variant="number" />
                <CalculatorButton value="2" onClick={handleButtonPress} variant="number" />
                <CalculatorButton value="3" onClick={handleButtonPress} variant="number" />
                <CalculatorButton value="+" onClick={handleButtonPress} variant="operator" />
                <CalculatorButton value=")" onClick={handleButtonPress} variant="function" />
                
                <CalculatorButton 
                  value="0" 
                  onClick={handleButtonPress} 
                  variant="number" 
                  className="col-span-2" 
                />
                <CalculatorButton value="." onClick={handleButtonPress} variant="number" />
                <CalculatorButton value="=" onClick={handleButtonPress} variant="equals" className="col-span-2" />
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-3">
                <CalculatorButton value="C" onClick={handleButtonPress} variant="function" />
                <CalculatorButton value="+/-" onClick={handleButtonPress} variant="function" />
                <CalculatorButton value="%" onClick={handleButtonPress} variant="function" />
                <CalculatorButton value="÷" onClick={handleButtonPress} variant="operator" />
                
                <CalculatorButton value="7" onClick={handleButtonPress} variant="number" />
                <CalculatorButton value="8" onClick={handleButtonPress} variant="number" />
                <CalculatorButton value="9" onClick={handleButtonPress} variant="number" />
                <CalculatorButton value="×" onClick={handleButtonPress} variant="operator" />
                
                <CalculatorButton value="4" onClick={handleButtonPress} variant="number" />
                <CalculatorButton value="5" onClick={handleButtonPress} variant="number" />
                <CalculatorButton value="6" onClick={handleButtonPress} variant="number" />
                <CalculatorButton value="-" onClick={handleButtonPress} variant="operator" />
                
                <CalculatorButton value="1" onClick={handleButtonPress} variant="number" />
                <CalculatorButton value="2" onClick={handleButtonPress} variant="number" />
                <CalculatorButton value="3" onClick={handleButtonPress} variant="number" />
                <CalculatorButton value="+" onClick={handleButtonPress} variant="operator" />
                
                <CalculatorButton 
                  value="0" 
                  onClick={handleButtonPress} 
                  variant="number" 
                  className="col-span-2" 
                />
                <CalculatorButton value="." onClick={handleButtonPress} variant="number" />
                <CalculatorButton value="=" onClick={handleButtonPress} variant="equals" />
              </div>
            )}
          </div>

          {showHistory && (
            <div className="lg:col-span-1">
              <CalculatorHistory
                history={history}
                savedResults={savedResults}
                onSaveResult={saveResult}
                onRemoveFromSaved={removeFromSaved}
                onClearHistory={clearHistory}
                onClearSaved={clearSaved}
                onUseResult={handleUseResult}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
