import { useEffect, useMemo, useState } from 'react';
import './App.css';
import { fetchDashboard, loginAdmin, type DashboardData } from './hooks/useDashboard';
import BranchesPage from './pages/BranchesPage';
import ServicesPage from './pages/ServicesPage';

const initialForm = {
  email: 'admin@glowlane.com',
  password: 'admin123',
};

const appointmentFormDefaults = {
  clientName: '',
  serviceId: '',
  stylist: 'Riya',
  time: '2026-11-04T10:00',
  branchId: 'branch-1',
};

type ActiveTab = 'overview' | 'branches' | 'services' | 'appointments';

function App() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [token, setToken] = useState<string | null>(localStorage.getItem('glowlane_token'));
  const [form, setForm] = useState(initialForm);
  const [appointmentForm, setAppointmentForm] = useState(appointmentFormDefaults);
  const [creatingAppointment, setCreatingAppointment] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (!token) {
      return;
    }

    const loadDashboard = async () => {
      setLoading(true);
      try {
        const result = await fetchDashboard(token);
        setData(result);
      } catch (error) {
        console.error('Dashboard fetch error:', error);
        setLoginError(error instanceof Error ? error.message : 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [token]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const result = await loginAdmin(form.email, form.password);
      localStorage.setItem('glowlane_token', result.token);
      setToken(result.token);
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleStatusChange = async (appointmentId: string, status: string) => {
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:5000/api/appointments/${appointmentId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update appointment status');
      }

      setData((current) => {
        if (!current) return current;

        return {
          ...current,
          appointments: current.appointments.map((item) => {
            const key = `${item.time}-${item.client}`;
            const currentId = `${item.time}-${item.client}`.replace(/\s+/g, '-').toLowerCase();
            if (currentId === appointmentId || key === appointmentId) {
              return { ...item, status };
            }
            return item;
          }),
        };
      });
    } catch (error) {
      console.error('Failed to update appointment status:', error);
      setLoginError(error instanceof Error ? error.message : 'Failed to update appointment status');
    }
  };

  const handlePaymentStatusChange = async (appointmentId: string, paymentStatus: string) => {
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:5000/api/appointments/${appointmentId}/payment`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ paymentStatus }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update payment status');
      }

      setData((current) => {
        if (!current) return current;

        return {
          ...current,
          appointments: current.appointments.map((item) => {
            const key = `${item.time}-${item.client}`;
            const currentId = `${item.time}-${item.client}`.replace(/\s+/g, '-').toLowerCase();
            if (currentId === appointmentId || key === appointmentId) {
              return { ...item, paymentStatus };
            }
            return item;
          }),
        };
      });
    } catch (error) {
      console.error('Failed to update payment status:', error);
      setLoginError(error instanceof Error ? error.message : 'Failed to update payment status');
    }
  };

  const handleCreateAppointment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token || !appointmentForm.clientName || !appointmentForm.serviceId || !appointmentForm.time) {
      setLoginError('Client name, service and time are required');
      return;
    }

    setCreatingAppointment(true);
    setLoginError('');

    try {
      const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerName: appointmentForm.clientName,
          serviceId: appointmentForm.serviceId,
          stylist: appointmentForm.stylist,
          time: appointmentForm.time,
          branchId: appointmentForm.branchId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create appointment');
      }

      const booking = result.booking;
      setData((current) => {
        if (!current) return current;

        const nextEntry = {
          time: booking.time,
          client: booking.customer,
          service: booking.service,
          stylist: booking.stylist,
          status: booking.status,
        };

        return {
          ...current,
          appointments: [nextEntry, ...current.appointments],
        };
      });

      setAppointmentForm(appointmentFormDefaults);
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Failed to create appointment');
    } finally {
      setCreatingAppointment(false);
    }
  };

  const stats = useMemo(() => data?.stats ?? [], [data]);
  const branches = useMemo(() => data?.branches ?? [], [data]);
  const services = useMemo(() => data?.services ?? [], [data]);
  const appointments = useMemo(() => data?.appointments ?? [], [data]);

  const filteredAppointments = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return appointments.filter((item) => {
      const matchesSearch =
        !query ||
        item.client.toLowerCase().includes(query) ||
        item.service.toLowerCase().includes(query) ||
        item.stylist.toLowerCase().includes(query) ||
        item.time.toLowerCase().includes(query);

      const matchesStatus = statusFilter === 'all' || item.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [appointments, searchTerm, statusFilter]);

  if (!token) {
    return (
      <div className="auth-shell">
        <form className="auth-card" onSubmit={onSubmit}>
          <div className="brand-wrap auth-brand">
            <div className="brand-mark">S</div>
            <div>
              <p className="eyebrow">Salon OS</p>
              <h2>GlowLane</h2>
            </div>
          </div>

          <h1>Admin Login</h1>
          <p className="auth-subtitle">Use your salon credentials to access dashboard.</p>

          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            />
          </label>

          {loginError && <div className="error-box">{loginError}</div>}

          <button className="primary-btn full-width" type="submit" disabled={loginLoading}>
            {loginLoading ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>
    );
  }

  if (loading) {
    return <div className="loading-state">Loading salon dashboard...</div>;
  }

  if (!data) {
    return <div className="loading-state">Unable to load dashboard data.</div>;
  }

  const renderTabContent = () => {
    if (activeTab === 'branches') {
      return <BranchesPage />;
    }

    if (activeTab === 'services') {
      return <ServicesPage />;
    }

    if (activeTab === 'appointments') {
      return (
        <section className="panel full-width">
          <div className="panel-head">
            <h3>Appointment Management</h3>
          </div>

          <form className="management-form" onSubmit={handleCreateAppointment}>
            <div className="form-grid">
              <label>
                Client name
                <input
                  value={appointmentForm.clientName}
                  onChange={(event) => setAppointmentForm((prev) => ({ ...prev, clientName: event.target.value }))}
                />
              </label>
              <label>
                Service
                <select
                  value={appointmentForm.serviceId}
                  onChange={(event) => setAppointmentForm((prev) => ({ ...prev, serviceId: event.target.value }))}
                >
                  <option value="">Select service</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Stylist
                <input
                  value={appointmentForm.stylist}
                  onChange={(event) => setAppointmentForm((prev) => ({ ...prev, stylist: event.target.value }))}
                />
              </label>
              <label>
                Date & time
                <input
                  type="datetime-local"
                  value={appointmentForm.time}
                  onChange={(event) => setAppointmentForm((prev) => ({ ...prev, time: event.target.value }))}
                />
              </label>
              <label>
                Branch
                <select
                  value={appointmentForm.branchId}
                  onChange={(event) => setAppointmentForm((prev) => ({ ...prev, branchId: event.target.value }))}
                >
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="form-actions">
              <button type="submit" className="primary-btn" disabled={creatingAppointment}>
                {creatingAppointment ? 'Creating...' : 'Add Appointment'}
              </button>
            </div>
          </form>

          {loginError && <div className="error-box">{loginError}</div>}

          <div className="appointments-toolbar">
            <input
              className="toolbar-input"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search client, service, stylist..."
            />
            <select
              className="toolbar-select"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="all">All status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Client</th>
                <th>Service</th>
                <th>Stylist</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((item) => (
                <tr key={`${item.time}-${item.client}`}>
                  <td>{item.time}</td>
                  <td>{item.client}</td>
                  <td>{item.service}</td>
                  <td>{item.stylist}</td>
                  <td>
                    <span className={`status ${item.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <select
                      className="status-select"
                      value={item.paymentStatus ?? 'pending'}
                      onChange={(event) => handlePaymentStatusChange(`${item.time}-${item.client}`, event.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="partial">Partial</option>
                      <option value="paid">Paid</option>
                    </select>
                  </td>
                  <td>
                    <select
                      className="status-select"
                      value={item.status}
                      onChange={(event) => handleStatusChange(`${item.time}-${item.client}`, event.target.value)}
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      );
    }

    return (
      <>
        <section className="stats-grid">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-card">
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
              <em>{stat.trend}</em>
            </div>
          ))}
        </section>

        <section className="content-grid">
          <div className="panel">
            <div className="panel-head">
              <h3>Branch Overview</h3>
              <a href="#">View all</a>
            </div>
            {branches.map((branch) => (
              <div key={branch.id} className="branch-row">
                <div>
                  <strong>{branch.name}</strong>
                  <small>{branch.city}</small>
                </div>
                <div>
                  <span>{branch.address}</span>
                </div>
                <div>
                  <span>{branch.status}</span>
                </div>
                <div>
                  <span className={`status ${branch.status.toLowerCase()}`}>{branch.status}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="panel">
            <div className="panel-head">
              <h3>Top Services</h3>
              <a href="#">Export</a>
            </div>
            {services.map((service) => (
              <div key={service.id} className="service-row">
                <div>
                  <strong>{service.name}</strong>
                  <small>{service.duration} min</small>
                </div>
                <span>₹{service.price}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel full-width">
          <div className="panel-head">
            <h3>Today’s Appointments</h3>
            <a href="#">Calendar</a>
          </div>
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Client</th>
                <th>Service</th>
                <th>Stylist</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((item) => (
                <tr key={`${item.time}-${item.client}`}>
                  <td>{item.time}</td>
                  <td>{item.client}</td>
                  <td>{item.service}</td>
                  <td>{item.stylist}</td>
                  <td>
                    <span className={`status ${item.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <select
                      className="status-select"
                      value={item.paymentStatus ?? 'pending'}
                      onChange={(event) => handlePaymentStatusChange(`${item.time}-${item.client}`, event.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="partial">Partial</option>
                      <option value="paid">Paid</option>
                    </select>
                  </td>
                  <td>
                    <select
                      className="status-select"
                      value={item.status}
                      onChange={(event) => handleStatusChange(`${item.time}-${item.client}`, event.target.value)}
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </>
    );
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-wrap">
          <div className="brand-mark">S</div>
          <div>
            <p className="eyebrow">Salon OS</p>
            <h2>GlowLane</h2>
          </div>
        </div>

        <nav className="nav">
          {[
            ['overview', 'Overview'],
            ['branches', 'Branches'],
            ['services', 'Services'],
            ['appointments', 'Appointments'],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              className={`nav-item ${activeTab === key ? 'active' : ''}`}
              onClick={() => setActiveTab(key as ActiveTab)}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="profile-card">
          <p>Owner</p>
          <strong>Ritika Sharma</strong>
          <small>All branches</small>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">Dashboard</p>
            <h1>Salon performance</h1>
          </div>
          <button
            className="primary-btn"
            onClick={() => {
              localStorage.removeItem('glowlane_token');
              setToken(null);
            }}
          >
            Logout
          </button>
        </header>

        {renderTabContent()}
      </main>
    </div>
  );
}

export default App;
