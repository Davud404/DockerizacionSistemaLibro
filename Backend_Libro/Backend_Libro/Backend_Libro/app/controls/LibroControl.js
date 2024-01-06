'use strict'

var models = require('../models');
var persona = models.persona;
var rol = models.rol;
var cuenta = models.cuenta;
const bcrypt = require('bcrypt');
const saltRounds = 8;
const { Op } = require('sequelize');
var libro = models.libro;
var archivoLibro = models.archivoLibro;

class LibroControl {

    async listar(req, res) {
        var lista = await libro.findAll({
            where: { estado_vendido: false },
            include: [
                { model: models.archivoLibro, as: "archivoLibro", attributes: ['url'] }
            ],
            attributes: ['titulo', 'autor', 'editorial', 'fechaPublicacion', 'isbn', "genero","numeroPaginas","resumen","idioma","formato","precio", 'external_id']
            
        });
        res.status(200);
        res.json({ msg: "OK!", code: 200, info: lista });
    }


    async obtener(req, res) {
        const external = req.params.external;
        var lista = await persona.findOne({
            where: { external_id: external },
            attributes: ["nombres", "apellidos", "cedula", "direccion", ["external_id", "id"]],
            include: [
                { model: models.cuenta, as: "cuenta", attributes: ["usuario"] },
                { model: models.rol, as: "rol", attributes: ["nombre"] }
            ]
        });
        if (lista === null) {
            lista = {};
        }
        res.status(200);
        res.json({ msg: "OK!", code: 200, info: lista });
    }

    async guardars(req, res) {
        
            console.log(req.body);
            const libroData = JSON.parse(req.body.libros);
            console.log("esto queiero")
            console.log(libroData)
            console.log("esto queiero")
            

            if (
                libroData.hasOwnProperty('titulo') &&
                libroData.hasOwnProperty('autor') &&
                libroData.hasOwnProperty('editorial') &&
                libroData.hasOwnProperty('fechaPublicacion') &&
                libroData.hasOwnProperty('isbn') &&
                libroData.hasOwnProperty('precio') &&
                libroData.hasOwnProperty('genero') &&
                libroData.hasOwnProperty('numeroPaginas') &&
                libroData.hasOwnProperty('resumen') &&
                libroData.hasOwnProperty('idioma') &&
                libroData.hasOwnProperty('formato')) {

                var uuid = require('uuid');

                let data = {
                    titulo: libroData.titulo,
                    autor: libroData.autor,
                    editorial: libroData.editorial,
                    fechaPublicacion: libroData.fechaPublicacion,
                    isbn: libroData.isbn,
                    genero: libroData.genero,
                    numeroPaginas: libroData.numeroPaginas,
                    resumen: libroData.resumen,
                    idioma: libroData.idioma,
                    precio: libroData.precio,
                    formato: libroData.formato,
                    external_id: uuid.v4(),
                };

                let transaction = await models.sequelize.transaction();

                try {
                    const aux = await libro.create(data, { transaction });

                    for (const file of req.files) {
                        const imageUrl = `http://localhost:3007/imagenes/${file.filename}`;
                        let datos = {
                            url: imageUrl,
                            id_libro: aux.id,
                            external_id: uuid.v4(),
                        };

                        await archivoLibro.create(datos, { transaction });
                    }

                    await transaction.commit();
                    res.status(200).json({ msg: "Se han registrado sus datos", code: 200 });
                } catch (error) {
                    await transaction.rollback();

                    if (error.errors && error.errors[0].message) {
                        res.status(400).json({ msg: error.errors.message, code: 400 });
                    } else {
                        res.status(500).json({ msg: "Error interno del servidor", code: 500 });
                    }
                }
            } else {
                res.status(400).json({ msg: "Datos no encontrados", code: 400 });
            }

        

    }



    async modificar(req, res) {
        var person = await persona.findOne({ where: { external_id: req.body.external } })

        if (person === null) {
            res.status(400);
            res.json({ msg: "Error", tag: "El dato a modificar no existe", code: 400 });
        } else {

            if (req.body.hasOwnProperty('nombres') &&
                req.body.hasOwnProperty('apellidos') &&
                req.body.hasOwnProperty('direccion') &&
                req.body.hasOwnProperty('cedula')) {

                var uuid = require('uuid')

                person.nombres = req.body.nombres;
                person.apellidos = req.body.apellidos;
                person.direccion = req.body.direccion;
                person.cedula = req.body.cedula;
                person.external_id = uuid.v4();

                var result = await person.save();

                if (result === null) {
                    res.status(400);
                    res.json({ msg: "Error", tag: "No se han modificado los datos", code: 400 });
                } else {
                    res.status(200);
                    res.json({ msg: "Success", tag: "Datos modificados correctamente", code: 200 });
                }


            } else {
                res.status(400);
                res.json({ msg: "Error", tag: "faltan datos", code: 400 });
            }
        }
    }
}


module.exports = LibroControl;