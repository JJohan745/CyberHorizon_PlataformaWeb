import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

// Componente de la barra lateral
function Sidebar() {
  // Estado para controlar si la barra lateral está abierta o cerrada
  const [open, setOpen] = useState(true);

  return (
    // La clase de la barra lateral cambia dinámicamente según el estado 'open'
    <div className={`sidebar ${open ? 'open' : 'closed'}`}>
      {/* Botón para alternar la visibilidad de la barra lateral */}
      <button onClick={() => setOpen(!open)} className="toggle-btn">
        {open ? '◄' : '►'}
      </button>
      {/* La lista de enlaces solo se renderiza si la barra lateral está abierta */}
      {open && (
        <ul>
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