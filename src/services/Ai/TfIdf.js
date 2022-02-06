export function calcTfIdfCards (cards, configToken = {}, configFilter = {}) {

  let results = [];

  for(let a in cards){
    if(cards[a].get('status') !== 'new' && cards[a].get('active')){
      let tf = extractTfAllDocuments(cards[a], configToken, configFilter.targetField);
      let dataCard = {
        'idCard' : cards[a].get('id'),
        'category' : cards[a].get('category'),
        'tf'  : tf,
        'idf' : defineIdf(tf)
      }
      results.push(dataCard);
    }
  }

  calcTfIDFFromTfCard(results)
  return results;
}

function calcTfIDFFromTfCard(dataTreated)
{
  dataTreated.forEach((card, cardIndex) => {

    dataTreated[cardIndex]['tf-idf'] = [];

    for(let a in card['tf']){

      let newResults = []

      let dataSet = card['tf'][a]['results'];

      for(let d in dataSet){
        if(dataTreated[cardIndex]['idf'][d]){
          let tfidf = dataSet[d] * dataTreated[cardIndex]['idf'][d];

            newResults.push({
              term : d,
              value : tfidf
            })
        }
      }

      dataTreated[cardIndex]['tf-idf'].push({
        results   : newResults,
        posItem   : card['tf'][a].posItem,
        pubDate   : card['tf'][a].pubDate,
        categories: card['tf'][a].categories,
        author    : card['tf'][a].author
      });
    }
  })
}

function extractTfAllDocuments(card, configToken, propertyChoosed)
{
  let items = card.get('items');
  let results = [];

  for(let i in items){
  // 
    let termsCaseTreated = makeTokens(configToken, items[i][propertyChoosed]);

    results.push({
      'results' : calcTf(
        addTermsToDictionary(termsCaseTreated, {}, 2)
      ),
      'posItem' : i,
      'author' :  items[i]['author'],
      'categories' :  chooseCategories(items[i]['categories']),
      'pubDate' : items[i]['pubDate'] || ''
    })
  }
  return results;
}

function chooseCategories($field){
  if(typeof $field === 'object'){
    return $field.join('-');
  }else{
    return $field || '';
  }
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

function calcTf(words){
  let tf = {};
  let wordsLength = Object.keys(words).length;

  for(let a in words){
    tf[a] = words[a] / wordsLength;
  }
  return tf;
}

function defineIdf(tfResults){

  let wordsPerText = {};
  let idf = {};

  let qtdTexts = Object.keys(tfResults).length;

  for(let a in tfResults){
    addTermsToDictionary(Object.keys(tfResults[a]['results']), wordsPerText)
  }

  for(let a in wordsPerText){
    idf[a] = Math.log(qtdTexts / wordsPerText[a]);
  }

  return idf;
}

function makeTokens(args, text = '')
{
  let fieldData = text.replace(/&lt;/g, '<', 'g');
  fieldData = fieldData.replace(/&gt;/g, ">");
  fieldData = fieldData.replace(/<[^>]*>/gi, "").trim();
  let fieldDatawithoutInvisible = fieldData.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');

  let divider   = args['divider'];
  let textCase  = args['case'] ? args['case'] : null;
  let minLength = args['minLength'] ? args['minLength'] : 1;
  let ngrams    = args['ngrams'] ? args['ngrams'] : 1;
  
  let choosedFieldFiltered = fieldDatawithoutInvisible.trim();
  var expression           = new RegExp(divider, 'gi');
  let termsSplited         = choosedFieldFiltered.split(expression);
  
  let termsMinLength = [];

  for(let i in termsSplited){
    if(termsSplited[i].length >= minLength){
      termsMinLength.push(termsSplited[i])
    }
  }
      
  let termsCaseTreated = termsMinLength.map(
    (item) => 
      textCase === 'lower' ?
        item.toLowerCase() : textCase === 'upper' ?
          item.toUpperCase() : item
  );

  let stopWords = args['stopWords'].split(',');

  let dataWithNgrams = applyNgrams(
    applyStopWords(stopWords, termsCaseTreated),
    ngrams
  );


  let finalData = !args['stopWords'] ? 
    dataWithNgrams : 
    applyStopWords(stopWords, dataWithNgrams);

  return finalData;
}

function applyStopWords(stopWords, arrayOfSplitedData){
  return arrayOfSplitedData.filter((term) => { 
    for(let a in stopWords){
      if(stopWords[a] === term){
        return false;
      }
    }
    return true;
  });
}

function applyNgrams(arrayOfSplitedData, ngrams){
  let newArray = [];
  for(let a = 0; a + ngrams < arrayOfSplitedData.length; ++a){
    let newString = '';
    for(let i = 0; i  < ngrams; ++i){
      newString += (i === 0 ? '' : ' ') + arrayOfSplitedData[a + i];
    }
    newArray.push(newString);
  }
  return newArray;
}