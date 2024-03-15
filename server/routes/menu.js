//--------------------------------------------
//Title: invoices.js
//Author: Kyle Hochdoerfer
//Date: 03/14/24
//Description: Menu routing for webdevgrill
//---------------------------------------------

//Enable strict mode
"use strict";

//Require statements
const express = require('express');
const router =  express.Router();
const { mongo } = require('../utils/mongo');

//API for findAllMenuItems
router.get("/", (req, res, next) => {
  try {
    // find all menu items in dishes collection of database
    mongo(async db => {
      const dishes = await db.collection("dishes").find().toArray();

      // If no dishes are found output an error message
      if (!dishes) {
        const err = new Error("No menu items found");
        err.status = 404;
        console.log("err", err);
        next(err);
        return;
      }
     // If there are dishes in database, send dish documents in json format
      res.json(dishes);
    }, next);
  } catch (err) {
    //Error handling
    console.error("Error:", err);
    next(err);
  }
})

module.exports = router;