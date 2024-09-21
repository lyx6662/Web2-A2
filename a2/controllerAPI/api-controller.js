var dbcon = require("../database");
var connection = dbcon.getconnection();
connection.connect();
var express = require('express');
var router = express.Router();
router.get("/", (req, res)=>{
	connection.query("select * from FUNDRAISER", (err, records,fields)=> {
		 if (err){
			 console.error("Error while retrieve the data");
		 }else{
			 res.send(records);
		 }
	})
})
module.exports = router;