const express = require("express");
const router = express.Router();

const History = require("../models/History.models");

//create
router.post("/", async (req, res) => {
  try {
    // const isValidated = validator.createCarValidation(req.body);
    // if (isValidated.error)
    //   return res
    //     .status(400)
    //     .send({ error: isValidated.error.details[0].message });
    const newHistory = await History.create(req.body);
    newHistory.dateAdded = Date.now();
    res.json({ msg: "History was added successfully", data: newHistory });
  } catch (error) {
    res.status(400).send({ msg: error });
    console.log(error);
  }
});

//read
router.get("/", async (req, res) => {
  const histories = await History.find();
  res.json({ data: histories });
});

//read specific
router.get("/:id", async (req, res) => {
  try {
    const histories = await History.findById(req.params.id);
    res.json({ data: histories });
  } catch (error) {
    console.log(error);
  }
});

//put
router.put("/:id", async (req, res) => {
  try {
    const History = await History.findOne({}, { _id: req.params.id });
    if (!History)
      return res.status(404).send({ error: "Renter does not exist" });
    // const isValidated = validator.updateValidations(req.body);
    // if (isValidated.error)
    //   return res
    //     .status(400)
    //     .send({ error: isValidated.error.details[0].message });
    await History.findByIdAndUpdate(req.params.id, req.body);
    res.json({ msg: "History updated successfully" });
  } catch (error) {
    // We will be handling the error later
    console.log(error);
  }
});

//delete
router.delete("/:id", async (req, res) => {
  try {
    await History.findByIdAndRemove(req.params.id);
    res.json({ msg: "History was deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: error });
  }
});
module.exports = router;
