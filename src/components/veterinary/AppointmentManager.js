import React, { useState, useEffect } from "react"; // ✅ Add this line at the top

const AppointmentManager = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // TODO: Replace with API call to fetch appointments for this vet
    const dummyAppointments = [
      {
        id: 1,
        petName: "Bruno",
        owner: "Ananya",
        time: "2025-07-12 10:00 AM",
        status: "pending",
      },
      {
        id: 2,
        petName: "Milo",
        owner: "Ravi",
        time: "2025-07-12 11:30 AM",
        status: "approved",
      },
    ];
    setAppointments(dummyAppointments);
  }, []);

  const handleStatusChange = (id, newStatus) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === id ? { ...apt, status: newStatus } : apt
      )
    );
  };

  return (
    <div className="appointment-container">
      <h2>Appointment Manager</h2>
      <table className="appointment-table">
        <thead>
          <tr>
            <th>Pet Name</th>
            <th>Owner</th>
            <th>Time</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((apt) => (
            <tr key={apt.id}>
              <td>{apt.petName}</td>
              <td>{apt.owner}</td>
              <td>{apt.time}</td>
              <td>{apt.status}</td>
              <td>
                {apt.status === "pending" && (
                  <>
                    <button onClick={() => handleStatusChange(apt.id, "approved")}>
                      Approve
                    </button>
                    <button onClick={() => handleStatusChange(apt.id, "rejected")}>
                      Reject
                    </button>
                  </>
                )}
                {apt.status !== "pending" && <span>—</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentManager;
