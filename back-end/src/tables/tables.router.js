const cors = require("cors");
const methodNotAllowed = require("../errors/methodNotAllowed");
const router = require("express").Router();
const controller = require("./tables.controller");

router.use(cors());

router
  .route("/:table_id/seat")
  .put(controller.occupy)
  .delete(controller.free)
  .all(methodNotAllowed);

router.route("/new").post(controller.create).all(methodNotAllowed);

router
  .route("/")
  .post(controller.create)
  .get(controller.list)
  .all(methodNotAllowed);

module.exports = router;