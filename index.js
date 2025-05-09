const dbConnection = require('./utils/dbConnection');
const express = require("express");
const morgan = require('morgan');
const { authRoutes, authorRoutes, bookRoutes, favoriteRoutes } = require('./routes'); 

dbConnection();

const app = express();
app.use(express.json());
app.use(morgan('dev'));

app.get("/", (req, res) => {
    res.send("Welcome to Stechoq Book Management System!");
});

app.use("/api/v1/user", authRoutes);
app.use("/api/v1/author", authorRoutes);
app.use("/api/v1/book", bookRoutes);
// app.use("/api/v1/favorite", favoriteRoutes);

module.exports = app;
