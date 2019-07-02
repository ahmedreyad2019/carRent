const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin.models");
const Moderator = require("../models/Moderator.models");
const CarRenter = require("../models/CarRenter.models");
const CarOwner = require("../models/CarOwner.models");
const Car = require("../models/Car.models");
const Complaint = require("../models/Complaint.models");
const Transaction = require("../models/Transaction.models");

var config = require("../config/jwt");
var jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
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

    var moderator = await Moderator.findOne({ email: req.body.email });
    if (moderator)
      return res.status(400).json({ error: "Email already exists" });
    req.body.dateAdded = Date.now();
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    req.body.password = hashedPassword;
    const newModerator = await Moderator.create(req.body);
    res.json({ msg: "Moderator was added successfully", data: newModerator });
  } catch (error) {
    res.status(400).send({ msg: error });
    console.log(error);
  }
});

router.post("/login", function(req, res) {
  Moderator.findOne({ email: req.body.email }, function(err, user) {
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

router.get("/", async (req, res) => {
  const moderators = await Moderator.find();
  res.json({ data: moderators });
});

//read specific
router.get("/:id", async (req, res) => {
  try {
    const moderators = await Moderator.findById(req.params.id);
    res.json({ data: moderators });
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
    var moderator = await Moderator.findById(stat);
    if (!moderator) {
      return res.status(404).send({ error: "Moderator does not exist" });
    }
    if (stat != req.params.id)
      return res.status(401).send({ error: "You can change other Moderators" });
    moderator = await Moderator.findOne({}, { _id: req.params.id });
    if (!moderator)
      return res.status(404).send({ error: "Moderator does not exist" });
    // const isValidated = validator.updateValidations(req.body);
    // if (isValidated.error)
    //   return res
    //     .status(400)
    //     .send({ error: isValidated.error.details[0].message });
    await Moderator.findByIdAndUpdate(req.params.id, req.body);
    res.json({ msg: "Moderator updated successfully" });
  } catch (error) {
    // We will be handling the error later
    console.log(error);
  }
});

//38
router.get("/view/drivingLicenseRequests", async (req, res) => {
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
  var moderator = await Moderator.findById(stat);
  if (!moderator) {
    return res.status(404).send({ error: "Moderator does not exist" });
  }
  try {
    const renters = await CarRenter.find({
      "drivingLicenseRequest.status": "Pending"
    });
    if (renters.length === 0)
      return res.status(401).send({ msg: "no pending requests" });
    var requests = [];
    console.log(renters)
    for (x in renters){ 
      var edited={}
      edited.firstName=renters[x].FirstName
      edited.lastName=renters[x].LastName
     
      edited.drivingLicenseRequest=renters[x].drivingLicenseRequest
      
      requests.push(edited);
    console.log(edited)}
    return res.status(200).send({
      msg: "Peding requests:",
      data: requests
    });
  } catch (error) {
    return res.status(400).send({ msg: "error", error: error });
  }
});
router.get("/view/drivingLicenseRequests/:id", async (req, res) => {
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
  var moderator = await Moderator.findById(stat);
  if (!moderator) {
    return res.status(404).send({ error: "Moderator does not exist" });
  }
  try {
    const request = await CarRenter.findOne({
      "drivingLicenseRequest.status": "Pending",
      "drivingLicenseRequest._id": req.params.id
    });
    if (!request) return res.status(401).send({ msg: "request not available" });

    return res.status(200).send({
      msg: "Peding requests:",
      data: request
    });
  } catch (error) {
    return res.status(400).send({ msg: "error", error: error });
  }
});

//39,40
router.put("/view/drivingLicenseRequests/:id/respond", async (req, res) => {
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
  var moderator = await Moderator.findById(stat);
  if (!moderator) {
    return res.status(404).send({ error: "Moderator does not exist" });
  }
  try {
    if (!req.body.response) {
      return res.status(400).send({ msg: "please choose a response" });
    }

    var request = await CarRenter.findOneAndUpdate(
      {
     
        "drivingLicenseRequest._id": req.params.id
      },
      {
        "drivingLicenseRequest.status": req.body.response,
        "drivingLicenseRequest.comment": req.body.comment,
        "drivingLicenseRequest.responseDate": Date.now()
      }
    );

    if (!request) return res.status(401).send({ msg: "request not available" });
    request = await CarRenter.findOne({
      "drivingLicenseRequest._id": req.params.id
    });
    return res.status(200).send({
      msg: "Response posted",
      data: request.drivingLicenseRequest
    });
  } catch (error) {
    return res.status(400).send({ msg: "error", error: error });
  }
});

//41
router.get("/view/carLicenseRequests", async (req, res) => {
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
  var moderator = await Moderator.findById(stat);
  if (!moderator) {
    return res.status(404).send({ error: "Moderator does not exist" });
  }
  try {
    const cars = await Car.find({
      status: "PendingApproval"
    });
    if (cars.length === 0)
      return res.status(401).send({ msg: "no pending requests" });
    return res.status(200).send({
      msg: "Peding requests:",
      data: cars
    });
  } catch (error) {
    return res.status(400).send({ msg: "error", error: error });
  }
});
router.get("/view/carLicenseRequests/:id", async (req, res) => {
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
  var moderator = await Moderator.findById(stat);
  if (!moderator) {
    return res.status(404).send({ error: "Moderator does not exist" });
  }
  try {
    const cars = await Car.findOne({
      status: "PendingApproval",
      _id: req.params.id
    });
    if (!cars) return res.status(401).send({ msg: "request not available" });

    return res.status(200).send({
      msg: "Peding requests:",
      data: cars
    });
  } catch (error) {
    return res.status(400).send({ msg: "error", error: error });
  }
});

//42,43
router.put("/view/carLicenseRequests/:id/respond", async (req, res) => {
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
  var moderator = await Moderator.findById(stat);
  if (!moderator) {
    return res.status(404).send({ error: "Moderator does not exist" });
  }
  try {
    if (!req.body.status) {
      return res.status(400).send({ msg: "please choose a response" });
    }

    var cars = await Car.findOneAndUpdate(
      {
        status: "PendingApproval",
        _id: req.params.id
      },
      { status: req.body.status }
    );

    if (!cars) return res.status(401).send({ msg: "request not available" });
    cars = await Car.findOne({ _id: req.params.id });
    return res.status(200).send({
      msg: "Response posted",
      data: cars
    });
  } catch (error) {
    return res.status(400).send({ msg: "error", error: error });
  }
});

//44
router.get("/view/complaints", async (req, res) => {
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
  var moderator = await Moderator.findById(stat);
  if (!moderator) {
    return res.status(404).send({ error: "Moderator does not exist" });
  }
  try {
    const complaints = await Complaint.find({
      reviewed: false
    });
    if (complaints.length === 0)
      return res.status(401).send({ msg: "no complaints at the moment" });

    return res.status(200).send({
      msg: "Complaints",
      data: complaints
    });
  } catch (error) {
    return res.status(400).send({ msg: "error", error: error });
  }
});
router.get("/view/complaints/:id", async (req, res) => {
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
  var moderator = await Moderator.findById(stat);
  if (!moderator) {
    return res.status(404).send({ error: "Moderator does not exist" });
  }
  try {
    const complaints = await Complaint.findOne({
      reviewed: false,
      _id: req.params.id
    });
    if (!complaints)
      return res.status(401).send({ msg: "no complaints at the moment" });

    return res.status(200).send({
      msg: "Complaints",
      data: complaints
    });
  } catch (error) {
    return res.status(400).send({ msg: "error", error: error });
  }
});

//45
router.put("/view/complaints/:id", async (req, res) => {
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
  var moderator = await Moderator.findById(stat);
  if (!moderator) {
    return res.status(404).send({ error: "Moderator does not exist" });
  }
  try {
    var complaints = await Complaint.findOne({
      reviewed: false,
      _id: req.params.id
    });
    if (!complaints)
      return res.status(404).send({ msg: "complaint not found " });
    const transaction = await Transaction.findOne({
      _id: complaints.transactionID
    });
    if (!transaction)
      return res.status(404).send({ msg: "transaction not found " });
    complaints = await Complaint.findOneAndUpdate(
      {
    
        _id: req.params.id
      },
      { reviewed: true }
    );
    if (complaints.issuedAgainst === "Owner")
      await CarOwner.findOneAndUpdate(
        { _id: transaction.carOwnerID },
        { banned: req.body.ban }
      );
    if (complaints.issuedAgainst === "Renter")
      await CarRenter.findOneAndUpdate(
        { _id: transaction.CarRenterID },
        { banned: req.body.ban }
      );
    if (complaints.issuedAgainst === "Car")
      await Car.findOneAndUpdate(
        { _id: transaction.carID },
        { banned: req.body.ban }
      );
    return res.status(200).send({
      msg:
        "Complaints" + req.body.ban ? " banned " + complaints.issuedAgainst : "",
      data: complaints
    });
  } catch (error) {
    return res.status(400).send({ msg: "error", error: error });
  }
});

module.exports = router;
