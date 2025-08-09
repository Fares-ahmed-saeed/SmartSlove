
import { useState, useCallback } from 'react';

export const useCalculator = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const [expression, setExpression] = useState('');

  const inputNumber = useCallback((num: string) => {
    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  }, [display, waitingForNewValue]);

  const inputDecimal = useCallback(() => {
    if (waitingForNewValue) {
      setDisplay('0.');
      setWaitingForNewValue(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  }, [display, waitingForNewValue]);

  const backspace = useCallback(() => {
    if (waitingForNewValue) {
      return;
    }
    
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  }, [display, waitingForNewValue]);

  const clear = useCallback(() => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
    setExpression('');
  }, []);

  const performOperation = useCallback((nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
      setExpression(`${inputValue} ${nextOperation}`);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
      setExpression(`${newValue} ${nextOperation}`);
    }

    setWaitingForNewValue(true);
    setOperation(nextOperation);
  }, [display, previousValue, operation]);

  const calculate = (firstValue: number, secondValue: number, operation: string) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return secondValue !== 0 ? firstValue / secondValue : 0;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const performEquals = useCallback(() => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setExpression(`${expression} ${inputValue} =`);
      setPreviousValue(null);
      setOperation(null);
      setWaitingForNewValue(true);
      return { expression: `${expression} ${inputValue}`, result: String(newValue) };
    }
    return null;
  }, [display, previousValue, operation, expression]);

  const performFunction = useCallback((func: string) => {
    const inputValue = parseFloat(display);
    let result: number;

    switch (func) {
      case '√':
        result = Math.sqrt(inputValue);
        break;
      case 'x²':
        result = inputValue * inputValue;
        break;
      case '1/x':
        result = inputValue !== 0 ? 1 / inputValue : 0;
        break;
      case '%':
        result = inputValue / 100;
        break;
      case '+/-':
        result = -inputValue;
        break;
      default:
        result = inputValue;
    }

    setDisplay(String(result));
    setWaitingForNewValue(true);
    setExpression(`${func}(${inputValue})`);
  }, [display]);

  return {
    display,
    expression,
    inputNumber,
    inputDecimal,
    backspace,
    clear,
    performOperation,
    performEquals,
    performFunction
  };
};
