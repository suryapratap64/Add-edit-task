"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ThemeToggle from "../components/ThemeToggle";

export default function DashboardPage() {
  const router = useRouter();
  const [tab, setTab] = useState("notes");
  const [showNav, setShowNav] = useState(true);
  const [notes, setNotes] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [newTask, setNewTask] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchNotes();
    fetchTasks();
  }, []);

  // Show navbar when scrolling down, hide when scrolling up
  useEffect(() => {
    let lastY = typeof window !== "undefined" ? window.scrollY || 0 : 0;
    let ticking = false;

    const onScroll = () => {
      const currentY = window.scrollY || 0;
      if (Math.abs(currentY - lastY) < 10) {
        // ignore small changes
        return;
      }
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (currentY > lastY) {
            // scrolling down -> hide nav
            setShowNav(false);
          } else {
            // scrolling up -> show nav
            setShowNav(true);
          }
          lastY = currentY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const fetchNotes = async () => {
    const res = await fetch("/api/notes");
    if (res.ok) {
      setNotes(await res.json());
    } else {
      toast.error("Failed to load notes");
    }
  };
  // ✅ Using .startsWith() ensures it matches letters from the start of the string.
  // const filteredNotes=notes.filter(note=>note.title.toLowerCase().startsWith(searchTerm.toLowerCase())||note.content.toLowerCase.startsWith(searchTerm.toLowerCase()));
  const filteredNotes = notes.filter((note) => {
    const title = note.title ? note.title.toLowerCase() : "";
    const content = note.content ? note.content.toLowerCase() : "";
    const search = searchTerm.toLowerCase();

    return title.includes(search) || content.includes(search);
  });

  const fetchTasks = async () => {
    const res = await fetch("/api/tasks");
    if (res.ok) {
      setTasks(await res.json());
    } else {
      toast.error("Failed to load tasks");
    }
  };

  const addNote = async () => {
    if (!newNote.title || !newNote.content)
      return toast.error("Fill all fields");
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newNote),
    });
    if (res.ok) {
      toast.success("Note added");
      setNewNote({ title: "", content: "" });
      fetchNotes();
    } else {
      toast.error("Failed to add note");
    }
  };

  const updateNote = async (noteId, title, content) => {
    const res = await fetch("/api/notes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ noteId, title, content }),
    });
    if (res.ok) {
      toast.success("Note updated");
      fetchNotes();
    } else {
      toast.error("Failed to update note");
    }
  };

  const deleteNote = async (noteId) => {
    const res = await fetch("/api/notes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ noteId }),
    });
    if (res.ok) {
      toast.success("Note deleted");
      fetchNotes();
    } else {
      toast.error("Failed to delete note");
    }
  };

  const addTask = async () => {
    if (!newTask) return toast.error("Enter task text");
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newTask }),
    });
    if (res.ok) {
      toast.success("Task added");
      setNewTask("");
      fetchTasks();
    } else {
      toast.error("Failed to add task");
    }
  };

  const updateTask = async (taskId, text, done) => {
    const res = await fetch("/api/tasks", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId, text, done }),
    });
    if (res.ok) {
      toast.success("Task updated");
      fetchTasks();
    } else {
      toast.error("Failed to update task");
    }
  };

  const deleteTask = async (taskId) => {
    const res = await fetch("/api/tasks", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId }),
    });
    if (res.ok) {
      toast.success("Task deleted");
      fetchTasks();
    } else {
      toast.error("Failed to delete task");
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        toast.success("Logged out");
        router.push("/login");
      } else {
        toast.error("Failed to logout");
      }
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--bg)", color: "var(--fg)" }}
    >
      {/* Navbar (fixed) */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transform transition-transform duration-300 ${
          showNav ? "translate-y-0" : "-translate-y-full"
        } bg-gray-900/70 backdrop-blur-sm border-b border-gray-800`}
      >
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold">🛠 My Workspace</h1>
            <p className="text-sm text-gray-400 hidden sm:block">
              Notes & Tasks
            </p>
          </div>
          <input
            type="text"
            placeholder="serach notes ...."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-1 rounded-md border-1 text-sm text-white outline-none"
          />

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTab("notes")}
              aria-pressed={tab === "notes"}
              className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                tab === "notes"
                  ? "bg-blue-500 text-black"
                  : "bg-gray-700 text-gray-200 hover:bg-gray-600"
              }`}
            >
              Notes
            </button>
            <button
              onClick={() => setTab("tasks")}
              aria-pressed={tab === "tasks"}
              className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                tab === "tasks"
                  ? "bg-blue-500 text-black"
                  : "bg-gray-700 text-gray-200 hover:bg-gray-600"
              }`}
            >
              Tasks
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-1 rounded-md bg-red-500 text-black text-sm font-medium"
            >
              Logout
            </button>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full pt-24">
        <div className="max-w-5xl mx-auto p-4 sm:p-6">
          <div className="card rounded-lg p-4 sm:p-6 shadow">
            {tab === "notes" && (
              <section>
                <div className="flex flex-col sm:flex-row sm:items-start sm:gap-4 mb-4">
                  <h2 className="text-2xl mb-3 sm:mb-0">Your Notes</h2>
                  <div className="flex-1" />
                </div>

                {/* Add new note */}
                <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    aria-label="Note title"
                    placeholder="Title"
                    value={newNote.title}
                    onChange={(e) =>
                      setNewNote({ ...newNote, title: e.target.value })
                    }
                    className="sm:col-span-1 col-span-1 p-2 rounded-md input-card border border-muted placeholder-gray-400"
                  />
                  <textarea
                    aria-label="Note content"
                    placeholder="Content"
                    value={newNote.content}
                    onChange={(e) =>
                      setNewNote({ ...newNote, content: e.target.value })
                    }
                    className="sm:col-span-2 col-span-1 p-2 rounded-md input-card border border-muted placeholder-gray-400 resize-vertical"
                  />
                  <div className="sm:col-span-3 flex justify-end">
                    <button
                      onClick={addNote}
                      className="mt-1 inline-flex items-center gap-2 bg-green-600 text-black px-4 py-2 rounded-md font-medium hover:bg-green-500"
                    >
                      Add Note
                    </button>
                  </div>
                </div>

                {/* Notes list */}
                <div className="grid  grid-cols-1 gap-4">
                  {/* {notes.map((note) => (
                    <NoteCard
                      key={note._id}
                      note={note}
                      onUpdate={updateNote}
                      onDelete={deleteNote}
                    />
                  ))} */}
                  {filteredNotes.length > 0 ? (
                    filteredNotes.map((note) => (
                      <NoteCard
                        key={note._id}
                        note={note}
                        onUpdate={updateNote}
                        onDelete={deleteNote}
                      />
                    ))
                  ) : (
                    <p>No notes found</p>
                  )}
                </div>
              </section>
            )}

            {tab === "tasks" && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl">Your Tasks</h2>
                </div>

                <div className="mb-6 flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    aria-label="New task"
                    placeholder="Task text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    className="flex-1 p-2 rounded-md input-card border border-muted placeholder-gray-400"
                  />
                  <button
                    onClick={addTask}
                    className="inline-flex items-center gap-2 bg-green-600 text-black px-4 py-2 rounded-md font-medium hover:bg-green-500"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-3">
                  {tasks.map((task) => (
                    <TaskItem
                      key={task._id}
                      task={task}
                      onUpdate={updateTask}
                      onDelete={deleteTask}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function NoteCard({ note, onUpdate, onDelete }) {
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    title: note.title,
    content: note.content,
  });
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const router = useRouter();

  const save = () => {
    onUpdate(note._id, form.title, form.content);
    setEdit(false);
  };

  const handleSummarize = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: note.content }),
      });
      const data = await res.json();
      setSummary(data.summary || "No summary found.");
      setShowSummary(true);
    } catch (err) {
      console.error("Failed to summarize:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-4 shadow-gray-500 shadow-md rounded  transition-all duration-300 overflow-hidden w-full">
      {edit ? (
        <div className="space-y-2">
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <textarea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <div className="flex gap-2">
            <button
              onClick={save}
              className="px-2 py-1 bg-blue-600 text-white rounded"
            >
              Save
            </button>
            <button
              onClick={() => setEdit(false)}
              className="px-2 py-1 bg-gray-300 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <h3
            className="font-semibold cursor-pointer text-fg"
            onClick={() => router.push(`/notes/${note._id}`)}
          >
            {note.title}
          </h3>
          <p className="text-fg whitespace-pre-wrap">{note.content}</p>
          <div className="flex gap-2 mt-2 flex-wrap">
            <button
              onClick={() => setEdit(true)}
              className="px-2 py-1 bg-yellow-500 text-white rounded"
            >
              Edit
            </button>
            {/* <button
              onClick={() => onDelete(note._id)}
              className="px-2 py-1 bg-red-500 text-white rounded"
            >
              Delete
            </button> */}
            <button
              onClick={handleSummarize}
              disabled={loading}
              className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              {loading ? "Summarizing..." : "Summarize with AI"}
            </button>
          </div>
          {/* Summary slides in */}
          <div
            className={`transition-all duration-500 ${
              showSummary ? "max-h-40 mt-2" : "max-h-0 overflow-hidden"
            }`}
          >
            {summary && (
              <p className="mt-2 text-green-300">
                <strong>Summary:</strong> {summary}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// TaskItem Component here
function TaskItem({ task, onUpdate, onDelete }) {
  const [text, setText] = useState(task.text);
  const router = useRouter();

  const save = () => onUpdate(task._id, text, task.done);
  const toggleDone = () => onUpdate(task._id, text, !task.done);

  return (
    <div className="card p-3 rounded shadow flex justify-between items-center">
      <div className="flex items-center gap-2">
        <input type="checkbox" checked={task.done} onChange={toggleDone} />
        <button
          onClick={() => router.push(`/tasks/${task._id}`)}
          className="text-left flex-1"
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={save}
            className="w-full p-1 border-b bg-transparent text-fg"
          />
        </button>
      </div>
      <button
        onClick={() => onDelete(task._id)}
        className="px-2 py-1 bg-red-500 text-white rounded"
      >
        Delete
      </button>
    </div>
  );
}
// thanks sir for this oppertunity;
