import React, { useState } from 'react';
import {
  Page,
  Card,
  FormLayout,
  TextField,
  Button,
  Banner,
} from '@shopify/polaris';
import { login } from '../../services/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    if (!email || !password) {
      setError('Por favor ingresa tu correo y contraseña');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await login(email, password);
      
      if (response.status !== 200) {
        setError(response.error ?? "");
      } else if (response.access_token) {
        // Guardar token y redirigir
        localStorage.setItem('kf', response.access_token);
        window.location.href = '/inicio'; // Ajusta la ruta de redirección
      } else {
        setError('Respuesta inesperada del servidor');
      }
    } catch (err) {
      console.error('Error en login:', err);
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page narrowWidth>
      <Card >

          {error && (
            <Banner tone="critical" onDismiss={() => setError('')}>
              {error}
            </Banner>
          )}

          <form onSubmit={handleSubmit}>
            <FormLayout>
              <TextField
                label="Correo electrónico"
                type="email"
                value={email}
                onChange={setEmail}
                autoComplete="email"
                disabled={loading}
              />

              <TextField
                label="Contraseña"
                type="password"
                value={password}
                onChange={setPassword}
                autoComplete="current-password"
                disabled={loading}
              />

                <Button
                  submit
                  loading={loading}
                  disabled={!email || !password || loading}
                >
                  Iniciar sesión
                </Button>
            </FormLayout>
          </form>
      </Card>
    </Page>
  );
}