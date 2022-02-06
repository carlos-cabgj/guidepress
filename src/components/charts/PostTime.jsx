import React from "react";
import Plot from 'react-plotly.js';

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

export default function PostTime({ plotDataPosttTime }) {

  function ksort(obj) {
    if (!obj || typeof (obj) != 'object') {
      return [];
    }
    var keys = [], values = [];

    for (let a in obj) {
      keys.push(a);
    }

    keys = keys.reverse();

    for (let i = 0; i < keys.length; i++) {
      values.push(obj[keys[i]]);
    }

    return [keys, values];
  }

  const plotPostTime = () => {

    let [labels, values] = ksort(plotDataPosttTime);

    for(let a in labels){
      labels[a] = labels[a]+'h';
    }

    let dataToPlot = [
      {
        values : values, 
        labels : labels,
        type: 'pie',
        hole: .2,
        mode: 'label+percent+name',
        textinfo: "label+value+percent",
        textposition: "inside",
        automargin: false,
        marker: {colors: colorsHourPie},
      }
    ];

    return <Plot
        data={dataToPlot}
        style={{width: "100%", height: "100%"}}
        useResizeHandler={false}
        layout={ {
          title: 'Horários com mais publicações',
          showlegend: true,
        } }
      />
  }

  return (
    <div>
      {plotPostTime()}
    </div>
  )
}