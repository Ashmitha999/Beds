import React, { useEffect, useState } from "react";

import {
  Container,
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Grid,
} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';


function PatientList() {
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch patient data from the API
    fetch("http://localhost:9000/selected") // Replace with your API endpoint
      .then((response) => response.json())
      .then((data) => {
        setPatients(data.patients);
        setIsLoading(false);
        console.log(data)
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  }, []);

  return (
    <div style={{ display: "flex", backgroundColor: "#f5f5f5" }}>
    <div style={{ width: "100%", padding: "10px", marginLeft: "50px" }}>
      <div
        style={{
          background: "#ffff",
          padding: "10px",
          height: "50px",
          marginBottom: "10px",
          width: "105%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginLeft: "-5%",
        }}
      >
        <Typography
          variant="h3"
          gutterBottom
          style={{ color: "#61AFF7", fontWeight: "bold", marginTop: "15px" }}
        >
          Good Care Hospital
        </Typography>
        <PersonIcon style={{ fontSize: 50, marginRight: "10px" }} />
      </div>

      {/* Place your heading here */}
      <Typography variant="h5" style={{ marginBottom: "20px" }}>
        
       Patient Care Dashboard
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={6}>
  <div
  style={{
    height: "550px",
    width: "1000px",
    background: "#ffff",
    borderRadius: "30px",
    boxShadow: "5px 10px 6px rgba(0, 0, 0, 0.2)",
  }}
>
    <Container>
  <Typography variant="h4" component="h2" gutterBottom>
    Patient List
  </Typography>
  <Paper elevation={3}>
    <Table>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={4}>Loading data...</TableCell>
          </TableRow>
        ) : (
          patients.map((patient) => (
            <TableRow key={patient._id}>
              <TableCell>Name: {patient.name}</TableCell>
              <TableCell>Medical Acuity: {patient.medicalAcuity.join(", ")}</TableCell>
              {patient.assignedNurse && (
                <TableCell>Assigned Nurse: {patient.assignedNurse}</TableCell>
              )}
              {patient.tasks.length > 0 && (
                <TableCell>
                  <div>
                    <strong>Tasks:</strong>
                  </div>
                  <ul>
                    {patient.tasks.map((task, index) => (
                      <li key={index}>
                        {`${task.taskType}: ${task.description}`}
                      </li>
                    ))}
                  </ul>
                </TableCell>
              )}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  </Paper>
</Container></div> </Grid></Grid></div></div>

  );
}

export default PatientList;