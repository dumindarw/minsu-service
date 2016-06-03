## Description

Mobile app back-end REST service and proxy service for SOAP services.

## Functions

* Provide REST API for mobile.
* Store temporary records in MYSQL DB.
* Pass data to SOAP client.
* Maintain a log file.

## API Reference

API reference...

* /assesorValuesService - save accedent details 
* /imageService - save images  

## Migrations

sequelize db:migrate --env development

## Tests

No tests yet.

## Author

Duminda Wanninayake

## Install service

"C:\NSSM\nssm64.exe" install InsuranceMBAAS "C:\nodejs\node.exe" \"C:\Users\administrator.LOITSSTF\node-workspace\insu-service\index.js\"

##Log file location
C:\nodejs\insu.log
