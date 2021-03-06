'use strict'

var express = require('express');
var UserController = require('../controlador/user');
var api = express.Router();
var md_auth = require('../middlewares/logueo');
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/usuarios'});

api.get('/probando-controlador',md_auth.ensureAuth,UserController.pruebas);
api.post('/registrar',UserController.guardarUsuario);
api.post('/login',UserController.loginUser);
api.put('/update-user/:id',md_auth.ensureAuth,UserController.updateUser);
api.post('/upload-image-user/:id',[md_auth.ensureAuth, md_upload],UserController.uploadImage);
api.get('/get-image-user/:imageFile',UserController.getImagenFile);


module.exports = api;