const router = require("express").Router();

const Product = require("../models/Product")
const Order = require("../models/order")
const Session = require("../models/Session")


router.post('/products/add', async (req, res) => {
    const name=req.body.name;
    const price=req.body.price;
    const newProduct=new Product({
        name: name,
        cost:price
    });
    try {
        const savedProduct = await newProduct.save()
        console.log(savedProduct)
        res.send("Successfully added new product");
    } catch (err) {
        console.log(err);
        res.status(500).send("Failed to add product");
    }
});

router.post('/products/delete', async (req, res) => {
    try {
        const productId = req.body.id;
        const deletedProduct = await Product.findByIdAndDelete(productId);
        
        if (deletedProduct) {
            console.log("Successfully deleted product:", deletedProduct);
            res.status(200).send("Successfully deleted product");
        } else {
            console.log("Product not found");
            res.status(404).send("Product not found");
        }
    } catch (err) {
        console.log("Failed to delete product:", err);
        res.status(500).send("Failed to delete product");
    }
});

router.post('/products/edit', async (req, res) => {
    try {
      const { id, name, price, desc } = req.body;
  
      // Check if the product exists
      const existingProduct = await Product.findById(id);
  
      if (!existingProduct) {
        console.log('Product not found');
        return res.status(404).send('Product not found');
      }
  
      // Update the product fields
      existingProduct.name = name;
      existingProduct.cost = price;
      existingProduct.desc = desc;
  
      const updatedProduct = await existingProduct.save();
  
      console.log('Successfully updated product:', updatedProduct);
      res.status(200).send('Successfully updated product');
    } catch (err) {
      console.error('Failed to update product:', err);
      res.status(500).send('Failed to update product');
    }
  });

  router.get("/reportOrder", async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while fetching products");
    }
});

router.get("/sessionReport", async (req, res) => {
    try {
        const sessions = await Session.find().sort({ createdAt: -1 });
        res.status(200).json(sessions);
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while fetching products");
    }
});

router.get("/daysales", async (req, res) => {
    try {
        const today = new Date();
        const startOfDay = new Date(today);
        startOfDay.setHours(0, 0, 0, 0); // Set to the start of the day (midnight)

        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);
        const sessions = await Session.find({
            createdAt: {
              $gte: startOfDay,
              $lte: endOfDay,
            },
          });
        res.status(200).json(sessions);
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while fetching products");
    }
});


router.get("/dayorders", async (req, res) => {
    try {
        const today = new Date();
        const startOfDay = new Date(today);
        startOfDay.setHours(0, 0, 0, 0); // Set to the start of the day (midnight)

        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);
        const orders = await Order.find({
            createdAt: {
              $gte: startOfDay,
              $lte: endOfDay,
            },
          });
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while fetching products");
    }
});

module.exports = router

