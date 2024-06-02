//--------------------------------------------
//Title: cart.js
//Author: Kyle Hochdoerfer
//Date: 04/20/24
//Description: Order routing for webdevgrill
//---------------------------------------------

//Enable strict mode
"use strict";

//Require statements
const express = require('express');
const router =  express.Router();
const { mongo } = require('../utils/mongo');

//API for findOrdersById
router.get("/:id", (req, res, next) => {
  try{
    let thisId  = req.params.id;

    mongo(async db => {
      let orders = await db.collection("orders").find({ userId: thisId}).toArray();

      // If no orders are found output an error message
      if (!orders) {
        const err = new Error("Orders not found");
        err.status = 404;
        console.log("err", err);
        next(err);
        return;
      }

      //If the orders are found, return them as a response in JSON format
      res.json(orders);
    }, next);
  } catch (err) {
    //Error handling
    console.error("Error:", err);
    next(err);
  }
})


module.exports = router;