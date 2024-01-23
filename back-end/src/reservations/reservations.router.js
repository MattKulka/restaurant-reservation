/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const cors = require("cors");
const router = require("express").Router();
const controller = require("./reservations.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router.use(cors());

router.route("/new").post(controller.create).all(methodNotAllowed);

router
  .route("/:reservation_id/status")
  .put(controller.updateStatus)
  .all(methodNotAllowed);

router
  .route("/:reservation_id/edit")
  .put(controller.edit)
  .all(methodNotAllowed);

router
  .route("/:reservation_id")
  .get(controller.listById)
  .put(controller.edit)
  .all(methodNotAllowed);

router
  .route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

module.exports = router;