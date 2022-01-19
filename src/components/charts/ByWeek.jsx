import React from "react";
import Plot from 'react-plotly.js';
import randomColor from "randomcolor/randomColor";

export default function PlotByWeek({ plotDataWeek }) {

  const plotTfIdfByWeek = () => {

    let dataToPlot = [];
    let months = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom']
    let daysColors = {'Seg':'yellow', 'Ter':'black', 'Qua':'purple', 'Qui':'red', 'Sex':'green', 'Sab':'pink', 'Dom':'blue'}

    months.forEach((item, index) => {
      plotDataWeek[index] && plotDataWeek[index].forEach((itemDay) => {
        dataToPlot.push({
          x: [months[index]],
          y: [itemDay['value']],
          type: 'bar',
          name: itemDay['term'],
          marker: {color: randomColor({luminosity: 'dark', hue: daysColors[months[index]]})},
        })
      })
    })

    return <Plot
        data={dataToPlot}
        style={{width: "100%", height: "100%"}}
        layout={ {
          barmode:"group",
          bargap :0.2,
          bargroupgap: 0.1,
          title: 'Melhores por dia da semana'
        } }
      />
  }

  return (
    <div>
      {plotTfIdfByWeek(plotDataWeek)}
    </div>
  )
}