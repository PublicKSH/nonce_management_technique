const express = require("express");
const txCreationRoute = require("./txCreation.route");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/tx-creation",
    route: txCreationRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
