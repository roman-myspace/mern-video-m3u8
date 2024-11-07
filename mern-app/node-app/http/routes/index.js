const express = require("express");
const router = express.Router();
const apiRoutes = require("./api.routes");



// *********************************************
//        API Pre-defined Routes
// *********************************************
router.get("/", (req, res) => {
    // res.send("Greeting");
    res.send({
        title: "greeting"
    });
});
router.use("/api", apiRoutes);

module.exports = router;