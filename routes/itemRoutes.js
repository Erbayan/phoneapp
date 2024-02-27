const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");


router.get('/api/items', itemController.getItems);
router.post('/api/items', itemController.addItem);
router.put('/api/items/:itemId', itemController.editItem);
router.delete('/api/items/:id', itemController.deleteItem);
router.get('/admin', itemController.renderAdminPage);
router.get('/admin/:itemId', itemController.getItemForEdit);
module.exports = router;
