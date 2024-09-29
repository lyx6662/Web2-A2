var dbcon = require("../database");
// Require database connection module.

var connection = dbcon.getconnection();
connection.connect();
// Obtain database connection and establish it.

var express = require('express');
var router = express.Router();
// Require Express and create router instance.

// Route to get all fundraisers.
router.get("/", (req, res) => {
    connection.query("select * from FUNDRAISER", (err, records, fields) => {
        if (err) {
            console.error("Error retrieving data.");
            // In case of error, log and send an error response.
        } else {
            res.send(records);
        }
    });
});

// Route to get fundraiser details by id.
router.get("/fundraiser/:id", (req, res) => {
    const fundraiserId = req.params.id;
    connection.query("SELECT * FROM FUNDRAISER WHERE fundraiser_id =?", [fundraiserId], (err, records, fields) => {
        if (err) {
            console.error("Error retrieving fundraiser details.");
            res.status(500).send("Error retrieving fundraiser details.");
            // Handle error when retrieving details.
        } else if (records.length === 0) {
            res.status(404).send("Fundraiser not found.");
            // Send 404 if fundraiser not found.
        } else {
            res.send(records[0]);
        }
    });
});

// Route to get all categories.
router.get("/gategory", (req, res) => {
    connection.query(`SELECT * FROM CATEGORY; `, (err, records, fields) => {
        if (err) {
            console.error("Error retrieving data.");
            // Log error when retrieving categories.
        } else {
            res.send(records);
        }
    });
});

// Route to search for fundraisers.
router.get("/Search/:search", (req, res) => {
    const searchParams = req.params.search;
    const params = searchParams.split(',');
    if (params.length === 0) {
        return res.status(400).send("You must select at least one criterion.");
        // Return error if no search parameters provided.
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
        // Return error if not all selected criteria have values.
    }
    query += conditions.join(" AND ");
    connection.query(query, (err, records, fields) => {
        if (err) {
            console.error("Error while searching data.", err);
            return res.status(500).send("Error while searching data.");
            // Handle error when searching.
        }
        res.send(records);
    });
});

module.exports = router;