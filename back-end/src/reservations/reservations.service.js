const db = require("../db/connection");

function create(reservation) {
  return db("reservations")
    .insert(reservation)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

function list(date) {
  return db("reservations")
    .select("*")
    .where({ reservation_date: date })
    .whereNot({ status: "finished" })
    .orderBy("reservation_time");
}

function listById(reservation_id) {
  return db("reservations")
    .select("*")
    .where({ reservation_id: reservation_id })
    .orderBy("reservation_time");
}

function listMobile(mobile_number) {
  return db("reservations")
    .select("*")
    .where("mobile_number", "like", `${mobile_number}%`)
    .orderBy("reservation_time");
}

function toStatus(reservation_id, status) {
  return db("reservations")
    .where({ reservation_id: reservation_id })
    .update({ status: status });
}

function edit(reservation) {
  return db("reservations")
    .where({ reservation_id: reservation.reservation_id })
    .update({ ...reservation });
}

module.exports = {
  create,
  list,
  listById,
  listMobile,
  toStatus,
  edit,
};