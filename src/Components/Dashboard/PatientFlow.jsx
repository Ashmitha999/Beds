import React, { useState, useEffect } from "react";
import { ResponsiveSankey } from "@nivo/sankey";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import PersonIcon from "@mui/icons-material/Person";

const PatientFlow = () => {
  const [datax, setDatax] = useState();

  useEffect(() => {
    fetch("http://localhost:9000/patientflow")
      .then((response) => response.json())
      .then((data) => {
        const nodesSet = new Set();
        const links = data.patientFlow.map((item) => {
          nodesSet.add(item.from);
          nodesSet.add(item.to);
          return {
            source: item.from,
            target: item.to,
            value: item.value,
          };
        });

        const nodes = Array.from(nodesSet).map((node) => ({ id: node }));

        const formattedData = {
          nodes,
          links,
        };

        setDatax(formattedData);
      })
      .catch((error) => console.error("Error fetching data: " + error));
  }, []);

  if (!datax) {
    // Data is still loading
    return <div>Loading...</div>;
  }

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
          Occupancy Overview Dashboard
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <div
              style={{
                height: "500px",
                width: "860px",
                background: "#ffff",
                borderRadius: "30px",
                boxShadow: "5px 10px 6px rgba(0, 0, 0, 0.2)",
              }}
            >
              <ResponsiveSankey
                data={datax}
                margin={{ top: 10, right: 160, bottom: 10, left: 50 }}
                align="justify"
                colors={{ scheme: "category10" }}
                nodeOpacity={1}
                nodeThickness={18}
                nodeInnerPadding={3}
                nodeSpacing={24}
                nodeBorderWidth={0}
                linkOpacity={0.5}
                linkHoverOpacity={0.8}
                linkContract={1}
                enableLinkGradient={true}
                labelPosition="outside"
                legends={[
                  {
                      anchor: 'bottom-right',
                      direction: 'column',
                      translateX: 130,
                      itemWidth: 100,
                      itemHeight: 14,
                      itemDirection: 'right-to-left',
                      itemsSpacing: 2,
                      itemTextColor: '#999',
                      symbolSize: 14,
                      effects: [
                          {
                              on: 'hover',
                              style: {
                                  itemTextColor: '#000'
                              }
                          }
                      ]
                  }
              ]}
              />
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default PatientFlow;
