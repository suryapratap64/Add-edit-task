"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function NoteDetailsPage({ params }) {
  // params may be a Promise in newer Next.js versions — unwrap with React.use()
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;
  const router = useRouter();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchNote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchNote = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notes");
      if (!res.ok) throw new Error("Failed to load notes");
      const data = await res.json();
      const n = data.find((i) => i._id === id) || null;
      if (!n) {
        toast.error("Note not found");
        router.back();
        return;
      }
      setNote(n);
      setTitle(n.title || "");
      setContent(n.content || "");
    } catch (err) {
      console.error(err);
      toast.error("Failed to load note");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    try {
      const res = await fetch("/api/notes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteId: id, title, content }),
      });
      if (res.ok) {
        toast.success("Note updated");
        router.back();
      } else {
        toast.error("Failed to update note");
      }
    } catch (err) {
      console.error(err);
      toast.error("Update error");
    }
  };

  const remove = async () => {
    try {
      const res = await fetch("/api/notes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteId: id }),
      });
      if (res.ok) {
        toast.success("Note deleted");
        router.back();
      } else {
        toast.error("Failed to delete note");
      }
    } catch (err) {
      console.error(err);
      toast.error("Delete error");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!note) return null;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="card p-8 rounded shadow">
        {/* reading-focused header */}
        <header className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight text-fg">
              {title}
            </h1>
            <p className="mt-2 text-sm text-muted">Topic</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.back()}
              className="px-3 py-1 rounded bg-gray-200 text-black"
            >
              Back
            </button>
           
          </div>
        </header>

        <article className="prose max-w-none text-fg leading-7 whitespace-pre-wrap">
          {content}
        </article>
      </div>
    </div>
  );
}
