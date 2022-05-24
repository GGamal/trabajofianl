var express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
const async = require('hbs/lib/async');

var util = require('util');
var cloudinary = require('cloudinary').v2;
const uploader = util.promisify(cloudinary.uploader.upload);
const destroy = util.promisify(cloudinary.uploader.destroy);

var router = express.Router();

var novedadesModel = require('./../../models/novedadesModel');

router.get('/', async function(req, res, next) {
    var novedades = await novedadesModel.getNovedades();

    // poner imagen si es que se carga una
    novedades = novedades.map(novedad=>{
      if(novedad.id_img){
        const imagen = cloudinary.image(novedad.id_img,{
          width: 100,
          height: 100,
          crop:'fill'
        });
        return{
          ...novedad,
          imagen
        }
      }
      else{
        return{
          ...novedad,
          imagen:''
        }
      }

    })
    

// fin poner imagen

    res.render('admin/novedades',{layout:'admin/layout',nombre: req.session.nombre,
    novedades});
    
  });
router.get('/agregar',(req,res,next)=>{
  res.render('admin/agregar',{
    layout: 'admin/layout'
  })
});


// prueba de error insert novedad
router.post('/agregar', async(req,res,next)=>{
  try{
// subir imagen
    var id_img ='';
    if (req.files && Object.keys(req.files).length>0){
      imagen = req.files.imagen;
      id_img = (await uploader(imagen.tempFilePath)).public_id;
    }


// fin subir imagen

    if(req.body.titulo !="" && req.body.cuerpo != ""){
      await novedadesModel.insertNovedad({
        ... req.body,
              id_img
      });

      res.redirect('/admin/novedades')
    }
    else{
      res.render('admin/agregar',{
        layout:'admin/layout',
        error: true,message:'Todos los campos son requeridos'
      })
    }
  }
  catch(error){
    console.log(error);
    res.render('admin/agregar',{
      layout:'admin/layout',
      error:true, message:'No se cargo la noticia'
    });
  }
});

// fin prueba de error 

// para eliminar

router.get('/eliminar/:id', async(req,res,next)=>{
  var id = req.params.id;

  // eliminar imagen si borramos lanovedad entera
  
  let novedad = await novedadesModel.getNovedadById(id);
  if(novedad.id_img){
    await (destroy(novedad.id_img))
  }

// fin de eliminar


  await novedadesModel.deleteNovedades(id);
  res.redirect('/admin/novedades');

});

// fin eliminar

// para modificar traigo la novedad por id

router.get('/modificar/:id', async(req,res,next)=>{
  var id = req.params.id;
  console.log(req.params.id);
  var novedad = await novedadesModel.getNovedadById(id);
  
  res.render('admin/modificar', {
    layout: 'admin/layout',
    novedad
  });



});
// fin de traer la novedad

// modificar una novedad- UPDATE

router.post('/modificar', async(req,res,next)=>{

  try{

// eliminar imagen

let id_img = req.body.img_original;
let borrar_img_vieja = false;

if(req.body.img_delete === "1"){
  id_img = null
  borrar_img_vieja = true;

}
else{
  if(req.files && Object.keys(req.files).length > 0){
    imagen = req.files.imagen;
    id_img = (await uploader(imagen.tempFilePath)).public_id;
    borrar_img_vieja = true;
  }
}
if(borrar_img_vieja && req.body.img_original){
  await (destroy(req.body.img_original));
}


// fin eliminar imagen

    var obj= {
      titulo: req.body.titulo,
      id_img,
      cuerpo: req.body.cuerpo
    }
    console.log(obj)

    await novedadesModel.modificarNovedadById(obj, req.body.id);
    res.redirect('/admin/novedades');
  
  }
  catch(error){
    console.log(error);
    res.render('admin/modificar',{
      layout: 'admin/layout',
      error: true,
      message: 'No se modifico la noticia'
    });


  }

});

// fin update



module.exports = router;