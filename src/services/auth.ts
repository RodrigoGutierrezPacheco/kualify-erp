const APP_URL = import.meta.env.VITE_APP_URL;

interface LoginResponse {
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
  error?: string;
  message?: string;
  status?: number;
  access_token?: string
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${APP_URL}/auth/login/admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al iniciar sesión');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en login:', error);
    return {
      error: error instanceof Error ? error.message : 'Error desconocido al iniciar sesión'
    };
  }
};