const express = require("express");
const router = express.Router();
const { init, responce, newPage, close } = require("../controller/ai");



router.get("/", async (req, res) => {
  res.json({
    status: "success",
    domains: ["/ai/init", "/ai/responce", "/ai/newPage", "/ai/close"],
  });
});
router.get("/init", async (req, res) => {
  try {
    await init();
    res.json({
      status: "success",
      message: "browser initialized",
    });
  } catch (err) {
    res.json({
      status: "failed",
      message: err.message,
    });
  }
});

router.post("/responce", async (req, res) => {
  try {
    const prompt = req.body.prompt || req.headers.prompt;
    if (prompt) {
      const data = await responce(prompt);
      res.json({
        status: "success",
        data: data,
      });
    }
    res.json({
      status: "failed",
      message: "prompt is required",
    });
  } catch (err) {
    res.json({
      status: "failed",
      message: err.message,
    });
  }
});

router.get("/newPage", async (req, res) => {
  try {
    await newPage();
    res.json({
      status: "success",
      message: "new page opened",
    });
  } catch (err) {
    res.json({
      status: "failed",
      message: err.message,
    });
  }
});

router.get("/close", async (req, res) => {
  try {
    await close();
    res.json({
      status: "success",
      message: "browser closed",
    });
  } catch (err) {
    res.json({
      status: "failed",
      message: err.message,
    });
  }
});

module.exports = router;

