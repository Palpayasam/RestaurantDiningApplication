const router = require("express").Router();
const TableModel = require("../models/Table");
const Session = require("../models/Session")
const Table = require("../helper/helper_table");
const Orders=require("../models/order");
const Product=require("../models/Product");



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
        res.status(200).send();
    } catch (error) {
        console.log(error);
        res.status(500).send("An error occurred");
    }
});

router.post('/table/:tableNumber', async (req, res) => {
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



router.get('/table/:tableNumber/checkout', async (req, res) => {
    const tableNumber = req.params.tableNumber;
  
    try {
      const table = await Table.getTable(tableNumber);
      if (!table || !table.active) {
        return res.status(404).send("Session does not exist");
      }
    } catch (error) {
      console.error("Error fetching table:", error);
      return res.status(500).send("An error occurred");
    }
  
    try {
      const session = await Session.findOne({ tableNumber: tableNumber });
      if (!session || session.status === "completed" || !session.orders) {
        return res.status(400).send("Session is not running or no orders placed.");
      }
      
      const orderDetails = [];
      let total = session.totalAmount;
  
      for (const orderobjectID of session.orders) {
        try {
          const orderID=orderobjectID.orderId;
          const order = await Orders.findById(orderID);
          if (!order || !order.products) {
            console.error(`Error finding order with ID ${orderID}: Order or products not found`);
            continue;
          }
  
          for (const productsObject of order.products) {
            try {
              const productId=productsObject.productId;
              const quantity=productsObject.quantity;
              const product = await Product.findById(productId);
              if (!product) {
                console.error(`Product not found with ID ${productId}`);
                continue;
              }
              const productDetails=[];
              productDetails.push(`${product.name}`);
              productDetails.push(`${quantity}`);
              productDetails.push(`${product.cost*quantity}`);
              
  
              orderDetails.push(productDetails);
            } catch (error) {
              console.error(`Error finding product :`, error);
            }
          }
        } catch (error) {
          console.error(`Error finding order :`, error);
        }
      }
      res.send(orderDetails);
    } catch (error) {
      console.error("Error fetching session:", error);
      return res.status(500).send("An error occurred");
    }
  });
  




  router.post('/table/:tableNumber/checkout', async (req, res) => {
    const tableNumber = req.params.tableNumber;

    try {
        const table = await Table.getTable(tableNumber);
        if (!table.active) {
            return res.status(200).send("Session does not exist");
        }
        const updatedTable = await TableModel.findByIdAndUpdate(
            table._id,
            { $unset: { sessionID: "" }, active: false },
            { new: true }
        );
        const session = await Session.findOne({ tableNumber: tableNumber });
        if (session && session.status !== "completed") {
            const updatedSession = await Session.findByIdAndUpdate(
                session._id,
                { status: "completed", transactionID: "TX328320" },
                { new: true }
            );

            return res.status(200).send({
                updatedTable,
                updatedSession
            });
        } else {
            return res.status(200).send("Session is not running");
        }
    } catch (error) {
        return res.status(500).send("An error occurred");
    }
});

module.exports = router;


module.exports = router