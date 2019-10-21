import React from "react";
import { Bar } from "react-chartjs-2";

const BOOKINGS_BUCKET = {
  Cheap: { min: 0, max: 100 },
  Normal: { min: 100, max: 200 },
  Expensive: { min: 200, max: 100000000 }
};

const bookingChart = props => {
  let output = [];
  const charData = { labels: [], datasets: [] };

  for (const bucket in BOOKINGS_BUCKET) {
    const filteredBookingsCount = props.bookings.reduce((prev, current) => {
      if (
        current.event.price > BOOKINGS_BUCKET[bucket].min &&
        current.event.price < BOOKINGS_BUCKET[bucket].max
      )
        return prev + 1;
      else return prev;
    }, 0);
    charData.labels.push(bucket);
    output.push(filteredBookingsCount);
  }
  console.log(output);
  charData.datasets.push({
    label: "Booking Price Chart",
    backgroundColor: "rgba(255,99,132,0.2)",
    borderColor: "rgba(255,99,132,1)",
    borderWidth: 1,
    hoverBackgroundColor: "rgba(255,99,132,0.4)",
    hoverBorderColor: "rgba(255,99,132,1)",
    data: output
  });
  console.log(charData);
  return (
    <Bar
      data={charData}
      options={{
        scales: {
          yAxes: [
            {
              ticks: {
                min: 0
              }
            }
          ]
        }
      }}
    />
  );
};
export default bookingChart;
