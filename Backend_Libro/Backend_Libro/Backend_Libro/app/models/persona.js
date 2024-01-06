'use strict';

module.exports = (sequelize, DataTypes) => {
    const persona = sequelize.define('persona', {
        nombres: { type: DataTypes.STRING(100), defaultValue: "NO_DATA" },
        apellidos: { type: DataTypes.STRING(100), defaultValue: "NO_DATA" },
        identificacion: { type: DataTypes.STRING(20), defaultValue: "NO_DATA", unique: true },
        tipo_identificacion: { type: DataTypes.ENUM("CEDULA", "PASAPORTE", "RUC"), defaultValue: "CEDULA" },
        external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
        direccion: { type: DataTypes.STRING(255), defaultValue: "NO_DATA" },
        estado: { type: DataTypes.BOOLEAN, defaultValue: true }
    }, { freezeTableName: true });

    persona.associate = function(models){
        persona.belongsTo(models.rol, {foreignKey: 'id_rol'});
        persona.hasOne(models.cuenta,{foreignKey: 'id_persona', as: 'cuenta'});
        persona.hasMany(models.factura,{foreignKey: 'id_persona', as: 'factura'});
    }
    return persona;
};
