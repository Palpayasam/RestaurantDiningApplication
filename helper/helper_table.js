const router = require("express").Router();
const Table = require("../models/Table")
// Get tableID
async function getTable(tableNumber) {
    try {
        const table = await Table.findOne({ num: tableNumber });
        console.log(table)
        return table;
    } catch (err) {
        throw err;
    }
}

module.exports = { getTable };

