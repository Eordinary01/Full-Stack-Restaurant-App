const express = require('express');
const MenuItem = require('../models/MenuItem');
const Auth = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');


const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads'); 
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); 
    }
  });
  
  const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
    fileFilter: (req, file, cb) => {
      const fileTypes = /jpeg|jpg|png|gif/;
      const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
      const mimeType = fileTypes.test(file.mimetype);
      if (extName && mimeType) {
        return cb(null, true);
      } else {
        cb(new Error('Images only!'));
      }
    }
  });



router.post('/',Auth,upload.single('image'),async(req,res)=>{
    try {
        const {name,description,price,restaurantId} = req.body;

        // file path

        const imagePath = req.file? req.file.path : null;

        const menuItem = new MenuItem({
            name,
            description,
            price,
            image:imagePath,
            restaurant:restaurantId,
        });

        await menuItem.save();
        res.status(201).json(menuItem);
        
    } catch (error) {
        res.status(500).json({message:'Error Creating Menu Item..'});
        
    }
});

router.get('/restaurant/:restaurantId',async(req,res)=>{
    try {
        const menuItems = await MenuItem.find({restaurant:req.params.restaurantId});
        res.json(menuItems);
        
    } catch (error) {
        res.status(500).json({message:'Error Fetching Menu Items..'})
        
    }
});


module.exports = router;