'use strict';

module.exports = (sequelize, DataTypes) => {
    const libro = sequelize.define('libro', {
        // Atributos del libro
        titulo: { type: DataTypes.STRING(100), defaultValue: "NO_DATA" },
        autor: { type: DataTypes.STRING(100), defaultValue: "NO_DATA" },
        editorial: { type: DataTypes.STRING(100), defaultValue: "NO_DATA" },
        fechaPublicacion: { type: DataTypes.DATE, defaultValue:  sequelize.literal('CURRENT_TIMESTAMP')},
        isbn: { type: DataTypes.STRING(13), defaultValue: "NO_DATA" },
        genero: { type: DataTypes.STRING(50), defaultValue: "NO_DATA" },
        numeroPaginas: { type: DataTypes.INTEGER, defaultValue: 0 },
        resumen: { type: DataTypes.TEXT, defaultValue: "NO_DATA" },
        idioma: { type: DataTypes.STRING(50), defaultValue: "NO_DATA" },
        copia_identificacion: { type: DataTypes.STRING(20), defaultValue: "NO_DATA" },
        formato: { type: DataTypes.ENUM('impreso', 'electronico', 'audiolibro'), defaultValue: 'impreso' },
        estado_vendido: { type: DataTypes.BOOLEAN, defaultValue: false },
        precio: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.0 },
        external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
    }, { freezeTableName: true });

    libro.associate = function(models){
        libro.hasOne(models.det_factura, { foreignKey: 'id_libro', as: "det_factura" });
        libro.hasMany(models.archivoLibro, { foreignKey: 'id_libro', as: "archivoLibro" });

    };

    return libro;
};
