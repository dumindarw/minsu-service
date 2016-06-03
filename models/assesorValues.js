"use strict";

module.exports = function(sequelize, DataTypes) {
  var AssesorValues = sequelize.define("AssesorValues", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    wFNo: DataTypes.INTEGER,
    inspectionType: DataTypes.INTEGER,
    salvageRecieved: DataTypes.STRING,
    onsiteOffer: DataTypes.DOUBLE,
    excess: DataTypes.DOUBLE,
    aCR: DataTypes.DOUBLE,
    repairComplete: DataTypes.CHAR,
    specialRemarks: DataTypes.STRING,
    payableAmount: DataTypes.DOUBLE,
    telephone: DataTypes.DOUBLE,
    reason: DataTypes.STRING,
    mileage: DataTypes.DOUBLE,
    investigateClaim: DataTypes.CHAR,
    policeReportRequested: DataTypes.CHAR,
    professionalFee: DataTypes.DOUBLE,
    baldTyrePenalty: DataTypes.DOUBLE,
    photoCount: DataTypes.INTEGER,
    underInsuredPenalty: DataTypes.DOUBLE,
    inspectionRemarks: DataTypes.STRING,
    arrivalAtAccident: DataTypes.DATEONLY,
    otherCosts: DataTypes.DOUBLE,
    totalCost: DataTypes.DOUBLE,
    preAccidentValue: DataTypes.DOUBLE,
    settlementMethod: DataTypes.STRING,
    noOfImages: DataTypes.INTEGER,
    completeStatus: DataTypes.STRING

  }, {
    classMethods: {
      associate: function(models) {
        AssesorValues.hasMany(models.Images)
      }
    }
  });

  return AssesorValues;
};