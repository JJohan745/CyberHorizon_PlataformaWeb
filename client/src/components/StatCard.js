import React from 'react';

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

export default StatCard;