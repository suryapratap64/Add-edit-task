'use client';
import { useState } from 'react';

export default function NoteCard({ note }) {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: note.content }),
      });
      const data = await res.json();
      setSummary(data.summary);
    } catch (err) {
      console.error('Failed to summarize:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded mb-4">
      <p>{note.content}</p>
      <button 
        onClick={handleSummarize}
        className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
        disabled={loading}
      >
        {loading ? 'Summarizing...' : 'Summarize with AI'}
      </button>
      {summary && (
        <p className="mt-2 text-green-300"><strong>Summary:</strong> {summary}</p>
      )}
    </div>
  );
}
