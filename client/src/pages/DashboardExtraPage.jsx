import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function DashboardExtrasPage() {
  const [extraTypes, setExtraTypes] = useState([]);
  const [extras, setExtras] = useState([]);

  const [loadingExtraTypes, setLoadingExtraTypes] = useState(true);
  const [loadingExtras, setLoadingExtras] = useState(true);

  const [extraTypesError, setExtraTypesError] = useState(null);
  const [extrasError, setExtrasError] = useState(null);

  const [editingExtraType, setEditingExtraType] = useState(null);
  const [editingExtra, setEditingExtra] = useState(null);

  const [extraTypeFormData, setExtraTypeFormData] = useState({
    Name: "",
    Cost: "",
  });

  const [extraFormData, setExtraFormData] = useState({
    Date: "",
    Time: "",
    Quantity: "",
    ReservationID: "",
    ExtraTypeID: "",
  });

  useEffect(() => {
    fetchExtraTypes();
    fetchExtras();
  }, []);

  const fetchExtraTypes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/extra-types", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to load extra types");
      }

      const data = await res.json();
      setExtraTypes(data);
    } catch (err) {
      setExtraTypesError(err.message);
    } finally {
      setLoadingExtraTypes(false);
    }
  };

  const fetchExtras = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/extras", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to load extras");
      }

      const data = await res.json();
      setExtras(data);
    } catch (err) {
      setExtrasError(err.message);
    } finally {
      setLoadingExtras(false);
    }
  };

  const handleExtraTypeFormChange = (e) => {
    const { name, value } = e.target;
    setExtraTypeFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleExtraFormChange = (e) => {
    const { name, value } = e.target;
    setExtraFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveExtraType = async (e) => {
    e.preventDefault();

    try {
      const method =
        editingExtraType && editingExtraType.ExtraTypeID ? "PUT" : "POST";

      const token = localStorage.getItem("token");
      const url =
        editingExtraType && editingExtraType.ExtraTypeID
          ? `http://localhost:5000/api/extra-types/${editingExtraType.ExtraTypeID}`
          : "http://localhost:5000/api/extra-types";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          Name: extraTypeFormData.Name,
          Cost: Number(extraTypeFormData.Cost),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save extra type");
      }

      await fetchExtraTypes();

      setEditingExtraType(null);
      setExtraTypeFormData({
        Name: "",
        Cost: "",
      });

      alert(
        editingExtraType && editingExtraType.ExtraTypeID
          ? "Extra type updated!"
          : "Extra type added!"
      );
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleSaveExtra = async (e) => {
    e.preventDefault();

    try {
      const method = editingExtra && editingExtra.ExtraID ? "PUT" : "POST";

      const token = localStorage.getItem("token");
      const url =
        editingExtra && editingExtra.ExtraID
          ? `http://localhost:5000/api/extras/${editingExtra.ExtraID}`
          : "http://localhost:5000/api/extras";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          Date: extraFormData.Date,
          Time: extraFormData.Time,
          Quantity: Number(extraFormData.Quantity),
          ReservationID: Number(extraFormData.ReservationID),
          ExtraTypeID: Number(extraFormData.ExtraTypeID),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save extra");
      }

      await fetchExtras();

      setEditingExtra(null);
      setExtraFormData({
        Date: "",
        Time: "",
        Quantity: "",
        ReservationID: "",
        ExtraTypeID: "",
      });

      alert(
        editingExtra && editingExtra.ExtraID
          ? "Extra updated!"
          : "Extra added!"
      );
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleDeleteExtraType = async (extraTypeId) => {
    if (!window.confirm("Are you sure you want to delete this extra type?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/extra-types/${extraTypeId}`,
        {
          method: "DELETE",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete extra type");
      }

      setExtraTypes(
        extraTypes.filter((extraType) => extraType.ExtraTypeID !== extraTypeId)
      );
      alert("Extra type deleted successfully");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleDeleteExtra = async (extraId) => {
    if (!window.confirm("Are you sure you want to delete this extra?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/extras/${extraId}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete extra");
      }

      setExtras(extras.filter((extra) => extra.ExtraID !== extraId));
      alert("Extra deleted successfully");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleEditExtraType = (extraType) => {
    setEditingExtraType(extraType);
    setExtraTypeFormData({
      Name: extraType.Name || "",
      Cost: extraType.Cost || "",
    });
  };

  const handleEditExtra = (extra) => {
    setEditingExtra(extra);
    setExtraFormData({
      Date: extra.Date || "",
      Time: extra.Time || "",
      Quantity: extra.Quantity || "",
      ReservationID: extra.ReservationID || "",
      ExtraTypeID: extra.ExtraTypeID || "",
    });
  };

  return (
    <div className="container">
      <h1>Extras Management</h1>

      <h2>Extra Types</h2>

      {loadingExtraTypes ? (
        <div style={{ padding: "20px", textAlign: "center" }}>
          Loading extra types...
        </div>
      ) : extraTypesError ? (
        <div style={{ padding: "20px", color: "red", textAlign: "center" }}>
          Error: {extraTypesError}
        </div>
      ) : (
        <>
          {editingExtraType !== null && (
            <form id="extraTypeForm" onSubmit={handleSaveExtraType}>
              <div className="form-group">
                <label htmlFor="Name">Name</label>
                <input
                  type="text"
                  id="Name"
                  name="Name"
                  value={extraTypeFormData.Name}
                  onChange={handleExtraTypeFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="Cost">Cost</label>
                <input
                  type="number"
                  id="Cost"
                  name="Cost"
                  value={extraTypeFormData.Cost}
                  onChange={handleExtraTypeFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <button type="submit">
                  {editingExtraType && editingExtraType.ExtraTypeID
                    ? "Update Extra Type"
                    : "Save Extra Type"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEditingExtraType(null);
                    setExtraTypeFormData({
                      Name: "",
                      Cost: "",
                    });
                  }}
                  style={{
                    marginLeft: "10px",
                    background: "#6c757d",
                    color: "white",
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {editingExtraType === null && (
            <button
              onClick={() => {
                setEditingExtraType({});
              }}
              style={{
                padding: "10px 20px",
                background: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "6px",
                marginBottom: "20px",
              }}
            >
              + Add New Extra Type
            </button>
          )}

          <table>
            <thead>
              <tr>
                <th>ExtraTypeID</th>
                <th>Name</th>
                <th>Cost</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {extraTypes.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    style={{ textAlign: "center", padding: "40px" }}
                  >
                    No extra types found
                  </td>
                </tr>
              ) : (
                extraTypes.map((extraType) => (
                  <tr key={extraType.ExtraTypeID}>
                    <td>{extraType.ExtraTypeID}</td>
                    <td>{extraType.Name}</td>
                    <td>€{extraType.Cost}</td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => handleEditExtraType(extraType)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDeleteExtraType(extraType.ExtraTypeID)
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </>
      )}

      <h2 style={{ marginTop: "40px" }}>Extras</h2>

      {loadingExtras ? (
        <div style={{ padding: "20px", textAlign: "center" }}>
          Loading extras...
        </div>
      ) : extrasError ? (
        <div style={{ padding: "20px", color: "red", textAlign: "center" }}>
          Error: {extrasError}
        </div>
      ) : (
        <>
          {editingExtra !== null && (
            <form id="extraForm" onSubmit={handleSaveExtra}>
              <div className="form-group">
                <label htmlFor="Date">Date</label>
                <input
                  type="date"
                  id="Date"
                  name="Date"
                  value={extraFormData.Date}
                  onChange={handleExtraFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="Time">Time</label>
                <input
                  type="text"
                  id="Time"
                  name="Time"
                  value={extraFormData.Time}
                  onChange={handleExtraFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="Quantity">Quantity</label>
                <input
                  type="number"
                  id="Quantity"
                  name="Quantity"
                  value={extraFormData.Quantity}
                  onChange={handleExtraFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="ReservationID">Reservation ID</label>
                <input
                  type="number"
                  id="ReservationID"
                  name="ReservationID"
                  value={extraFormData.ReservationID}
                  onChange={handleExtraFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="ExtraTypeID">Extra Type ID</label>
                <input
                  type="number"
                  id="ExtraTypeID"
                  name="ExtraTypeID"
                  value={extraFormData.ExtraTypeID}
                  onChange={handleExtraFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <button type="submit">
                  {editingExtra && editingExtra.ExtraID
                    ? "Update Extra"
                    : "Save Extra"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEditingExtra(null);
                    setExtraFormData({
                      Date: "",
                      Time: "",
                      Quantity: "",
                      ReservationID: "",
                      ExtraTypeID: "",
                    });
                  }}
                  style={{
                    marginLeft: "10px",
                    background: "#6c757d",
                    color: "white",
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {editingExtra === null && (
            <button
              onClick={() => {
                setEditingExtra({});
              }}
              style={{
                padding: "10px 20px",
                background: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "6px",
                marginBottom: "20px",
              }}
            >
              + Add New Extra
            </button>
          )}

          <table>
            <thead>
              <tr>
                <th>ExtraID</th>
                <th>Date</th>
                <th>Time</th>
                <th>Quantity</th>
                <th>ReservationID</th>
                <th>ExtraTypeID</th>
                <th>Extra Name</th>
                <th>Cost</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {extras.length === 0 ? (
                <tr>
                  <td
                    colSpan="9"
                    style={{ textAlign: "center", padding: "40px" }}
                  >
                    No extras found
                  </td>
                </tr>
              ) : (
                extras.map((extra) => (
                  <tr key={extra.ExtraID}>
                    <td>{extra.ExtraID}</td>
                    <td>{extra.Date}</td>
                    <td>{extra.Time}</td>
                    <td>{extra.Quantity}</td>
                    <td>{extra.ReservationID}</td>
                    <td>{extra.ExtraTypeID}</td>
                    <td>{extra.ExtraName}</td>
                    <td>€{extra.Cost}</td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => handleEditExtra(extra)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteExtra(extra.ExtraID)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </>
      )}

      <div className="back-link">
        <Link to="/admin/dashboard/" className="btn">
          Back
        </Link>
      </div>
    </div>
  );
}

export default DashboardExtrasPage;