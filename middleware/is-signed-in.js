const isSignedIn = (req, res, next) => {
  if(req.session.user) return next(); // checking the user then go to next instructions which is on line 51 vip lounge (server.js file)
  res.redirect("/auth/sign-in"); // if not true then redirect to sing in page
};
module.exports = isSignedIn;