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

//API for findMenuItemByName
router.get("/:name", (req, res, next) => {
  try {
    //Get the dish name from the request parameters
    let dishName = req.params;

    //Access the database and make a query to find the requested dish
    mongo(async db => {
      const dish = await db.collection("dishes").findOne(dishName)

      // If no dish is found output an error message
      if (!dish) {
        const err = new Error("Menu item not found");
        err.status = 404;
        console.log("err", err);
        next(err);
        return;
      }
      //If the dish is found, return it as a response in JSON format
      res.json(dish);
    }, next);
  } catch (err) {
    //Error handling
    console.error("Error:", err);
    next(err);
  }
})

module.exports = router;