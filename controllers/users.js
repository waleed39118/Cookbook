const router = require("express").Router();
const mongoose = require("mongoose");
const Application = require("../models/application");
const User = require("../models/user");

// صفحة إنشاء تطبيق جديد
router.get("/users/:id/applications/new", async (req, res) => {
  res.render("users/new-application.ejs", {
    userId: req.params.id,
  });
});

// حفظ تطبيق جديد
router.post("/users/:id/applications", async (req, res) => {
  const userId = req.params.id;

  // التحقق من صلاحية ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).send("Invalid user ID");
  }

  try {
    const application = await Application.create({
      user: userId,
      title: req.body.title,
    });

    res.redirect(`/users/${userId}/applications`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to create application");
  }
});

// عرض التطبيقات الخاصة بالمستخدم
router.get("/users/:id/applications", async (req, res) => {
  const userId = req.params.id;

  // التحقق من صلاحية ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).send("Invalid user ID");
  }

  try {
    const applications = await Application.find({ user: userId });

    res.render("users/applications.ejs", {
      applications,
      userId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});

module.exports = router;
