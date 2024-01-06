'use strict'

const { where } = require('sequelize');
var models = require('../models');
var persona = models.persona;
var rol = models.rol;
var cuenta = models.cuenta;
let jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class CuentaControl {

    async inicio_sesion(req, res) {
        if (req.body.hasOwnProperty('correo') &&
            req.body.hasOwnProperty('clave')) {
            let cuentaA = await cuenta.findOne({
                where: { correo: req.body.correo },
                include: [
                    { model: models.persona, as: "persona", attributes: ["apellidos", "nombres", "id_rol", "external_id"] }
                ]
            });

            if (cuentaA === null) {
                res.status(400);
                res.json({ msg: "Error", tag: "Cuenta no existe", code: 400 });
            } else {

                var isClaveValida = function (clave, claveUser) {
                    return bcrypt.compareSync(claveUser, clave);
                };

                if (cuentaA.estado) {
                    if (isClaveValida(cuentaA.clave, req.body.clave)) {
                        var rolA = await rol.findOne({ where: {id: cuentaA.persona.id_rol}, attributes: ['nombre']});
                        const tokenData = {
                            rol: rolA.nombre,
                            external: cuentaA.external_id,
                            check: true,
                        };

                        require('dotenv').config();
                        const key = process.env.KEY_PRI;
                        const token = jwt.sign(tokenData, key, {
                            expiresIn: '2h'
                        });
                        var info = {
                            token: token,
                            user: cuentaA.persona.apellidos + ' ' + cuentaA.persona.nombres,
                            rol: rolA.nombre,
                            exter: cuentaA.persona.external_id,
                        }
                        res.status(200);
                        res.json({ msg: "OK", tag: "BIENVENIDO", data: info, code: 200 });
                    } else {
                        res.status(400);
                        res.json({ msg: "Error", tag: "Datos incorrectos", code: 400 });
                    }
                } else {
                    res.status(400);
                    res.json({ msg: "Error", tag: "Cuenta desactivada", code: 400 });
                }
            }
        } else {
            res.status(400);
            res.json({ msg: "Error", tag: "faltan datos", code: 400 });
        }

    }

}
module.exports = CuentaControl;