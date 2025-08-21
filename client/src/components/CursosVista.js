import React, { useEffect, useState } from 'react';
import CursoCard from './CursoCard';

// Componente principal para la vista de los cursos
function CursosVista() {
  // Estado para almacenar la lista de cursos obtenida de la API
  const [cursos, setCursos] = useState([]);
  // Estado para controlar el filtro de nivel seleccionado por el usuario
  const [filtroNivel, setFiltroNivel] = useState('');
  // Estado para controlar el filtro de tema seleccionado por el usuario
  const [filtroTema, setFiltroTema] = useState('');

  // useEffect para cargar los cursos una sola vez al montar el componente
  useEffect(() => {
    // Realiza una solicitud fetch a la API para obtener la lista de cursos
    fetch('http://localhost:3001/cursos')
      .then(res => res.json()) // Convierte la respuesta a formato JSON
      .then(data => setCursos(data)) // Actualiza el estado 'cursos' con los datos recibidos
      .catch(err => console.error('Error al cargar cursos:', err)); // Captura y muestra cualquier error en la consola
  }, []); // El array vacío de dependencias asegura que el efecto se ejecute solo una vez

  // Filtra los cursos basados en los estados de los filtros (filtroNivel y filtroTema)
  // Esta constante se recalcula cada vez que 'cursos', 'filtroNivel' o 'filtroTema' cambian
  const cursosFiltrados = cursos.filter((curso) => {
    // Retorna true si el curso debe ser incluido en la lista filtrada
    return (
      // La condición es verdadera si el filtro de nivel está vacío O si el nivel del curso coincide
      (filtroNivel === '' || curso.nivel === filtroNivel) &&
      // Y la condición es verdadera si el filtro de tema está vacío O si el tema del curso coincide
      (filtroTema === '' || curso.tema === filtroTema)
    );
  });

  return (
    <div>
      <h2 className='titulo-cursos'>Cursos Disponibles</h2>
      <p className='descripcion-curso'>Filtra por nivel y tema para encontrar el curso ideal.</p>

      {/* Contenedor para los select de filtro */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        {/* Selector para el filtro de nivel */}
        <select value={filtroNivel} onChange={(e) => setFiltroNivel(e.target.value)}>
          <option value="">Todos los niveles</option>
          <option value="Básico">Básico</option>
          <option value="Intermedio">Intermedio</option>
          <option value="Avanzado">Avanzado</option>
        </select>

        {/* Selector para el filtro de tema */}
        <select value={filtroTema} onChange={(e) => setFiltroTema(e.target.value)}>
          <option value="">Todos los temas</option>
          <option value="Fundamentos">Fundamentos</option>
          <option value="Phishing">Phishing</option>
          {/* Puedes añadir más temas según tengas en tu base de datos */}
        </select>
      </div>

      {/* Contenedor para la cuadrícula de cursos */}
      <div className="cursos-grid">
        {/* Renderizado condicional: si no hay cursos filtrados, muestra un mensaje */}
        {cursosFiltrados.length === 0 ? (
          <p>No se encontraron cursos con los filtros aplicados.</p>
        ) : (
          // Si hay cursos, mapea el array filtrado para renderizar un CursoCard para cada uno
          cursosFiltrados.map((curso) => (
            <CursoCard key={curso.id_curso} curso={curso} />
          ))
        )}
      </div>
    </div>
  );
}

export default CursosVista;
