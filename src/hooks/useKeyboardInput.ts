
import { useEffect } from 'react';

interface UseKeyboardInputProps {
  onNumberInput: (num: string) => void;
  onOperatorInput: (op: string) => void;
  onDecimalInput: () => void;
  onEquals: () => void;
  onClear: () => void;
  onBackspace: () => void;
}

export const useKeyboardInput = ({
  onNumberInput,
  onOperatorInput,
  onDecimalInput,
  onEquals,
  onClear,
  onBackspace
}: UseKeyboardInputProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event;
      
      // Prevent default browser behavior for calculator keys
      if (/[0-9+\-*/=.c]/.test(key.toLowerCase()) || key === 'Enter' || key === 'Backspace' || key === 'Escape') {
        event.preventDefault();
      }

      // Numbers
      if (/[0-9]/.test(key)) {
        onNumberInput(key);
      }
      // Operators
      else if (key === '+') {
        onOperatorInput('+');
      }
      else if (key === '-') {
        onOperatorInput('-');
      }
      else if (key === '*') {
        onOperatorInput('×');
      }
      else if (key === '/') {
        onOperatorInput('÷');
      }
      // Decimal point
      else if (key === '.') {
        onDecimalInput();
      }
      // Equals
      else if (key === 'Enter' || key === '=') {
        onEquals();
      }
      // Clear
      else if (key === 'Escape' || key.toLowerCase() === 'c') {
        onClear();
      }
      // Backspace (delete last character)
      else if (key === 'Backspace') {
        onBackspace();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onNumberInput, onOperatorInput, onDecimalInput, onEquals, onClear, onBackspace]);
};
