import React from 'react';
// Importa los componentes de React Router para manejar la navegación
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importa todos los componentes de la interfaz de usuario
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import VistaModulos from './components/Cursos/VistaModulos';
import CursosVista from './components/Cursos/CursosVista';
import CursoDetalle from './components/Cursos/CursoDetalle';
import CursoInteractivo from './components/Cursos/CursoInteractivo';


// Importa el archivo de estilos principal
import './styles/App.css';

// El componente principal de la aplicación
function App() {
  return (
    // <Router> envuelve toda la aplicación para habilitar la navegación
    <Router>
      <div className="app">
        {/* El encabezado (Header) se muestra en todas las páginas */}
        <Header />
        {/* El contenedor principal que divide la pantalla entre la barra lateral y el contenido */}
        <div className="main">
          {/* La barra lateral (Sidebar) también se muestra en todas las páginas */}
          <Sidebar />
          {/* Este div actúa como el contenedor para el contenido que cambia según la ruta */}
          <div className="content">
            {/* <Routes> envuelve todas las rutas */}
            <Routes>
              {/*
                Define las rutas de la aplicación:
                - `path="/" o "/inicio"`: Muestra el componente `Dashboard` para la página de inicio.
                - `path="/cursos/:id"`: Muestra `VistaModulos` para un curso específico, usando un parámetro dinámico (`:id`).
                - `path="/cursos"`: Muestra `CursosVista` para la lista de todos los cursos.
                - `path="/curso/:id"`: Muestra `CursoDetalle` para los detalles de un curso específico.
                - `path="/curso/:id/interactive"`: Muestra `CursoInteractivo` para la experiencia interactiva de un curso.
              */}
              <Route path="/" element={<Dashboard />} />
              <Route path="/inicio" element={<Dashboard />} />
              <Route path="/cursos/:id" element={<VistaModulos />} />
              <Route path="/cursos" element={<CursosVista />} />
              <Route path="/curso/:id" element={<CursoDetalle />} />
              <Route path="/curso/:id/interactive" element={<CursoInteractivo />} />
            </Routes>
          </div>
        </div>
        {/* El pie de página (Footer) se muestra en todas las páginas */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;


