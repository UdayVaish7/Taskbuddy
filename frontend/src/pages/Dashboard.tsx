import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { token } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/tasks', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTasks(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTasks();
  }, [token]);

  const todo = tasks.filter(t => t.status === 'TODO').length;
  const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const done = tasks.filter(t => t.status === 'DONE').length;

  return (
    <div className="animate-fade-in">
      <h1 style={{ marginBottom: '8px' }}>Dashboard</h1>
      <p style={{ color: 'var(--text-secondary)' }}>Welcome back! Here's an overview of your tasks.</p>

      <div className="dashboard-grid">
        <div className="glass-panel stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="stat-title">To Do</span>
            <Circle color="var(--primary-color)" size={24} />
          </div>
          <span className="stat-value">{todo}</span>
        </div>
        <div className="glass-panel stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="stat-title">In Progress</span>
            <Clock color="var(--warning-color)" size={24} />
          </div>
          <span className="stat-value">{inProgress}</span>
        </div>
        <div className="glass-panel stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="stat-title">Done</span>
            <CheckCircle2 color="var(--success-color)" size={24} />
          </div>
          <span className="stat-value">{done}</span>
        </div>
      </div>

      <div className="glass-panel" style={{ marginTop: '32px', padding: '24px' }}>
        <h3 style={{ marginBottom: '16px' }}>Recent Tasks</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Project</th>
              <th>Status</th>
              <th>Due Date</th>
            </tr>
          </thead>
          <tbody>
            {tasks.slice(0, 5).map(task => (
              <tr key={task.id}>
                <td style={{ fontWeight: 500 }}>{task.title}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{task.project.name}</td>
                <td>
                  <span className={`badge badge-${task.status.toLowerCase().replace('_', '-')}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </td>
                <td style={{ color: 'var(--text-secondary)' }}>
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                </td>
              </tr>
            ))}
            {tasks.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '32px' }}>
                  No tasks found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
