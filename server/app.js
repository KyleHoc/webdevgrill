/**
 * Title: app.js
 * Author: Kyle Hochdoerfer
 * Date: 3/6/2024
 */
'use strict'

// Require statements
const express = require('express')
const createServer = require('http-errors')
const path = require('path')

const menuRoute = require('./routes/menu');

// Create the Express app
const app = express()

// Configure the app
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '../dist/webdevgrill')))
app.use('/', express.static(path.join(__dirname, '../dist/webdevgrill')))


app.use("/api/menu", menuRoute)

// error handler for 404 errors
app.use(function(req, res, next) {
  next(createServer(404)) // forward to error handler
})

// error handler for all other errors
app.use(function(err, req, res, next) {
  res.status(err.status || 500) // set response status code

  // send response to client in JSON format with a message and stack trace
  res.json({
    type: 'error',
    status: err.status,
    message: err.message,
    stack: req.app.get('env') === 'development' ? err.stack : undefined
  })
})

module.exports = app // export the Express application