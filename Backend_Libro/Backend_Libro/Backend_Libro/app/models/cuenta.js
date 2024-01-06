'use strict';

module.exports = (sequelize, DataTypes) => {
    const cuenta = sequelize.define('cuenta', {
        correo: { type: DataTypes.STRING(20), defaultValue: "NO_DATA" },
        clave: { type: DataTypes.STRING(120), defaultValue: "NO_DATA" },
        external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
        estado: { type: DataTypes.BOOLEAN, defaultValue: true }
    }, { freezeTableName: true });

    cuenta.associate = function(models){
        cuenta.belongsTo(models.persona, {foreignKey: 'id_persona'});
    }
    return cuenta;
};