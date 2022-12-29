const Evento = require("../models/Evento");
const Legajo = require("../models/Legajo");
const responseService = require("../services/responseService");
const Notifi = require("../models/Notificacion");

exports.crearEvento = async (req, res) => {
    const {emisor_nombre, autoridad_emisor, notificacion, tipo, titulo, contenido, descripcion, fecha, alumnos, cursos, difusion} = req.body;
    let evento;
    let eventoCreado;
    let alumnosList =[]
    if(!difusion){
    if(cursos.length !== 0){
        alumnosList = await new Promise(async (resolve, reject) => {
            cursos.map(async curse => {
            const alumns = await new Promise(async (resolve, reject) => {
                try {
                    let alumnosDelCurso = await Legajo.find({ curso: curse }).select('-curso -_id -padre -madre -tutor -documentos -archivado -__v')
                    if (!alumnosDelCurso) {
                        return res.status(404).json({ msg: "Alumnos no encontrados" });
                    }
                    alumnosDelCurso = alumnosDelCurso.map((id) =>id.alumno.toString())
                    resolve(alumnosDelCurso)
                    
                } catch (error) {
                    res.status(400).send(responseService.crearBadResponse(error.message));
                }
                
              });
              resolve(...alumnosList, alumns)
              
        })
    }).then(async (alumnosResponse)=>{
        // fix para limpiar repetidos (no deberia suceder - 1 legajo por alumno)
        let alumnosNoRepeat = [...new Set(alumnosResponse)];
        evento = new Evento({emisor_nombre, autoridad_emisor, notificacion, tipo, titulo, contenido, descripcion, fecha, alumnos:alumnosNoRepeat, cursos, difusion});
        eventoCreado = await evento.save();
        if(notificacion){
            alumnosNoRepeat.map(async alu => {
            const notificacion = new Notifi({evento: eventoCreado._id, alumno: alu });
            await notificacion.save();
            });
        }
        res.status(201).json(eventoCreado); 
    }); }
        else{
            evento = new Evento({emisor_nombre, autoridad_emisor, notificacion, tipo, titulo, alumnos, contenido, descripcion, fecha, alumnos, cursos: [], difusion});
            eventoCreado = await evento.save();
            if(notificacion){
                alumnos.map(async alu => {
                const notificacion = new Notifi({evento: eventoCreado._id, alumno: alu });
                await notificacion.save();
                });
            }
            res.status(201).json(eventoCreado); 
        }
       
    }else{
        const alumns = await new Promise(async (resolve, reject) => {
            try {
                let alumnosDelCurso = await Legajo.find().select('-curso -_id -padre -madre -tutor -documentos -archivado -__v')
                if (!alumnosDelCurso) {
                    return res.status(404).json({ msg: "Alumnos no encontrados" });
                }
                alumnosDelCurso = alumnosDelCurso.map((id) =>id.alumno.toString())
                resolve(alumnosDelCurso)
                
            } catch (error) {
                res.status(400).send(responseService.crearBadResponse(error.message));
            }
          });
          let alumnosNoRepeat = [...new Set(alumns)];
            evento = new Evento({emisor_nombre, autoridad_emisor, notificacion, tipo, titulo, contenido, descripcion, fecha, alumnos:alumnosNoRepeat, cursos, difusion});
            eventoCreado = await evento.save();
            if(notificacion){
                alumnosNoRepeat.map(async alu => {
                const noti = new Notifi({evento: eventoCreado._id, alumno: alu })
                await noti.save();
                });
            }
            res.status(201).json(eventoCreado); 
    }
        
        
    
};

exports.obtenerEventosByAlumno = async (req, res) => {
    try {
        const events = await Evento.find({ alumnos: req.params.id });
        const comunicados = events.filter(evento => evento.tipo === "Comunicado")
        const eventos = events.filter(evento => evento.tipo === "Evento")
        const difusion = events.filter(evento => evento.tipo === "Difusion");
        comunicados.push(...difusion)
        res.status(200).json({eventos, comunicados});
    } catch (error) {
        res.status(400).send(responseService.crearBadResponse(error.message));
    }
};

exports.obtenerEventosByAutoridad = async (req, res) => {
    try {
        const eventos = await Evento.find({ autoridad_emisor: req.params.id })
        res.status(200).json(eventos);
    } catch (error) {
        res.status(400).send(responseService.crearBadResponse(error.message));
    }
};

exports.eliminarEvento = async (req, res) => {
    try {
        let evento = await Evento.findById(req.params.id);
    if (!evento) {
        throw new Error("No existe el evento en nuestra base de datos.");
    }
    await Evento.findOneAndRemove({ _id: req.params.id });
        res.status(200).json(evento);
    } catch (error) {
        res.status(400).send(responseService.crearBadResponse(error.message));
    }
};

exports.obtenerEventos = async (req, res) => {
    try {
        let eventos = await Evento.find()
    .populate({
        path: "alumnos"
    })
    .populate({
        path: "cursos"
    })
        return res.status(200).json(eventos);
    } catch (error) {
        res.status(400).send(responseService.crearBadResponse(error.message));
    }
};

exports.obtenerEventosById = async (req, res) => {
    try {
        let evento = await Evento.findById({ _id: req.params.id })
        .populate({
            path: "alumnos"
        })
        .populate({
            path: "cursos"
        })
    if (!evento) throw new Error("No existe el evento en nuestra base de datos.");
        res.status(200).json(evento);
    } catch (error) {
        res.status(400).send(responseService.crearBadResponse(error.message));
    }
};

exports.obtenerEventosByCurso = async (req, res) => {
    try {
        let eventos = await Evento.find({ cursos: req.params.id })
        .populate({
            path: "alumnos"
        })
        .populate({
            path: "cursos"
        })
        if (!eventos) {
            return []
        }
        res.status(200).json(eventos);
    } catch (error) {
        res.status(400).send(responseService.crearBadResponse(error.message));
    }
};

// exports.obtenerEventosByAsignatura = async (req, res) => {
//     try {
//         let eventos = await Evento.find({ asignatura: req.params.id })
//         .populate({
//             path: "asignatura",
//             populate: { path: "profesor" }})
//         .populate({
//             path: "alumnos"
//         })
//         .populate({
//             path: "cursos"
//         })
//         if (!eventos) {
//             return []
//         }
//         res.status(200).json(eventos);
//     } catch (error) {
//         res.status(400).send(responseService.crearBadResponse(error.message));
//     }
// };