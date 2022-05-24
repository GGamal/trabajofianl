var express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
const async = require('hbs/lib/async');
var router = express.Router();
var usuariosmodels = require('./../../models/usuariosmodels')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('admin/login',{layout:'admin/layout'});
});

router.get('/logout', function(req, res, next) {
  req.session.destroy();
  res.render('admin/login',{layout:'admin/layout'});
});
// pide el nombre y contraseña y comprueba
router.post('/',  async(req,res,next )=>{
  try{
    var usuario = req.body.nombre;
    var password = req.body.contraseña;

    var data = await usuariosmodels.getUserBUserNameAndPassword(usuario,password);

    if (data != undefined){
      req.session.id_usuario = data.id;
      req.session.nombre = data.nombre;

      res.redirect('/admin/novedades')
      
    }
    else{
      res.render('admin/login', {
        layout : 'admin/layout',
        error : true
      })
    }
  }
  catch(error){
    console.log(error)

  }
});

// fin

module.exports = router;
