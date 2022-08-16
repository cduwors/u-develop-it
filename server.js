//import express for use
const express = require("express");
//install mysql2 package for use
const mysql = require("mysql2");

//add port designation and the app expression
const PORT = process.env.PORT || 3001;
const app = express();

// add Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// function to validate user input for new candidate
const inputCheck = require("./utils/inputCheck");

//connect to database
const db = mysql.createConnection(
	{
		host: "localhost",
		//Your MySQL username,
		user: "root",
		//Your MySQL password
		password: "",
		database: "election",
	},
	console.log("connected to the election database")
);

//test route to make sure server is connected - always placed above the PORT
// app.get("/", (req, res) => {
// 	res.json({
// 		message: "Hello World",
// 	});
// });

//GET all candidates
app.get("/api/candidates", (req, res) => {
	const sql = "SELECT * FROM candidates";

	db.query(sql, (err, rows) => {
		if (err) {
			res.status(500).json({ error: err.message });
			return;
		}
		res.json({
			message: "success",
			data: rows,
		});
	});
});

//GET a single candidate
app.get("/api/candidate/:id", (req, res) => {
	const sql = "SELECT * FROM candidates WHERE id = ?";
	const params = [req.params.id];

	db.query(sql, params, (err, row) => {
		if (err) {
			res.status(400).json({ error: err.message });
			return;
		}
		res.json({
			message: "success",
			data: row,
		});
	});
});

//DELETE a candidate
app.delete("/api/candidate/:id", (req, res) => {
	const sql = "DELETE FROM candidates WHERE id = ?";
	const params = [req.params.id];

	db.query(sql, params, (err, result) => {
		if (err) {
			res.statusMessage(400).json({ error: res.message });
		} else if (!result.affectedRows) {
			res.json({
				message: "Candidate not found",
			});
		} else {
			res.json({
				message: "successfully deleted",
				changes: result.affectedRows,
				id: req.params.id,
			});
		}
	});
});

//CREATE a candidate
app.post("/api/candidate", ({ body }, res) => {
	const errors = inputCheck(
		body,
		"first_name",
		"last_name",
		"industry_connected"
	);
	if (errors) {
		res.status(400).json({ error: errors });
		return;
	}

	const sql =
		"INSERT INTO candidates (first_name, last_name, industry_connected) VALUES (?,?,?)";
	const params = [body.first_name, body.last_name, body.industry_connected];

	db.query(sql, params, (err, result) => {
		if (err) {
			res.status(400).json({ error: err.message });
			return;
		}
		res.json({
			message: "candidate successfully added",
			data: body,
		});
	});
});

// Default response for any other request that's not supported by the app (Not Found)
app.use((req, res) => {
	res.status(404).end();
});

//function to start Express.js on port 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
