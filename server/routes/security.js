//--------------------------------------------
//Title: security.js
//Author: Kyle Hochdoerfer
//Date: 03/19/24
//Description: Menu routing for webdevgrill
//---------------------------------------------

//Enable strict mode
"use strict";

//Require statements
const express = require('express');
const router =  express.Router();
const { mongo } = require('../utils/mongo');
const { ObjectId } = require('mongodb');
const Ajv = require('ajv')

//Create a variable for ajv validation
const ajv = new Ajv()

//Require bcrypt and set a saltRounds variable for salting passwords
const bcrypt = require('bcryptjs');
const saltRounds = 10

//Schema for singin user input
const signinSchema = {
  type: 'object',
  properties:{
    email: { type: 'string'},
    password: { type: 'string'}
  },
  required: ["email", "password"],
  additionalProperties: false
}

//Declare a registerSchema containing all user properties
const registerSchema = {
  type: 'object',
  properties: {
    userId: { type: 'string'},
    email: { type: 'string'} ,
    password: { type: 'string'},
    firstName: { type: 'string'},
    lastName: { type: 'string'},
    cart: { type: 'array'}
  },
  required: [
    'email',
    'password',
    'firstName',
    'lastName',
    'userId'
  ],
  additionalProperties: false
}

//Create a schema for updating the user
const updateSchema = {
  type: 'object',
  properties: {
    userId: { type: 'string'},
    email: { type: 'string'} ,
    password: { type: 'string'},
    firstName: { type: 'string'},
    lastName: { type: 'string'},
    cart: { type: 'array'}
  },
  required: [
    'email',
    'password',
    'firstName',
    'lastName',
    'userId',
    'cart'
  ],
  additionalProperties: false
}

//signin API
router.post('/signin', async(req, res) =>{
  try {
    //Get the signin data from the request
    let signinData = req.body;

    //Determine if the signinData matches the required schema
    const validator = ajv.compile(signinSchema);
    const isValid = validator(signinData);

    //If the provided signinData does not fit the required schema, trigger a 400 Bad Request error
    if(!isValid){
      const err = new Error("Bad Request")
      err.status = 400;
      err.errors = validator.errors;
      console.error("err", err)
      next(err)
      return
    }

    //Connect to the database and find a user with an email matching the user input
    mongo(async db => {
      let user = await db.collection("users").findOne({email: signinData.email});
      console.log(user)

      //If a valid email was found
      if (user) {
        //Determine if the request body password is valid and save the boolean result
        let passwordIsValid = bcrypt.compareSync(signinData.password, user.password);

        //If the password is valid
        if (passwordIsValid) {
          //Output a message stating that the user has logged in and send it as a response
          console.log('User logged in');
          res.send(user);
          return;
        } else {
            //If the password is invalid, output an error message and send it as a response
            console.log('Invalid email and/or password');
            res.status(404).send({
                'message': `Valid email and/or password not found`
            })
        }
    } else {
        //If the username is invalid, output an error message and send it as a response
        console.log('Invalid email and/or password');
        res.status(404).send({
            'message': `Valid email and/or password not found`
        })
    }
    })

  } catch (err) {
      //If the server encounters an error, output the message and send it as a response
      console.log(err);
      res.status(500).send({
          'message': `Server Exception: ${err}`
      })
  }
})

//registerUser API
router.post('/register', (req, res, next) => {
  try {
    //grab input from user
    const { user } = req.body;

    // set data validation based on registerSchema
    const validator  = ajv.compile(registerSchema);
    // Validate user input against registerSchema
    const isValid = validator(user);

    // If user input does not pass validation, return 400 Error
    if(!isValid){
      const err = new Error("Bad Request")
      err.status = 400;
      err.errors = validator.errors;
      console.error("err", err)
      next(err)
      return
    }
    // Set password encryption
    const hashedPassword = bcrypt.hashSync(user.password, saltRounds);

   //Access database
   mongo(async db => {
    // Search for all users in database and sort them in ascending order in an array
    const users = await db.collection('users').find().sort({userId: 1}).toArray();
    console.log('Current users:', users);

    // if email is already in use, return 400 error
    let emailInUse = users.find(customers => customers.email === user.email)
    if (emailInUse) {
      const err = new Error("Bad Request")
      err.status = 400;
      err.message = 'Email is already in use';
      console.error("err", err)
      next(err)
      return
     }

     // Get the user with last user Id based on ascending order
     const latestuser = users[users.length - 1];

     // Set the new user id as the latest userId plus 1.
     const tempInt = parseInt(latestuser.userId)
     const newUserId = (tempInt + 1).toString();

     // Create newUser to be added to database
     const newUser = {
      userId: newUserId,
      email: user.email,
      password: hashedPassword,
      firstName: user.firstName,
      lastName: user.lastName,
      cart: []
     }

     //Output new user object
     console.log(newUser);

     // push newUser object to the users collection
     const result = await db.collection('users').insertOne(newUser);

     // send the inserted _id
     res.status(201).send({ id: result.insertedId });
   }, next);

  } catch (err) {
    console.error("Error:", err);
    next(err);
  }
})

//API for findUserById
router.get("/:userId", (req, res, next) => {
  try {
    //Get the user ID from the request parameters
    let userId = req.params;

    //Access the database and make a query to find the requested user
    mongo(async db => {
      const user = await db.collection("users").findOne(userId)

      //If no user is found output an error message
      if (!user) {
        const err = new Error("User ID could not be found");
        err.status = 404;
        console.log("err", err);
        next(err);
        return;
      }
      //If the user is found, return it as a response in JSON format
      res.json(user);
    }, next);
  } catch (err) {
    //Error handling
    console.error("Error:", err);
    next(err);
  }
})

//updateUser
router.put('/:userId', (req, res, next) => {
  try {

     //Hold the user ID from the request in a variable
     let { userId } = req.params;

     // Variables Create
     const { user } =  req.body;
     const validator = ajv.compile(updateSchema);
     const isValid = validator(user);

     // 400 if user input isn't validated
     if (!isValid) {
       const err = new Error('Bad Request');
       err.status = 400;
       err.errors = validator.errors;
       console.log('req.body validation failed', err)
       next(err);
       return;
     }

     //Query the database and update user with the provided ID
     mongo(async db => {
      const result = await db.collection("users").updateOne(
        {userId},
        {$set: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          cart: user.cart
        }}
        );
        console.log(result);

         // If the user was not updated, return a 404 status code.
        if (!result.modifiedCount) {
          const err = new Error('Unable to update record for ID' + userId);
          err.status = 404;
          console.error('err', err);
          next(err);
          return; //return to exit the function
          }

       // Send a success response with a 204 status code.
      res.status(204).send();
    }, next);

  } catch (err) {
    console.error("Error:", err);
    next(err);
  }
})

module.exports = router;