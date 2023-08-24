const router = require("express").Router();
// const Table = require("../models/Table")
// router.post('/table', async (req, res) => {
//     var i = 0
//     for (i = 0; i < 15; i++) {
//         const newTable = new Table({
//             num: i,
//             active: false,
//         });
//         try {
//             const savedTable = await newTable.save()
//             console.log(savedTable)
//         } catch (err) {
//             console.log(err)
//             break
//         }
//     }
//     if (i == 15) {
//         res.send("Succesfully added 15 tables")
//     } else {
//         res.status(500).send("Failed to add tables")
//     }
// });

const Product = require("../models/Product")
router.post('/products', async (req, res) => {
    var i = 0
    for (i = 0; i < 15; i++) {
        const newProduct = new Product({
            name: String.fromCharCode(97 + i),
            cost: i * 5 + 10,
        });
        try {
            const savedProduct = await newProduct.save()
            console.log(savedProduct)
        } catch (err) {
            console.log(err)
            break
        }
    }
    if (i == 15) {
        res.send("Succesfully added 15 products")
    } else {
        res.status(500).send("Failed to add products")
    }
});

module.exports = router

