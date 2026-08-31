import { useEffect, useState } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const FILTERS = ['all', 'active', 'done'];

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState('all');

  const load = () => fetch(`${API}/api/tasks`).then(r => r.json()).then(setTasks);
  useEffect(() => { load(); }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    await fetch(`${API}/api/tasks`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    setTitle('');
    load();
  };

  const toggle = async (id) => {
    await fetch(`${API}/api/tasks/${id}`, { method: 'PUT' });
    load();
  };

  const remove = async (id) => {
    await fetch(`${API}/api/tasks/${id}`, { method: 'DELETE' });
    load();
  };

  const visibleTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.done;
    if (filter === 'done') return task.done;
    return true;
  });

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>SimpleTasks</h1>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {FILTERS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setFilter(option)}
            aria-pressed={filter === option}
            style={{
              textTransform: 'capitalize',
              opacity: filter === option ? 1 : 0.7,
              cursor: 'pointer',
            }}
          >
            {option === 'all' ? 'All' : option === 'active' ? 'Active' : 'Done'}
          </button>
        ))}
      </div>

      <form onSubmit={addTask}>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="New task" />
        <button type="submit">Add</button>
      </form>
      <ul>
        {visibleTasks.map(t => (
          <li key={t.id} style={{ textDecoration: t.done ? 'line-through' : 'none' }}>
            <span onClick={() => toggle(t.id)}>{t.title}</span>
            <button onClick={() => remove(t.id)}>x</button>
          </li>
        ))}
      </ul>
    </div>
  );
}