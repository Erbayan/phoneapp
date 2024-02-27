const express = require("express");
const Item = require("../models/item");

async function getItems(req, res) {
  try {
    const items = await Item.find({ deletedAt: null });
    res.json(items);
  } catch (error) {
    console.error('Error getting items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function addItem(req, res) {
  console.log(req.body); 
  const image1 = req.body['images[]'];
  const image2 = req.body['images[1]'];
  const image3 = req.body['images[2]'];
  const images = [image1 , image2 , image3];
  const enNames = req.body['enNames[]'];
  const ruNames = req.body['ruNames[]'];
  const enDescriptions = req.body['enDescriptions[]'];
  const ruDescriptions = req.body['ruDescriptions[]'];
  
  console.log(images);
  console.log(enNames);
  console.log(ruNames);
  console.log(enDescriptions);
  console.log(ruDescriptions);
  try {    
    const newItem = new Item({
      images,
      names: [{ lang: "en", value: enNames }, { lang: "ru", value: ruNames }],
      descriptions: [{ lang: "en", value: enDescriptions }, { lang: "ru", value: ruDescriptions }],
    });

    await newItem.save();

    res.redirect('/admin'); 
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).send('Error adding item');
  }
}

async function editItem(req, res) {
  const itemId = req.params.itemId;
  console.log(itemId);
  console.log(req.body);
  
  try {
    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).send('Item not found');
    }


    const names = [
      { lang: "en", value: req.body.names[0] ? req.body.names[0].value : '' },
      { lang: "ru", value: req.body.names[1] ? req.body.names[1].value : '' }
    ];
    const descriptions = [
      { lang: "en", value: req.body.descriptions[0] ? req.body.descriptions[0].value : '' },
      { lang: "ru", value: req.body.descriptions[1] ? req.body.descriptions[1].value : '' }
    ];

    item.names = names;
    item.descriptions = descriptions;
    item.updatedAt = Date.now();

    await item.save();

    res.redirect('/admin');
  } catch (error) {
    console.error('Error editing item:', error);
    res.status(500).send('Error editing item');
  }
}


async function deleteItem(req, res) {
  try {
    const itemId = req.params.id;

    const existingItem = await Item.findById(itemId);
    if (!existingItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    await Item.deleteOne({ _id: itemId });
    res.redirect('/admin');
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}



async function getItemForEdit(req, res) {
  try {
    const itemId = req.params.itemId;
    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).send('Item not found');
    }

    res.render('admin', { item });
  } catch (error) {
    console.error('Error fetching item for edit:', error);
    res.status(500).send('Error fetching item for edit');
  }
}



module.exports = {getItems, addItem, editItem, deleteItem, getItemForEdit};
