'use client';

import { useEffect, useRef, useState } from 'react';

export default function TrackingPage() {
  const [clickCount, setClickCount] = useState(0);
  const [metrics, setMetrics] = useState(null); // remove the type annotation

  const startTimeRef = useRef(null);

  useEffect(() => {
    startTimeRef.current = Date.now();

    const handleClick = () => {
      setClickCount((prev) => prev + 1);
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  const handleSubmit = () => {
    const endTime = Date.now();
    const timeSpent = startTimeRef.current ? (endTime - startTimeRef.current) / 1000 : 0;

    setMetrics({
      timeSpent,
      clickCount,
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Interaction Tracking</h1>
      <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
        Submit
      </button>

      {metrics && (
        <div className="mt-6 border p-4 rounded bg-gray-100">
          <p><strong>Time spent:</strong> {metrics.timeSpent.toFixed(2)} seconds</p>
          <p><strong>Total clicks:</strong> {metrics.clickCount}</p>
        </div>
      )}
    </div>
  );
}
