const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const CarRenter = require("../models/CarRenter.models");
const Car = require("../models/Car.models");
const CarOwner = require("../models/CarOwner.models");
const Transaction = require("../models/Transaction.models");
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
    const renter = await CarRenter.findOne({
      mobileNumber: req.body.mobileNumber
    });
    if (renter) return res.status(400).json({ error: "Phone already exists" });
    req.body.dateAdded = Date.now();
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    req.body.password = hashedPassword;
    const newCarRenter = await CarRenter.create(req.body);
    res.json({ msg: "Renter was added successfully", data: newCarRenter });
  } catch (error) {
    res.status(400).send({ msg: error });
    console.log(error);
  }
});

router.post("/login", function(req, res) {
  CarRenter.findOne({ mobileNumber: req.body.mobileNumber }, function(
    err,
    user
  ) {
    if (!user) {
      return res.status(401).send({ auth: false, message: "No user found." });
    }
    const loginPassword = req.body.password;
    if (!loginPassword) {
      return res
        .status(401)
        .send({ auth: false, message: "Please enter password." });
    }
    const userPassword = user.password;
    const match = bcrypt.compareSync(loginPassword, userPassword);
    if (!match) return res.status(401).send({ auth: false, token: null });
    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });
    res.status(200).send({ auth: true, token: token, id: user._id });
  });
});

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
    if (stat != req.params.id)
      return res.status(401).send({ error: "You can change other Renters" });
    const carRenter = await CarRenter.findOne({}, { _id: req.params.id });
    if (!carRenter)
      return res.status(404).send({ error: "Renter does not exist" });
    // const isValidated = validator.updateValidations(req.body);
    // if (isValidated.error)
    //   return res
    //     .status(400)
    //     .send({ error: isValidated.error.details[0].message });
    await CarRenter.findByIdAndUpdate(req.params.id, req.body);
    res.json({ msg: "Renter updated successfully" });
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

//26
router.get("/view/availableCars", async (req, res) => {
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
    const cars = await Car.find({ status: "UpForRent" });
    if (cars.length === 0) {
      return res.send({ msg: "no cars avaialble at the moment" });
    }
    carsSorted = cars.sort((a, b) => {
      return b.rating - a.rating;
    });
    res.json({ msg: "Cars available:", data: carsSorted });
  } catch (error) {
    res.status(400).send({ msg: error });
  }
});

//27
router.get("/view/availableCars/filter", async (req, res) => {
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
    const cars = await Car.find({ ...req.body, status: "UpForRent" });
    if (cars.length === 0) {
      return res.send({ msg: "no cars avaialble at the moment" });
    }
    carsSorted = cars.sort((a, b) => {
      return b.rating - a.rating;
    });
    res.json({ msg: "Cars available:", data: carsSorted });
  } catch (error) {}
});

//28
router.get("/view/availableCars/:id", async (req, res) => {
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
    const cars = await Car.findOne({
      _id: req.params.id,
      status: "UpForRent",
      currentRenter: null
    });
    if (!cars) {
      return res.send({ msg: "no cars avaialble at the moment" });
    }

    res.json({ msg: "Cars available:", data: cars });
  } catch (error) {}
});

//29
router.put("/submitDrivingLicense", async (req, res) => {
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
  try {
    const Renter = await CarRenter.findOneAndUpdate(
      { _id: stat },
      { drivingLicenseLink: req.body.drivingLicenseLink }
    ).then(res.status(200).send({ msg: "updated successfully", data: Renter }));
  } catch (error) {
    return res.status(400).send({ msg: "error", error: error });
  }
});
//30
router.put("/view/availableCars/:id/rent", async (req, res) => {
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
  try {
    const Renter = await CarRenter.findOne({ _id: stat });
    if (!Renter.drivingLicenseLink)
      return res.status(401).send({ msg: "Please add your driving license" });
    if (!Renter.personalID)
      return res.status(401).send({ msg: "Please add your personalID" });
    if (!Renter.validated)
      return res
        .status(401)
        .send({ msg: "your driving license is not validated yet" });
    const cars = await Car.findOneAndUpdate(
      {
        _id: req.params.id,
        status: "UpForRent"
      },
      {
        status: "Rented",
        currentRenter: Renter
      }
    );
    if (!cars) {
      return res.status(204).send({ msg: "no cars avaialble at the moment" });
    }
    const transaction = await Transaction.create({
      carRenterID: stat,
      carID: cars._id,
      carOwnerID: cars.carOwnerID,
      rentingDateStart: req.body.rentingDateStart,
      rentingDateEnd: req.body.rentingDateEnd
    });
    await CarRenter.findOneAndUpdate(
      { _id: stat },
      { $push: { transaction: transaction } }
    );
    await Car.findOneAndUpdate(
      { _id: cars._id },
      { $push: { transaction: transaction } }
    );
    await CarOwner.findOneAndUpdate(
      { _id: cars.carOwnerID },
      { $push: { transaction: transaction } }
    );
    return res
      .status(200)
      .json({ msg: "Cars Rented", data: cars, transaction: transaction });
  } catch (error) {
    return res.status(400).send({ msg: "error", error: error });
  }
});
//32
router.get("/view/availableCars/:id/ownerDetails", async (req, res) => {
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
  try {
    const Renter = await CarRenter.findOne({ _id: stat });
    const cars = await Car.findOne({
      _id: req.params.id,
      status: "Rented",
      "currentRenter._id":stat
    });
    if (!cars) {
      return res.send({ msg: "no cars avaialble at the moment" });
    }
    const Owner = await CarOwner.findOne({ _id: cars.carOwnerID });
    return res.status(200).send({ msg: "Owner Details", data: Owner });
  } catch (error) {
    console.log(error)
    return res.status(400).send({ msg: "error", error: error });
  }
});

module.exports = router;
