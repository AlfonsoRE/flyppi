'use strict'

var express = require('express');
var MusicaController = require('../controlador/musica');
var api = express.Router();
var md_auth = require('../middlewares/logueo');
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/canciones'});

api.post('/musica',MusicaController.guardarMusica);
api.get('/musica/:id',MusicaController.getMusica);
api.get('/musicas/:album?',MusicaController.getMusicas);
api.put('/musica/:id',md_auth.ensureAuth,MusicaController.actualizarMusica);
api.delete('/musica/:id',md_auth.ensureAuth,MusicaController.eliminarMusica);
api.post('/upload-file-musica/:id',[md_auth.ensureAuth, md_upload],MusicaController.uploadFile);
api.get('/get-musica-file/:musicaFile',MusicaController.getMusicaFile);

module.exports = api;