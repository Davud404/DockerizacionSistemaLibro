'use strict'

var models = require('../models');
var persona = models.persona;
var rol = models.rol;
var cuenta = models.cuenta;
const bcrypt = require('bcrypt');
const saltRounds = 8;

class PersonaControl {

    async listar(req, res) {
        var lista = await persona.findAll({
            attributes: ["nombres", "apellidos", "identificacion", "tipo_identificacion", "direccion", ["external_id", "id"]],
            include: [
                { model: models.cuenta, as: "cuenta", attributes: ["correo"] },
            ]
        });
        res.status(200);
        res.json({ msg: "OK", code: 200, datos: lista });
    }

    async obtener(req, res) {
        const external = req.params.external;
        var lista = await persona.findOne({
            where: { external_id: external },
            attributes: ["nombres", "apellidos", "cedula", "direccion", ],
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

    async guardar(req, res) {

        if (req.body.hasOwnProperty('nombres') &&
            req.body.hasOwnProperty('apellidos') &&
            req.body.hasOwnProperty('direccion') &&
            req.body.hasOwnProperty('rol')) {

            var uuid = require('uuid');
            var rol_aux = await rol.findOne({ where: { external_id: req.body.rol } });

            if (rol_aux != undefined) {

                var claveHash = function (clave) {
                    return bcrypt.hashSync(clave, bcrypt.genSaltSync(saltRounds), null);
                };

                var data = {
                    nombres: req.body.nombres,
                    apellidos: req.body.apellidos,
                    identificacion: req.body.identificacion,
                    tipo_identificacion: req.body.tipo_identificacion,
                    direccion: req.body.direccion,
                    id_rol: rol_aux.id,
                    external_id: uuid.v4(),
                    cuenta: {
                        correo: req.body.correo,
                        clave: claveHash(req.body.clave),
                    }
                }


               

                let transaction = await models.sequelize.transaction();

                try {
                    var result = await persona.create(data, { include: [{ model: models.cuenta, as: "cuenta" }], transaction });
                    await transaction.commit();
                    if (result === null) {
                        res.status(401);
                        res.json({ msg: "Error", tag: "no se puede crear", code: 401 });
                    } else {
                        rol_aux.external_id = uuid.v4();
                        await rol_aux.save();
                        res.status(200);
                        res.json({ msg: "OK", code: 200 });
                    }

                } catch (error) {
                    if (transaction) await transaction.rollback();
                        if (error.errors && error.errors[0].message) {
                            res.json({ msg: error.errors[0].message, code: 200 })
                        } else {
                            res.json({ msg: error.message, code: 200 })
                        }

                }


            } else {
                res.status(400);
                res.json({ msg: "Error", tag: "El rol ingresado no existe", code: 400 });
            }

        } else {
            res.status(400);
            res.json({ msg: "Error", tag: "faltan datos", code: 400 });
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
            req.body.hasOwnProperty('identificacion')) {

                var uuid = require('uuid')

                person.nombres= req.body.nombres;
                person.apellidos= req.body.apellidos;
                person.identificacion= req.body.identificacion;
                person.tipo_identificacion= req.body.tipo_identificacion;
                person.direccion= req.body.direccion;
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


module.exports = PersonaControl;

// modificar datos persona
