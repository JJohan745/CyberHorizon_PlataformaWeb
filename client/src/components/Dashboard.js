import React, { useState, useEffect } from 'react';
import CursoCard from './Cursos/CursoCard';
import '../styles/Dashboard.css';

// Componente funcional StatCard que acepta dos props: 'titulo' y 'valor'
function StatCard({ titulo, valor }) {
  return (
    // Contenedor principal para la tarjeta de estadísticas
    <div className="stat-card">
      {/* Título de la estadística */}
      <h4>{titulo}</h4>
      {/* Valor de la estadística */}
      <p>{valor}</p>
    </div>
  );
}

// Componente principal del panel de control
function Dashboard() {
  // Estado para almacenar la lista de cursos obtenidos de la API
  const [cursos, setCursos] = useState([]);

  // useEffect para cargar los cursos al montar el componente
  useEffect(() => {
    // Realiza una solicitud fetch a la API para obtener la lista de cursos
    fetch('http://localhost:3001/cursos')
      .then(res => res.json()) // Convierte la respuesta a JSON
      .then(data => setCursos(data)) // Actualiza el estado 'cursos' con los datos
      .catch(err => console.error('Error al cargar cursos:', err)); // Maneja cualquier error
  }, []); // El array de dependencias vacío asegura que se ejecute solo una vez

  return (
    <div className="dashboard">
      <div className="dashboard-top">
        <div className="dashboard-center">
          <h2 className="bienvenida-titulo">¡Bienvenido de nuevo! </h2>
          <p className="bienvenida-texto">Comienza a fortalecer tus conocimientos en ciberseguridad.</p>
        </div>

        {/* Sección de estadísticas con los componentes StatCard */}
        <div className="dashboard-right">
          <StatCard titulo="Cursos en Progreso" valor="3" />
          <StatCard titulo="Logros" valor="5" />
        </div>
      </div>

      {/* Sección inferior del dashboard que muestra los cursos disponibles */}
      <div className="dashboard-bottom">
        <h3 className="titulo-cursos">Cursos</h3>
        <div className="cursos-grid">
          {/* Mapea la lista de cursos para renderizar un CursoCard por cada uno */}
          {cursos.map((curso) => (
            <CursoCard key={curso.id_curso} curso={curso} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
