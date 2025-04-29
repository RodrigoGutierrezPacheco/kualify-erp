import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Navbar from './components/Navbar';
import Home from './pages/Home/Home';
import Inicio from './pages/Inicio/Inicio';
import Sidebar from './components/Sidebar';
import Usuarios from './pages/Usuarios/Usuarios';
import Profesionales from './pages/Profesionales/Profesionales';
import Administradores from './pages/Administradores/Administradores';
import InfoProfesional from './pages/Profesionales/Profesional[id]';
import { jwtDecode } from 'jwt-decode';
import './App.css';

// Componente para rutas protegidas
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('kf');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Verificar si el token está expirado
  try {
    const decoded: { exp?: number } = jwtDecode(token);
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem('kf');
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    localStorage.removeItem('kf');
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Componente para rutas de autenticación (login/register)
const AuthRoute = ({ children }: { children: JSX.Element }) => {
  // const token = localStorage.getItem('kf');

  // if (token) {
  //   // Verificar si el token es válido
  //   try {
  //     const decoded: { exp?: number } = jwtDecode(token);
  //     if (decoded.exp && decoded.exp * 1000 > Date.now()) {
  //       return <Navigate to="/inicio" replace />;
  //     }
  //   } catch {
  //     localStorage.removeItem('kf');
  //   }
  // }

  return children;
};

// Componente para protección por roles
// const RoleProtectedRoute = ({ 
//   children, 
//   allowedRoles 
// }: { 
//   children: JSX.Element, 
//   allowedRoles: string[] 
// }) => {
//   const token = localStorage.getItem('kf');

//   if (!token) {
//     return <Navigate to="/login" replace />;
//   }

//   try {
//     const decoded: { role?: string } = jwtDecode(token);
//     const userRole = decoded.role;

//     if (!userRole || !allowedRoles.includes(userRole)) {
//       return <Navigate to="/inicio" replace />;
//     }

//     return children;
//   } catch (error) {
//     localStorage.removeItem('kf');
//     return <Navigate to="/login" replace />;
//   }
// };

const Layout = () => {
  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="flex">
        <div className='flex'>
          <Sidebar />
        </div>
        <main className="flex w-full h-full p-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas protegidas */}
        <Route element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Inicio />} />
          <Route path="/inicio" element={<Home />} />
          <Route path="/usuarios" element={
            // <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
              <Usuarios />
            // </RoleProtectedRoute>
          } />
          <Route path="/profesionales" element={<Profesionales />} />
          <Route path="/profesional/:id" element={<InfoProfesional />} />
          <Route path="/administradores" element={
              <Administradores />
          } />
        </Route>

        {/* Rutas de autenticación */}
        <Route path="/login" element={
          <AuthRoute>
            <Login />
          </AuthRoute>
        } />

        {/* Ruta de fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;