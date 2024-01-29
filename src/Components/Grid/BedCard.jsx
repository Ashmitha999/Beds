import React from 'react';
import Typography from "@mui/material/Typography";
import IconButton from '@mui/material/IconButton';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import BedIcon from '@mui/icons-material/Bed';
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

// Import available and occupied images
import availableImage from '../../Images/OIP.jpg';
import occupiedImage from '../../Images/OOP.jpg';

const BedCard = ({ availableColor, occupiedColor, selectedWard }) => {
  const navigate = useNavigate();

  const bed = {
    // Other properties of the bed...
    status: "available", // or "occupied"
    // Assign imported images to the bed object
    availableImage: availableImage,
    occupiedImage: occupiedImage,
    // Other properties of the bed...
  };

  if (!bed || !bed.status || !bed.bedNumber) {
    return null;
  }

  const handleAdmitClick = () => {
    if (bed.status === "available") {
      const url = `/AdmitPatient`;
      navigate(url);
    } else {
      toast.error("Cannot admit patient to an occupied bed.");
    }
  };

  const handleTransferClick = () => {
    if (bed.status === "occupied" && selectedWard) {
      const url = `/TransferPatient?bedNumber=${bed.bedNumber.replace(
        "bed_",
        "bed_"
      )}&patientId=${bed.patientId}&patientName=${bed.patientName}&age=${
        bed.age
      }&gender=${bed.gender}&medicalAcuity=${bed.medicalAcuity}&contactno=${
        bed.contactno
      }&currentWardId=${selectedWard.wards[0].wardId}`;
      navigate(url);
    }
  };

  const handleDischargeClick = () => {
    if (bed.status === "occupied" && selectedWard) {
      const url = `/DischargePatient?bedNumber=${bed.bedNumber}&patientId=${
        bed.patientId
      }&patientName=${bed.patientName}&age=${bed.age}&gender=${
        bed.gender
      }&medicalAcuity=${bed.medicalAcuity}&contactno=${bed.contactno}&admissionDate=${
        bed.admissionDate
      }&WardId=${selectedWard.wards[0].wardId}`;
      navigate(url);
    }
  };
  
  // Define the image source based on bed status
  const getImageSource = () => {
    if (bed.status === "available") {
      return bed.availableImage; // Set the available image source
    } else {
      return bed.occupiedImage; // Set the occupied image source
    }
  };
  
  return (
    <Card style={{ maxWidth: 200, margin: 10 }}>
      <CardContent
        style={{
          backgroundColor: bed.status === "available" ? availableColor : occupiedColor,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          padding: 20,
        }}
      >
        <BedIcon style={{ color: bed.status === "available" ? "white" : "black", fontSize: 40 }} />
        <Typography variant="subtitle2" style={{ color: bed.status === "available" ? "white" : "black", marginTop: 10 }}>
          {bed.status === "available" ? "Available" : "Occupied"}
        </Typography>
        <Typography variant="subtitle2" style={{ color: bed.status === "available" ? "white" : "black", marginTop: 10 }}>
          {bed.bedNumber}
        </Typography>
        {bed.status === "available" && (
          <IconButton
            variant="contained"
            color="primary"
            size="small"
            style={{ marginTop: 10 }}
            onClick={handleAdmitClick}
          >
            <AddCircleOutlineIcon />
          </IconButton>
        )}
        {bed.status === "occupied" && (
          <div>
            <IconButton
              variant="contained"
              color="primary"
              size="small"
              style={{ marginTop: 10 }}
              onClick={handleTransferClick}
            >
              <AddCircleOutlineIcon />
            </IconButton>
            <IconButton
              variant="contained"
              color="primary"
              size="small"
              style={{ marginTop: 10 }}
              onClick={handleDischargeClick}
            >
              <AddCircleOutlineIcon />
            </IconButton>
          </div>
        )}
      </CardContent>
      {/* Use the getImageSource function to dynamically set the image source */}
      <img src={getImageSource()} alt={`Bed ${bed.bedNumber}`} style={{ width: '100%', height: 'auto' }} />
    </Card>
  );
};

export default BedCard;
