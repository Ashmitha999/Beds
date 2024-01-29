import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { RadioGroup } from "@mui/material";
import { Radio } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker"; // Uncommented this line
import dayjs from "dayjs";


const initializeFormData = (queryParams) => ({
  patientName: "",
  age: "",
  gender: "",
  contactno: "",
  abhaNo: "",
  wardId: queryParams.get("bedNumber") ? queryParams.get("wardId") || "" : "",
  wardName: queryParams.get("bedNumber") ? queryParams.get("wardName") || "" : "",
  bedNumber: queryParams.get("bedNumber") || "",
  medicalAcuity: "",
  admittingDoctors: "",
  assignedNurse: "",
  admissionDate: null,
  admissionTime: null,
  address: {
    doorno: "",
    streetname: "",
    district: "",
    state: "",
    country: "",
    pincode: "",
  },
  tasks: {
    taskType: "",
    description: "",

  },
});
const AdmitPatient = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [wardOptions, setWardOptions] = useState([]);

  useEffect(() => {
    // Fetch ward options from the API
    axios
      .get("http://localhost:9000/bedGet")
      .then((response) => {
        if (Array.isArray(response.data)) {
          const extractedWardNames = response.data.flatMap((item) =>
            item.wards.map((ward) => ward.name)
          );
          setWardOptions(extractedWardNames);
        }
      })
      .catch((error) => {
        console.error("Error fetching ward options:", error);
      });
  }, []);

  const [data, setData] = useState(initializeFormData(queryParams));

  useEffect(() => {
    if (queryParams.has("bedNumber")) {
      setData(initializeFormData(queryParams));
    }
  }, [queryParams]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const {
      patientName,
      age,
      gender,
      contactno,
      wardId,
      abhaNo,
      wardName,
      bedNumber,
      medicalAcuity,
      admittingDoctors,
      assignedNurse,
      admissionDate,
      admissionTime,
      address,
      tasks,
    } = data;

    try {
      const { data: response } = await axios.post(
        "http://localhost:9000/admitpt",
        {
          patientName,
          age,
          gender,
          contactno,
          abhaNo,
          wardId,
          wardName,
          bedNumber,
          medicalAcuity,
          admittingDoctors,
          assignedNurse,
          admissionDate,
          admissionTime,
          address: { ...address },
          tasks: { ...tasks },
        }
      );

      if (response.error) {
        // Display the error message from the server
        toast.error(response.error);
      } else {
        // Reset the form and show a success message
        setData(initializeFormData(queryParams));
        toast.success("Patient Admitted Successfully");
      }
    } catch (error) {
      // Handle network or other errors
      console.error("Error:", error);
      toast.error("An error occurred while submitting the form.");
    }

  };
  
  const handleDatedChanged = (newDate) => {
    const formattedDated = newDate ? dayjs(newDate).format("YYYY-MM-DD") : null;
    setData({ ...data, admissionDate: formattedDated });
  };
  
  const shouldDisableDate = (day) => {
    return dayjs(day).isBefore(dayjs(), 'day');
  };
  
  const handleTimeChange = (newTime) => {
    const formattedTime = newTime ? dayjs(newTime).format("HH:mm A") : "";
    setData((prevData) => ({ ...prevData, admissionTime: formattedTime }));
  };
  const handleGenderChange = (event) => {
    setData({
      ...data,
      gender: event.target.value,
    });
  };

  return (
    <div style={{ display: "flex", backgroundColor: "#f5f5f5",width:"100%" }}>
      <div style={{ width: "100%", padding: "10px", marginLeft: "50px", marginTop: "50px" }}>
        <Typography
          variant="h5"
          gutterBottom
          style={{ color: "gray", fontWeight: "bold", marginTop: "20px" }}
        >
          To Admit a patient, please enter the details
        </Typography>
        <Container
          maxWidth="lr"
          style={{
            display: "flex",
            width: "100%",
            height: "600px",
            marginTop: "10px",
            justifyContent: "flex-start",
            background: "#DEE3E2",
            borderRadius: "30px",
            marginLeft: "-15px",
            boxShadow: "5px 10px 6px rgba(0, 0, 0, 0.3)",
          }}
        >
          <div style={{ width: "100%" }}>
            <form onSubmit={handleFormSubmit}>
              <Grid container spacing={3}>
              <Grid item xs={2}>
                  <TextField
                    style={{
                      background: "#ffff",
                      padding: "10px",
                      borderRadius: "10px",
                      boxShadow: "5px 10px 6px rgba(0, 0, 0, 0.2)",
                    }}
                    required
                    label="Patient Name"
                    fullWidth
                    variant="outlined"
                    value={data.patientName}
                    onChange={(e) => setData({ ...data, patientName: e.target.value })}
                  />
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    style={{
                      background: "#ffff",
                      padding: "10px",
                      borderRadius: "10px",
                      boxShadow: "5px 10px 6px rgba(0, 0, 0, 0.2)",
                    }}
                    required
                    label="Age"
                    fullWidth
                    variant="outlined"
                    type="number"
                    value={data.age}
                    onChange={(e) => setData({ ...data, age: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={3.8}>
                  <div
                    style={{
                      background: "#ffff",
                      padding: "10px",
                      borderRadius: "10px",
                      boxShadow: "5px 10px 6px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    <RadioGroup
                      patientName="gender"
                      value={data.gender}
                      onChange={handleGenderChange}
                      row
                    >
                      <FormControlLabel
                        value="Male"
                        control={<Radio size="small" />}
                        label={<span style={{ color: "gray" }}>Male</span>}
                      />
                      <FormControlLabel
                        value="Female"
                        control={<Radio size="small" />}
                        label={<span style={{ color: "gray" }}>Female</span>}
                      />
                      <FormControlLabel
                        value="Other"
                        control={<Radio size="small" />}
                        label={<span style={{ color: "gray" }}>Other</span>}
                      />
                    </RadioGroup>
                  </div>
                </Grid>

                <Grid item xs={3}>
                  <TextField
                    required
                    style={{
                      background: "#ffff",
                      padding: "10px",
                      borderRadius: "10px",
                      boxShadow: "5px 10px 6px rgba(0, 0, 0, 0.2)",
                    }}
                    label="Contact Number"
                    fullWidth
                    variant="outlined"
                    type="tel"
                    value={data.contactno}
                    onChange={(e) => setData({ ...data, contactno: e.target.value })}
                  />
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    required
                    style={{
                      background: "#ffff",
                      padding: "10px",
                      borderRadius: "10px",
                      boxShadow: "5px 10px 6px rgba(0, 0, 0, 0.2)",
                    }}
                    label="Ward ID"
                    fullWidth
                    variant="outlined"
                    type="tel"
                    value={data.wardId}
                    onChange={(e) => setData({ ...data, wardId: e.target.value })}
                  />
                </Grid>

                <Grid item xs={2}>
                  <TextField
                    required
                    style={{
                      background: "#ffff",
                      padding: "10px",
                      borderRadius: "10px",
                      boxShadow: "5px 10px 6px rgba(0, 0, 0, 0.2)",
                    }}
                    label="ABHA Number"
                    fullWidth
                    variant="outlined"
                    value={data.abhaNo}
                    onChange={(e) => setData({ ...data, abhaNo: e.target.value })}
                  />
                </Grid>

                <Grid item xs={2}>
                  <div
                    style={{
                      background: "#ffff",
                      padding: "10px",
                      borderRadius: "10px",
                      boxShadow: "5px 10px 6px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    <FormControl  fullWidth variant="outlined">
                      <InputLabel>Medical Acuity</InputLabel>
                      <Select
                        value={data.medicalAcuity}
                        onChange={(e) =>
                          setData({ ...data, medicalAcuity: e.target.value })
                        }
                        label="Medical Acuity"
                      >
                        <MenuItem value="Moderate">Moderate</MenuItem>
                        <MenuItem value="Critical">Critical</MenuItem>
                        <MenuItem value="Stable">Stable</MenuItem>
                        
                      </Select>
                    </FormControl>
                  </div>
                </Grid>

                <Grid item xs={3}>
                  <div
                    style={{
                      background: "#ffff",
                      padding: "10px",
                      borderRadius: "10px",
                      boxShadow: "5px 10px 6px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    <FormControl  fullWidth variant="outlined">
                      <InputLabel>Ward</InputLabel>
                      <Select
                        value={data.wardName}
                        onChange={(e) =>
                          setData({ ...data, wardName: e.target.value })
                        }
                        label="Wards"
                      >
                        <MenuItem value="Ward A">Ward A</MenuItem>
                        <MenuItem value="Ward B">Ward B</MenuItem>
                        <MenuItem value="Ward C">Ward C</MenuItem>
                        <MenuItem value="Ward D">Ward D</MenuItem>
                        <MenuItem value="Ward E">Ward E</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </Grid>

                <Grid item xs={3} >
                  <TextField
                    style={{
                      background: "#ffff",
                      padding: "10px",
                      borderRadius: "10px",
                      boxShadow: "5px 10px 6px rgba(0, 0, 0, 0.2)",
                    }}
                    required
                    label="Bed Number"
                    fullWidth
                    variant="outlined"
                    type="text"
                    value={data.bedNumber}
                    onChange={(e) => setData({ ...data, bedNumber: e.target.value })}
                  />
                </Grid>
                <Grid item xs={3}>
                  <div
                    style={{
                      background: "#ffff",
                      padding: "10px",
                      borderRadius: "10px",
                      boxShadow: "5px 10px 6px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    <FormControl  fullWidth variant="outlined">
                      <InputLabel>Assigned Doctors</InputLabel>
                      <Select
                        value={data.admittingDoctors}
                        onChange={(e) =>
                          setData({ ...data, admittingDoctors: e.target.value })
                        }
                        label="Wards"
                      >
                        <MenuItem value="Ward A">Dr John</MenuItem>
                        <MenuItem value="Dr. Smith">Dr Smith</MenuItem>
                        <MenuItem value="Dr. Johnson">Dr Johnson</MenuItem>
                        <MenuItem value="Dr. Williams">Dr Williams</MenuItem>
                        <MenuItem value="Dr. Anderson">Dr Anderson</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={3}>
                  <div
                    style={{
                      background: "#ffff",
                      padding: "10px",
                      borderRadius: "10px",
                      boxShadow: "5px 10px 6px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    <FormControl  fullWidth variant="outlined">
                      <InputLabel>Assigned Nurse</InputLabel>
                      <Select
                        value={data.assignedNurse}
                        onChange={(e) =>
                          setData({ ...data, assignedNurse: e.target.value })
                        }
                        label="Nurse"
                      >
                        <MenuItem value="Nr Stella">Nr.Stella</MenuItem>
                        <MenuItem value="Nr.Beulla">Nr.Beulla</MenuItem>
                        <MenuItem value="Nr.Vimala">Nr.Vimala</MenuItem>
                        <MenuItem value="Nr.Nirmala">Nr.Nirmala</MenuItem>
                        <MenuItem value="Nr.Jenny">Nr.Jenny</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </Grid>
                
<Grid item xs={3}>
  {/* <div
    style={{
      background: "#ffff",
      padding: "10px",
      borderRadius: "4px",
      boxShadow: "5px 10px 6px rgba(0, 0, 0, 0.2)",
    }}
  > */}
    <FormControl fullWidth variant="outlined" style={{
      width:"200px",
      marginLeft:"-20px",
      background: "#ffff",
      padding: "10px",
      borderRadius: "10px",
      boxShadow: "3px 6px 3px rgba(0, 0, 0, 0.2)",
    }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Admission Date"
          slotProps={{ textField: {  } }}
          value={data.admissionDate ? dayjs(data.admissionDate) : null}
          onChange={(newDate) => handleDatedChanged(newDate)}
          shouldDisableDate={shouldDisableDate}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
    </FormControl>
  {/* </div> */}
</Grid>

<Grid item xs={2} >
                  <div
                    style={{
                      background: "#ffff",
                      padding: "10px",
                      borderRadius: "10px",
                      marginLeft:"-80px",
                      boxShadow: "5px 10px 6px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    <TextField
                      label="Admission Time"
                      id="admissionTime"
                      type="time"
                      value={data.admissionTime}
                      onChange={(e) =>
                        setData({ ...data, admissionTime: e.target.value })
                      }
                      required
                      inputProps={{ step: 300 }} // 5-minute steps
                      style={{ width: "100%" }}
                    />
                  </div>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="h6" gutterBottom style={{ color: "gray", marginTop: "20px" }}>
                    Address
                  </Typography>
                </Grid>

                <Grid item xs={3}>
                  <TextField
                    required
                    style={{
                      background: "#ffff",
                      padding: "10px",
                      borderRadius: "10px",
                      boxShadow: "5px 10px 6px rgba(0, 0, 0, 0.2)",
                    }}
                    label="Door No."
                    fullWidth
                    variant="outlined"
                    value={data.address.doorno}
                    onChange={(e) =>
                      setData({
                        ...data,
                        address: { ...data.address, doorno: e.target.value },
                      })
                    }
                  />
                </Grid>

                <Grid item xs={3}>
                  <TextField
                    style={{
                      background: "#ffff",
                      padding: "10px",
                      borderRadius: "10px",
                      boxShadow: "5px 10px 6px rgba(0, 0, 0, 0.2)",
                    }}
                    required
                    label="Street Name"
                    fullWidth
                    variant="outlined"
                    value={data.address.streetname}
                    onChange={(e) =>
                      setData({
                        ...data,
                        address: { ...data.address, streetname: e.target.value },
                      })
                    }
                  />
                </Grid>

                <Grid item xs={3}>
                  <TextField
                    required
                    style={{
                      background: "#ffff",
                      padding: "10px",
                      borderRadius: "10px",
                      boxShadow: "5px 10px 6px rgba(0, 0, 0, 0.2)",
                    }}
                    label="District"
                    fullWidth
                    variant="outlined"
                    value={data.address.district}
                    onChange={(e) =>
                      setData({
                        ...data,
                        address: { ...data.address, district: e.target.value },
                      })
                    }
                  />
                </Grid>

                <Grid item xs={3}>
                  <TextField
                    required
                    style={{
                      background: "#ffff",
                      padding: "10px",
                      borderRadius: "10px",
                      boxShadow: "5px 10px 6px rgba(0, 0, 0, 0.2)",
                    }}
                    label="State"
                    fullWidth
                    variant="outlined"
                    value={data.address.state}
                    onChange={(e) =>
                      setData({
                        ...data,
                        address: { ...data.address, state: e.target.value },
                      })
                    }
                  />
                </Grid>

                <Grid item xs={3}>
                  <TextField
                    required
                    style={{
                      background: "#ffff",
                      padding: "10px",
                      borderRadius: "10px",
                      boxShadow: "5px 10px 6px rgba(0, 0, 0, 0.2)",
                    }}
                    label="Country"
                    fullWidth
                    variant="outlined"
                    value={data.address.country}
                    onChange={(e) =>
                      setData({
                        ...data,
                        address: { ...data.address, country: e.target.value },
                      })
                    }
                  />
                </Grid>

                <Grid item xs={3}>
                  <TextField
                    required
                    style={{
                      background: "#ffff",
                      padding: "10px",
                      borderRadius: "10px",
                      boxShadow: "5px 10px 6px rgba(0, 0, 0, 0.2)",
                    }}
                    label="Pincode"
                    fullWidth
                    variant="outlined"
                    type="number"
                    value={data.address.pincode}
                    onChange={(e) =>
                      setData({
                        ...data,
                        address: { ...data.address, pincode: e.target.value },
                      })
                    }
                  />
                </Grid>

                <Grid item xs={3}>
                  <Typography variant="h6" gutterBottom style={{ color: "gray", marginTop: "20px" }}>
                    Tasks
                  </Typography>
                </Grid>

                <Grid item xs={3}>
                  <TextField
                    required
                    style={{
                      background: "#ffff",
                      padding: "10px",
                      borderRadius: "10px",
                      boxShadow: "5px 10px 6px rgba(0, 0, 0, 0.2)",
                    }}
                    label="Task Type"
                    fullWidth
                    variant="outlined"
                    value={data.tasks.taskType}
                    onChange={(e) =>
                      setData({
                        ...data,
                        tasks: { ...data.tasks, taskType: e.target.value },
                      })
                    }
                  />
                </Grid>

                <Grid item xs={3}>
                  <TextField
                    required
                    style={{
                      background: "#ffff",
                      padding: "10px",
                      borderRadius: "10px",
                      boxShadow: "5px 10px 6px rgba(0, 0, 0, 0.2)",
                    }}
                    label="Task Description"
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={2}
                    value={data.tasks.description}
                    onChange={(e) =>
                      setData({
                        ...data,
                        tasks: { ...data.tasks, description: e.target.value },
                      })
                    }
                  />
                </Grid>

                <Grid item xs={12}>
                  {/* ... (remaining code) */}
                </Grid>

                
                {/* ... (similar structure for other form fields) */}
                <Grid item xs={6} >
                  <Button type="submit" variant="contained" color="primary"   style={{ width: '200px', height: '50px',marginTop:"-190px",marginLeft:"700px" }}>
                    Admit Patient
                  </Button>
                </Grid>
              </Grid>
            </form>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default AdmitPatient;