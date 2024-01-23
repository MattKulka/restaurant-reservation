import { useHistory } from "react-router";
import ErrorAlert from "../../utils/Errors/ErrorAlert";
import { next, previous, today } from "../../utils/date-time";
import ReservationDisplay from "../reservations/ReservationDisplay";
import TablesDisplay from "../tables/TablesDisplay";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
export default function Dashboard({
  date,
  reservations,
  reservationsError,
  tables,
  tablesError,
  loadDashboard,
}) {
  const history = useHistory();

  return (
    <main className="menu-align">
      <div className="d-flex mb-1 justify-content-center">
        <h1>Dashboard</h1>
      </div>
      <div className="d-flex mb-4 justify-content-center">
        <h4 className="mb-0">
          Reservations for {date.slice(5)}-{date.slice(0, 4)}
        </h4>
      </div>

      <div className="pb-2">
        <ReservationDisplay
          reservations={reservations}
          loadDashboard={loadDashboard}
        />
      </div>
      <TablesDisplay tables={tables} loadDashboard={loadDashboard} />

      <div className="d-flex mt-3 justify-content-center">
        <button
          type="button"
          name="yesterday"
          id="yesterday"
          className="btn btn-a border-a border-right-0"
          value="Previous Day"
          onClick={() => history.push(`/dashboard?date=${previous(date)}`)}
        >
          Previous Day
        </button>
        <button
          type="button"
          name="today"
          id="today"
          className="btn btn-a border-a"
          value="Today"
          onClick={() => history.push(`/dashboard?date=${today()}`)}
        >
          Today
        </button>
        <button
          type="button"
          name="next day"
          id="next day"
          className="btn btn-a border-a border-left-0"
          value="Next Day"
          onClick={() => history.push(`/dashboard?date=${next(date)}`)}
        >
          Next Day
        </button>
      </div>
      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={tablesError} />
    </main>
  );
}
 
