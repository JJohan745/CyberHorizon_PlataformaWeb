import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/CursoCard.css';

/**
 * Componente funcional `CursoCard`.
 * Representa una tarjeta individual para mostrar la información de un curso.
 * Es un componente reutilizable que se utiliza en `CursosVista`.
 *
 * @param {object} props - Las propiedades pasadas al componente.
 * @param {object} props.curso - Un objeto que contiene los datos de un curso específico.
 * Debe incluir `id_curso`, `titulo` y `descripcion`.
 */
function CursoCard({ curso }) {
  // `useNavigate` es un hook de React Router que permite la navegación
  // programática entre rutas de la aplicación.
  const navigate = useNavigate();

  // El componente retorna un `div` que actúa como la tarjeta del curso.
  return (
    // Se utiliza un `div` con la clase "curso-card" para aplicar estilos.
    // El evento `onClick` maneja la acción de hacer clic en la tarjeta.
    // Al hacer clic, navega a la ruta dinámica del curso usando su `id_curso`.
    // La propiedad `style` cambia el cursor a un puntero para indicar que es clickeable.
    <div 
      className="curso-card" 
      onClick={() => navigate(`/curso/${curso.id_curso}`)} 
      style={{ cursor: 'pointer' }}
    >
      {/* Muestra una imagen asociada al curso. La URL es estática en este caso. */}
      <img src="/logo-cursos.png" alt="curso" width={110} />
      
      {/* Muestra el título del curso como un encabezado. */}
      <h3>{curso.titulo}</h3>
      
      {/* Muestra la descripción breve del curso como un párrafo. */}
      <p>{curso.descripcion}</p>
    </div>
  );
}

// Exporta el componente para que pueda ser utilizado en otras partes de la aplicación.
export default CursoCard;

