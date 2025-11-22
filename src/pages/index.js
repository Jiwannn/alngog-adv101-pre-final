import { useEffect, useState } from "react";

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function fmt(ts) {
  try { return new Date(ts).toLocaleString(); } catch { return "-"; }
}

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("todo");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDescription, setEditingDescription] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("todos:v1");
      if (raw) setTodos(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem("todos:v1", JSON.stringify(todos)); } catch {}
  }, [todos]);

  const addTodo = (e) => {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    const now = Date.now();
    const item = { id: uid(), title: t, description: description.trim(), completed: false, createdAt: now, updatedAt: now };
    setTodos((s) => [item, ...s]);
    setTitle(""); setDescription("");
  };

  const deleteTodo = (id) => setTodos((s) => s.filter((it) => it.id !== id));
  const toggleComplete = (id) => setTodos((s) => s.map((it) => it.id === id ? {...it, completed: !it.completed, updatedAt: Date.now()} : it));
  const startEditing = (item) => { setEditingId(item.id); setEditingTitle(item.title); setEditingDescription(item.description || ""); };
  const saveEdit = (e) => {
    e.preventDefault();
    const t = editingTitle.trim(); if (!t) return;
    setTodos((s) => s.map((it) => it.id === editingId ? {...it, title: t, description: editingDescription.trim(), updatedAt: Date.now()} : it));
    setEditingId(null); setEditingTitle(""); setEditingDescription("");
  };

  const visible = todos.filter((it) => {
    if(tab==="todo" && it.completed) return false;
    if(tab==="completed" && !it.completed) return false;
    if(search){
      const q = search.toLowerCase();
      if(!(it.title.toLowerCase().includes(q) || (it.description||"").toLowerCase().includes(q))) return false;
    }
    return true;
  });

  return (
    <div className="page">
      <div className="app-container">

        <header className="header">
          <div className="brand">My Tasks</div>
          <div style={{ display:"flex", gap:"10px" }}>
            <button className={`nav-btn ${tab==="todo"?"active":""}`} onClick={()=>setTab("todo")}>To Do</button>
            <button className={`nav-btn ${tab==="completed"?"active":""}`} onClick={()=>setTab("completed")}>Completed</button>
          </div>
          <input className="search" placeholder="Search tasks..." value={search} onChange={(e)=>setSearch(e.target.value)} />
        </header>

        <section className="panel create">
          <h2 className="panel-title">Create Task</h2>
          <form className="form" onSubmit={addTodo}>
            <input className="field title" placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} />
            <textarea className="field desc" placeholder="Description (optional)" value={description} onChange={(e)=>setDescription(e.target.value)} />
            <div className="form-actions">
              <button type="submit" className="primary">Add Task</button>
            </div>
          </form>
        </section>

        <section className="panel list">
          <h2 className="panel-title">{tab==="todo"?"To Do":"Completed"}</h2>
          {visible.length===0?<div className="empty">No tasks — add one.</div>:
            <div className="grid">
              {visible.map(it=>(
                <div key={it.id} className={`card ${it.completed?"done":""}`}>
                  <div className="card-left">
                    <input type="checkbox" checked={it.completed} onChange={()=>toggleComplete(it.id)} />
                  </div>
                  <div className="card-body">
                    {editingId===it.id?
                      <form className="edit" onSubmit={saveEdit}>
                        <input className="field title" value={editingTitle} onChange={(e)=>setEditingTitle(e.target.value)} />
                        <textarea className="field desc" value={editingDescription} onChange={(e)=>setEditingDescription(e.target.value)} />
                        <div className="card-actions">
                          <button type="button" className="primary small" onClick={saveEdit}>Save</button>
                          <button type="button" className="ghost small" onClick={()=>setEditingId(null)}>Cancel</button>
                        </div>
                      </form>
                      :
                      <>
                        <h3 className="card-title">{it.title}</h3>
                        {it.description && <p className="card-desc">{it.description}</p>}
                        <div className="meta">Created: {fmt(it.createdAt)} · Updated: {fmt(it.updatedAt)}</div>
                      </>
                    }
                  </div>
                  <div className="card-right">
                    {editingId!==it.id && <>
                      <button className="ghost small" onClick={()=>startEditing(it)}>Edit</button>
                      <button className="danger small" onClick={()=>deleteTodo(it.id)}>Delete</button>
                    </>}
                  </div>
                </div>
              ))}
            </div>
          }
        </section>

      </div>
    </div>
  );
}
