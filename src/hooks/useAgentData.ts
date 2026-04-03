import { useEffect, useState } from "react";
import type { AgentData } from "../types";

const useAgentData = () => {
  const [data, setData] = useState<AgentData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/data.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json: AgentData = await response.json();
      // console.log("Refetched at:", new Date().toLocaleTimeString());

      setData(json);
    } catch (error: any) {
      setError(error.message || "Failed to fetch agent data");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
};

export default useAgentData;
