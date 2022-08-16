//import express for use
const express = require("express");

//add port designation and the app expression
const PORT = process.env.PORT || 3001;
const app = express();

// add Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//test route to make sure server is connected - always placed above the PORT
// app.get("/", (req, res) => {
// 	res.json({
// 		message: "Hello World",
// 	});
// });

// Default response for any other request that's not supported by the app (Not Found)
app.use((req, res) => {
	res.status(404).end();
});

//function to start Express.js on port 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
