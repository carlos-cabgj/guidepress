import React from "react";
import Plot from 'react-plotly.js';

import randomColor from "randomcolor/randomColor";

const colorsHourPie = [
  'rgb(58, 46, 125)', //1 
  'rgb(90, 78, 156)', //2
  'rgb(39, 13, 181)', //3
  'rgb(13, 114, 181)', //4
  'rgb(0, 133, 173)', //5
  'rgb(11, 141, 212)', //6
  'rgb(145, 212, 11)', //7
  'rgb(205, 212, 11)', //8
  'rgb(237, 213, 59)', //9
  'rgb(255, 246, 84)', //10
  'rgb(255, 237, 145)',//11
  'rgb(209, 188, 77)', //12
  'rgb(245, 208, 15)', //13
  'rgb(252, 206, 106)', //14
  'rgb(252, 204, 144)', //15
  'rgb(255, 151, 23)', //16
  'rgb(201, 111, 0)', //17
  'rgb(201, 74, 0)', //18
  'rgb(115, 27, 0)', //19
  'rgb(110, 0, 35)', //20
  'rgb(110, 0, 82)', //21
  'rgb(110, 1, 88)', //22
  'rgb(121, 2, 212)', //23
  'rgb(63, 1, 110)', //00
];

export default function plotDataHours({ plotDataHours }) {

  const plotTfIdfByHours = () => {

    let axis_x = Object.keys(plotDataHours);
    let dataToPlot = [];

    axis_x.forEach((hour) => {
      let axis_y = [];
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