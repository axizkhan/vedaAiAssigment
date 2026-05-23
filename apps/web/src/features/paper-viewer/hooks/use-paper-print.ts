import { useCallback } from "react";

export function usePaperPrint() {
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return { handlePrint };
}
