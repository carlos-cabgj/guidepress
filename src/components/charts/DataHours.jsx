import React from "react";
import Plot from 'react-plotly.js';

import randomColor from "randomcolor/randomColor";

export default function plotDataHours({ plotDataHours }) {

  const plotTfIdfByHours = () => {

    let axis_x = Object.keys(plotDataHours);
    let dataToPlot = [];

    axis_x.forEach((hour) => {
      if(plotDataHours[hour]){
        let array = plotDataHours[hour];
        array.sort((a,b)=> a['value'] - b['value']);
        array.forEach(
        (itemDay, indexDay) => {

          dataToPlot.push({
            x: [hour+"h"],
            y: [itemDay['value']],
            type: 'bar',
            name: itemDay['term'],
            marker: {color: randomColor({
              luminosity: 'dark',
              seed : indexDay,
            })},
          })
        })
      }
    })

    return <Plot
        data={dataToPlot}
        style={{width: "100%", height: "100%"}}
        config={{responsive: true}}
        layout={ {
          xaxis : { tickangle: -45},
          barmode: 'group',
          bargap :0.2,
          bargroupgap: 0.1,
            line: {
          width: 2.5,
          margin: 1
      },
          yaxis: {
            zeroline: true,
          },
          title: 'Melhores por Horário',
        } }
      />
  }

  return (
    <div>
      {plotTfIdfByHours()}
    </div>
  )
}