import React from 'react';
//import './Header.css'; // Comentado, pero podrías necesitarlo para estilizar

// Componente del encabezado (header)
function Header() {
  return (
    <header className="header">
      <div className="logo">
        <img src="/logo.png" alt="logo" width="50" />
        CyberHorizon
      </div>
      <button className="logout-btn">Salir</button>
    </header>
  );
}

export default Header;
