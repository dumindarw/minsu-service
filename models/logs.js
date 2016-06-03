"use strict";

module.exports = function(sequelize, DataTypes) {
  var Logs = sequelize.define("Logs", {
    logId : {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    intimationNo: DataTypes.INTEGER,
    details: DataTypes.TEXT
  });

  return Logs;
};