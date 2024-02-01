const db = require("../db/connection");
const { toSeated } = require("../reservations/reservations.service");

function create(table) {
  return db("tables").insert(table).returning("*");
}

function list() {
  return db("tables").select("*").orderBy("table_name");
}

function listById(table_id) {
  return db("tables").select("*").where({ table_id: table_id }).first();
}

function listResById(reservation_id) {
  return db("reservations")
    .select("*")
    .where({ reservation_id: reservation_id })
    .first();
}

function occupy(table_id, reservation_id) {
  return db.transaction(function (transaction) {
    return db("tables")
      .transacting(transaction)
      .where({ table_id: table_id })
      .update({ occupied: true, reservation_id: reservation_id })
      .then(function () {
        return db("reservations")
          .where({ reservation_id: reservation_id })
          .update({ status: "seated" });
      })
      .then(transaction.commit)
      .catch(function (error) {
        transaction.rollback();
        throw error;
      });
  });
}

function free(table_id, reservation_id) {
  return db.transaction(function (transaction) {
    return db("tables")
      .transacting(transaction)
      .where({ table_id: table_id })
      .update({ occupied: false })
      .then(function () {
        return db("reservations")
          .where({ reservation_id: reservation_id })
          .update({ status: "finished" });
      })
      .then(transaction.commit)
      .catch(function (error) {
        transaction.rollback();
        throw error;
      });
  });
}

module.exports = {
  create,
  list,
  listById,
  listResById,
  occupy,
  free,
};