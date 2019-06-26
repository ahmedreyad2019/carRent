const express = require("express");
const router = express.Router();

const CarRenter = require("../models/CarRenter.models");

//create
router.post("/", async (req, res) => {
  try {
    // const isValidated = validator.createCarValidation(req.body);
    // if (isValidated.error)
    //   return res
    //     .status(400)
    //     .send({ error: isValidated.error.details[0].message });
    const newCarRenter = await CarRenter.create(req.body);
    newCarRenter.dateAdded = Date.now();
    res.json({ msg: "Renter was added successfully", data: newCarRenter });
  } catch (error) {
    res.status(400).send({ msg: error });
    console.log(error);
  }
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
