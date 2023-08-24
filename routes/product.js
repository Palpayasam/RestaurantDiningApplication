const router = require("express").Router();
const Product = require("../models/Product")
// Get ProductID
async function getIDandCost(Pname) {
    try {
        const product = await Product.findOne({ name: Pname });
        return { id: product._id, cost: product.cost };
    } catch (err) {
        res.status(500).send("Product not found");
    }
}

// Update Product

router.get("/products", async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while fetching products");
    }
});

// Delete Product

module.exports = { getIDandCost, router };

