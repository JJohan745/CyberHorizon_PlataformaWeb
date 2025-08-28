import React, { useEffect, useState } from 'react';
import { useParams} from 'react-router-dom';
import '../../styles/CursoInteractivo.css';
import Test from '../Test.js'; // Importa el componente Test para las evaluaciones

// Función de utilidad para convertir una URL de YouTube a un formato incrustable (embed)
const getEmbedUrl = (url) => {
  // Si la URL está vacía, devuelve una cadena vacía
  if (!url) return '';

  // Expresión regular para encontrar el ID del video de YouTube en varios formatos de URL
  const youtubeWatchRegex = /(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([\w-]{11})(?:\S+)?/i;
  const match = url.match(youtubeWatchRegex);

  // Si se encuentra una coincidencia y se extrae el ID, devuelve la URL de incrustación
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }
  // De lo contrario, devuelve la URL original (esto podría ser una URL no válida)
  return url;
};

// Función para limpiar contenido HTML, eliminando espacios y etiquetas de salto de línea innecesarias
const limpiarContenido = (html) => {
  return html
    // Elimina espacios, saltos de línea y párrafos vacíos al inicio de la cadena
    .replace(/^((\s|&nbsp;|<br\s*\/?>|<p>\s*<\/p>)+)/gi, '')
    // Reemplaza los saltos de línea (\n) por etiquetas <br /> para una correcta visualización
    .replace(/\n/g, '<br />');
};

