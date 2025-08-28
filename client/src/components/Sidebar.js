import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Sidebar.css';

// Componente de la barra lateral
function Sidebar() {
  // Define un estado para controlar si la barra lateral está abierta o cerrada.
  // El valor inicial es 'true', lo que significa que la barra estará abierta por defecto.
  const [open, setOpen] = useState(true);

  return (
    // Aplica una clase CSS condicionalmente: 'sidebar open' si 'open' es verdadero,
    // o 'sidebar closed' si 'open' es falso. Esto controla la visibilidad y el estilo.
    <div className={`sidebar ${open ? 'open' : 'closed'}`}>
      {/* Botón para alternar el estado 'open' al hacer clic. */}
      {/* Al hacer clic, el valor de 'open' se invierte (true a false, false a true). */}
      <button onClick={() => setOpen(!open)} className="toggle-btn">
        {open ? '☰' : '☰'}
      </button>
      {/* Renderiza la lista de enlaces (<ul>) solo si el estado 'open' es verdadero. */}
      {open && (
        <ul>
          {/* Cada <li> contiene un <Link> de react-router-dom para la navegación. */}
          {/* Los enlaces apuntan a diferentes rutas de la aplicación. */}
          <li><Link to="/inicio">Inicio</Link></li>
          <li><Link to="/cursos">Cursos</Link></li>
          <li><Link to="/progreso">Mi progreso</Link></li>
          <li><Link to="/perfil">Perfil</Link></li>
          <li><Link to="/ayuda">Ayuda</Link></li>
          <li><Link to="/noticias"> Noticias</Link></li>
          <li><Link to="/logout">Cerrar Sesión</Link></li>
        </ul>
      )}
    </div>
  );
}

export default Sidebar;

