// hooks/usePortfolioData.js
'use client';
import { useState, useEffect } from 'react';
import { fetchCollection } from '@/lib/firestore';

export function usePortfolioData(collectionName) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!collectionName) return;
    setLoading(true);
    fetchCollection(collectionName)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [collectionName]);

  return { data, loading, error };
}

export function useMultipleCollections(collections) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all(collections.map((c) => fetchCollection(c)))
      .then((results) => {
        const map = {};
        collections.forEach((c, i) => { map[c] = results[i]; });
        setData(map);
      })
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}
