const router = require("express").Router();
const Order = require("../models/Order")

// Get Orders

router.get('/table/:tableNumber/orders', async (req, res) => {
    const tableNumber = req.params.tableNumber;
});

module.exports = { getIDandCost };