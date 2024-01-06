'use strict';

module.exports = (sequelize, DataTypes) => {
    const archivoLibro = sequelize.define('archivoLibro', {
        url: { type: DataTypes.STRING(100), defaultValue: "NO_DATA" },
        external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
    }, { freezeTableName: true });

    archivoLibro.associate = function (models) {
        archivoLibro.belongsTo(models.libro, { foreignKey: 'id_libro' });
    }
    return archivoLibro;
};        