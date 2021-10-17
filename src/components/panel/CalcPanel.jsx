import React, { useEffect, useState } from "react";
import Plot from 'react-plotly.js';

import {
  Button,
  Grid
} from "@material-ui/core";

import Typography from "@material-ui/core/Typography";
import randomColor from "randomcolor/randomColor";
import { FormattedMessage } from 'react-intl';
import { calcTfIdfCards } from '../../services/Ai/TfIdf.js';

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

export default function CalcPanel({ cardsInput, configToken, configFilter}) {

  const [tfIdf, setTfIdf] = useState([]);

  const [plotDataWeek, setPlotDataWeek] = useState({});
  const [plotDataHours, setPlotDataHours] = useState([]);
  const [plotDataAll, setPlotDataAll] = useState([]);
  const [plotDataPosttTime, setPlotDataPostTime] = useState([]);

  const [countWordsGenerated, setWordsGenerated] = useState(0);
  const [countWordsUsed, setWordsUsed] = useState(0);
  const [countDocuments, setCountDocuments] = useState(0);
  const [countFonts, setCountFonts] = useState(0);

  const [limitCount] = useState(10);
  const [similarityList, setSimilarityList] = useState('');

  let selectedWeek = {
    0 : [], 
    1 : [],
    2 : [], 
    3 : [],
    4 : [], 
    5 : [],
    6 : [], 
  };

  useEffect(() => {
    calcAll();
  }, [tfIdf] )

  const execCalcs = () => {
    let data = calcTfIdfCards(cardsInput, configToken, configFilter)
    setTfIdf(data);
  }

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
    return <Grid item xs={12}>
      <Plot
        data={dataToPlot}
        style={{width: "100%", height: "100%"}}
        useResizeHandler={true}
        layout={ {title: 'Fontes com conteúdo mais similaridades'} }
      />
    </Grid>
  }

  const calcAll = () => {
    let counts = {
      countWordsGenerated : 0,
      countWordsUsed : 0,
      countDocuments : 0,
      countFonts : 0,
    };

    let selectedAll = [];
    let selectedHours = [];
    let selectedPostsTime = {};

    tfIdf.forEach((card, cardIndex) => {
      ++counts['countFonts'];

      card['tf-idf'].forEach((cardTfIdf) => {
        let results = cardTfIdf['results'];

        ++counts['countDocuments'];
        counts['countWordsGenerated'] = counts['countWordsGenerated'] + results.length;

        results.sort(function(a, b){ return b['value'] - a['value'] })

        let slicedResults = results.slice(0, limitCount);

        slicedResults.map(item => item['dataPub'] = cardTfIdf['pubDate'])

        selectedAll = selectedAll.concat(slicedResults);

        let day = new Date(cardTfIdf.pubDate).getDay();
        let hour = new Date(cardTfIdf.pubDate).getHours();

        selectedWeek[day] = selectedWeek[day] = slicedResults; 
        selectedHours[hour] = selectedHours[hour] ?
        selectedHours[hour].concat(slicedResults) : slicedResults

        if(!selectedPostsTime[hour]){
          selectedPostsTime[hour] = 0;
        }  
        ++selectedPostsTime[hour];
      })
    })

    selectedAll = selectedAll.sort(function(a, b){ return a['value'] - b['value'] })
    counts['countWordsUsed'] = selectedAll.length
    const selectedAllWihtoutDuplicates = selectedAll.filter(function(item, pos, arrayContent){ 
      for(let a in arrayContent){
        if(pos != a && 
            item.term === arrayContent[a].term && 
            item.value < arrayContent[a].value){
          return false
        }
      }
      return true;
    })


    setWordsGenerated(counts['countWordsGenerated']);
    setWordsUsed(counts['countWordsUsed']);
    setCountDocuments(counts['countDocuments']);
    setCountFonts(counts['countFonts']);

    setPlotDataPostTime(selectedPostsTime);
    setPlotDataWeek(selectedWeek);
    setPlotDataHours(selectedHours);
    setPlotDataAll(selectedAllWihtoutDuplicates);

    if(configFilter['targetCardForComparison']){
      let similarity = compareSources();
      setSimilarityList(similarity);
    }
  }

  const getVectorFormat = () => {
    let vectorFormat = [];
    tfIdf.forEach((card, cardIndex) => {

      card['tf-idf'].forEach((cardTfIdf) => {

        let results = cardTfIdf['results'];

        results.forEach((result) => {
        
          let unique = true;
          vectorFormat.forEach((item) => {
        
            if(item['term'] === result['term'].toLowerCase()){
              unique = false;
            }
          })

          if(unique){
            vectorFormat.push({'term' : result['term'].toLowerCase(), value : 0});
          }
        })
      })
    })

    return vectorFormat;
  }

  const formatDocumentsWithVectors = (vectorFormat) => {

    let cardChoosed = null;
    let cardsToCompare = [];
    let formatToDecript = JSON.stringify(vectorFormat); 

    tfIdf.forEach((card, cardIndex) => {

      let cardsToCompareVector = {
        idCard : card['idCard'],
        docsWithVector : [],
      }

      card['tf-idf'].forEach((cardTfIdf) => {

        let document = { 
          'vector' : [],
          'pubDate' : cardTfIdf['pubDate'],
          'postItem' : cardTfIdf['posItem']
        }
        let newVector = JSON.parse(formatToDecript);

        cardTfIdf['results'].forEach((result) => {
          newVector.forEach((item, index) => {
            if(item['term'] === result['term'].toLowerCase()){
              newVector[index]['value'] = result['value'];
            }
          })
        })
        document['vector'] = newVector;
        cardsToCompareVector['docsWithVector'].push(document);
      })

      if(card['idCard'] === configFilter['targetCardForComparison']){
        cardChoosed = {...cardsToCompareVector};
      }else{
        cardsToCompare.push(cardsToCompareVector); 
      }
    })
    return [cardChoosed, cardsToCompare]
  }

  const calcMagnitudeVector = (vector) => {
    return Math.sqrt(vector.reduce((acumulator, value) => {
      return value**2 + acumulator;
    }))
  }

  const calcCosSimilarity = (vector1, magnitude1, vector2) => 
  {
    let product = 0;

    vector1.map((vector1Item, indexVector1) => {
      product += vector1Item * vector2[indexVector1];
    })

    let magnitude2 = calcMagnitudeVector(vector2);

    return product / (magnitude1 * magnitude2)
  }

  const compareSources = (choosedSource) => {

    let [cardChoosed, cardsToCompare] = formatDocumentsWithVectors(getVectorFormat()) 

    let choosed = cardChoosed['docsWithVector'].map(item => {
      let vector =  item['vector'].map((item) => {
        return item['value'];
      });
      return {
        vector : vector, 
        magnitude : calcMagnitudeVector(vector)
      };
    });

    let similarity = {};

    cardsToCompare.map((item) => {

      let vectorToCompare = item['docsWithVector'].map(item => {
        let vector = item['vector'].map((item) => {
          return item['value'];
        });
        return {
          vector : vector, 
          magnitude : calcMagnitudeVector(vector)
        };
      });

      let listResults = [];

      choosed.forEach((itemChoosed) => {
        let listFirstResult = vectorToCompare.map(item => {
          return calcCosSimilarity(
              itemChoosed['vector'], 
              itemChoosed['magnitude'], 
              item['vector']
            );
        });
        listFirstResult.sort((a,b)=>b-a);
        listResults.push(listFirstResult[0])
      })

      similarity[item['idCard']] = {
        listResults : listResults,
        mean : listResults.reduce((acumulator, value) => {
          return value + acumulator;
        })/listResults.length
      }
    });

    return similarity;
  }

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
      <Typography variant="h5" gutterBottom>
        <FormattedMessage id="app.Calcs" />
        <Button variant="contained" onClick={execCalcs} color="primary" style={{margin:'0 5px'}}>
          Executar Cálculos
        </Button>
      </Typography>
        <div id="linear">
          <div className="chart"></div>
          <div className="status"></div>
          <div id="modelInspectionOutput">
            <p id="inspectionHeadline"></p>
            <table id="myTable"></table>
          </div>
        </div>
        <Grid container spacing={2}>          
          <Grid item xs={12}>
            Quantas palavras geradas : {countWordsGenerated}
            <br/>
            Quantas palavras apresentadas : {countWordsUsed}
            <br/>
            Quanto documentos analisados : {countDocuments}
            <br/>
            Quantas fontes analisadas : {countFonts}
          </Grid>
            {showComparison()}
          <Grid item xs={12}>
            {plotPostTime()}
          </Grid>
          <Grid item xs={12}>
            {plotTfIdfByAll()}
          </Grid>
          <Grid item xs={12}>
            {plotTfIdfByWeek()}
          </Grid>
          <Grid item xs={12}>
            {plotTfIdfByHours()}
          </Grid>

        </Grid>
    </div>
  )
}