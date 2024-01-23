import { useState } from "react";
import { useHistory } from "react-router";
import { createTable } from "../../utils/api";
import ErrorAlert from "../../utils/Errors/ErrorAlert";

export default function NewTable({loadDashboard}) {
  const history = useHistory();

  const defaultState = {
    table_name: "",
    capacity: 0,
  };

  const [error, setError] = useState(null);
  const [table, setTable] = useState(defaultState);

  const _submitHandler = (event) => {
    event.preventDefault();
    const abortController = new AbortController();

    createTable(table, abortController.abort())
      .then(() => history.push(`/dashboard`))
      .then(loadDashboard)
      .catch(setError);
    return () => abortController.abort();
  };

  const _inputChange = (event) => {
    event.preventDefault();
    const inputValue = event.target.value;
    const inputId = event.target.name;
    inputId === "table_name"
      ? setTable({ ...table, table_name: inputValue })
      : setTable({ ...table, capacity: Number(inputValue) });
  };

  return (
    <main>
      <div className="d-flex mb-1 justify-content-center">
        <h1>New Table</h1>
      </div>
      <ErrorAlert error={error} />
      <div className="d-flex mb-3 justify-content-center">
        <h4 className="mb-0">Enter The Table's Information Below</h4>
      </div>

      <form onSubmit={_submitHandler}>
        <div className="row">
          <div className="col">
            <label htmlFor="table_name">
              <h5>Table Name</h5>
            </label>
            <input
              name="table_name"
              id="table_name"
              type="text"
              className="form-control"
              minLength={2}
              onChange={_inputChange}
              value={table.table_name}
            />
          </div>
          <div className="col">
            <label htmlFor="table_name">
              <h5>Capacity</h5>
            </label>
            <input
              name="capacity"
              id="capacity"
              type="number"
              className="form-control"
              min={1}
              onChange={_inputChange}
              value={table.capacity}
            />
          </div>
        </div>
        <div className="d-flex mt-3 justify-content-center">
          <button
            type="submit"
            name="submit"
            id="submit"
            className="btn btn-a border-a col-2 minw100"
            value="Submit"
          >
            Submit
          </button>
          <button
            type="button"
            name="cancel"
            id="cancel"
            className="btn btn-warn border-warn col-2 minw100"
            value="Cancel"
            onClick={() => history.goBack()}
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}