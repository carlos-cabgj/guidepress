import React from "react";
import Plot from 'react-plotly.js';

export default function TfIdfByAll({ plotDataAll }) {

  const plotTfIdfByAll = () => {

    let axis_x = plotDataAll.map(item => item['term']);
    let axis_y = plotDataAll.map(item => item['value']);

    let dataToPlot = [
      {
        x : axis_x, 
        y : axis_y,
        mode: 'lines+markers',
        marker: {color: 'red'},
      }
    ];

    return <Plot
        data={dataToPlot}
        style={{width: "100%", height: "100%"}}
        useResizeHandler={true}
        layout={ {
          title: 'Mais bem avaliados'
        } }
      />
  }

  return (
    <div>
      {plotTfIdfByAll()}
    </div>
  )
}