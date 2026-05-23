import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { fetchPaper } from "../services/paper.service";
import { usePaperViewerStore } from "../stores/paper-viewer.store";

export function usePaperViewer(paperId: string) {
  const setPaper = usePaperViewerStore(s => s.setPaper);

  const query = useQuery({
    queryKey: ["paper", paperId],
    queryFn: () => fetchPaper(paperId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (query.data) {
      setPaper(query.data);
    }
  }, [query.data, setPaper]);

  return query;
}
