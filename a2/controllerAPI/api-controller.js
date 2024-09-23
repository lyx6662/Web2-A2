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


router.get("/fundraisers-with-categories", (req, res) => {
	connection.query("SELECT * FROM FUNDRAISER JOIN CATEGORY ON FUNDRAISER.category_id = CATEGORY.category_id", (err, records, fields) => {
		if (err) {
			console.error("Error while retrieving data");
			res.status(500).send("Error retrieving fundraisers with categories");
		} else {
			res.send(records);
		}
	});
});

router.get("/categories", (req, res) => {
	connection.query("SELECT * FROM CATEGORY", (err, records, fields) => {
		if (err) {
			console.error("Error while retrieving categories");
			res.status(500).send("Error retrieving categories");
		} else {
			res.send(records);
		}
	});
});

router.get("/fundraisers-with-filtered-categories", (req, res) => {
	// 根据特定标准查询筹款人和类别，这里假设标准为类别名称以特定字符串开头
	const categoryFilter = "Poor Student";
	connection.query(`SELECT * FROM FUNDRAISER JOIN CATEGORY ON FUNDRAISER.category_id = CATEGORY.category_id WHERE CATEGORY.name LIKE '${categoryFilter}%'`, (err, records, fields) => {
		if (err) {
			console.error("Error while retrieving filtered data");
			res.status(500).send("Error retrieving fundraisers with filtered categories");
		} else {
			res.send(records);
		}
	});
});

router.get("/fundraiser/:id", (req, res) => {
	const fundraiserId = req.params.id;
	connection.query("SELECT * FROM FUNDRAISER WHERE fundraiser_id =?", [fundraiserId], (err, records, fields) => {
		if (err) {
			console.error("Error while retrieving fundraiser details");
			res.status(500).send("Error retrieving fundraiser details");
		} else if (records.length === 0) {
			res.status(404).send("Fundraiser not found");
		} else {
			res.send(records[0]);
		}
	});
});

module.exports = router;