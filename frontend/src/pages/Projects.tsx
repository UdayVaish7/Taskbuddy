import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus } from 'lucide-react';

const Projects: React.FC = () => {
  const { token, user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [token]);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/projects', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/projects', { name, description }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setName('');
      setDescription('');
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ marginBottom: '8px' }}>Projects</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your team's projects</p>
        </div>
        {user?.role === 'Admin' && (
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            <Plus size={20} /> New Project
          </button>
        )}
      </div>

      {showForm && (
        <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Project Name</label>
              <input type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <input type="text" className="form-input" value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" className="btn btn-primary">Create</button>
              <button type="button" className="btn" onClick={() => setShowForm(false)} style={{ background: 'var(--surface-color)', border: '1px solid var(--border-color)' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="dashboard-grid">
        {projects.map(project => (
          <div key={project.id} className="glass-panel card">
            <h3 style={{ fontSize: '18px' }}>{project.name}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', flex: 1 }}>{project.description || 'No description'}</p>
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {project.members?.length || 0} Members
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {new Date(project.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
      {projects.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No projects found.</p>}
    </div>
  );
};

export default Projects;
