'use strict';

module.exports = (sequelize, DataTypes) => {
    const factura = sequelize.define('factura', {
        motodpago: { type: DataTypes.STRING(100), defaultValue: "" },
        fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
        estado: { type: DataTypes.ENUM("PAGADO", "PENDIENTE"), defaultValue: "PENDIENTE" },
        total: { type: DataTypes.DECIMAL(15,2), defaultValue: 0.0 },

    }, { freezeTableName: true });
    factura.associate = function(models){
        factura.belongsTo(models.persona, {foreignKey: 'id_persona'});
        factura.hasMany(models.det_factura,{foreignKey: 'id_factura', as: 'det_factura'});
    }
    return factura;
};