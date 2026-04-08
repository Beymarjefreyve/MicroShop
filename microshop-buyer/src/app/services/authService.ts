const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api';

const authService = {
  async login(formData: any): Promise<any> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error en el inicio de sesión');
    }
    return data;
  },

  async register(formData: any, role: string): Promise<any> {
    const payload = {
      name: formData.fullName || formData.name,
      email: formData.email,
      password: formData.password,
      role: this.unmapRole(role)
    };

    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error en el registro');
    }
    return data;
  },

  async forgotPassword(email: string): Promise<any> {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email,
        frontendUrl: window.location.origin
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Error al solicitar recuperación');
    }
    return true;
  },

  async resetPassword(formData: any): Promise<any> {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Error al restablecer contraseña');
    }
    return true;
  },

  async getProfile(): Promise<any> {
    const response = await fetch(`${API_URL}/users/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.getToken()}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener el perfil');
    }
    return data;
  },

  async updateProfile(formData: any): Promise<any> {
    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error al actualizar el perfil');
    }
    return data;
  },

  // Helpers
  mapRole(backendRole: string): string {
    const roles: Record<string, string> = {
      'ROLE_BUYER': 'buyer',
      'ROLE_SELLER': 'seller',
      'ROLE_ADMIN': 'admin'
    };
    return roles[backendRole] || backendRole.toLowerCase().replace('role_', '');
  },

  unmapRole(frontendRole: string): string {
    const roles: Record<string, string> = {
      'buyer': 'ROLE_BUYER',
      'seller': 'ROLE_SELLER',
      'admin': 'ROLE_ADMIN'
    };
    return roles[frontendRole] || `ROLE_${frontendRole.toUpperCase()}`;
  },

  saveAuthData(token: string, userData: any) {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  },

  clearAuthData() {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  isAuthenticated(): boolean {
    return localStorage.getItem('isAuthenticated') === 'true';
  }
};

export default authService;