// El componente principal para la vista del curso interactivo
function CursoInteractivo() {
  // Obtiene el ID del curso de la URL usando useParams
  const { id } = useParams();

  // Estados del componente
  const [curso, setCurso] = useState(null); // Almacena los datos del curso
  const [modulos, setModulos] = useState([]); // Almacena la lista de módulos del curso
  const [moduloActual, setModuloActual] = useState(0); // Almacena el índice del módulo actualmente visible
  const [contenidos, setContenidos] = useState([]); // Almacena los contenidos del módulo actual
  const [errorContenidos, setErrorContenidos] = useState(null); // Almacena errores al cargar contenidos
  const [isCurrentTestPassed, setIsCurrentTestPassed] = useState(false); // Indica si el test del módulo actual ha sido aprobado
  const [highestModuleIndexVisited, setHighestModuleIndexVisited] = useState(0); // Mantiene el índice más alto de módulo al que el usuario ha navegado
  const [modulesCompletedCount, setModulesCompletedCount] = useState(0); // Cuenta los módulos completados para el progreso

  // Efecto para cargar los datos del curso y los módulos al montar el componente
  useEffect(() => {
    // Carga los datos del curso
    fetch(`http://localhost:3001/cursos/${id}`)
      .then(res => res.json())
      .then(data => {
        setCurso(data);
        console.log('Curso cargado:', data);
      })
      .catch(error => console.error('Error al cargar el curso:', error));

    // Carga la lista de módulos para el curso
    fetch(`http://localhost:3001/modulos/${id}`)
      .then(res => res.json())
      .then(data => {
        setModulos(data);
        console.log('Módulos cargados:', data);
      })
      .catch(error => console.error('Error al cargar los módulos:', error));
  }, [id]); // Dependencia: Se ejecuta solo cuando el ID del curso cambia

  // Efecto para cargar los contenidos del módulo actual
  useEffect(() => {
    // Reinicia el estado de aprobación del test cada vez que el módulo cambia
    setIsCurrentTestPassed(false);

    // Actualiza el índice del módulo más alto visitado
    setHighestModuleIndexVisited(prevHighest => Math.max(prevHighest, moduloActual));

    if (modulos.length > 0) {
      const idModulo = modulos[moduloActual].id_modulo;
      console.log('Intentando obtener contenidos para id_modulo:', idModulo);
      setErrorContenidos(null); // Reinicia el estado de error

      // Carga los contenidos para el módulo actual
      fetch(`http://localhost:3001/contenidos/${idModulo}`)
        .then(res => {
          if (!res.ok) {
            // Maneja los errores HTTP
            return res.text().then(text => { throw new Error(`HTTP error! status: ${res.status}, body: ${text}`) });
          }
          return res.json();
        })
        .then(data => {
          setContenidos(data);
          console.log('Contenidos recibidos para el módulo actual:', data);
          // Verifica si el módulo actual contiene un test
          const hasTest = data.some(item => item.tipo === 'test');
          if (!hasTest) {
            // Si no hay test, el módulo se considera "aprobado" para avanzar
            setIsCurrentTestPassed(true);
          }
        })
        .catch(error => {
          console.error('Error al obtener contenidos:', error);
          setErrorContenidos(`No se pudieron cargar los contenidos: ${error.message}`);
        });
    } else {
      setContenidos([]); // No hay módulos, no hay contenidos
    }
  }, [moduloActual, modulos]); // Dependencias: Se ejecuta cuando el módulo actual o la lista de módulos cambian

  // Función callback que el componente Test.js llama al completar el test
  const handleTestCompletion = (passed) => {
    setIsCurrentTestPassed(passed);
    // Si el test es aprobado, actualiza el conteo de módulos completados
    if (passed) {
      setModulesCompletedCount(prevCount => Math.max(prevCount, moduloActual + 1));
    }
  };

  // Función para avanzar al siguiente módulo
  const goToNextModule = () => {
    // Solo permite avanzar si el test del módulo actual fue aprobado o si el módulo no tiene test
    const currentModuleHasTest = contenidos.some(item => item.tipo === 'test');
    if (!currentModuleHasTest || isCurrentTestPassed) {
      setModuloActual(prev => prev + 1);
      setModulesCompletedCount(prevCount => Math.max(prevCount, moduloActual + 1));
      window.scrollTo(0,0); // Desplazarse al principio de la página
    } else {
      // Usar un componente de mensaje en lugar de alert()
      alert("Debes completar y aprobar el test de este módulo para avanzar.");
    }
  };

  // Función para navegar a un módulo específico desde la barra lateral
  const navigateToModule = (index) => {
    // Solo permite navegar a módulos que ya han sido visitados o el actual
    if (index <= highestModuleIndexVisited) {
      setModuloActual(index);
      window.scrollTo(0,0); // Desplazarse al principio de la página
    }
  };


  // Muestra un mensaje de carga mientras se obtienen los datos del curso
  if (!curso) return <p>Cargando curso...</p>;
  // Muestra un mensaje si el curso no tiene módulos
  if (modulos.length === 0) return <p>Este curso aún no tiene módulos disponibles.</p>;

  // Determina si el botón "Siguiente" debe estar deshabilitado
  const currentModuleHasTestContent = contenidos.some(item => item.tipo === 'test');

  // Calcula el porcentaje de progreso para la barra de progreso
  const progressValue = modulesCompletedCount;
  const progressPercentage = modulos.length > 0 ? (progressValue / modulos.length) * 100 : 0;

  // Renderiza el componente
  return (
    <div className="curso-interactivo">
      {/* Barra lateral de navegación de módulos */}
      <aside className="barra-lateral">
        <h3>{curso.titulo}</h3>
        {/* Contenedor para la barra de progreso y el porcentaje */}
        <div className="progress-container">
          <progress value={progressValue} max={modulos.length}></progress>
          <span className="progress-percentage">{progressPercentage.toFixed(0)}%</span>
        </div>
        <ul>
          {/* Mapea y renderiza cada módulo como un elemento de lista */}
          {modulos.map((mod, i) => (
            <li
              key={mod.id_modulo}
              className={
                i === moduloActual
                  ? 'actual'
                  : i < modulesCompletedCount // Usa modulesCompletedCount para marcar como "completado"
                  ? 'completado'
                  : 'pendiente'
              }
              // Maneja el clic para navegar a un módulo
              onClick={() => i <= highestModuleIndexVisited ? navigateToModule(i) : null}
              style={{ cursor: i <= highestModuleIndexVisited ? 'pointer' : 'not-allowed' }}
            >
              {mod.titulo}
            </li>
          ))}
        </ul>
      </aside>

      {/* Contenedor del contenido principal del módulo */}
      <main className="contenido-modulo">
        <h2>{modulos[moduloActual].titulo}</h2>
        {/* Muestra un mensaje de error si no se pudieron cargar los contenidos */}
        {errorContenidos && <p style={{ color: 'red' }}>{errorContenidos}</p>}
        <section className="contenido-lista">
          {/* Muestra un mensaje si no hay contenidos o si se están cargando */}
          {contenidos.length === 0 && !errorContenidos ? (
            <p>Este módulo no tiene contenidos disponibles o se están cargando.</p>
          ) : (
            // Mapea y renderiza cada elemento de contenido
            contenidos.map((contenido, index) => {
              if (contenido.tipo === 'texto') {
                return (
                  <div key={index} className="contenido-item contenido-texto">
                    {/* Renderiza el HTML con la función de limpieza */}
                    <div dangerouslySetInnerHTML={{ __html: limpiarContenido(contenido.contenido) }} />
                  </div>
                );
              } else if (contenido.tipo === 'video') {
                const videoSrc = getEmbedUrl(contenido.contenido);
                return (
                  <div key={index} className="contenido-item contenido-video">
                    {videoSrc ? (
                      <div className="video-responsive">
                        <iframe
                          src={videoSrc}
                          title={`Video ${index}`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          onError={(e) => console.error("Error al cargar el video:", e)}
                        ></iframe>
                      </div>
                    ) : (
                      <p style={{ color: 'orange' }}>URL de video no válida o no incrustable.</p>
                    )}
                  </div>
                );
              } else if (contenido.tipo === 'imagen') {
                return (
                  <div key={index} className="contenido-item contenido-imagen">
                    <img
                      src={contenido.contenido}
                      alt={`Imagen ${index}`}
                      className="imagen-contenido"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/600x400/cccccc/333333?text=Imagen+no+disponible";
                        console.error("Error al cargar la imagen:", contenido.contenido);
                      }}
                    />
                  </div>
                );
              } else if (contenido.tipo === 'test') {
                return (
                  <div key={index} className="contenido-item contenido-test">
                    <h3>{contenido.contenido}</h3>
                    {contenido.contenido.includes("Evaluación Final") ? (
                        <Test esEvaluacionFinal={true} cursoId={id} onTestComplete={handleTestCompletion} />
                    ) : (
                        <Test moduloId={modulos[moduloActual].id_modulo} onTestComplete={handleTestCompletion} />
                    )}
                  </div>
                );
              } else {
                return (
                  <div key={index} className="contenido-item contenido-desconocido">
                    <p>Tipo de contenido desconocido: {contenido.tipo}</p>
                  </div>
                );
              }
            })
          )}
        </section>

        {/* Botones de navegación para avanzar y retroceder */}
        <div className="navegacion">
          <button
            disabled={moduloActual === 0}
            onClick={() => setModuloActual(moduloActual - 1)}
          >
            ← Anterior
          </button>
          <button
            // Deshabilitado si es el último módulo O si hay un test en el módulo actual que no ha sido aprobado
            disabled={moduloActual === modulos.length - 1 || (currentModuleHasTestContent && !isCurrentTestPassed)}
            onClick={goToNextModule}
          >
            Siguiente →
          </button>
        </div>
      </main>
    </div>
  );
}

export default CursoInteractivo;
