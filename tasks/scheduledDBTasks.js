var models = require('../models')
var Promise = require('promise');
var winston = require('winston');

var dbTask2 = function () {
	return new Promise(function (fulfill, reject){

		models.Images.findOne({ 
			attributes: ['intimationNo'],
			where: {
				completeStatus: 'C'
			}
		}).then(function(data) {

			winston.log("info","Found completed image data: "+JSON.stringify(data))

			models.AssesorValues.destroy({
			    where: {
			       completeStatus: 'C',
			       wFNo: data.intimationNo
			    }
			}).then(function(result) {
				winston.log("info","REMOVING AssesorValues: "+JSON.stringify(result))

				models.sequelize.query("optimize table assesorvalues").spread(function(res) {
			      winston.log("info","OPTIMIZE assesorvalues table : " + JSON.stringify(res));
				})

				fulfill(true)
			}).catch(function(err) {
				winston.log("error","9=> "+JSON.stringify(err))
				reject(true)
			});

			models.Images.destroy({
			    where: {
			       completeStatus: 'C',
				   intimationNo: data.intimationNo
			    }
			}).then(function(result) {
				winston.log("info","REMOVING Images: "+JSON.stringify(result))

				models.sequelize.query("optimize table images").spread(function(res) {
			      winston.log("info","OPTIMIZE image table : " + JSON.stringify(res));
				})

				fulfill(true)
			}).catch(function(err) {
				winston.log("error","10=> "+JSON.stringify(err))
				reject(true)
			});
		  
		})	

	})

}

var task = Promise.denodeify(dbTask2);

module.exports = task;