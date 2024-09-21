var crowdfundingdb = require("./crowdfunding_db");
var mysql = require('mysql2');
var bodyParser = require('body-parser');
var http = require('http');
module.exports = {
	getconnection: ()=>{
	return mysql.createConnection({
		host:crowdfundingdb.host,
		user:crowdfundingdb.user,
		password:crowdfundingdb.password,
		database:crowdfundingdb.database	
	});
}
}