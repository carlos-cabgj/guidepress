import React, { useEffect, useState } from "react";

import {
  Button
} from "@material-ui/core";

import moment from 'moment'

import Typography from "@material-ui/core/Typography";
import { FormattedMessage } from 'react-intl';
import { calcTfIdfCards } from '../../services/Ai/TfIdf.js';


export default function CalcPanel({ 
  modelTree,
  modelTree2,
  setModelTree,
  setModelTree2,
  cardsInput, 
  configToken, 
  configFilter,
  setResults
}) {

  const [tfIdf, setTfIdf] = useState([]);

  const [limitCount] = useState(10);
  const [similarityList, setSimilarityList] = useState('');

  useEffect(() => {
    calcAll();
  }, [tfIdf])

  let selectedWeek = {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
  };

  const execCalcs = () => {
    let data = calcTfIdfCards(cardsInput, configToken, configFilter)
    setTfIdf(data);
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
    let cutTreeData = 0;
    let selectedAll = [];
    let selectedHours = [];
    let selectedPostsTime = {};

    counts['dataTree'] = [];

    tfIdf.forEach((card, cardIndex) => {
      ++counts['countFonts'];

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


        slicedResults.forEach((item, index) => {
          item['idCard'] = card['idCard'];
          item['posItem'] = cardTfIdf['posItem'];
          item['id'] = item['posItem']+'-'+card['idCard'];
          item['dataPub'] = cardTfIdf['pubDate'];
          item['categories'] = cardTfIdf['categories'];
          item['author'] = cardTfIdf['author'];
          item['day'] = day;
          item['hour'] = hour;
          slicedResults[index] = item
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

    let percentCutTFIDF = configFilter?.idfCut || 50;
    let percentCutTree = configFilter?.treeCut || 50;

    cutTfIdf = Math.round((selectedAll.length * percentCutTFIDF) / 100);

    selectedAll = selectedAll.sort(function (a, b) { return a['value'] - b['value'] })
    selectedAll.splice(0, cutTfIdf);

    cutTreeData = Math.round((selectedAll.length * percentCutTree) / 100);

    let dataToTreeFirstSelected = [];

    for(let z in selectedAll){
      let item = selectedAll[z]
      if(z > cutTreeData){
        dataToTreeFirstSelected.push(item);
      }
    }
    counts['countWordsUsedTree'] = dataToTreeFirstSelected.length

    let dataToTree        = [];
    let dataToTree2_byDoc = {};
    let dataToTree2       = [];
    let dataToTree2_keys  = [];
    
    // console.log(configFilter)
    // console.log(configFilter?.termSecondTree)
    // console.log(configToken)
    for(let z in selectedAll){
      let item = selectedAll[z]
      for(let x in dataToTreeFirstSelected){
        if(dataToTreeFirstSelected[x]['term'] === item['term']){
          item['hour'] = item['hour']+':00h'
          item['day'] = getDayName(item['day'])
          dataToTree.push(item);


          if(configFilter?.termSecondTree){
            if(!dataToTree2_byDoc[item['id']]){
              dataToTree2_byDoc[item['id']] = [];
            }
            dataToTree2_keys[item['term']] = false;
            dataToTree2_byDoc[item['id']].push(item['term'])
          }

          break;
        }
      }
    }

    if(configFilter?.termSecondTree){
      let termoEscolhidoParaSegundaArvore = configFilter?.termSecondTree

      for(let i in dataToTree2_byDoc){
        let part = {};
        let possuiOTermo = false;

        for(let b in dataToTree2_byDoc[i]){
          part[dataToTree2_byDoc[i][b]] =  dataToTree2_byDoc[i][b];
        }
        // console.log(part)
        // dataToTree2.push({...part});

        for(let p in part){
        // dataToTree2.push({...part});
          if(termoEscolhidoParaSegundaArvore == p){
            dataToTree2.push({...part, '000class##1' : true});
          }else{
            dataToTree2.push({...part, '000class##1' : false});
          }
        }
        // if(termoEscolhidoParaSegundaArvore == p){
        //   possuiOTermo = true;
        //   break
        // }
        // dataToTree2.push({...{...dataToTree2_keys, ...part}, '000class##1' : possuiOTermo}); 
      }
    }

    let keys = Object.keys(dataToTree2_keys)

    counts['countWordsUsed'] = selectedAll.length

    const selectedAllWihtoutDuplicates = selectedAll.filter(function (item, pos, arrayContent) {
      for (let a in arrayContent) {
        if (pos !== a &&
          item.term === arrayContent[a].term &&
          item.value < arrayContent[a].value) {
          return false
        }
      }
      return true;
    })

    let results = {
      modelTree           : calcDataTree(dataToTree),
      modelTree2          : calcDataTree2(dataToTree2, keys),
      countWordsUsedTree  : counts['countWordsUsedTree'],
      countWordsGenerated : counts['countWordsGenerated'],
      countWordsUsed      : counts['countWordsUsed'],
      countDocuments      : counts['countDocuments'],
      countFonts          : counts['countFonts'],
      plotDataPostTime    : selectedPostsTime,
      plotDataWeek        : selectedWeek,
      plotDataHours       : selectedHours,
      plotDataHours       : selectedHours,
      plotDataAll         : selectedAllWihtoutDuplicates,
    };

    if (configFilter['targetCardForComparison']) {
      let similarity = compareSources();
      setSimilarityList(similarity);
      results[similarityList] = similarity;
    }

    setResults(results);
  }


  const getDayName = (num) => {
    switch (num) {
      case 0:
        return 'segunda';
      case 1:
        return 'Terça';
      case 2:
        return 'Quarta';
      case 3:
        return 'Quinta';
      case 4:
        return 'Sexta';
      case 5:
        return 'Sábado';
      case 6:
        return 'Domingo';
      default :
        console.log('('+num+ ') Não é um número de dia da semana aceitável')
        break;
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

  function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
  }


  const calcDataTree2 = (data, keys) => {

    // console.log([...data])
    // console.log(configFilter?.termSecondTree)

    if(data.length <= 0 || !configFilter?.termSecondTree){
      return false;
    }else if(data.length < 2){
      alert('Não existem elementos o sufuciente para montar a árvore de decisão')
      return false;
    }

    var DecisionTree = require('decision-tree');

    data = shuffle(data)
    const totalCountData = data.length;
    let countTrainable = (totalCountData * configFilter.percentTrain / 100)

    var class_name    = "000class##1";
    // var class_name    = configFilter?.termSecondTree;
    let training_data = [];
    let test_data     = [];

    var features = keys;
    var dt;

    // if(Object.keys(modelTree2).length === 0 ){
    //   console.log(1)
      training_data = data.slice(0, countTrainable);
      test_data = data.slice(countTrainable);
      dt = new DecisionTree(training_data, class_name, features);
    // }else{
    //   console.log(2)
    //   dt = new DecisionTree(modelTree2.modelTree);
    //   test_data = data;
    // }

    // console.log(JSON.stringify(test_data))
    var accuracy = dt.evaluate(test_data);
    let modelInJson = dt.toJSON();
    // if(
    //     Object.keys(modelTree2).length === 0 || 
    //     configFilter.percentTrain !== modelTree2.modelTree.percentTrain
    //   ){
      modelInJson.date = moment(new Date()).format('Y-MM-DD HH:mm:ss');
      modelInJson.percentTrain = configFilter.percentTrain;
    // }else{
    //   console.log(modelTree2)
    //   modelInJson.date = modelTree2.modelTree.date;
    //   modelInJson.percentTrain = modelTree2.modelTree.percentTrain;
    // }

    let model = {
      accuracy: accuracy,
      modelTree: modelInJson
    };

    setModelTree2(model);
    return model;
  }

  const calcDataTree = (data) => {
        
    if(data.length <= 0){
      return false;
    }else if(data.length < 2){
      alert('Não existem elementos o sufuciente para montar a árvore de decisão')
      return false;
    }

    var DecisionTree = require('decision-tree');

    data = shuffle(data)
    const totalCountData = data.length;
    let countTrainable = (totalCountData * configFilter.percentTrain / 100)

    var class_name    = "term";
    let training_data = [];
    let test_data     = [];

    var features = ['hour', "day"];
    // var features = ["day", "term"];
    var dt;

    if(Object.keys(modelTree).length === 0 ){
      training_data = data.slice(0, countTrainable);
      test_data = data.slice(countTrainable);
      dt = new DecisionTree(training_data, class_name, features);
    }else{
      dt = new DecisionTree(modelTree.modelTree);
      test_data = data;
    }

    var accuracy = dt.evaluate(test_data);
    let modelInJson = dt.toJSON();

    if(
        Object.keys(modelTree).length === 0 || 
        configFilter.percentTrain !== modelTree.modelTree.percentTrain
      ){
      modelInJson.date = moment(new Date()).format('Y-MM-DD HH:mm:ss');
      modelInJson.percentTrain = configFilter.percentTrain;
    }else{
      modelInJson.date = modelTree.modelTree.date;
      modelInJson.percentTrain = modelTree.modelTree.percentTrain;
    }
    let model = {
      accuracy: accuracy,
      modelTree: modelInJson
    };

    setModelTree(model);
    return model;
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

    vector1.forEach((vector1Item, indexVector1) => {
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

    cardsToCompare.forEach((item) => {
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
        <br></br>
      <Typography variant="h5" gutterBottom>
        <FormattedMessage id="app.Calcs" />
        <br></br>
        <Button variant="contained" onClick={execCalcs} color="primary" style={{ margin: '0 5px' }}>
          Executar Cálculos
        </Button>
      </Typography>
        <br></br>
    </div>
  )
}