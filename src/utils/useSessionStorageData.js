import { useState, useEffect } from 'react';

function useSessionStorageData(key) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setData(sessionStorage.getItem(key));
    }
  }, [key]);

  return data;
}

export default useSessionStorageData