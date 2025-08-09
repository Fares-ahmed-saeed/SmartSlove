
import { CalculatorButton } from "@/components/Calculator/CalculatorButton";
import { CalculatorDisplay } from "@/components/Calculator/CalculatorDisplay";
import { useState } from "react";

export const ProgrammerCalculator = () => {
  const [display, setDisplay] = useState('0');
  const [mode, setMode] = useState<'DEC' | 'HEX' | 'OCT' | 'BIN'>('DEC');
  const [value, setValue] = useState(0);
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  const convertToBase = (num: number, base: number): string => {
    if (base === 10) return num.toString();
    if (base === 16) return num.toString(16).toUpperCase();
    if (base === 8) return num.toString(8);
    if (base === 2) return num.toString(2);
    return num.toString();
  };

  const parseFromBase = (str: string, base: number): number => {
    return parseInt(str.replace(/[^0-9A-F]/gi, ''), base) || 0;
  };

  const updateDisplay = (newValue: number) => {
    setValue(newValue);
    const baseMap = { DEC: 10, HEX: 16, OCT: 8, BIN: 2 };
    setDisplay(convertToBase(newValue, baseMap[mode]));
  };

  const handleNumberInput = (input: string) => {
    if (waitingForNewValue) {
      const baseMap = { DEC: 10, HEX: 16, OCT: 8, BIN: 2 };
      const newValue = parseFromBase(input, baseMap[mode]);
      updateDisplay(newValue);
      setWaitingForNewValue(false);
    } else {
      const currentStr = display === '0' ? '' : display;
      const newStr = currentStr + input;
      const baseMap = { DEC: 10, HEX: 16, OCT: 8, BIN: 2 };
      const newValue = parseFromBase(newStr, baseMap[mode]);
      updateDisplay(newValue);
    }
  };

  const handleBitwiseOperation = (op: string) => {
    const currentValue = parseFromBase(display, { DEC: 10, HEX: 16, OCT: 8, BIN: 2 }[mode]);
    
    if (previousValue === null) {
      setPreviousValue(currentValue);
      setOperation(op);
      setWaitingForNewValue(true);
    } else if (operation && !waitingForNewValue) {
      // Execute the pending operation
      const result = executeBitwiseOperation(previousValue, currentValue, operation);
      updateDisplay(result);
      setPreviousValue(result);
      setOperation(op);
      setWaitingForNewValue(true);
    } else {
      setOperation(op);
      setWaitingForNewValue(true);
    }
  };

  const executeBitwiseOperation = (first: number, second: number, op: string): number => {
    switch (op) {
      case 'AND':
        return first & second;
      case 'OR':
        return first | second;
      case 'XOR':
        return first ^ second;
      case '<<':
        return first << 1;
      case '>>':
        return first >> 1;
      default:
        return second;
    }
  };

  const handleUnaryOperation = (op: string) => {
    const currentValue = parseFromBase(display, { DEC: 10, HEX: 16, OCT: 8, BIN: 2 }[mode]);
    
    switch (op) {
      case 'NOT':
        updateDisplay(~currentValue);
        break;
      case '<<':
        updateDisplay(currentValue << 1);
        break;
      case '>>':
        updateDisplay(currentValue >> 1);
        break;
    }
    setWaitingForNewValue(true);
  };

  const handleEquals = () => {
    if (previousValue !== null && operation && !waitingForNewValue) {
      const currentValue = parseFromBase(display, { DEC: 10, HEX: 16, OCT: 8, BIN: 2 }[mode]);
      const result = executeBitwiseOperation(previousValue, currentValue, operation);
      updateDisplay(result);
      setPreviousValue(null);
      setOperation(null);
      setWaitingForNewValue(true);
    }
  };

  const handleClear = () => {
    updateDisplay(0);
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  const isValidInput = (input: string): boolean => {
    switch (mode) {
      case 'DEC':
        return /^[0-9]$/.test(input);
      case 'HEX':
        return /^[0-9A-F]$/i.test(input);
      case 'OCT':
        return /^[0-7]$/.test(input);
      case 'BIN':
        return /^[01]$/.test(input);
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-bg p-4 pb-20">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6 text-foreground">
          حاسبة المبرمجين
        </h1>
        
        <div className="mb-4">
          <div className="flex gap-2 mb-4">
            {(['DEC', 'HEX', 'OCT', 'BIN'] as const).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  const baseMap = { DEC: 10, HEX: 16, OCT: 8, BIN: 2 };
                  setDisplay(convertToBase(value, baseMap[m]));
                }}
                className={`px-3 py-2 rounded text-sm font-semibold transition-colors ${
                  mode === m 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          
          <CalculatorDisplay 
            value={`${mode}: ${display}`} 
            expression={operation ? `${previousValue} ${operation} ${display}` : `DEC: ${value}`} 
          />
        </div>
        
        <div className="grid grid-cols-4 gap-3">
          {/* Row 1: Bitwise operations */}
          <CalculatorButton 
            value="AND" 
            onClick={() => handleBitwiseOperation('AND')} 
            variant="function" 
          />
          <CalculatorButton 
            value="OR" 
            onClick={() => handleBitwiseOperation('OR')} 
            variant="function" 
          />
          <CalculatorButton 
            value="XOR" 
            onClick={() => handleBitwiseOperation('XOR')} 
            variant="function" 
          />
          <CalculatorButton 
            value="NOT" 
            onClick={() => handleUnaryOperation('NOT')} 
            variant="function" 
          />
          
          {/* Row 2: Shift operations and controls */}
          <CalculatorButton 
            value="<<" 
            onClick={() => handleUnaryOperation('<<')} 
            variant="operator" 
          />
          <CalculatorButton 
            value=">>" 
            onClick={() => handleUnaryOperation('>>')} 
            variant="operator" 
          />
          <CalculatorButton 
            value="C" 
            onClick={handleClear} 
            variant="function" 
          />
          <CalculatorButton 
            value="=" 
            onClick={handleEquals} 
            variant="equals" 
          />
          
          {/* Hex digits A-F (only in HEX mode) */}
          {mode === 'HEX' && (
            <>
              {['A', 'B', 'C', 'D', 'E', 'F'].map((hex) => (
                <CalculatorButton 
                  key={hex}
                  value={hex} 
                  onClick={() => handleNumberInput(hex)} 
                  variant="number" 
                />
              ))}
            </>
          )}
          
          {/* Numbers */}
          {['7', '8', '9', '4', '5', '6', '1', '2', '3', '0'].map((num, idx) => {
            const isValid = isValidInput(num);
            return (
              <CalculatorButton
                key={num}
                value={num}
                onClick={() => handleNumberInput(num)}
                variant="number"
                disabled={!isValid}
                className={idx === 9 ? 'col-span-2' : ''}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
