import React, { useEffect, useState } from 'react';
//import './Test.css'; // Asegúrate de tener un archivo CSS para estilos

// Función de utilidad para mezclar un array (Fisher-Yates shuffle)
// Este algoritmo asegura que las preguntas y opciones se muestren en un orden aleatorio
const shuffleArray = (array) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    // Escoge un elemento restante
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    // Intercámbialo con el elemento actual
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
};

// Componente principal del test
function Test({ moduloId, cursoId, esEvaluacionFinal, onTestComplete }) {
  // Estado para almacenar las preguntas originales
  const [preguntas, setPreguntas] = useState([]);
  // Estado para guardar las respuestas del usuario, mapeadas por ID de pregunta
  const [respuestasUsuario, setRespuestasUsuario] = useState({});
  // Estado para controlar si se deben mostrar los resultados finales
  const [mostrarResultados, setMostrarResultados] = useState(false);
  // Estado para el puntaje del usuario
  const [puntaje, setPuntaje] = useState(0);
  // Estado para mostrar mensajes de error
  const [mensajeError, setMensajeError] = useState('');
  // Estado para controlar el estado de carga
  const [cargando, setCargando] = useState(true);

  // Nuevo estado para guardar las preguntas y opciones mezcladas
  const [preguntasMezcladas, setPreguntasMezcladas] = useState([]);

  // useEffect para cargar las preguntas desde el servidor
  useEffect(() => {
    const fetchPreguntas = async () => {
      setCargando(true);
      setMensajeError('');
      try {
        let url = '';
        // Determina la URL de la API según si es una evaluación final o un test de módulo
        if (esEvaluacionFinal) {
          url = `http://localhost:3001/preguntas/final?curso_id=${cursoId}`;
        } else {
          url = `http://localhost:3001/preguntas?modulo_id=${moduloId}`;
        }
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (data.mensaje) {
          setMensajeError(data.mensaje);
          setPreguntas([]);
          if (onTestComplete) {
            onTestComplete(true);
          }
        } else if (Array.isArray(data)) {
          setPreguntas(data);
          // Mezclar preguntas y opciones una sola vez al cargar
          const shuffledData = shuffleArray(data.map(pregunta => ({
            ...pregunta,
            opciones: shuffleArray([...pregunta.opciones])
          })));
          setPreguntasMezcladas(shuffledData);
          const initialRespuestas = {};
          // Inicializa el estado de respuestas del usuario
          shuffledData.forEach(pregunta => {
            initialRespuestas[pregunta.id_pregunta] = null;
          });
          setRespuestasUsuario(initialRespuestas);
        } else {
          setMensajeError('Formato de datos de preguntas inesperado.');
          setPreguntas([]);
          if (onTestComplete) {
            onTestComplete(false);
          }
        }
      } catch (error) {
        console.error('Error al cargar las preguntas:', error);
        setMensajeError(`No se pudieron cargar las preguntas: ${error.message}`);
        setPreguntas([]);
        if (onTestComplete) {
          onTestComplete(false);
        }
      } finally {
        setCargando(false);
      }
    };

    if (moduloId || cursoId) {
      fetchPreguntas();
    }
  }, [moduloId, cursoId, esEvaluacionFinal, onTestComplete]);

  // Manejador para actualizar las respuestas del usuario
  const handleRespuestaChange = (idPregunta, textoOpcion) => {
    setRespuestasUsuario(prev => ({
      ...prev,
      [idPregunta]: textoOpcion,
    }));
  };

  // Manejador para el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    let correctas = 0;
    // Compara las respuestas del usuario con las respuestas correctas
    preguntasMezcladas.forEach(pregunta => {
      const opcionCorrecta = pregunta.opciones.find(op => op.es_correcta);
      if (opcionCorrecta && respuestasUsuario[pregunta.id_pregunta] === opcionCorrecta.texto) {
        correctas++;
      }
    });
    setPuntaje(correctas);
    setMostrarResultados(true);

    // Calcula si el usuario ha aprobado (70% o más)
    const aprobado = (correctas / preguntasMezcladas.length) >= 0.7;
    if (onTestComplete) {
      onTestComplete(aprobado);
    }
  };

  // Manejador para reintentar el test
  const handleRetry = () => {
    setRespuestasUsuario({});
    setMostrarResultados(false);
    setPuntaje(0);
    // Para mezclar las preguntas de nuevo al reintentar, creamos una nueva copia del array y la mezclamos
    const shuffledPreguntas = shuffleArray([...preguntas.map(pregunta => ({
      ...pregunta,
      opciones: shuffleArray([...pregunta.opciones])
    }))]);
    setPreguntasMezcladas(shuffledPreguntas);
  };

  // Renderizado condicional
  if (cargando) {
    return <p>Cargando test...</p>;
  }

  if (mensajeError) {
    return <p className="error-message">{mensajeError}</p>;
  }

  if (preguntasMezcladas.length === 0) {
    return <p>No hay preguntas disponibles para este test.</p>;
  }

  // Calcular el porcentaje de acierto
  const porcentajeAcierto = preguntasMezcladas.length > 0 ? (puntaje / preguntasMezcladas.length) * 100 : 0;

  return (
    <div className="test-container">
      <form onSubmit={handleSubmit}>
        {preguntasMezcladas.map((pregunta) => (
          <div key={pregunta.id_pregunta} className="pregunta-item">
            <h4>{pregunta.texto}</h4>
            <div className="opciones-lista">
              {pregunta.opciones.map((opcion, index) => {
                const isCorrect = opcion.es_correcta;
                const isSelected = respuestasUsuario[pregunta.id_pregunta] === opcion.texto;
                let className = 'opcion-item';
                
                // Aplicar clases de feedback solo si se muestran los resultados
                if (mostrarResultados) {
                  // Si la opción seleccionada es la correcta, marcar como correcta
                  if (isSelected && isCorrect) {
                      className += ' correct-answer';
                  } 
                  // Si la opción seleccionada es incorrecta, marcar como incorrecta
                  else if (isSelected && !isCorrect) {
                      className += ' incorrect-answer';
                  } 
                  // Mostrar la opción correcta, incluso si el usuario no la seleccionó
                  else if (isCorrect) {
                      className += ' correct-answer';
                  }
                }

                return (
                  <div key={index} className={className}>
                    <label className="opcion-label">
                      <input
                        type="radio"
                        name={`pregunta-${pregunta.id_pregunta}`}
                        value={opcion.texto}
                        checked={isSelected}
                        onChange={() => handleRespuestaChange(pregunta.id_pregunta, opcion.texto)}
                        disabled={mostrarResultados}
                      />
                      {opcion.texto}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        {!mostrarResultados && (
          <button 
            type="submit" 
            className="submit-button" 
            disabled={Object.keys(respuestasUsuario).length !== preguntasMezcladas.length || Object.values(respuestasUsuario).some(v => v === null)}
          >
            Enviar Respuestas
          </button>
        )}
      </form>
      
      {mostrarResultados && (
        <div className="resultados-test">
          <h3>Resultados del Test</h3>
          <p>Obtuviste {puntaje} de {preguntasMezcladas.length} preguntas correctas.</p>
          <p>Tu puntaje es del {porcentajeAcierto.toFixed(2)}%.</p>
          {puntaje === preguntasMezcladas.length && (
            <div className="felicidades-container">
              <h4 className="felicidades-mensaje">¡Felicidades, has aprobado con 100%! 🎉</h4>
            </div>
          )}
          {esEvaluacionFinal && (
            <p className={ (puntaje / preguntasMezcladas.length) >= 0.7 ? 'aprobado' : 'reprobado' }>
              { (puntaje / preguntasMezcladas.length) >= 0.7 ? '¡Felicidades, has aprobado la evaluación final!' : 'Necesitas repasar, no has aprobado la evaluación final.' }
            </p>
          )}
          <button onClick={handleRetry} className="retry-button">Reintentar</button>
        </div>
      )}
    </div>
  );
}

export default Test;
