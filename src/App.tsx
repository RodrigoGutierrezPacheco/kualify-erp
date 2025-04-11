import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home/Home';
import Inicio from './pages/Inicio/Inicio';
import Sidebar from './components/Sidebar';
import Usuarios from './pages/Usuarios/Usuarios';
import './App.css';

const Layout = () => {
  return (
    <div className="flex flex-col">
      {/* Navbar persistente */}
      <Navbar />

      <div className="flex">
        {/* Sidebar persistente */}
        <div className='flex'>
          <Sidebar />
        </div>

        {/* Contenido principal dinámico */}
        <main className="flex w-full h-full p-5">
          <Outlet /> {/* Componente dinámico según la ruta */}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Todas las rutas que usan el Layout */}
        <Route element={<Layout />}>
          <Route index element={<Inicio />} /> {/* Ruta raíz */}
          <Route path="/inicio" element={<Home />} />
          <Route path="/usuarios" element={<Usuarios />} />

          {/* Ejemplo de rutas adicionales */}
          {/* <Route path="/products" element={<Products />} /> */}
          {/* <Route path="/settings" element={<Settings />} /> */}
        </Route>

        {/* Ejemplo de ruta sin Layout (para login/register) */}
        {/* <Route path="/login" element={<LoginPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;