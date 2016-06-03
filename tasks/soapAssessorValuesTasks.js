var models = require('../models')
var constants = require('../config/constants.json')
var Promise = require('promise');
var winston = require('winston');
var async = require("async");

var client = require('../client')
var assessorValuesSoapClient = require('../client/assessorValuesSoapClient')

var soapAssessorValuesTask = function () {

	return new Promise(function (fulfill, reject){

		models.AssesorValues.findAll({
		   where: {
		    completeStatus: 'P'
		  }
		}).then(function(result){

			var obj = {}

			Promise.all(result).then(function(assessorValues) {

				async.eachSeries(assessorValues, function (data, next) { 

					winston.log("info","SOAP Assesor values: " + JSON.stringify(data))

					var obj = {
						':wFNo' : data.wFNo,
						':aCR' : data.aCR,
						':baldTyrePenalty' : data.baldTyrePenalty,
						':payableAmount' : data.payableAmount,
						':settlementMethod' : data.settlementMethod,
						':onsiteOffer' : data.onsiteOffer,
						':inspectionType' : data.inspectionType,
						':inspectionRemarks' : data.inspectionRemarks,
						':policeReportRequested' : data.policeReportRequested,
						':specialRemarks' : data.specialRemarks,
						':investigateClaim' : data.investigateClaim,
						':arrivalAtAccident' : data.arrivalAtAccident,
						':mileage' : data.mileage,
						':otherCosts' : data.otherCosts,
						':reason' : data.reason,
						':preAccidentValue' : data.preAccidentValue,
						':underInsuredPenalty' : data.underInsuredPenalty,
						':excess' : data.excess,
						':professionalFee' : data.professionalFee,
						':telephone' : data.telephone,
						':totalCost' : data.totalCost,
						':photoCount' : data.photoCount,
						':repairComplete' : data.repairComplete,
						':salvageRecieved' : data.salvageRecieved
					}

					//console.log(JSON.stringify(obj))

					assessorValuesSoapClient(constants.ASSESOR_VALUE_SERVICE_URL, obj).then(function(soapResult) {

						winston.log("info",data.wFNo + " => SOAP: Assesor values result: " + JSON.stringify(soapResult))
						if(typeof soapResult.return !== 'undefined'){
							//if(soapResult.return){
								if (soapResult.return.charAt(0) === "S") {//S
									models.AssesorValues.update({ 
								  		completeStatus: 'C',		
										}, {
										  where: {
										  	wFNo: data.wFNo,
										  	completeStatus: 'P'/* changed R to P 'REASON: SP asked to send values directly.'*/
										  }
									}).then(function(result2){
										//TODO: send images
										winston.log("info",data.wFNo + " => Completed")
									}).catch(function(err) {
										winston.log("error","5=> " +JSON.stringify(err))
										//log.err.push(JSON.stringify(err))
										//console.log(JSON.stringify(err))
									})
								}
							//}
						}
					})
				})

			})

			fulfill(true)

		}).catch(function(err) {
			winston.log("error","soapAssesorValues 6=> " +JSON.stringify(err))
			reject(true)
		});

	});

}	

var task = Promise.denodeify(soapAssessorValuesTask);

module.exports = task;	
