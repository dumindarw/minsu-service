"use strict";

module.exports = function(sequelize, DataTypes) {
  var Images = sequelize.define("Images", {
    
    intimationNo: DataTypes.INTEGER,
    imageName: DataTypes.STRING,
    image: DataTypes.TEXT('long'),
    completeStatus: DataTypes.STRING,
    inspectionType: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        Images.belongsTo(models.AssesorValues, {
            foreignKey: 'wFNo'
        });
      }
    }
  });

  return Images;
};