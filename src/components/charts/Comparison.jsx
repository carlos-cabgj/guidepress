import React from "react";
import Plot from 'react-plotly.js';
import randomColor from "randomcolor/randomColor";

export default function PlotComparison({ similarityList }) {

  const showComparison = () => {

    if(!similarityList){
      return '';
    }

    let axis_x = [];
    let axis_y = [];

    for(let idCard in similarityList){
      axis_x.push(idCard);
      axis_y.push(similarityList[idCard]['mean']);
    }

    let dataToPlot = [
      {
        x : axis_x, 
        y : axis_y,
        type: 'bar',
        mode: 'lines+markers',
        marker: {color: randomColor()},
      }
    ];

    return 
      <Plot
        data={dataToPlot}
        style={{width: "100%", height: "100%"}}
        useResizeHandler={true}
        layout={ {title: 'Fontes com conteúdo mais similaridades'} }
      />
  }

  return (
    <div>
      {showComparison()}
    </div>
  )
}