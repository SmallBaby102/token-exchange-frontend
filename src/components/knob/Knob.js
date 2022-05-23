import React from "react";
import { Doughnut } from "react-chartjs-2";

const Knob = ({ data }) => {
  return (
    <Doughnut
      data={data}
      options={{
        legend: {
          display: false,
        },
        rotation: 1 * Math.PI,
        circumference: 1 * Math.PI,
        cutoutPercentage: 93,
        maintainAspectRatio: true,
        hover: false,
        tooltips: {
          enabled: false,
        },
      }}
    />
  );
};

export default Knob;
