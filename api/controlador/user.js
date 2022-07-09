'use strict'
var bcrypt = require('bcrypt-nodejs');
var Usuario = require('../modelo/usuario');
var jwt = require('../servicios/jwt');
var fs = require('fs');
var path = require('path');

function pruebas(req, res) {
	res.status(200).send({
		message: 'Probando una accion del controlador de usuarios con api rest con Node y Mongo'
	});
}

function guardarUsuario(req, res) {
	var user = new Usuario();
	var params = req.body;

	console.log(params);

	user.nombre = params.nombre;
	user.apellidos = params.apellidos;
	user.email = params.email;
	user.rol = 'ROLE_USER';
	user.imagen = null;

	if (params.password) {
		bcrypt.hash(params.password, null, null, function (err, hash) {
			user.password = hash;
			if (user.nombre != null && user.apellidos != null && user.email != null) {

				user.save((err, userStored) => {
					if (err) {
						res.status(500).send({ message: 'Error al guardar al usuario' });
					}
					else {
						if (!userStored) {
							res.status(404).send({ message: 'No se ha registrado el usuario' });
						} else {
							res.status(200).send({ user: userStored });
						}
					}
				});

			}
			else {
				res.status(200).send({ message: 'Rellena todos los campos' });
			}
		});

	}
	else {
		res.status(500).send({ message: 'Introdusca la contraseña' });
	}

}

function loginUser(req, res) {
	var params = req.body;
	var email = params.email;
	var password = params.password;
	Usuario.findOne({ email: email.toLowerCase() }, (err, user) => {
		if (err) {
			res.status(500).send({ message: "Error en la peticion" });
		} else {
			if (!user) {
				res.status(404).send({ message: "El usuario no existe" });
			} else {
				bcrypt.compare(password, user.password, function (err, check) {
					if (check) {
						if (params.gethash) {
							res.status(200).send({
								token: jwt.createToken(user)
							});
						} else {
							res.status(200).send({ user });
						}
					} else {
						res.status(404).send({ message: "El usuario no ha podido loguearse" });
					}
				});
			}
		}
	});

}

function updateUser(req, res) {
	var userId = req.params.id;
	var update = req.body;
	//se checa si el usuario que esta guardado en el token es igual al que envian
	if (userId != req.user.sub) {
		return res.status(500).send({ message: "No tienes permiso para actualizar este usuario" });
	}

	Usuario.findByIdAndUpdate(userId, update, (err, userUpdated) => {
		if (err) {
			res.status(500).send({ message: "Error al actualizar el usuario" });
		} else {
			if (!userUpdated) {
				res.status(404).send({ message: "No se ha podido actualizar el usuario" });
			} else {
				res.status(200).send({ user: userUpdated });

			}
		}
	});

}

function uploadImage(req, res) {
	var userId = req.params.id;
	var file_name = 'No subio...';

	if (req.files) {
		console.log("INICIA");
		var file_path = req.files.imagen.path;
		console.log(file_path);
		var file_split = file_path.split('\\');
		var file_name = file_split[2];
		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
			Usuario.findByIdAndUpdate(userId, { imagen: file_name }, (err, userUpdated) => {
				if (!userUpdated) {
					res.status(404).send({ message: "No se ha podido actualizar el usuario" });
				} else {
					res.status(200).send({ image: file_name, user: userUpdated });
				}
			});
		} else {
			res.status(200).send({ message: "Extensión del archivo no valida" });
		}

	} else {
		res.status(200).send({ message: "No has subido ninguna imagen" });
	}
}

function getImagenFile(req, res) {
	var imageFile = req.params.imageFile;
	var path_file = './uploads/usuarios/' + imageFile;
	fs.exists(path_file, function (exists) {
		if (exists) {
			res.sendFile(path.resolve(path_file));
		} else {
			res.status(200).send({ message: 'No existe la imagen...' });
		}
	});
}



module.exports = {
	pruebas,
	guardarUsuario,
	loginUser,
	updateUser,
	uploadImage,
	getImagenFile
}