const router = require("express").Router();
const TableModel = require("../models/Table");
const Session = require("../models/Session")
const Table = require("../helper/helper_table");
// Check Table session
router.get('/table/:tableNumber', async (req, res) => {
    const tableNumber = req.params.tableNumber;
    try {
        const table = await Table.getTable(tableNumber);
        if (!table) {
            return res.status(400).send("Table not found");
        }
        if (table.active) {
            return res.status(200).send(table.sessionID);
        }
        res.status(200).send({});
    } catch (error) {
        console.log(err);
        res.status(500).send("An error occurred");
    }
});

// Create Table session
router.post('/table/:tableNumber', async (req, res) => {
    // to start session
    const tableNumber = req.params.tableNumber;
    let table, savedSession;

    try {
        table = await Table.getTable(tableNumber);
        if (table.active) {
            return res.status(200).send("Session already exists");
        }
    } catch (error) {
        return res.status(500).send("An error occurred");
    }

    try {
        const newSession = new Session({
            tableNumber: tableNumber,
            orders: [],
            totalAmount: 0,
            status: "active"
        });
        savedSession = await newSession.save();
    } catch (err) {
        res.status(400).send("Failed to create session");
        return;
    }

    try {
        const updatedTable = await TableModel.findByIdAndUpdate(table._id, { sessionID: savedSession._id, active: true }, { new: true });
        res.status(200).send(updatedTable);
    } catch (err) {
        res.status(500).send("Failed to update session on table");
    }

});


router.post('/table/:tableNumber/checkout', async (req, res) => {
    const tableNumber = req.params.tableNumber;
    let table, session;

    try {
        table = await Table.getTable(tableNumber);
        if (!table.active) {
            return res.status(200).send("Session does not exist");
        }
    } catch (error) {
        return res.status(500).send("An error occurred for table");
    }
    try {
        const updatedTable = await TableModel.findByIdAndUpdate(table._id, { $unset: { sessionID: "" }, active: false }, { new: true });
        res.status(200).send(updatedTable);
    } catch (err) {
        res.status(500).send("Failed to update table");
    }
    try {
        session = await Session.findOne({ tableNumber: tableNumber });
        if (session.status === "completed") {
            return res.status(200).send("Session is not running");
        }
    } catch (error) {
        return res.status(500).send("An error occurred for session");
    }
    try {
        const updatedSession = await Session.findByIdAndUpdate(session._id, { status: "completed", transactionID: "TX328320" }, { new: true });
        res.status(200).send(updatedSession);
    } catch (err) {
        res.status(500).send("Failed to update session");
    }
});

module.exports = router

