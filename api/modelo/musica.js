'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MusicaSchema = Schema({
	numero: String,
	nombre: String,
	duracion: String,
	file: String,
	album: {type: Schema.ObjectId, ref: 'Album'}
});

module.exports = mongoose.model('Musica',MusicaSchema);
