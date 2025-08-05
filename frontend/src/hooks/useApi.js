import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:3000/api'; // URL base com o prefixo /api

const useApi = (endpoint) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`); // URL completa: http://localhost:3000/api/consoles
        if (!response.ok) {
          throw new Error(`Erro: ${response.statusText}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [endpoint]);

  return { data, loading, error };
};

export default useApi;
