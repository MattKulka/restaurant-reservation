import React, { useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../components/dashboard/dashboard";
import NotFound from "../utils/Errors/NotFound";
import { today } from "../utils/date-time";
import { listReservations, listTables } from "../utils/api";
import useQuery from '../utils/useQuery'
import NewTable from "../components/tables/NewTable";
import Seating from "../components/reservations/Seating";
import Search from "../components/search/Search";
import CreateReservations from "../components/reservations/CreateReservations";
import EditReservations from "../components/reservations/EditReservations";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const query = useQuery();
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const date = query.get("date") ? query.get("date") : today();

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();

    setReservationsError(null);

    setTablesError(null);

    listReservations({ date: date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);

    listTables(abortController.signal).then(setTables).catch(setTablesError);

    return () => abortController.abort();
  }

  return (
    <Switch>
      <Route exact={true} path="/tables/new">
        <NewTable loadDashboard={loadDashboard} />
      </Route>

      <Route exact={true} path="/reservations/:reservation_id/seat">
        <Seating tables={tables} loadDashboard={loadDashboard} />
      </Route>

      <Route exact={true} path="/reservations/:reservation_id/edit">
        <EditReservations loadDashboard={loadDashboard} />
      </Route>

      <Route exact={true} path="/reservations/new">
        <CreateReservations loadDashboard={loadDashboard} />
      </Route>

      <Route exact={true} path="/reservations">
        <Redirect to={`/reservations?date=${date ? date : today()}`} />
        <Dashboard
          date={date ? date : today()}
          reservations={reservations}
          reservationsError={reservationsError}
          tables={tables}
          tablesError={tablesError}
          loadDashboard={loadDashboard}
        />
      </Route>

      <Route exact={true} path="/dashboard">
        <Redirect to={`/dashboard?date=${date ? date : today()}`} />
        <Dashboard
          date={date ? date : today()}
          reservations={reservations}
          reservationsError={reservationsError}
          tables={tables}
          tablesError={tablesError}
          loadDashboard={loadDashboard}
        />
      </Route>

      <Route path="/search">
        <Search />
      </Route>

      <Route exact={true} path="/">
        <Redirect to={`/dashboard?date=${date ? date : today()}`} />
      </Route>

      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
