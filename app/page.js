'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';


export default function DashboardPage() {
  const router = useRouter();
  const [tab, setTab] = useState('notes');
  const [notes, setNotes] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [newTask, setNewTask] = useState('');

 
  useEffect(() => {
    fetchNotes();
    fetchTasks();
  }, []);

  const fetchNotes = async () => {
    const res = await fetch('/api/notes');
    if (res.ok) {
      setNotes(await res.json());
    } else {
      toast.error('Failed to load notes');
    }
  };

  const fetchTasks = async () => {
    const res = await fetch('/api/tasks');
    if (res.ok) {
      setTasks(await res.json());
    } else {
      toast.error('Failed to load tasks');
    }
  };

  const addNote = async () => {
    if (!newNote.title || !newNote.content) return toast.error('Fill all fields');
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newNote),
    });
    if (res.ok) {
      toast.success('Note added');
      setNewNote({ title: '', content: '' });
      fetchNotes();
    } else {
      toast.error('Failed to add note');
    }
  };

  const updateNote = async (noteId, title, content) => {
    const res = await fetch('/api/notes', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ noteId, title, content }),
    });
    if (res.ok) {
      toast.success('Note updated');
      fetchNotes();
    } else {
      toast.error('Failed to update note');
    }
  };

  const deleteNote = async (noteId) => {
    const res = await fetch('/api/notes', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ noteId }),
    });
    if (res.ok) {
      toast.success('Note deleted');
      fetchNotes();
    } else {
      toast.error('Failed to delete note');
    }
  };

  const addTask = async () => {
    if (!newTask) return toast.error('Enter task text');
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newTask }),
    });
    if (res.ok) {
      toast.success('Task added');
      setNewTask('');
      fetchTasks();
    } else {
      toast.error('Failed to add task');
    }
  };

  const updateTask = async (taskId, text, done) => {
    const res = await fetch('/api/tasks', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId, text, done }),
    });
    if (res.ok) {
      toast.success('Task updated');
      fetchTasks();
    } else {
      toast.error('Failed to update task');
    }
  };

  const deleteTask = async (taskId) => {
    const res = await fetch('/api/tasks', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId }),
    });
    if (res.ok) {
      toast.success('Task deleted');
      fetchTasks();
    } else {
      toast.error('Failed to delete task');
    }
  };

const handleLogout = async () => {
  try {
    const res = await fetch('/api/logout', { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      toast.success('Logged out');
      router.push('/login');
    } else {
      toast.error('Failed to logout');
    }
  } catch (error) {
    toast.error('Logout failed');
  }
};


  return (
    <div className="min-h-screen bg-gray-900">
      {/*this is my  Navbar */}
      <nav className="bg-gray-900 w-full h-full  shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">🛠 My Workspace</h1>
        <div className="space-x-4">
          <button
            onClick={() => setTab('notes')}
            className={`px-3 py-1 rounded ${tab === 'notes' ? 'bg-blue-600 text-black' : 'bg-gray-600'}`}
          >
            Notes
          </button>
          <button
            onClick={() => setTab('tasks')}
            className={`px-3 py-1 rounded ${tab === 'tasks' ? 'bg-blue-600 text-black' : 'bg-gray-600'}`}
          >
            Tasks
          </button>
          <button onClick={handleLogout} className="px-3 py-1 rounded bg-red-500 text-black">
            Logout
          </button>
        </div>
      </nav>

      <div className="p-6 bg-gray-800 w-full h-full  mx-auto">
        {tab === 'notes' && (
          <div>
            <h2 className="text-2xl mb-4">Your Notes</h2>

            {/*for  Add  new note */}
            <div className="mb-4 space-y-2">
              <input
                type="text"
                placeholder="Title"
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <textarea
                placeholder="Content"
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <button
                onClick={addNote}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Add Note
              </button>
            </div>

            {/* Notes  list here  */}
            <div className="grid gap-4">
              {notes.map((note) => (
                <NoteCard
                  key={note._id}
                  note={note}
                  onUpdate={updateNote}
                  onDelete={deleteNote}
                />
              ))}
            </div>
          </div>
        )}

        {tab === 'tasks' && (
          <div>
            <h2 className="text-2xl mb-4">Your Tasks</h2>

            {/* Add new task */}
            <div className="mb-4 flex gap-2">
              <input
                type="text"
                placeholder="Task text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="flex-1 p-2 border rounded"
              />
              <button
                onClick={addTask}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Add
              </button>
            </div>

            {/* Tasks list */}
            <div className="space-y-2">
              {tasks.map((task) => (
                <TaskItem
                  key={task._id}
                  task={task}
                  onUpdate={updateTask}
                  onDelete={deleteTask}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}




 function NoteCard({ note, onUpdate, onDelete }) {
  
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ title: note.title, content: note.content });
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const save = () => {
    onUpdate(note._id, form.title, form.content);
    setEdit(false);
  };

  const handleSummarize = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: note.content }),
      });
      const data = await res.json();
      setSummary(data.summary || 'No summary found.');
      setShowSummary(true);
    } catch (err) {
      console.error('Failed to summarize:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-600 p-4 rounded shadow transition-all duration-300 overflow-hidden">
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
            <button onClick={save} className="px-2 py-1 bg-blue-600 text-white rounded">Save</button>
            <button onClick={() => setEdit(false)} className="px-2 py-1 bg-gray-300 rounded">Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <h3 className="font-semibold">{note.title}</h3>
          <p className="text-white whitespace-pre-wrap">{note.content}</p>
          <div className="flex gap-2 mt-2 flex-wrap">
            <button onClick={() => setEdit(true)} className="px-2 py-1 bg-yellow-500 text-white rounded">Edit</button>
            <button onClick={() => onDelete(note._id)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
            <button 
              onClick={handleSummarize} 
              disabled={loading}
              className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              {loading ? 'Summarizing...' : 'Summarize with AI'}
            </button>
          </div>
          {/* Summary slides in */}
          <div className={`transition-all duration-500 ${showSummary ? 'max-h-40 mt-2' : 'max-h-0 overflow-hidden'}`}>
            {summary && (
              <p className="mt-2 text-green-300"><strong>Summary:</strong> {summary}</p>
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

  const save = () => onUpdate(task._id, text, task.done);
  const toggleDone = () => onUpdate(task._id, text, !task.done);

  return (
    <div className="bg-gray-600 p-3 rounded shadow flex justify-between items-center">
      <div className="flex items-center gap-2">
        <input type="checkbox" checked={task.done} onChange={toggleDone} />
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={save}
          className="p-1 border-b"
        />
      </div>
      <button onClick={() => onDelete(task._id)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
    </div>
  );
}
// thanks sir for this oppertunity;