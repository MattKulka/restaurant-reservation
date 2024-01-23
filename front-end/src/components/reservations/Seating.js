import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { editTable, listReservationsById } from "../../utils/api";
import ErrorAlert from "../../utils/Errors/ErrorAlert";

export default function Seating({ tables, loadDashboard }) {
  const { reservation_id } = useParams();
  const history = useHistory();

  const [error, setError] = useState(null);
  const [reservation, setreservation] = useState([]);
  const [currentTable, setCurrentTable] = useState({
    table_name: "",
    capacity: "",
  });

  const _loadReservation = () => {
    const abortController = new AbortController();

    setError(null);

    listReservationsById(
      { reservation_id: reservation_id },
      abortController.signal
    )
      .then(setreservation)
      .catch(setError);

    return () => abortController.abort();
  };

  useEffect(_loadReservation, [reservation_id]);
  useEffect(() => {
    if (reservation && tables.length > 0)
      setCurrentTable({
        table_id: tables[0].table_id,
        table_name: tables[0].table_name,
        capacity: tables[0].capacity,
        occupied: true,
      });
  }, [tables, reservation]);

  const _inputChange = async (event) => {
    event.preventDefault();
    setError(null);
    const { value } = event.target;
    const values = value.split("_ ");
    const table_id = values[0];
    const table_name = values[1];
    const capacity = Number(values[2]);
    setCurrentTable({
      table_id: table_id,
      table_name: table_name,
      capacity: capacity,
      occupied: true,
    });
    return capacity < reservation.people
      ? setError({
          status: 400,
          message:
            "Your party size exceeds the capacity for this table, please choose another.",
        })
      : null;
  };

  const _submitHandler = (event) => {
    event.preventDefault();
    const abortController = new AbortController()
    if (error) return null;
    editTable(currentTable, reservation_id)
      .then(loadDashboard)
      .then(() => {
        history.push("/dashboard");
      })
      .catch(setError);
    return () => abortController.abort
  };

  if (!tables || !reservation) return <h3>Missing Tables or Reservation</h3>;

  return (
    <div>
      <div className="d-flex mb-1 justify-content-center">
        <h1>Seating</h1>
      </div>
      <form onSubmit={_submitHandler}>
        <div className="row">
          <div className="col-2"></div>
          <div className="col">
            <div className="d-flex mt-1 justify-content-center">
              <label htmlFor="table_id"> Table Number: </label>
            </div>
            <select
              name="table_id"
              id="table_id"
              className="form-control minw100"
              required={true}
              onChange={_inputChange}
            >
              {tables.map((t, index) => {
                return (
                  <option
                    key={index}
                    value={`${t.table_id}_ ${t.table_name}_ ${t.capacity}`}
                  >
                    {t.table_name} - {t.capacity}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="col-2"></div>
        </div>
        <div className="row mt-3">
          <div className="col-4"></div>
          <button
            type="submit"
            className="btn btn-a border-a col minw100"
            name="submit"
          >
            Submit
          </button>
          <button
            type="button"
            className="btn btn-warn border-warn col minw100"
            name="cancel"
            onClick={() => history.goBack()}
          >
            Cancel
          </button>
          <div className="col-4"></div>
        </div>
        <ErrorAlert error={error} />
      </form>
    </div>
  );
}