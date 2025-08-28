import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/CursoDetalle.css';

/**
 * Componente funcional `CursoDetalle`.
 * Muestra la información detallada de un curso específico, incluyendo su resumen,
 * nivel, tema y el número de módulos. También permite navegar a la vista
 * interactiva del curso.
 */
function CursoDetalle() {
  // `useParams` es un hook de React Router que extrae los parámetros de la URL.
  // En este caso, obtiene el `id` del curso desde la ruta, por ejemplo: /curso/:id.
  const { id } = useParams();
  
  // `useNavigate` permite la navegación programática.
  const navigate = useNavigate();
  
  // Estado para almacenar los datos del curso. Se inicializa en `null`.
  const [curso, setCurso] = useState(null);
  
  // Estado para almacenar los módulos del curso. Se inicializa como un array vacío.
  const [modulos, setModulos] = useState([]);

  // `useEffect` se utiliza para cargar los datos del curso y sus módulos
  // cuando el componente se monta o cuando el `id` de la URL cambia.
  useEffect(() => {
    // Primer `fetch`: Carga los datos del curso usando el `id` de la URL.
    fetch(`http://localhost:3001/cursos/${id}`)
      .then(res => res.json())
      .then(data => setCurso(data))
      .catch(err => console.error('Error al cargar curso:', err));

    // Segundo `fetch`: Carga los módulos asociados a ese `id` de curso.
    fetch(`http://localhost:3001/modulos/${id}`)
      .then(res => res.json())
      .then(data => setModulos(data))
      .catch(err => console.error('Error al cargar módulos:', err));
  }, [id]); // La dependencia `id` asegura que los datos se recarguen si el ID cambia.

  // Muestra un mensaje de carga mientras los datos del curso se están cargando.
  if (!curso) return <p>Cargando curso...</p>;

  // Renderiza el contenido una vez que los datos del curso están disponibles.
  return (
    // Contenedor principal para la vista de detalle del curso.
    <div className="curso-detalle">
      {/* Sección para la información textual del curso. */}
      <div className="curso-info">
        {/* Título del curso. */}
        <h2 className='titulo-Scurso'>{curso.titulo}</h2>
        {/* Resumen del curso. */}
        <p className="resumen">{curso.resumen_curso}</p>
        {/* Detalles del curso. */}
        <p><strong>Nivel:</strong> {curso.nivel}</p>
        <p><strong>Tema:</strong> {curso.tema}</p>
        <p><strong>Módulos:</strong> {modulos.length}</p>
        
        {/* Contenedor para los botones de navegación. */}
        <div className="curso-botones">
          {/* Botón para iniciar el curso interactivo. Navega a la ruta dinámica. */}
          <button onClick={() => navigate(`/curso/${curso.id_curso}/interactive`)}>Iniciar curso</button>
          
          {/* Botón para volver a la lista de cursos. */}
          <button onClick={() => navigate('/cursos')}>Volver</button>
        </div>
      </div>

      {/* Sección para la imagen del curso. */}
      <div className="curso-imagen">
        {/* La imagen es dinámica, usando el `id_curso` para construir la URL. */}
        <img src={`/curso${curso.id_curso}.png`} alt="Imagen del curso" />
      </div>
    </div>
  );
}

// Exporta el componente para su uso en otras partes de la aplicación.
export default CursoDetalle;
