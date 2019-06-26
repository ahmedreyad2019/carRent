const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin.models");
var config = require("../config/jwt");
var jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
    try {
      // const isValidated = validator.createCarValidation(req.body);
      // if (isValidated.error)
      //   return res
      //     .status(400)
      //     .send({ error: isValidated.error.details[0].message });
      var stat = 0;
      var token = req.headers["x-access-token"];
      if (!token) {
        return res
          .status(401)
          .send({ auth: false, message: "Please login first." });
      }
      jwt.verify(token, config.secret, async function(err, decoded) {
        if (err) {
          return res
            .status(500)
            .send({ auth: false, message: "Failed to authenticate token." });
        }
        stat = decoded.id;
      });
      var admin = await Admin.findById(stat);
      if (!admin) {
        return res.status(404).send({ error: "Admin does not exist" });
      }

       admin=await Admin.findOne({email:req.body.email})
      if(admin)
       return res.status(400).json({ error: "Email already exists" });
      req.body.dateAdded = Date.now();
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(req.body.password, salt);
      req.body.password=hashedPassword;
      const newAdmin = await Admin.create(req.body);
      res.json({ msg: "Admin was added successfully", data: newAdmin });
    } catch (error) {
      res.status(400).send({ msg: error });
      console.log(error);
    }
  });

  router.post("/login", function(req, res) {
    Admin.findOne({ email: req.body.email }, function(err, user) {
      if (!user) {
        return res.status(401).send({ auth: false, message: "No user found." });
      }
      const loginPassword = req.body.password;
      if(!loginPassword){
        return res
        .status(401)
        .send({ auth: false, message: 'Please enter password.'})
      }
      const userPassword = user.password;
      const match = bcrypt.compareSync(loginPassword, userPassword);
      if (!match) return res.status(401).send({ auth: false, token: null });
      var token = jwt.sign({ id: user._id }, config.secret, {
        expiresIn: 86400 // expires in 24 hours
      });
      res.status(200).send({ auth: true, token: token, id: user._id });
    })
    })
    

  router.get("/", async (req, res) => {
    const admins = await Admin.find();
    res.json({ data: admins });
  });
  
  //read specific
  router.get("/:id", async (req, res) => {
    try {
      const admins = await Admin.findById(req.params.id);
      res.json({ data: admins });
    } catch (error) {
      console.log(error);
    }
  });


  //put
router.put("/:id", async (req, res) => {
    try {
      var stat = 0;
      var token = req.headers["x-access-token"];
      if (!token) {
        return res
          .status(401)
          .send({ auth: false, message: "Please login first." });
      }
      jwt.verify(token, config.secret, async function(err, decoded) {
        if (err) {
          return res
            .status(500)
            .send({ auth: false, message: "Failed to authenticate token." });
        }
        stat = decoded.id;
      });
      var admin = await Admin.findById(stat);
      if (!admin) {
        return res.status(404).send({ error: "Admin does not exist" });
      }
      if(stat!=req.params.id)
      return res.status(401).send({ error: "You can change other Admins" });
      admin = await Admin.findOne({}, { _id: req.params.id });
      if (!admin) return res.status(404).send({ error: "Admin does not exist" });
      // const isValidated = validator.updateValidations(req.body);
      // if (isValidated.error)
      //   return res
      //     .status(400)
      //     .send({ error: isValidated.error.details[0].message });
  await Admin.findByIdAndUpdate(req.params.id, req.body);
      res.json({ msg: "Admin updated successfully"});
    } catch (error) {
      // We will be handling the error later
      console.log(error);
    }
  });
  

  module.exports = router;