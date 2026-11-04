export type DashboardData = {
  stats: Array<{ label: string; value: string; trend: string }>;
  branches: Array<{ id: string; salonId: string; name: string; city: string; address: string; status: string }>;
  services: Array<{ id: string; name: string; duration: number; price: number }>;
  appointments: Array<{ time: string; client: string; service: string; stylist: string; status: string; paymentStatus?: string }>;
};

export type LoginResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    branchId: string;
  };
};

export async function loginAdmin(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Login failed' }));
    throw new Error(error.message || 'Login failed');
  }

  return response.json();
}

export async function fetchDashboard(token: string): Promise<DashboardData> {
  const response = await fetch('http://localhost:5000/api/dashboard', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch dashboard data' }));
    throw new Error(error.message || 'Failed to fetch dashboard data');
  }

  return response.json();
}
