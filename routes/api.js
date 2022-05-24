var express = require('express');
const async = require('hbs/lib/async');
var router = express.Router();
var novedadesModel = require('./../models/novedadesModel');
var nodemailer = require('nodemailer');
var cloudinary = require('cloudinary').v2;



router.get('/novedades', async function(req,res,next){
    let novedades = await novedadesModel.getNovedades();

    novedades = novedades.map(novedades =>{
        if(novedades.id_img){
            const imagen = cloudinary.url(novedades.id_img,{
                width: 500,
                height: 500,
                crop:'fill'
            });
            return{
                ...novedades,
                imagen
            }
        }
        else{
            return{
                ...novedades,
                imagen:''
            }
        }
       
    });

    res.json(novedades);


});

// enviar mail
router.post('/contacto', async (req,res) => {
    const mail = {
        to: 'gamalmaruan57@gmail.com',
        subject: 'contacto web',
        html: `${req.body.nombre} se contacto desde la web y quiere mas info a este correo:${req.body.email};`
    }
    const transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth:{
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
    
    await transport.sendMail(mail);
    res.status(201).json({
        error: false,
        message: 'mensaje no enviado'
    });

    
});


// fin enviar mail







module.exports = router;