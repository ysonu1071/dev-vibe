import { useEffect, useState } from 'react';

type ServiceItem = {
  id: string;
  name: string;
  duration: number;
  price: number;
};

const emptyForm = {
  name: '',
  duration: '45',
  price: '1200',
};

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState('');
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  const loadServices = async () => {
    const token = localStorage.getItem('glowlane_token');

    try {
      const response = await fetch('http://localhost:5000/api/services', {
        headers: {
          Authorization: `Bearer ${token || 'demo-token'}`,
        },
      });

      const data = await response.json();

      if (Array.isArray(data.services)) {
        setServices(data.services);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingServiceId(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const token = localStorage.getItem('glowlane_token');

    try {
      const response = await fetch(`http://localhost:5000/api/services${editingServiceId ? `/${editingServiceId}` : ''}`, {
        method: editingServiceId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || 'demo-token'}`,
        },
        body: JSON.stringify({
          name: form.name,
          duration: Number(form.duration),
          price: Number(form.price),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || (editingServiceId ? 'Failed to update service' : 'Failed to create service'));
      }

      setMessage(editingServiceId ? `Service updated: ${result.service.name}` : `Service created: ${result.service.name}`);
      resetForm();
      await loadServices();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : editingServiceId ? 'Failed to update service' : 'Failed to create service');
    }
  };

  const handleEdit = (service: ServiceItem) => {
    setEditingServiceId(service.id);
    setForm({
      name: service.name,
      duration: String(service.duration),
      price: String(service.price),
    });
  };

  const handleDelete = async (serviceId: string) => {
    const token = localStorage.getItem('glowlane_token');

    try {
      const response = await fetch(`http://localhost:5000/api/services/${serviceId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token || 'demo-token'}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete service');
      }

      setMessage('Service deleted successfully');
      resetForm();
      await loadServices();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to delete service');
    }
  };

  return (
    <div className="panel full-width">
      <div className="panel-head">
        <h3>Service Catalog</h3>
      </div>

      <form className="management-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            Service name
            <input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} />
          </label>
          <label>
            Duration (min)
            <input value={form.duration} onChange={(event) => setForm((prev) => ({ ...prev, duration: event.target.value }))} />
          </label>
          <label>
            Price (₹)
            <input value={form.price} onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))} />
          </label>
        </div>
        <div className="form-actions">
          <button type="submit" className="primary-btn">{editingServiceId ? 'Update Service' : 'Add Service'}</button>
          {editingServiceId && (
            <button type="button" className="secondary-btn" onClick={resetForm}>Cancel</button>
          )}
        </div>
      </form>

      {message && <div className="success-box">{message}</div>}

      {loading ? (
        <p>Loading services...</p>
      ) : (
        <div className="services-admin-list">
          {services.map((service) => (
            <div key={service.id} className="service-admin-row">
              <div>
                <strong>{service.name}</strong>
                <small>{service.duration} min</small>
              </div>
              <span>₹{service.price}</span>
              <div className="inline-actions">
                <button type="button" className="secondary-btn small-btn" onClick={() => handleEdit(service)}>Edit</button>
                <button type="button" className="danger-btn small-btn" onClick={() => handleDelete(service.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
