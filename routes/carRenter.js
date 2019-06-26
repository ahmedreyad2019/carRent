const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const CarRenter = require("../models/CarRenter.models");
var config = require("../config/jwt");
var jwt = require("jsonwebtoken");
//create
router.post("/", async (req, res) => {
  try {
    // const isValidated = validator.createCarValidation(req.body);
    // if (isValidated.error)
    //   return res
    //     .status(400)
    //     .send({ error: isValidated.error.details[0].message });
    const renter=await CarRenter.findOne({mobileNumber:req.body.mobileNumber})
    if(renter)
     return res.status(400).json({ error: "Phone already exists" });
    req.body.dateAdded = Date.now();
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    req.body.password=hashedPassword;
    const newCarRenter = await CarRenter.create(req.body);
    res.json({ msg: "Renter was added successfully", data: newCarRenter });
  } catch (error) {
    res.status(400).send({ msg: error });
    console.log(error);
  }
});

router.post("/login", function(req, res) {
CarRenter.findOne({ mobileNumber: req.body.mobileNumber }, function(err, user) {
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

//read
router.get("/", async (req, res) => {
  const carRenters = await CarRenter.find();
  res.json({ data: carRenters });
});

//read specific
router.get("/:id", async (req, res) => {
  try {
    const carRenters = await CarRenter.findById(req.params.id);
    res.json({ data: carRenters });
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
    const renter = await CarRenter.findById(stat);
    if (!renter) {
      return res.status(404).send({ error: "Renter does not exist" });
    }
    if(stat!=req.params.id)
    return res.status(401).send({ error: "You can change other Renters" });
    const carRenter = await CarRenter.findOne({}, { _id: req.params.id });
    if (!carRenter) return res.status(404).send({ error: "Renter does not exist" });
    // const isValidated = validator.updateValidations(req.body);
    // if (isValidated.error)
    //   return res
    //     .status(400)
    //     .send({ error: isValidated.error.details[0].message });
await CarRenter.findByIdAndUpdate(req.params.id, req.body);
    res.json({ msg: "Renter updated successfully"});
  } catch (error) {
    // We will be handling the error later
    console.log(error);
  }
});

//delete
router.delete("/:id", async (req, res) => {
  try {
    await CarRenter.findByIdAndRemove(req.params.id);
    res.json({ msg: "Renter was deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: error });
  }
});
module.exports = router;
