const Alumno = require("../models/Alumno");
const { validationResult } = require("express-validator");
const Inasistencia = require("../models/Inasistencia");

exports.crearInasistencia = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }  
  const arrayInasistencias = req.body;
  let inasistenciasCreadas = [];
  arrayInasistencias.map(async (inasistencia, index) => {
    
  const { alumnoId, valor, estado } = inasistencia;
    try {
      let alumno = await Alumno.findById(alumnoId);
      if (!alumno) {
        return res.status(400).json({ msg: "El alumno no existe" });
      }
      if(estado === null || estado === ""){
        estado = "Injustificada";
      }
      const today = (new Date).toLocaleDateString();
      let inasistExist = await Inasistencia.find({alumno: alumnoId, fecha: today});
      if(inasistExist.length !== 0){
        return res.status(200).json(inasistExist);
      }
      let inasistencia = new Inasistencia({alumno: alumnoId, valor, estado, curso: alumno.curso});
      const inasistenciaCreada = await inasistencia.save();
      inasistenciasCreadas.push(inasistenciaCreada)
      if(arrayInasistencias.length - 1 === index){
        res.status(200).json(inasistenciasCreadas);
      }
    } catch (error) {
      console.log(error);
      res.status(400).send("Hubo un error");
    }
  }) 
};

exports.actualizarInasistencia = async (req, res) => {
  try {
    let inasistencia = await Inasistencia.findById(req.params.id);
    if (!inasistencia) {
      return res.status(404).json({ msg: "Inasistencia no encontrada" });
    }
    const nuevaInasistencia = {};

    const { valor, estado } = req.body

    if (inasistencia) {
    nuevaInasistencia.valor = valor;
    nuevaInasistencia.estado = estado;
    }

    inasistencia = await Inasistencia.findOneAndUpdate(
      { _id: req.params.id },
      { $set: nuevaInasistencia },
      { new: true }
    );
    res.json({ inasistencia });
  } catch (error) {
    res.status(500).send("Hubo un error");
  }
};

exports.eliminarInasistencia = async (req, res) => {
  try {
    let inasistencia = await Inasistencia.findById(req.params.id);
    if (!inasistencia) {
      return res.status(404).json({ msg: "Inasistencia no encontrada" });
    }
    await Inasistencia.findOneAndRemove({ _id: req.params.id });
    res.status(200).json({ msg: "Inasistencia eliminada" });
  } catch (error) {
    res.status(500).send("Hubo un error");
  }  
};

exports.obtenerInasistencias = async (req, res) => {
  try {
    let inasistencias = await Inasistencia.find({alumno: req.params.id}).populate({
      path: 'alumno',
      populate: { path: 'persona' }
    });
    let totalInasistencias = 0;
    inasistencias.map(inasistencia => {
      totalInasistencias = totalInasistencias + inasistencia.valor;
    })
    if (!inasistencias) {
      return res.status(404).json({ msg: "No hay inasistencias" });
    }
    const inasistenciasInfo = { inasistencias, totalInasistencias };
    res.status(200).json(inasistenciasInfo);
  } catch (error) {
    res.status(500).send("Hubo un error");
  }

};


exports.obtenerInasistenciasByCurso = async (req, res) => {
  try {
    let inasistencias = await Inasistencia.find({curso: req.params.id}).populate({
      path: 'alumno',
      populate: { path: 'persona' }
    });
    let totalInasistencias = 0;
    inasistencias.map(inasistencia => {
      totalInasistencias = totalInasistencias + inasistencia.valor;
    })
    if (!inasistencias) {
      return res.status(404).json({ msg: "No hay inasistencias" });
    }
    const inasistenciasInfo = { inasistencias, totalInasistencias };
    res.status(200).json(inasistenciasInfo);
  } catch (error) {
    res.status(500).send("Hubo un error");
  }

};


exports.obtenerInasistenciasDiariasByCurso = async (req, res) => {
  try {
    const today = (new Date).toLocaleDateString();
    let inasistencias = await Inasistencia.find({curso: req.params.id, fecha: today }).populate({
      path: 'alumno',
      populate: { path: 'persona' }
    });
    if (!inasistencias) {
      res.status(200).json([]);
    }

    res.status(200).json(inasistencias);
  } catch (error) {
    res.status(500).send("Hubo un error");
  }

};



exports.obtenerInasistenciasDiariasByAlumno = async (req, res) => {
  try {
    const today = (new Date).toLocaleDateString();
    // let inasistExist = await Inasistencia.find({alumno:  req.params.id, fecha: today});
    // console.log(inasistExist)
    let inasistencias = await Inasistencia.find({alumno: req.params.id, fecha: today }).populate({
      path: 'alumno',
      populate: { path: 'persona' }
    });
    if (!inasistencias) {
      res.status(200).json([]);
    }

    res.status(200).json(inasistencias);
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }

};