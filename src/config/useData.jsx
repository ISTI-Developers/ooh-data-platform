import { useEffect, useState, useRef } from "react";

export default function useData(func, isRealtime = false) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const results = await func();
        setData(results);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    if (isRealtime) {
      intervalRef.current = setInterval(fetchData, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [func, isRealtime]);

  return [data, loading, error];
}
