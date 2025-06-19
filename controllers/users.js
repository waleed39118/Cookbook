const router = require("express").Router();
const Application = require("../models/application");
const User = require("../models/user");



//req new page 
router.get("/users/:id/applications/new", async (req, res) => {
  res.render("users/new-application.ejs", {
    userId: req.params.id
  });
});

router.post("/users/:id/applications", async (req, res) => {
  try {
    const application = await Application.create({
      user: req.params.id,
      title: req.body.title,
    });

    res.redirect(`/users/${req.params.id}/applications`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to create application");
  }
});
//users req
router.get("/users/:id/applications", async (req, res) => {
  const userId = req.params.id;

  try {
    const applications = await Application.find({ user: userId });

    res.render("users/applications.ejs", {
      applications, userId
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});


module.exports = router;
