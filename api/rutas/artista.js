'use strict'

var express = require('express');
var ArtistController = require('../controlador/artista');
var api = express.Router();
var md_auth = require('../middlewares/logueo');
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/artistas'});


api.get('/artista/:id',md_auth.ensureAuth,ArtistController.getArtista);
api.post('/artista',md_auth.ensureAuth,ArtistController.guardarArtista);
api.get('/artistas/:page?',md_auth.ensureAuth,ArtistController.getArtistas);
api.put('/artista/:id',md_auth.ensureAuth,ArtistController.actualizarArtista);
api.delete('/artista/:id',md_auth.ensureAuth,ArtistController.eliminarArtista);
api.post('/upload-image-artista/:id',[md_auth.ensureAuth, md_upload],ArtistController.uploadImage);
api.get('/get-image-artista/:imageFile',ArtistController.getImagenFile);


module.exports = api;