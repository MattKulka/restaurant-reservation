const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./tables.service");

//functional middleware

const _validateProperties = (req, res, next) => {
  const table = req.body.data;
  if (!table) return next({ status: 400, message: "Body of data required" });
  const properties = ["table_name", "capacity"];
  for (const property of properties) {
    if (!table.hasOwnProperty(property) || table[property] === "") {
      return next({
        status: 400,
        message: `Property required: '${property}'`,
      });
    }
  }
};

const _storeProperties = (req, res, next) => {
  const { table_name, capacity } = req.body.data;
  res.locals.table_name = table_name;
  res.locals.capacity = capacity;
};

const _validateName = (req, res, next) => {
  if (res.locals.table_name.length <= 1)
    next({
      status: 400,
      message: `Length of property 'table_name' must be greater than 1 character.`,
    });
};

const _validateCapacity = (req, res, next) => {
  if (typeof res.locals.capacity !== "number" || isNaN(res.locals.capacity))
    next({ status: 400, message: `Property 'capacity' must be a number.` });
  if (res.locals.capacity < 1)
    next({
      status: 400,
      message: `Property 'capacity' must be greater than 0.`,
    });
};

const _validateOccupied = (req, res, next) => {
  if (!req.body.data.occupied) req.body.data.occupied = false;
};

const _validateReservationId = async (req, res, next) => {
  let { reservation_id } = req.body.data;
  if (!reservation_id)
    next({
      status: 400,
      message: `Property 'reservation_id' must be present.`,
    });
  const listedReservation = await service.listResById(Number(reservation_id));
  if (!listedReservation)
    next({
      status: 404,
      message: `Property 'reservation_id' must be a valid ID. ${reservation_id} is not a valid ID.`,
    });
  let { people } = listedReservation;
  res.locals.reservation = listedReservation;
  res.locals.people = people;
};

const _listById = async (req, res, next) => {
  const { table_id } = req.params;
  const table = await service.listById(table_id);

  if (!table) {
    return next({
      status: 404,
      message: `table id ${table_id} does not exist`,
    });
  }
  let { occupied, capacity, reservation_id } = table;
  res.locals.occupied = occupied;
  res.locals.capacity = capacity;
  res.locals.reservation_id = reservation_id;
};

const _validateSeatCapacity = (req, res, next) => {
  if (res.locals.occupied) {
    return next({
      status: 400,
      message: "The table you have selected is currently occupied.",
    });
  }

  if (res.locals.capacity < res.locals.people) {
    return next({
      status: 400,
      message: `The table you selected does not have enough capacity to seat ${res.locals.people} people.`,
    });
  }
};

const _validateCurrentlyOccupied = (req, res, next) => {
  const { occupied } = res.locals;
  if (!occupied)
    next({ status: 400, message: `The table you selected is not occupied.` });
};

const _validateCurrentlySeated = (req, res, next) => {
  const { status } = res.locals.reservation;
  if (status === "seated")
    next({ status: 400, message: "This reservation ios already seated" });
};

//organizational middleware

async function _createValidations(req, res, next) {
  _validateProperties(req, res, next);
  _storeProperties(req, res, next);
  _validateName(req, res, next);
  _validateCapacity(req, res, next);
  _validateOccupied(req, res, next);
  next();
}

async function _occupyValidations(req, res, next) {
  await _validateReservationId(req, res, next);
  await _listById(req, res, next);
  _validateSeatCapacity(req, res, next);
  _validateCurrentlySeated(req, res, next);
  next();
}

async function _freeValidations(req, res, next) {
  await _listById(req, res, next);
  _validateCurrentlyOccupied(req, res, next);
  next();
}

//executive functions

async function create(req, res) {
  const response = await service.create(req.body.data);
  res.status(201).json({ data: response[0] });
}

async function list(req, res) {
  const data = await service.list();
  res.json({ data });
}

async function occupy(req, res) {
  const { table_id } = req.params;
  const { reservation_id } = req.body.data;
  const data = await service.occupy(table_id, reservation_id);
  res.status(200).json({ data: data });
}

async function free(req, res) {
  const { table_id } = req.params;
  let { reservation_id } = res.locals;
  const data = await service.free(table_id, reservation_id);
  res.status(200).json({data: data});
}

module.exports = {
  create: [asyncErrorBoundary(_createValidations), asyncErrorBoundary(create)],
  list: [asyncErrorBoundary(list)],
  occupy: [asyncErrorBoundary(_occupyValidations), asyncErrorBoundary(occupy)],
  free: [asyncErrorBoundary(_freeValidations), asyncErrorBoundary(free)],
};