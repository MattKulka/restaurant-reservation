import { useState } from "react";
import { useHistory } from "react-router";
import { seatReservation } from "../../utils/api";
import ErrorAlert from "../../utils/Errors/ErrorAlert";

export default function ReservationDisplay({ reservations, loadDashboard}) {
    const [error, setError] = useState(null);
    const history = useHistory()

    function _clickHandler(event) {
        event.preventDefault();
        setError(null);
        event.target.name ==="seat"
          ? _seatClickHandler(event)
          : _cancelHandler(event);
    }

    function _seatClickHandler(event) {
      const abortController = new AbortController();
      history.push(`/reservations/${event.target.value}/seat`)
      return () => abortController.abort();
    }

    function _cancelHandler(event) {
      event.preventDefault();
      const abortController = new AbortController();
      if (
        !window.confirm(
            "Do you want to cancel this reservation? this cannot be undone."
        )
      )
        return null;
      seatReservation(event.target.value, "cancelled", abortController.signal)
        .then(loadDashboard)
        .catch(setError);
      return () => abortController.abort();
    }

    const SeatButton = ({ r }) => {
      if (r.status === "booked")
        return (
          <a href={`/reservations/${r.reservation_id}/seat`}>
            <button 
              type="button"
              className="btn btn-a border-a border-right-0"
              name="seat"
              value={r.reservation_id}
              onClick={_clickHandler}
            >
                Seat
            </button>
          </a>
        );
      return null;
    };

    const ListItem = ({ r, index }) => {
        if (r.status === "finished" || r.status === "cancelled") return null;
        return (
          <li className="list-group-item" key={r.reservation_id}>
            <h5 className="lgi-interior">
              {r.last_name}, {r.first_name} will arrive at {r.reservation_time}, phone number {r.mobile_number}
            </h5>
            <h5
              className="lgi-interior"
              data-reservation-id-status={r.reservation_id}
            >
              {r.status}
            </h5>
            <SeatButton r={r} />
            <a href={`/reservations/${r.reservation_id}/edit`}>
              <button
                type="button"
                className="btn btn-a border-a"
                value={r.reservation_id}
              >
                Edit
              </button>
            </a>
            <button
              type="button"
              name="cancel"
              className="btn btn-warn border-warn"
              value={r.reservation_id}
              onClick={_cancelHandler}
              data-reservation-id-cancel={r.reservation_id}
            >
              Cancel
            </button>
          </li>
        );
      };

      const reservationList =
      !reservations ||
      reservations.length === 0 ||
      reservations.every(
        (r) => r.status === "finished" || r.status === "cancelled"
      ) ? (
        <div className="d-flex mb-3 justify-content-center">
          <h4>There are no reservations on this date</h4>
        </div>
      ) : (
        <ol className="list-group">
          {reservations.map((r, index) => {
            return <ListItem key={"listItem " + r.reservation_id} r={r} index={index} />;
          })}
        </ol>
      );
  
    return (
      <div>
        <ErrorAlert error={error} />
        {reservationList}
      </div>
    );
  }
