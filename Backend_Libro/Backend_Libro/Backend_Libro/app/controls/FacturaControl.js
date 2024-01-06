"use strict";

var models = require('../models/');
var factura = models.factura;
var persona = models.persona;
var libro = models.libro;
var det_factura = models.det_factura;

class FacturaControl {
    async listar(req, res) {
        var lista = await rol.findAll({
            attributes: ["nombre", ["external_id", "id"]],
        });
        res.status(200);
        res.json({ msg: "OK", code: 200, datos: lista });


    }
    async guardar(req, res) {
        const facturas = JSON.parse(req.body.factura);

        const dataDesArray = [];
        if (Array.isArray(req.body.dataDes)) {
            for (const item of req.body.dataDes) {
                dataDesArray.push(JSON.parse(item));
            }
        } else {
            dataDesArray.push(JSON.parse(req.body.dataDes));
        }

        let persona_id = facturas.external_persona;

        if (persona_id != undefined) {
            let personaAux = await persona.findOne({
                where: { external_id: persona_id },
            });

            if (personaAux) {
                var data = {
                    fecha: facturas.fecha,
                    metodpago: facturas.metodo,
                    estado: facturas.estado,
                    id_persona: personaAux.id,
                };

                let transaction = await models.sequelize.transaction();

                try {
                    const auxFactura = await factura.create(data, { transaction });

                    for (const car of dataDesArray) {
                        // Utilizar 'dataDes' en lugar de 'dataDesArray'
                        //console.log("EXTERNAL ID CAR", car.external_id);
                        let libroAux = await libro.findOne({
                            where: { external_id: car.external_id },
                        });

                        libroAux.copia_identificacion = personaAux.identificacion;
                        libroAux.estado_vendido = true;

                        var result = await libroAux.save();

                        if (result === null) {
                            res.status(400);
                            res.json({ msg: "error al agregar libro", code: 200 });
                        } else {
                            res.status(200);
                            let datos = {
                                cantidad: ventas.cantidad,
                                subtotal: ventas.subtotal,
                                id_factura: auxFactura.id,
                                id_libro: libroAux.id,

                            };
                            await det_factura.create(datos, { transaction });
                        }
                    }

                    await transaction.commit();
                    res.json({ msg: "Se han registrado su Factura", code: 200 });
                } catch (error) {
                    if (transaction) await transaction.rollback();
                    if (error.errors && error.errors[0].message) {
                        res.json({ msg: error.errors[0].message, code: 200 });
                    } else {
                        res.json({ msg: error.message, code: 200 });
                    }
                }
            } else {
                res.status(400);
                res.json({ msg: "Datos no encontrados", code: 400 });
            }
        } else {
            res.status(400);
            res.json({ msg: "Datos no encontrados", code: 400 });
        }
    }
}

module.exports = FacturaControl;
