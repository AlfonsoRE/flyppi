'use strict'
var Artista = require('../modelo/artista');
var Album = require('../modelo/album');
var Musica = require('../modelo/musica');
var fs = require('fs');
var path = require('path');
var mongoosePagination = require('mongoose-pagination');

function getArtistas(req, res) {
	if (req.params.page) {
		var page = req.params.page;
	} else {
		var page = 1;
	}
	console.log("Pagina: "+page);
    //El numero de registro que va a regresar segun la paginacion
	var itemsPerPage = 4;
	Artista.find().sort('nombre').paginate(page, itemsPerPage, (err, artistas, total) => {
		if (err) {
			res.status(500).send({ message: 'Error en la petición' });
		} else {
			if (!artistas) {
				res.status(404).send({ message: 'No hay artistas!!!' });
			} else {
				res.status(200).send({ total_items: total, artistas: artistas });
			}
		}
	});
}

function getArtista(req, res) {
	var artistaId = req.params.id;
	Artista.findById(artistaId, (err, artista) => {
		if (err) {
			res.status(500).send({ message: 'Error en la petición' });
		} else {
			if (!artista) {
				res.status(404).send({ message: 'El artista no existe' });
			} else {
				res.status(200).send({ artista });
			}
		}
	});
}

function guardarArtista(req, res) {
	var artista = new Artista();
	var params = req.body;
	artista.nombre = params.nombre;
	artista.descripcion = params.descripcion;
	artista.imagen = null;
	artista.save((err, artistaStored) => {
		if (err) {
			res.status(500).send({ message: 'Error al guardar el artista' });
		}else {
			if (!artistaStored) {
				res.status(404).send({ message: 'No se ha registrado el artista' });
			} else {
				res.status(200).send({ artista: artistaStored });
			}
		}});
}

function actualizarArtista(req, res) {
	var artistaId = req.params.id;
	var update = req.body;

	Artista.findByIdAndUpdate(artistaId, update, (err, artistaUpdate) => {
		if (err) {
			res.status(500).send({ message: 'Error al modificar el artista' });
		}
		else {
			if (!artistaUpdate) {
				res.status(404).send({ message: 'El artista no ha sido actualizado' });
			} else {
				res.status(200).send({ artista: artistaUpdate });
			}
		}
	});
}

function eliminarArtista(req, res) {
	var artistaId = req.params.id;
	var update = req.body;

	Artista.findByIdAndRemove(artistaId, (err, artistaRemoved) => {
		if (err) {
			res.status(500).send({ message: 'Error al eliminar el artista' });
		}
		else {
			if (!artistaRemoved) {
				res.status(404).send({ message: 'El artista no ha sido eliminado' });
			} else {
				Album.find({ artista: artistaRemoved._id }).remove((err, albumRemoved) => {
					if (err) {
						res.status(500).send({ message: 'Error al eliminar el Album' });
					}
					else {
						if (!albumRemoved) {
							res.status(404).send({ message: 'El album no ha sido eliminado' });
						} else {
							Musica.find({ album: albumRemoved._id }).remove((err, musicaRemoved) => {
								if (err) {
									res.status(500).send({ message: 'Error al eliminar la canción' });
								}
								else {
									if (!musicaRemoved) {
										res.status(404).send({ message: 'La canción no ha sido eliminada' });
									} else {
										res.status(200).send({ artista: artistaRemoved });
									}
								}
							});
						}
					}
				});
			}
		}
	});

}

function uploadImage(req, res) {
	var artistaId = req.params.id;

	if (req.files) {
		var file_path = req.files.imagen.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];
		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];


		//console.log("id del artista: " + artistaId + " nombre: " + file_name);

		if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
			Artista.findByIdAndUpdate(artistaId, { imagen: file_name }, (err, artistaUpdated) => {
				if (!artistaUpdated) {
					res.status(404).send({ message: "No se ha podido actualizar el artista" });
				} else {
					res.status(200).send({ image: file_name, artista: artistaUpdated });
				}
			});
		} else {
			res.status(200).send({ message: "Extensión del archivo no valida" });
		}
		//console.log(file_split);
	} else {
		res.status(200).send({ message: "No has subido ninguna imagen" });
	}

}

function getImagenFile(req, res) {
	var imageFile = req.params.imageFile;
	var path_file = './uploads/artistas/' + imageFile;
	fs.exists(path_file, function (exists) {
		if (exists) {
			res.sendFile(path.resolve(path_file));
		} else {
			res.status(200).send({ message: 'No existe la imagen...' });
		}
	});
}





module.exports = {
	getArtista,
	guardarArtista,
	getArtistas,
	actualizarArtista,
	eliminarArtista,
	uploadImage,
	getImagenFile
}