import { useState, useCallback, useEffect } from "react";
import { getPromptRemainingChars, isPromptOverLimit } from "../utils/prompt.utils";

export function usePromptInput(initialValue: string = "", onChange?: (val: string) => void) {
  const [value, setValue] = useState(initialValue);
  
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const remainingChars = getPromptRemainingChars(value);
  const isOverLimit = isPromptOverLimit(value);

  const handleChange = useCallback((newVal: string) => {
    setValue(newVal);
    onChange?.(newVal);
  }, [onChange]);

  const applySuggestion = useCallback((suggestion: string) => {
    const newVal = value ? `${value}\n\n${suggestion}` : suggestion;
    handleChange(newVal);
  }, [value, handleChange]);

  return {
    value,
    remainingChars,
    isOverLimit,
    handleChange,
    applySuggestion,
  };
}
