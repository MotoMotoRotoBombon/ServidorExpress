const express = require('express');
const app = express();
app.use(express.json());

let tareas = [];
let idActual = 1;

// Ruta para la raíz
app.get('/', (req, res) => {
    res.send('Bienvenido a la API de la lista de tareas!');
});

// Ruta para la creación de una nueva tarea
app.post('/tareas', (req, res) => {
    console.log(req.body); // Verifica y muestra el contenido del cuerpo de la solicitud

    const nuevaTarea = {
        id: idActual++, // Asigna un ID único
        descripcion: req.body.descripcion, // Captura la descripción desde el cuerpo de la solicitud
        completada: false, // Inicialmente, la tarea no está completada
        fechaCreacion: new Date() // Registra la fecha de creación
    };
    tareas.push(nuevaTarea); // Agrega la nueva tarea al arreglo
    res.status(201).json(nuevaTarea); // Responde con la tarea recién creada
});

// Ruta para obtener todas las tareas
app.get('/tareas', (req, res) => {
    res.json(tareas);
});

// Ruta para obtener una tarea específica por ID
app.get('/tareas/:id', (req, res) => {
    const tarea = tareas.find(t => t.id === parseInt(req.params.id));
    if (!tarea) return res.status(404).json({ error: 'Tarea no encontrada' });
    res.json(tarea);
});

// Ruta para actualizar una tarea
app.put('/tareas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { descripcion, completada } = req.body;

    const tarea = tareas.find(t => t.id === id);
    if (!tarea) {
        return res.status(404).json({ error: "Tarea no encontrada" });
    }
    if (descripcion) {
        tarea.descripcion = descripcion;
    }
    if (completada !== undefined) {
        tarea.completada = completada;
    }

    res.json(tarea);
});

// Ruta para eliminar una tarea por ID
app.delete('/tareas/:id', (req, res) => {
    const indice = tareas.findIndex(t => t.id === parseInt(req.params.id));
    if (indice === -1) return res.status(404).json({ error: 'Tarea no encontrada' });

    // Elimina la tarea del arreglo y responde con la tarea eliminada
    const [tareaEliminada] = tareas.splice(indice, 1);
    res.json(tareaEliminada);
});

// Ruta para obtener estadísticas sobre las tareas
app.get('/tareas/estadisticas', (req, res) => {
    const total = tareas.length;
    const completadas = tareas.filter(t => t.completada).length;
    const pendientes = total - completadas;

    let masReciente = null;
    let masAntigua = null;

    if (total > 0) {
        masReciente = tareas.reduce((a, b) => a.fechaCreacion > b.fechaCreacion ? a : b);
        masAntigua = tareas.reduce((a, b) => a.fechaCreacion < b.fechaCreacion ? a : b);
    }

    // Responde con las estadísticas calculadas
    res.json({
        total,
        completadas,
        pendientes,
        masReciente,
        masAntigua
    });
});

// Inicio del servidor en el puerto 3000
app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});




