import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus } from 'lucide-react';

const Tasks: React.FC = () => {
  const { token } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  
  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState('');

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, [token]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks', { headers: { Authorization: `Bearer ${token}` } });
      setTasks(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchProjects = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/projects', { headers: { Authorization: `Bearer ${token}` } });
      setProjects(res.data);
      if (res.data.length > 0) setProjectId(res.data[0].id);
    } catch (err) { console.error(err); }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/tasks', { title, projectId }, { headers: { Authorization: `Bearer ${token}` } });
      setTitle('');
      setShowForm(false);
      fetchTasks();
    } catch (err) { console.error(err); }
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      await axios.patch(`http://localhost:5000/api/tasks/${taskId}/status`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } });
      fetchTasks();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ marginBottom: '8px' }}>Tasks</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track and manage work items</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={20} /> New Task
        </button>
      </div>

      {showForm && (
        <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Task Title</label>
              <input type="text" className="form-input" value={title} onChange={e => setTitle(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Project</label>
              <select className="form-input" value={projectId} onChange={e => setProjectId(e.target.value)} required>
                <option value="">Select a project</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" className="btn btn-primary">Create</button>
              <button type="button" className="btn" onClick={() => setShowForm(false)} style={{ background: 'var(--surface-color)', border: '1px solid var(--border-color)' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-panel" style={{ padding: '0 24px 24px 24px' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Project</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id}>
                <td style={{ fontWeight: 500 }}>{task.title}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{task.project.name}</td>
                <td>
                  <select 
                    className="form-input" 
                    style={{ padding: '4px 8px', fontSize: '14px' }} 
                    value={task.status} 
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                  >
                    <option value="TODO">TODO</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="DONE">DONE</option>
                  </select>
                </td>
                <td>
                  <button className="btn" style={{ padding: '6px 12px', fontSize: '12px', background: 'rgba(255, 255, 255, 0.05)' }}>Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tasks;
