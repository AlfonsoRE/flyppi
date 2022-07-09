'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;

mongoose.connect('mongodb://localhost:27017/curso_node', (err, res) => {
	if(err){
		throw err;
	}else{
		console.log("Conexion Exitosa...");
		app.listen(port, function(){
			console.log("Servidor del api rest escuchando en http://localhost:"+port);
		});
	}
});