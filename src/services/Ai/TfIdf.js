import * as tf from '@tensorflow/tfjs';

export function runModel () {
  // Define a model for linear regression.
  const model = tf.sequential();
  model.add(tf.layers.dense({units: 1, inputShape: [1]}));

  // Prepare the model for training: Specify the loss and the optimizer.
  model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

  // Generate some synthetic data for training.
  const xs = tf.tensor2d([1, 2, 3, 4], [4, 1]);
  const ys = tf.tensor2d([1, 3, 5, 7], [4, 1]);

  // Train the model using the data.
  model.fit(xs, ys).then(() => {
    // Use the model to do inference on a data point the model hasn't seen before:
    model.predict(tf.tensor2d([5], [1, 1])).print();
  });
}

export function calcTfIdfCards (cards, propertyChoosed = 'title') {

  let results = {
    'tf'  : [],
    'idf' : []
  };

  let wordsPerText = {};

  for(let a in cards){
    if(cards[a].get('status') !== 'new'){
      let items = cards[a].get('items');
      for(let i in items){

        let termsCaseTreated = makeToken(items[i][propertyChoosed], 'lower', 2);

        setWordEncounterPerText(termsCaseTreated, wordsPerText);

        results['tf'][a+'-'+ i] = defineTf(
          addTermsToDictionary(termsCaseTreated, {}, 2)
        ) 
      }
    }
  }

  results['idf'] = defineIdf(results['tf'], wordsPerText);
  console.log(results)
  return results;
}

function setWordEncounterPerText(terms, words){
  for(let a in terms){
    words[terms[a]] = words[terms[a]] ? words[terms[a]] + 1 : 1;
  }
}

function defineIdf(tfResults, wordsPerText){

  let qtdTexts = Object.keys(tfResults).length;
  let idf = {};

  for(let a in wordsPerText){
    idf[a] = Math.log(qtdTexts / wordsPerText[a]);
  }
  return idf;
}

function defineTf(words){
  let tf = {};
  let wordsLength = Object.keys(words).length;

  for(let a in words){
    tf[a] = words[a] / wordsLength;
  }
  return tf;
}

function makeToken($fieldData, textCase = '', minLength = 1){
  let choosedFieldFiltered = $fieldData.trim();
  // let termsSplited         = choosedFieldFiltered.split(\[., -]\);
  let termsSplited         = choosedFieldFiltered.split(/[., -]/);
      termsSplited         = termsSplited.map((item) => item.length < minLength ? '' : item);
  return termsSplited.map((item) => textCase === 'lower' ? item.toLowerCase() : textCase === 'upper' ? item.toUpperCase() : item);
}

function addTermsToDictionary(terms, dictionary){
  for(let a in terms){

    if(terms[a] === ''){ continue; }

    if(dictionary[terms[a]]){
      dictionary[terms[a]] = dictionary[terms[a]] + 1; 
    }else{
      dictionary[terms[a]] = 1; 
    }
  }
  return dictionary;
}