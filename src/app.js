const express = require('express');
const app = express();
const morgan = require('morgan');
const UserRoutes = require('./api/routes/UserRoutes');
const QueueRoutes = require('./api/routes/QueueRoutes');
const mongoose = require('mongoose');
require('dotenv').config();

app.use(morgan('dev'));
mongoose.connect(process.env.DB_URL, {
	useUnifiedTopology: true,
	useNewUrlParser: true,
});

//BODY PARSER
app.use(express.urlencoded({ extended: false }));
app.use(express.raw());
app.use(express.json());

let db = mongoose.connection;

db.once('open', () => {
	console.log('Connected To Database');
});

db.on('error', (err) => {
	console.log(err);
});

app.use('/api/user', UserRoutes);
app.use('/api/queue', QueueRoutes);
app.use((req, res, next) => {
	res.status(404).json({ message: 'Enter Correct Route' });
});
module.exports = app;
