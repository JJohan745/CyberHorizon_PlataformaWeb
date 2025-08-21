// server/index.js

// Importa los módulos necesarios
const express = require('express'); // Framework para construir el servidor web
const cors = require('cors'); // Middleware para habilitar solicitudes de otros dominios
require('dotenv').config(); // Carga las variables de entorno desde un archivo .env
const pool = require('./db'); // Importa la conexión a la base de datos PostgreSQL

const app = express();
const PORT = process.env.PORT || 3001; // Define el puerto, usando el del entorno o 3001 por defecto

// Middlewares
app.use(cors()); // Permite que el frontend (en un dominio diferente) se comunique con esta API
app.use(express.json()); // Habilita el análisis de cuerpos de solicitud en formato JSON

// =======================
// RUTAS DE LA API
// =======================

// Ruta para obtener todos los cursos
// GET /cursos
app.get('/cursos', async (req, res) => {
  try {
    // Realiza una consulta a la base de datos para obtener todos los cursos
    const resultado = await pool.query('SELECT * FROM cursos');
    // Envía la respuesta como un array de objetos JSON
    res.json(resultado.rows);
  } catch (error) {
    console.error('Error al obtener cursos:', error);
    res.status(500).send('Error en el servidor');
  }
});

// Ruta para obtener los módulos de un curso específico
// GET /modulos/:id_curso
app.get('/modulos/:id_curso', async (req, res) => {
  const { id_curso } = req.params; // Extrae el parámetro de la URL
  try {
    // Consulta los módulos filtrando por el id_curso y los ordena por id
    const resultado = await pool.query(
      'SELECT * FROM modulos WHERE id_curso = $1 ORDER BY id_modulo ASC',
      [id_curso]
    );
    res.json(resultado.rows);
  } catch (error) {
    console.error('Error al obtener módulos:', error);
    res.status(500).send('Error al obtener módulos');
  }
});

// Ruta para obtener los detalles de un curso específico
// GET /cursos/:id_curso
app.get('/cursos/:id_curso', async (req, res) => {
  const { id_curso } = req.params;
  try {
    // Consulta el curso por su ID
    const resultado = await pool.query('SELECT * FROM cursos WHERE id_curso = $1', [id_curso]);
    // Si no se encuentra el curso, devuelve un error 404
    if (resultado.rows.length === 0) return res.status(404).send('Curso no encontrado');
    // Si se encuentra, devuelve el primer (y único) registro
    res.json(resultado.rows[0]);
  } catch (error) {
    console.error('Error al obtener curso:', error);
    res.status(500).send('Error del servidor');
  }
});

// Ruta para obtener los contenidos de un módulo específico
// GET /contenidos/:id_modulo
app.get('/contenidos/:id_modulo', async (req, res) => {
  const { id_modulo } = req.params;
  try {
    // Consulta los contenidos filtrando por el id_modulo y los ordena
    const resultado = await pool.query(
      'SELECT * FROM contenido WHERE id_modulo = $1 ORDER BY orden',
      [id_modulo]
    );
    res.json(resultado.rows);
  } catch (error) {
    console.error(`Error al obtener contenidos para id_modulo ${id_modulo}:`, error);
    res.status(500).send('Error al obtener contenidos');
  }
});

// Ruta para obtener preguntas y opciones de un test de módulo
// GET /preguntas?modulo_id=...
app.get('/preguntas', async (req, res) => {
  const { modulo_id } = req.query; // Extrae el parámetro de consulta
  try {
    // Obtiene las preguntas del módulo
    const preguntasRes = await pool.query(
      'SELECT id_pregunta, texto FROM preguntas WHERE id_modulo = $1',
      [modulo_id]
    );
    const preguntas = preguntasRes.rows;
    // Para cada pregunta, obtiene sus opciones asociadas
    for (let pregunta of preguntas) {
      const opcionesRes = await pool.query(
        'SELECT texto, es_correcta FROM opciones WHERE id_pregunta = $1',
        [pregunta.id_pregunta]
      );
      pregunta.opciones = opcionesRes.rows; // Asigna las opciones a la pregunta
    }
    res.json(preguntas);
  } catch (error) {
    console.error('Error al obtener preguntas:', error);
    res.status(500).send('Error al obtener preguntas');
  }
});

// Ruta para obtener preguntas y opciones de la evaluación final del curso
// GET /preguntas/final?curso_id=...
app.get('/preguntas/final', async (req, res) => {
  const { curso_id } = req.query;
  try {
    // Busca el módulo de evaluación final, que se identifica con numero = 99
    const moduloFinalRes = await pool.query(
      `SELECT id_modulo FROM modulos WHERE id_curso = $1 AND numero = 99`,
      [curso_id]
    );
    // Si no existe, devuelve un mensaje informando que no hay evaluación
    if (moduloFinalRes.rows.length === 0) {
      return res.json({ mensaje: 'No hay evaluación final disponible por el momento.' });
    }
    const id_modulo_final = moduloFinalRes.rows[0].id_modulo;
    // Obtiene las preguntas del módulo de evaluación final
    const preguntasRes = await pool.query(
      'SELECT id_pregunta, texto FROM preguntas WHERE id_modulo = $1',
      [id_modulo_final]
    );
    const preguntas = preguntasRes.rows;
    // Si no hay preguntas, devuelve un mensaje
    if (preguntas.length === 0) {
      return res.json({ mensaje: 'No hay preguntas en la evaluación final.' });
    }
    // Para cada pregunta, obtiene sus opciones
    for (let pregunta of preguntas) {
      const opcionesRes = await pool.query(
        'SELECT texto, es_correcta FROM opciones WHERE id_pregunta = $1',
        [pregunta.id_pregunta]
      );
      pregunta.opciones = opcionesRes.rows;
    }
    res.json(preguntas);
  } catch (error) {
    console.error('Error al obtener evaluación final:', error);
    res.status(500).send('Error al obtener evaluación final');
  }
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
