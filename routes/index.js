var express = require("express");
var router = express.Router();
var { generatePayload } = require("./gen_qrcode");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/webhooks", async (req, res, next) => {
  try {
    req.app.get("io").emit("tst", req.body);
    return res.json({ msg: "Hook has been called" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
});

router.post("/qrcode", async (req, res, next) => {
  try {
    const target = "ah2CRVQwkjPkTbiTBUDxB4Ume";
    req.body.mccCode = "5221";
    const qr = await generatePayload(target, req.body);
    return res.json(qr);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
});

module.exports = router;
