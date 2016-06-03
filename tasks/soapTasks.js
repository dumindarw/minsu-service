var models = require('../models')
var constants = require('../config/constants.json')
var Promise = require('promise');
var winston = require('winston');
var async = require("async");

var imageValuesSoapClient = require('../client/imageValuesSoapClient')
var assessorValuesSoapClient = require('../client/assessorValuesSoapClient')

var soapTask = function () {

	return new Promise(function (fulfill, reject){

		models.AssesorValues.findAll({
		   where: {
		    completeStatus: 'R'
		  }
		}).then(function(result){

			var obj = {}

			Promise.all(result).then(function(assessorValues) {

				async.eachSeries(assessorValues, function (value, next) { 
				     setTimeout(function() {
				          console.log(value.wFNo);

				          winston.log("info","SOAP Assesor values: " + JSON.stringify(value))

							obj = {
								':wFNo' : value.wFNo,
								':aCR' : value.aCR,
								':baldTyrePenalty' : value.baldTyrePenalty,
								':payableAmount' : value.payableAmount,
								':settlementMethod' : value.settlementMethod,
								':onsiteOffer' : value.onsiteOffer,
								':inspectionType' : value.inspectionType,
								':inspectionRemarks' : value.inspectionRemarks,
								':policeReportRequested' : value.policeReportRequested,
								':specialRemarks' : value.specialRemarks,
								':investigateClaim' : value.investigateClaim,
								':arrivalAtAccident' : value.arrivalAtAccident,
								':mileage' : value.mileage,
								':otherCosts' : value.otherCosts,
								':reason' : value.reason,
								':preAccidentValue' : value.preAccidentValue,
								':underInsuredPenalty' : value.underInsuredPenalty,
								':excess' : value.excess,
								':professionalFee' : value.professionalFee,
								':telephone' : value.telephone,
								':totalCost' : value.totalCost,
								':photoCount' : value.photoCount,
								':repairComplete' : value.repairComplete,
								':salvageRecieved' : value.salvageRecieved
							}

							//console.log(JSON.stringify(obj))

							assessorValuesSoapClient(constants.ASSESOR_VALUE_SERVICE_URL, obj).then(function(soapResult) {

								winston.log("info",value.wFNo + " => SOAP: Assesor values result: " + JSON.stringify(soapResult))
								if(typeof soapResult.return !== 'undefined'){
									//if(soapResult.return){
										if (soapResult.return.charAt(0) === "S") {//S
											models.AssesorValues.update({ 
										  		completeStatus: 'C',		
												}, {
												  where: {
												  	wFNo: value.wFNo,
												  	completeStatus: 'R'
												  }
											}).then(function(result2){
												//TODO: send images
												winston.log("info",value.wFNo + " => Completed")
											}).catch(function(err) {
												winston.log("error","5=> " +JSON.stringify(err))
												//log.err.push(JSON.stringify(err))
												//console.log(JSON.stringify(err))
											})
										}
									//}
								}
							})

				          next(); // don't forget to execute the callback!
				     }, 4000);
				}, function () {
				     console.log('Done going through assesor values!');
				});
			})

			fulfill(true)

		}).catch(function(err) {
			winston.log("error","soapTasks 6=> " +JSON.stringify(err))
			reject(true)
		});

		models.Images.findAll({
		   attributes: ['imageName', 'image', 'intimationNo', 'inspectionType'],
		   where: {
		    completeStatus: 'R'
		  }
		}).then(function(result){

			winston.log("info","Received image count: "  + result.length)

			var imgObj = {}


			Promise.all(result).then(function(imageValues) { 

			  //console.log(values[1].dataValues);

			  async.eachSeries(imageValues, function (value, next) { 
				     setTimeout(function() {
				          console.log(value.imageName);

				         imgObj = {
								':intimationNo' : value.intimationNo,
								':image' : value.image,
								':inspectionType': value.inspectionType,
								':imageName' : value.imageName
							}

							winston.log("info","image name: "  + value.imageName)

							imageValuesSoapClient(constants.IMAGE_SERVICE_URL, imgObj).then(function(soapResult) {

								winston.log("info",value.intimationNo + " => SOAP: Images result: "  + JSON.stringify(soapResult))

								//if(typeof soapResult !== 'undefined'){
									if(typeof soapResult.return  !== 'undefined'){
										if (soapResult.return.charAt(0) === "S") {//S
											models.Images.update({ 
										  		completeStatus: 'C' 		
												}, {
												  where: {
												  	intimationNo: value.intimationNo,
												  }
											}).then(function(result2){

												//TODO: send images
												winston.log("info",value.intimationNo + " => Completed")
											}).catch(function(err) {
												winston.log("error","7=> " + JSON.stringify(err))
											})
										}
									}
								//}

								//callback();

							}).catch(function(err) {
							  	winston.log("error","imageValuesSoapClient=> "+JSON.stringify(err))
							})

				          next(); // don't forget to execute the callback!
				     }, 4000);
				}, function () {
				     console.log('Done going through values!');
				});
			  	
			})

			fulfill(true)

		}).catch(function(err) {
			winston.log("error","8=> " +JSON.stringify(err))
			reject(true)
		})
	})
}

var task = Promise.denodeify(soapTask);

module.exports = task;