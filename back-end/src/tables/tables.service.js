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


// Inside service module
async function occupy(table_id, reservation_id) {
  if (!table_id || !reservation_id) {
    console.error('Missing parameters:', { table_id, reservation_id });
    return Promise.reject(new Error('Both table_id and reservation_id are required'));
  }

  try {
    await db("tables")
      .where({ table_id: table_id })
      .update({ occupied: true, reservation_id: reservation_id });

    await db("reservations")
      .where({ reservation_id: reservation_id })
      .update({ status: "seated" });

    return Promise.resolve(); // or return any relevant data
  } catch (error) {
    console.error('Error during update:', error);
    return Promise.reject(error);
  }
}


function free(table_id, reservation_id) {
  // Inside the occupy function
if (!table_id || !reservation_id) {
  console.error('Missing parameters:', { table_id, reservation_id });
  return Promise.reject({ status: 400, message: 'Both table_id and reservation_id are required' });
}

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