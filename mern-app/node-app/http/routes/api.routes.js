const express = require("express");
const router = express.Router();
const utils = require("../../utils/media");

const mediaController = require("../controllers/mediaController");

// *********************************************
//        API Routes
// *********************************************

router.get("/public", (req, res) => {
    res.send("Public API route");
});
router.get("/test", (req, res) => {
    res.send("Test API route");
});


// File Upload 
router.post("/file-upload", utils.upload("mediaFile"), mediaController.uploadNew);



module.exports = router;