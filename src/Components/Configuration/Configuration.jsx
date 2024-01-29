import React, { useState, useEffect } from 'react';

const DoctorManagement = () => {
  const [admittingDoctors, setAdmittingDoctors] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [doctorNames, setDoctorNames] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');

  useEffect(() => {
    // Fetch doctor names when the component mounts
    fetchDoctorNames();
  }, []);

  const fetchDoctorNames = async () => {
    try {
      const response = await fetch('http://localhost:9000/getDoctorNames');
      const data = await response.json();
      setDoctorNames(data);
    } catch (error) {
      console.error('Error fetching doctor names:', error);
    }
  };

  const handleAddDoctorSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:9000/addDoctor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ admittingDoctors }),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Doctor added successfully:', responseData);
        setAdmittingDoctors(''); // Clear input after successful submission
        fetchDoctorNames(); // Fetch updated doctor names
      } else {
        const errorData = await response.json();
        console.error('Invalid response from server:', errorData);
        setErrorMessage('An unexpected error occurred.');
      }
    } catch (error) {
      console.error('Error adding doctor:', error);
      setErrorMessage('An unexpected error occurred.');
    }
  };

  const handleSelectChange = (event) => {
    setSelectedDoctor(event.target.value);
  };

  const handleShowPopup = () => {
    // Display popup message with the selected doctor
    if (selectedDoctor) {
      alert(`Selected Doctor: ${selectedDoctor}`);
      // You can replace the alert with your custom popup component
    } else {
      alert('Please select a doctor');
    }
  };

  return (
    <div>
      <h2>Add Doctor</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form onSubmit={handleAddDoctorSubmit}>
        <label>
          Admitting Doctors:
          <input
            type="text"
            value={admittingDoctors}
            onChange={(e) => setAdmittingDoctors(e.target.value)}
          />
        </label>
        <button type="submit">Add Doctor</button>
      </form>

      <h2>Select a Doctor</h2>
      <select value={selectedDoctor} onChange={handleSelectChange}>
        <option value="">Select a Doctor</option>
        {doctorNames.map((doctor, index) => (
          <option key={index} value={doctor.admittingDoctors}>
            {doctor.admittingDoctors}
          </option>
        ))}
      </select>
      <button onClick={handleShowPopup}>Show Popup</button>
    </div>
  );
};

export default DoctorManagement;
