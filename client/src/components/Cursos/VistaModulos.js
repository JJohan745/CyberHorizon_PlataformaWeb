import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// Componente para mostrar los módulos de un curso específico
function VistaModulos() {
  // Obtiene el parámetro de la URL, que en este caso es el ID del curso
  const { id } = useParams();
  // Estado para almacenar la lista de módulos del curso
  const [modulos, setModulos] = useState([]);

  // useEffect se usa para realizar la llamada a la API cuando el componente se monta
  // La dependencia [id] asegura que la llamada se vuelva a ejecutar si el ID del curso cambia
  useEffect(() => {
    // Realiza una solicitud fetch a la API para obtener los módulos
    fetch(`http://localhost:3001/modulos/${id}`)
      .then(res => res.json()) // Convierte la respuesta a formato JSON
      .then(data => setModulos(data)) // Almacena los datos de los módulos en el estado
      .catch(err => console.error('Error al cargar módulos:', err)); // Maneja cualquier error de la solicitud
  }, [id]);

  // La interfaz de usuario del componente
  return (
    <div>
      <h2>Módulos del curso</h2>
      {/* Muestra un mensaje si no hay módulos disponibles */}
      {modulos.length === 0 ? (
        <p>No hay módulos disponibles.</p>
      ) : (
        // Si hay módulos, los renderiza en una lista desordenada
        <ul>
          {modulos.map((modulo) => (
            // Cada módulo es un elemento de la lista
            <li key={modulo.id_modulo}>
              <strong>{modulo.titulo}</strong><br />
              {modulo.contenido}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default VistaModulos;