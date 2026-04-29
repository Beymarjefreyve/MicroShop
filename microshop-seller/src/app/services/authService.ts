const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api/auth';

const authService = {
  async login(formData: any): Promise<any> {
    const response = await fetch(`${API_URL}/login`, {
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
      role: this.unmapRole(role),
      frontendUrl: window.location.origin
    };

    const response = await fetch(`${API_URL}/register`, {
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

  async verifyEmail(token: string): Promise<any> {
    const response = await fetch(`${API_URL}/verify-email?token=${token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Error al verificar correo');
    }
    return true;
  },

  async validateToken(token: string): Promise<any> {
    const response = await fetch(`${API_URL}/validate-token?token=${token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Token inválido');
    }
    return await response.json();
  },

  async forgotPassword(email: string): Promise<any> {
    const response = await fetch(`${API_URL}/forgot-password`, {
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
    const response = await fetch(`${API_URL}/reset-password`, {
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
    const response = await fetch(`${API_URL}/profile`, {
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
    const response = await fetch(`${API_URL}/profile`, {
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

  async changePassword(formData: any): Promise<any> {
    const response = await fetch(`${API_URL}/change-password`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Error al cambiar la contraseña');
    }
    return true;
  },

  // Helpers
  mapRole(backendRole: string): string {
    const roles: Record<string, string> = {
      'BUYER': 'buyer',
      'SELLER': 'seller',
      'ADMIN': 'admin'
    };
    return roles[backendRole] || backendRole.toLowerCase();
  },

  unmapRole(frontendRole: string): string {
    const roles: Record<string, string> = {
      'buyer': 'BUYER',
      'seller': 'SELLER',
      'admin': 'ADMIN'
    };
    return roles[frontendRole] || frontendRole.toUpperCase();
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
