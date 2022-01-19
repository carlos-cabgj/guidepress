import React, { useEffect, useState } from "react";

import {
  Button,
  Grid
} from "@material-ui/core";


import PlotByWeek from '../charts/ByWeek';
import PlotDataHours from '../charts/DataHours';
import PlotTfIdfByAll from '../charts/TfIdfByAll';
import PlotPostTime from '../charts/PostTime';
import PlotComparison from '../charts/Comparison';
import PlotTree from '../charts/Tree';

import Typography from "@material-ui/core/Typography";
import { FormattedMessage } from 'react-intl';
import { calcTfIdfCards } from '../../services/Ai/TfIdf.js';


export default function CalcPanel({ cardsInput, configToken, configFilter }) {

  const [tfIdf, setTfIdf] = useState([]);

  const [plotDataWeek, setPlotDataWeek] = useState({});
  const [plotDataHours, setPlotDataHours] = useState([]);
  const [plotDataAll, setPlotDataAll] = useState([]);
  const [plotDataPosttTime, setPlotDataPostTime] = useState([]);

  const [dataTree, setDataTree] = useState([]);

  const [countWordsGenerated, setWordsGenerated] = useState(0);
  const [countWordsUsed, setWordsUsed] = useState(0);
  const [countDocuments, setCountDocuments] = useState(0);
  const [countFonts, setCountFonts] = useState(0);

  const [limitCount] = useState(10);
  const [similarityList, setSimilarityList] = useState('');

  let selectedWeek = {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
  };

  useEffect(() => {
    calcAll();
  }, [tfIdf])

  const execCalcs = () => {
    let data = calcTfIdfCards(cardsInput, configToken, configFilter)
    setTfIdf(data);
  }

  let transInt = {};
  const transStringToInt = (tipo, value) => {
    if (!transInt[tipo]) {
      transInt[tipo] = {};
    }
    if (transInt[tipo][value]) {
      return transInt[tipo][value];
    } else {
      return transInt[tipo][value] = Object.keys(transInt[tipo]).length + 1;
    }
  }

  const calcAll = () => {
    let counts = {
      countWordsGenerated: 0,
      countWordsUsed: 0,
      countDocuments: 0,
      countFonts: 0,
    };

    let minValueTfIdf;
    let maxValueTfIdf;
    let cutTfIdf = 0;
    let selectedAll = [];
    let selectedHours = [];
    let selectedPostsTime = {};

    counts['dataTree'] = [];

    tfIdf.forEach((card, cardIndex) => {
      ++counts['countFonts'];

      // console.log(card)
      card['tf-idf'].forEach((cardTfIdf) => {
        let results = cardTfIdf['results'];

        ++counts['countDocuments'];
        counts['countWordsGenerated'] = counts['countWordsGenerated'] + results.length;

        results.sort(function (a, b) { return b['value'] - a['value'] })

        minValueTfIdf = minValueTfIdf < results[results.length - 1]['value'] ?
          minValueTfIdf : results[results.length - 1]['value'];

        maxValueTfIdf = maxValueTfIdf > results[0]['value'] ?
          maxValueTfIdf : results[0]['value'];

        let slicedResults = results.slice(0, limitCount);
        let day = new Date(cardTfIdf.pubDate).getDay();
        let hour = new Date(cardTfIdf.pubDate).getHours();

        slicedResults.map((item) => {
          item['dataPub'] = cardTfIdf['pubDate'];
          item['categories'] = cardTfIdf['categories'];
          item['author'] = cardTfIdf['author'];
          item['day'] = day;
          item['hour'] = hour;
        })

        selectedAll = selectedAll.concat(slicedResults);

        selectedWeek[day] = selectedWeek[day] = slicedResults;
        selectedHours[hour] = selectedHours[hour] ?
          selectedHours[hour].concat(slicedResults) : slicedResults

        if (!selectedPostsTime[hour]) {
          selectedPostsTime[hour] = 0;
        }
        ++selectedPostsTime[hour];
      })
    })

    let percentCutTree = 10;

    cutTfIdf = (((maxValueTfIdf - minValueTfIdf) * percentCutTree) / 100) + minValueTfIdf;

    selectedAll = selectedAll.sort(function (a, b) { return a['value'] - b['value'] })
    const dataToTree = selectedAll
      .filter((item) => item.value > cutTfIdf)
      .map((item) => {
        return item;
      });

    counts['countWordsUsed'] = selectedAll.length
    const selectedAllWihtoutDuplicates = selectedAll.filter(function (item, pos, arrayContent) {
      for (let a in arrayContent) {
        if (pos != a &&
          item.term === arrayContent[a].term &&
          item.value < arrayContent[a].value) {
          return false
        }
      }
      return true;
    })

    calcDataTree(dataToTree)

    setWordsGenerated(counts['countWordsGenerated']);
    setWordsUsed(counts['countWordsUsed']);
    setCountDocuments(counts['countDocuments']);
    setCountFonts(counts['countFonts']);

    setPlotDataPostTime(selectedPostsTime);
    setPlotDataWeek(selectedWeek);
    setPlotDataHours(selectedHours);
    setPlotDataAll(selectedAllWihtoutDuplicates);

    if (configFilter['targetCardForComparison']) {
      let similarity = compareSources();
      setSimilarityList(similarity);
    }
  }

  const shiftStringsToKeys = (array) => {
    let keys = {};
    let newArray = [];

    array.forEach(item => {
      if (!keys[item]) {
        keys[item] = Object.keys(keys).length + 1;
      }
      newArray.push(keys[item]);
    })
    return newArray;
  }

  const removeSingleFeatures = (array) => {

    let checkArray = [...array[0]];
    let newArray = [];

    array.forEach(item => {
      item.forEach((subItem, index) => {
        if (checkArray[index] !== subItem) {
          checkArray[index] = true;
        }
      })
    })

    array.forEach(item => {
      let newItem = [];
      checkArray.forEach((checkValue, index) => {
        if (checkArray[index] === true) {
          newItem.push(item[index]);
        }
      })
      newArray.push(newItem);
    })

    return newArray;
  }

  const getVectorFormat = () => {
    let vectorFormat = [];
    tfIdf.forEach((card, cardIndex) => {

      card['tf-idf'].forEach((cardTfIdf) => {

        let results = cardTfIdf['results'];

        results.forEach((result) => {

          let unique = true;
          vectorFormat.forEach((item) => {

            if (item['term'] === result['term'].toLowerCase()) {
              unique = false;
            }
          })

          if (unique) {
            vectorFormat.push({ 'term': result['term'].toLowerCase(), value: 0 });
          }
        })
      })
    })

    return vectorFormat;
  }

  const calcDataTree = (data) => {

    var DecisionTree = require('decision-tree');
    let training_data = data.slice(0, 50);
    let test_data = data.slice(50);

    var class_name = "term";

    var features = ["day", 'hour'];

    var dt = new DecisionTree(training_data, class_name, features);

    var accuracy = dt.evaluate(test_data);


    setDataTree({
      accuracy: accuracy,
      modelTree: dt.toJSON()
    });
  }

  const formatDocumentsWithVectors = (vectorFormat) => {

    let cardChoosed = null;
    let cardsToCompare = [];
    let formatToDecript = JSON.stringify(vectorFormat);

    tfIdf.forEach((card, cardIndex) => {

      let cardsToCompareVector = {
        idCard: card['idCard'],
        docsWithVector: [],
      }

      card['tf-idf'].forEach((cardTfIdf) => {

        let document = {
          'vector': [],
          'pubDate': cardTfIdf['pubDate'],
          'postItem': cardTfIdf['posItem']
        }
        let newVector = JSON.parse(formatToDecript);

        cardTfIdf['results'].forEach((result) => {
          newVector.forEach((item, index) => {
            if (item['term'] === result['term'].toLowerCase()) {
              newVector[index]['value'] = result['value'];
            }
          })
        })
        document['vector'] = newVector;
        cardsToCompareVector['docsWithVector'].push(document);
      })

      if (card['idCard'] === configFilter['targetCardForComparison']) {
        cardChoosed = { ...cardsToCompareVector };
      } else {
        cardsToCompare.push(cardsToCompareVector);
      }
    })
    return [cardChoosed, cardsToCompare]
  }

  const calcMagnitudeVector = (vector) => {
    return Math.sqrt(vector.reduce((acumulator, value) => {
      return value ** 2 + acumulator;
    }))
  }

  const calcCosSimilarity = (vector1, magnitude1, vector2) => {
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
      let vector = item['vector'].map((item) => {
        return item['value'];
      });
      return {
        vector: vector,
        magnitude: calcMagnitudeVector(vector)
      };
    });

    let similarity = {};

    cardsToCompare.map((item) => {

      let vectorToCompare = item['docsWithVector'].map(item => {
        let vector = item['vector'].map((item) => {
          return item['value'];
        });
        return {
          vector: vector,
          magnitude: calcMagnitudeVector(vector)
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
        listFirstResult.sort((a, b) => b - a);
        listResults.push(listFirstResult[0])
      })

      similarity[item['idCard']] = {
        listResults: listResults,
        mean: listResults.reduce((acumulator, value) => {
          return value + acumulator;
        }) / listResults.length
      }
    });

    return similarity;
  }

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        <FormattedMessage id="app.Calcs" />
        <Button variant="contained" onClick={execCalcs} color="primary" style={{ margin: '0 5px' }}>
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
          <br />
          Quantas palavras apresentadas : {countWordsUsed}
          <br />
          Quanto documentos analisados : {countDocuments}
          <br />
          Quantas fontes analisadas : {countFonts}
        </Grid>
        <Grid item xs={12}>
          <PlotTree dataToPlot={dataTree} />
        </Grid>
        <Grid item xs={12}>
          <PlotComparison similarityList={similarityList} />
        </Grid>
        <Grid item xs={12}>
          <PlotPostTime plotDataPosttTime={plotDataPosttTime} />
        </Grid>
        <Grid item xs={12}>
          <PlotTfIdfByAll plotDataAll={plotDataAll} />
        </Grid>
        <Grid item xs={12}>
          <PlotByWeek plotDataWeek={plotDataWeek} />
        </Grid>
        <Grid item xs={12}>
          <PlotDataHours plotDataHours={plotDataHours} />
        </Grid>
      </Grid>
    </div>
  )
}