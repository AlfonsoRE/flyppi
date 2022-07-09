'use strict'
var fs = require('fs');
var path = require('path');
var mongoosePagination = require('mongoose-pagination');
var Artista = require('../modelo/artista');
var Album = require('../modelo/album');
var Musica = require('../modelo/musica');


function guardarAlbum(req, res) {
	var album = new Album();
	var params = req.body;

	album.titulo = params.titulo;
	album.descripcion = params.descripcion;
	album.año = params.año;
	album.artista = params.artista;
	album.imagen = null;

	album.save((err, albumStored) => {
		if (err) {
			res.status(500).send({ message: 'Error al guardar el album' });
		}
		else {
			if (!albumStored) {
				res.status(404).send({ message: 'No se ha registrado el album' });
			} else {
				res.status(200).send({ album: albumStored });
			}
		}
	});

}

function getAlbums(req, res) {
	var artistaId = req.params.artista;
	if (!artistaId) {
		var find = Album.find({}).sort('titulo');
	} else {
		var find = Album.find({ artista: artistaId }).sort('año');
	}
	find.populate({ path: 'artista' }).exec((err, albums) => {
		if (err) {
			res.status(500).send({ message: 'Error en la petición' });
		} else {
			if (!albums) {
				res.status(404).send({ message: 'No hay albums!!' });
			} else {
				res.status(200).send({ albums:albums });
			}
		}
	});
}

function getAlbum(req, res) {
	var albumId = req.params.id;
//	console.log("id Album: "+albumId);
	Album.findById(albumId).populate({ path: 'artista' }).exec((err, album) => {
		if (err) {
			res.status(500).send({ message: 'Error en la petición' });
		} else {
			if (!album) {
				res.status(404).send({ message: 'El album no existe' });
			} else {
				res.status(200).send({ album: album });
			}
		}
	});
}

function actualizarAlbum(req, res) {
	var albumId = req.params.id;
	var update = req.body;

	Album.findByIdAndUpdate(albumId, update, (err, albumUpdate) => {
		if (err) {
			res.status(500).send({ message: 'Error al modificar el album' });
		}
		else {
			if (!albumUpdate) {
				res.status(404).send({ message: 'El album no ha sido actualizado' });
			} else {
				res.status(200).send({ album: albumUpdate });
			}
		}
	});
}

function eliminarAlbum(req, res) {
	var albumId = req.params.id;

	Album.findByIdAndRemove(albumId, (err, albumRemoved) => {
		if (err) {
			res.status(500).send({ message: 'Error al eliminar el album' });
		}
		else {
			if (!albumRemoved) {
				res.status(404).send({ message: 'El album no ha sido eliminado' });
			} else {
				Musica.find({ album: albumRemoved._id }).remove((err, musicaRemoved) => {
					if (err) {
						res.status(500).send({ message: 'Error al eliminar la musica' });
					}
					else {
						if (!musicaRemoved) {
							res.status(404).send({ message: 'La canción no ha sido eliminada' });
						} else {
							res.status(200).send({ album: albumRemoved });
						}
					}
				});
			}
		}
	});
}


function uploadImage(req, res) {
	var albumId = req.params.id;

	if (req.files) {
		var file_path = req.files.imagen.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];
		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
			Album.findByIdAndUpdate(albumId, { imagen: file_name }, (err, albumUpdated) => {
				if (!albumUpdated) {
					res.status(404).send({ message: "No se ha podido actualizar el artista" });
				} else {
					res.status(200).send({ album: albumUpdated });
				}
			});
		} else {
			res.status(200).send({ message: "Extensión del archivo no valida" });
		}
		console.log(file_split);
	} else {
		res.status(200).send({ message: "No has subido ninguna imagen" });
	}

}

function getImagenFile(req, res) {
	var imageFile = req.params.imageFile;
	var path_file = './uploads/albums/' + imageFile;
	fs.exists(path_file, function (exists) {
		if (exists) {
			res.sendFile(path.resolve(path_file));
		} else {
			res.status(200).send({ message: 'No existe la imagen...' });
		}
	});
}





module.exports = {
	getAlbum,
	guardarAlbum,
	getAlbums,
	actualizarAlbum,
	eliminarAlbum,
	uploadImage,
	getImagenFile
}