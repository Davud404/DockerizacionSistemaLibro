'use strict';

module.exports = (sequelize, DataTypes) => {
    const det_factura = sequelize.define('det_factura', {
        cantidad: { type: DataTypes.INTEGER, defaultValue: 0 },
        subtotal: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.0 },
    }, { freezeTableName: true });
    det_factura.associate = function (models) {
        det_factura.belongsTo(models.libro, { foreignKey: 'id_libro' });
        det_factura.belongsTo(models.factura, { foreignKey: 'id_factura' });
    }
    return det_factura;
};

