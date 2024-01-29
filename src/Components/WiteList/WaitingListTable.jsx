import React, { useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
} from "@mui/material";

const WaitListForm = () => {
  const [patientId, setPatientId] = useState("");
  const [newPriority, setNewPriority] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handlePriorityUpdate = async () => {
    try {
      setError(null);
      setSuccess(null);

      // Validate input
      if (!patientId || !newPriority) {
        setError("Patient ID and New Priority are required.");
        return;
      }

      // Make request to update priority
      const response = await axios.put("http://localhost:9000/pro", {
        patientId,
        priority: newPriority,
      });

      if (response.data.error) {
        setError(response.data.error);
      } else {
        setSuccess(response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred while updating the priority.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100%",
        marginLeft: "90%",
        background: "#f4f4f4",
      }}
    >
      <div
        style={{
          width: "400px",
          padding: "30px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          boxShadow: "5px 10px 6px rgba(0, 0, 0, 0.2)",
          background: "#fff",
          margin: "20px",
        }}
      >
        <h2 style={{ textAlign: "center", color: "#333", marginBottom: "20px" }}>
          Update Priority
        </h2>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>
                  <label htmlFor="patientId" style={{ color: "#555" }}>
                    Patient ID:
                  </label>
                </TableCell>
                <TableCell>
                  <TextField
                    type="text"
                    id="patientId"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    style={{ width: "100%" }}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <label htmlFor="newPriority" style={{ color: "#555" }}>
                    New Priority:
                  </label>
                </TableCell>
                <TableCell>
                  <TextField
                    type="text"
                    id="newPriority"
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    style={{ width: "100%" }}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        {error && (
          <p style={{ color: "red", fontSize: "14px", marginBottom: "10px" }}>{error}</p>
        )}
        {success && (
          <p style={{ color: "green", fontSize: "14px", marginBottom: "10px" }}>{success}</p>
        )}
        <Button
          onClick={handlePriorityUpdate}
          variant="contained"
          color="primary"
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "16px",
            borderRadius: "5px",
            marginTop: "10px",
          }}
        >
          Update Priority
        </Button>
      </div>
    </div>
  );
};

export default WaitListForm;
