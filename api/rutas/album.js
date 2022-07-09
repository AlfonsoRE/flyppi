'use strict'

var express = require('express');
var AlbumController = require('../controlador/album');
var api = express.Router();
var md_auth = require('../middlewares/logueo');
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/albums'});

api.post('/album',AlbumController.guardarAlbum);
api.get('/album/:id',AlbumController.getAlbum);
api.get('/albums/:artista?',AlbumController.getAlbums);
api.put('/album/:id',md_auth.ensureAuth,AlbumController.actualizarAlbum);
api.delete('/album/:id',md_auth.ensureAuth,AlbumController.eliminarAlbum);
api.post('/upload-image-album/:id',[md_auth.ensureAuth, md_upload],AlbumController.uploadImage);
api.get('/get-image-album/:imageFile',AlbumController.getImagenFile);

module.exports = api;