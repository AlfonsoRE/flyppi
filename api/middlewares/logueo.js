'use strict'

var jwt = require("jwt-simple");
var moment = require("moment");
var secret = 'clave_secreta_curso';

exports.ensureAuth = function(req,res,next){
    if(!req.headers.authorization){
        return res.status(403).send({message: 'La petición no tiene la cabecera de logueo'});
    }
    var token = req.headers.authorization.replace(/['"]+/g,'');
    try {
        var playload=jwt.decode(token,secret);
        if(playload.exp<=moment().unix()){
            return res.status(401).send({message: 'El Token ha expirado'});      
        }
    } catch (ex) {
       // console.log(ex);
        return res.status(404).send({message: 'Token no válido'});
    }
    req.user = playload;
    next();
};