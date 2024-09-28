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


router.get("/Search/:search", (req, res) => {
    const searchParams = req.params.search;
    const params = searchParams.split(',');
    if (params.length === 0) {
        return res.status(400).send("You must select at least one criterion.");
    }
    let query = "SELECT f.*, c.NAME AS category_name FROM FUNDRAISER f JOIN CATEGORY c ON f.CATEGORY_ID = c.CATEGORY_ID WHERE ";
    const conditions = [];
    if (params.includes("ORGANIZER")) {
        const organizer = req.query.organizer;
        if (organizer) {
            conditions.push(`f.ORGANIZER = '${organizer}'`);
        }
    }
    if (params.includes("NAME")) {
        const categoryName = req.query.categoryName;
        if (categoryName) {
            conditions.push(`c.NAME = '${categoryName}'`);
        }
    }
    if (params.includes("CITY")) {
        const city = req.query.city;
        if (city) {
            conditions.push(`f.CITY = '${city}'`);
        }
    }
    if (conditions.length!== params.length) {
        return res.status(400).send("All selected criteria must have values provided.");
    }
    query += conditions.join(" AND ");
    connection.query(query, (err, records, fields) => {
        if (err) {
            console.error("Error while searching data", err);
            return res.status(500).send("Error while searching data.");
        }
        res.send(records);
    });
});


module.exports = router;