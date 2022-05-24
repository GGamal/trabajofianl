var pool = require('./db');
const async = require('hbs/lib/async');

//listar 

async function getNovedades(){
    var query = "select * from noticias order by id desc";
    var rows = await pool.query(query);
    return rows;
}
//fin listar

// insert

async function insertNovedad(obj){
    try{
        var query = "insert into noticias set ?";
        var rows = await pool.query(query,[obj]);
        return rows;
    }
    catch(error){
        console.log(error);
        throw error;
    }
}

// fin insert

// borrar

async function deleteNovedades(id){
    var query = "delete from noticias where id = ?";
    var rows = await pool.query(query,[id]);
    return rows;
}


// fin borrar

// inicio para modificar =>traer una novedad por id

async function getNovedadById(id){
    var query = "select * from noticias where id = ?";
    var rows = await pool.query(query,[id]);
    return rows[0];

}

// fin de modificar/traer una novedad

// para hacer el update de la novedad que ya tenemos de antes

async function modificarNovedadById(obj,id){
    try{
        var query = "update noticias set ? where id = ?";
        var rows = await pool.query(query,[obj,id]);
        return rows;

    }
    catch(error){
        throw error;
    }
}

// fin de actualizar novedad

module.exports = {getNovedades, insertNovedad, deleteNovedades, getNovedadById, modificarNovedadById};