import { useEffect, useState } from 'react';

type BranchItem = {
  id: string;
  name: string;
  city: string;
  address: string;
  status: string;
};

const emptyForm = {
  name: '',
  city: 'Mumbai',
  address: '',
};

export default function BranchesPage() {
  const [branches, setBranches] = useState<BranchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState('');
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);

  const loadBranches = async () => {
    const token = localStorage.getItem('glowlane_token');

    try {
      const response = await fetch('http://localhost:5000/api/branches', {
        headers: {
          Authorization: `Bearer ${token || 'demo-token'}`,
        },
      });

      const data = await response.json();

      if (Array.isArray(data.branches)) {
        setBranches(data.branches);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBranches();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingBranchId(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const token = localStorage.getItem('glowlane_token');

    try {
      const response = await fetch(`http://localhost:5000/api/branches${editingBranchId ? `/${editingBranchId}` : ''}`, {
        method: editingBranchId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || 'demo-token'}`,
        },
        body: JSON.stringify({
          name: form.name,
          city: form.city,
          address: form.address,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || (editingBranchId ? 'Failed to update branch' : 'Failed to create branch'));
      }

      setMessage(editingBranchId ? `Branch updated: ${result.branch.name}` : `Branch created: ${result.branch.name}`);
      resetForm();
      await loadBranches();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : editingBranchId ? 'Failed to update branch' : 'Failed to create branch');
    }
  };

  const handleEdit = (branch: BranchItem) => {
    setEditingBranchId(branch.id);
    setForm({
      name: branch.name,
      city: branch.city,
      address: branch.address,
    });
  };

  const handleDelete = async (branchId: string) => {
    const token = localStorage.getItem('glowlane_token');

    try {
      const response = await fetch(`http://localhost:5000/api/branches/${branchId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token || 'demo-token'}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete branch');
      }

      setMessage('Branch deleted successfully');
      resetForm();
      await loadBranches();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to delete branch');
    }
  };

  return (
    <div className="panel full-width">
      <div className="panel-head">
        <h3>Branch Management</h3>
      </div>

      <form className="management-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            Branch name
            <input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} />
          </label>
          <label>
            City
            <input value={form.city} onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))} />
          </label>
          <label>
            Address
            <input value={form.address} onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))} />
          </label>
        </div>
        <div className="form-actions">
          <button type="submit" className="primary-btn">{editingBranchId ? 'Update Branch' : 'Add Branch'}</button>
          {editingBranchId && (
            <button type="button" className="secondary-btn" onClick={resetForm}>Cancel</button>
          )}
        </div>
      </form>

      {message && <div className="success-box">{message}</div>}

      {loading ? (
        <p>Loading branches...</p>
      ) : (
        <div className="branches-admin-list">
          {branches.map((branch) => (
            <div key={branch.id} className="branch-admin-row">
              <div>
                <strong>{branch.name}</strong>
                <small>{branch.city}</small>
              </div>
              <span>{branch.address}</span>
              <span className={`status ${branch.status.toLowerCase()}`}>{branch.status}</span>
              <div className="inline-actions">
                <button type="button" className="secondary-btn small-btn" onClick={() => handleEdit(branch)}>Edit</button>
                <button type="button" className="danger-btn small-btn" onClick={() => handleDelete(branch.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
