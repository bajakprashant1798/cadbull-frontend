import { useState, useEffect } from 'react';

function useSessionStorageData(key) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setData(localStorage.getItem(key));
    }
  }, [key]);

  return data;
}

export default useSessionStorageData