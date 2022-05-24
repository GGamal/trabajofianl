 var pool = require('./db'); //llamando a la base de datos
var md5 = require('md5');
const async = require('hbs/lib/async');

async function getUserBUserNameAndPassword(user, password){
    try{
        var query = "select * from usuario where nombre = ? and contraseña = ? limit 1";
        var rows = await pool.query(query,[user,md5(password)]);
        return rows[0];
    }
    catch(error){
        console.log(error)
    }
}
module.exports = {getUserBUserNameAndPassword}