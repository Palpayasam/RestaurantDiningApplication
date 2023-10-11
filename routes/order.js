const router = require("express").Router();
const Product = require("../models/Product");
const Order = require("../models/order");
const Session = require("../models/Session");
const { getIDandCost } = require("./product");
const Table = require("../helper/helper_table");

router.post('/table/:tableNumber/order', async (req, res) => {
    const tableNumber = req.params.tableNumber;
    const itemsToAdd = req.body;
    let table;
    try {
        table = await Table.getTable(tableNumber);
        if (!table.active) {
            return res.status(200).send("Session not created");
        }
    } catch (error) {
        return res.status(500).send("An error occurred");
    }

    const sessionId = table.sessionID
    let orderId;

    try {
        const productsArray = [];
        let orderAmount = 0;

        for (const item of itemsToAdd) {
            const productInfo = await getIDandCost(item.productName);

            productsArray.push({
                productId: productInfo.id,
                quantity: item.quantity,
            });
            orderAmount += (productInfo.cost * item.quantity)
        }

        const newOrder = new Order({
            tableNumber: tableNumber,
            products: productsArray,
            amount: orderAmount,
        });

        const savedOrder = await newOrder.save();
        const updatedSession = await Session.findByIdAndUpdate(sessionId, { $push: { orders: { orderId: savedOrder._id } }, $inc: { totalAmount: orderAmount } }, { new: true });
        if (!updatedSession) {
            return res.status(400).send(sessionId);
        }
        res.status(201).json(updatedSession);
    } catch (err) {
        console.log(err);
        res.status(500).send("Failed to create order");
    }
});


module.exports = router