'use strict'
var fs = require('fs');
var path = require('path');
var mongoosePagination = require('mongoose-pagination');
var Artista = require('../modelo/artista');
var Album = require('../modelo/album');
var Musica = require('../modelo/musica');


function guardarMusica(req, res) {
	var musica = new Musica();
	var params = req.body;

	musica.numero = params.numero;
	musica.nombre = params.nombre;
	musica.duracion = params.duracion;
	musica.file = null;
	musica.album = params.album;;

	musica.save((err, musicaStored) => {
		if (err) {
			res.status(500).send({ message: 'Error al guardar la canción' });
		}
		else {
			if (!musicaStored) {
				res.status(404).send({ message: 'No se ha registrado la canción' });
			} else {
				res.status(200).send({ musica: musicaStored });
			}
		}
	});

}

function getMusicas(req, res) {
	var albumId = req.params.album;
	if (!albumId) {
		var find = Musica.find({}).sort('nombre');
	} else {
		var find = Musica.find({ album: albumId }).sort('numero');
	}
	find.populate({ path: 'album', populate: { path: 'artista', model: 'Artista' } }).exec((err, canciones) => {
		if (err) {
			res.status(500).send({ message: 'Error en la petición' });
		} else {
			if (!canciones) {
				res.status(404).send({ message: 'No hay albums!!' });
			} else {
				res.status(200).send({ musicas: canciones });
			}
		}
	});
}

function getMusica(req, res) {
	var musicaId = req.params.id;
	Musica.findById(musicaId).populate({ path: 'album' }).exec((err, musica) => {
		if (err) {
			res.status(500).send({ message: 'Error en la petición' });
		} else {
			if (!musica) {
				res.status(404).send({ message: 'La canción no existe' });
			} else {
				res.status(200).send({ musica });
			}
		}
	});
}

function actualizarMusica(req, res) {
	var musicaId = req.params.id;
	var update = req.body;

	Musica.findByIdAndUpdate(musicaId, update, (err, musicaUpdate) => {
		if (err) {
			res.status(500).send({ message: 'Error al modificar la canción' });
		}
		else {
			if (!musicaUpdate) {
				res.status(404).send({ message: 'La canción no ha sido actualizado' });
			} else {
				res.status(200).send({ musica: musicaUpdate });
			}
		}
	});
}

function eliminarMusica(req, res) {
	var musicaId = req.params.id;

	Musica.findByIdAndRemove(musicaId, (err, musicaRemoved) => {
		if (err) {
			res.status(500).send({ message: 'Error al eliminar la canción' });
		}
		else {
			if (!musicaRemoved) {
				res.status(404).send({ message: 'La cancion no ha sido eliminado' });
			} else {
				res.status(200).send({ musica:musicaRemoved });
			}
		}
	});
}


function uploadFile(req, res) {
	var musicaId = req.params.id;

	if (req.files) {
		var file_path = req.files.imagen.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];
		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		if (file_ext == 'mp3' || file_ext == 'ogg') {
			Musica.findByIdAndUpdate(musicaId, { file: file_name }, (err, musicaUpdated) => {
				if (!musicaUpdated) {
					res.status(404).send({ message: "No se ha podido actualizar la canción" });
				} else {
					res.status(200).send({ musica: musicaUpdated });
				}
			});
		} else {
			res.status(200).send({ message: "Extensión del archivo no valida" });
		}
		
	} else {
		res.status(200).send({ message: "No has subido ningun archivo de audio" });
	}

}

function getMusicaFile(req, res) {
	var imageFile = req.params.musicaFile;
	var path_file = './uploads/canciones/' + imageFile;
	fs.exists(path_file, function (exists) {
		if (exists) {
			res.sendFile(path.resolve(path_file));
		} else {
			res.status(200).send({ message: 'No existe el audio...' });
		}
	});
}





module.exports = {
	getMusica,
	guardarMusica,
	getMusicas,
	actualizarMusica,
	eliminarMusica,
	uploadFile,
	getMusicaFile
}