
var models = require('../models')
var Promise = require('promise');
var winston = require('winston');
var async = require("async");

var dbTask = function () {

	return new Promise(function (fulfill, reject){	

		models.AssesorValues.findAll({
		  attributes: ['noOfImages', 'wFNo'],
		  where: {
		     $or : [{'completeStatus': 'C'}, {'completeStatus': 'P'}]
		  }
		}).then(function(result) {

			//log.msg.push("No. of pending records : " + result.length)
			winston.log("info","No. of pending records : " + result.length);

			async.forEachOf(result, function (data, key, callback) {
			//for( var i = 0; i < result.length; i++ ) {

				var details = JSON.stringify(data)

				//console.log(result[i])

				models.Images.count({
				     where: {
				        intimationNo: data.wFNo,
				        completeStatus: 'P'
				     }
				  })
				  .then(function(count) {

				  	//log.msg.push("Actual Image count : " + count + " ,Promised Image count : " + imgCount)
				  	winston.log("info",data.wFNo + " => Actual Image count : " + count + " ,Promised Image count : " + data.noOfImages)
				   
				    if(count === data.noOfImages){
				    	
				    	models.AssesorValues.update({ 
						  		completeStatus: 'R' 		
							}, {
							  where: {
							  	wFNo: data.wFNo,
								completeStatus: 'P'
							  }
						}).then(function(upresult1){

							//log.msg.push("Assesor values UPDATE, count: " + upresult1)
							winston.log("info",data.wFNo + " => Assesor values UPDATE Success, count: " + upresult1)
							
							//if(upresult1){
					
								models.Images.update({
								  	completeStatus: 'R' }, {
									  where: {
									  	intimationNo: data.wFNo,
										completeStatus: 'P'
									  }
								}).then(function(upresult2){

									//log.msg.push("Images UPDATE, count: " + upresult2)
									winston.log("info",data.wFNo + " => Images UPDATE Success, count: " + upresult2)
					
					
								}).catch(function(err) {
									winston.log("error","1=> "+JSON.stringify(err))
									//log.err.push(JSON.stringify(err))
									//console.log(JSON.stringify(err))
								});
							//}

						}).catch(function(err) {
							winston.log("error","2=> "+JSON.stringify(err))
							//log.err.push(JSON.stringify(err))
							//console.log(JSON.stringify(err))
						});
				    }

				  }).catch(function(err) {
				  	winston.log("error","3=> "+JSON.stringify(err))
				  	//log.err.push(JSON.stringify(err))
					//console.log(JSON.stringify(err));
				})
			})

			fulfill(true)
		
		}).catch(function(err) {
			//log.err.push(JSON.stringify(err))
			//console.log(log.err)
			winston.log("error","4=> "+JSON.stringify(err))
			reject(true)

			//console.log(JSON.stringify(err))
		});
	})



}

var task = Promise.denodeify(dbTask);

module.exports = task;