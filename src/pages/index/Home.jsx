import React, { useState, useEffect } from 'react';
import MainHeader from '../../components/header/MainHeader.jsx';
import SourceContents from '../../components/download/SourceContents.jsx';

import CalcPanel from '../../components/panel/CalcPanel.jsx';
import ConfigPanel from '../../components/panel/ConfigPanel.jsx';
import TokenizacaoPanel from '../../components/panel/TokenizacaoPanel.jsx';
import FilteringAndSetPanel from '../../components/panel/FilteringAndSetPanel.jsx';

import SourceEntity from '../../entities/SourceEntity'

import {
    Divider
} from "@material-ui/core";

export default function Home({setResults}) {

  const [cardsSource, setCardsSource] = useState([
    new SourceEntity(),
  ]);

  const [configFilter, setConfigFilter] = useState({
    'rssHostDownload1': 'https://api.rss2json.com/v1/api.json',
    'rssHostParam1'   : 'rss_url',
    'minItemPerCard'   : 1,
    'minCharsPerItem'   : 0,
    'minDate'   : null,
    'maxDate'   : null,
    'targetField' : 'content',
    'targetCardForComparison' : '',
    'termSecondTree' : '',
    'idfCut' : 5,
    'treeCut' : 0,
    'percentTrain' : 50
  });

  const [configToken, setConfigToken] = useState({
    'divider' : '[-.,;!?\\\(\)\"\' ]',
    'ngrams' : 1,
    'minLength' : 2,
    'case' : 'lower',
    'stopWords' : 'de,em,os',
  });

  const [modelTree, setModelTree] = useState({});
  const [modelTree2, setModelTree2] = useState({});

  const setConfigFilterCallback = (newConfig) => {
    setConfigFilter(newConfig)
  }

  const setCardsSourceCallback = (objCollection) => {

    let newArray = [...objCollection];

    if(newArray.length === 0 || newArray[newArray.length - 1].get('status') !== 'new'){
      newArray.push(new SourceEntity());
    }

    setCardsSource(newArray)
  }

  const setConfigTokenCallback = (data) => {
    setConfigToken(data)
  }

  return (
    <div>
      <MainHeader/>

      <SourceContents cardsInput={cardsSource} setCardsInput={setCardsSourceCallback}/>

      <Divider variant="middle" />

      <div style={{ backgroundColor: '#D4F1F4'}}>
        <ConfigPanel 
          configInput={configFilter}
          modelTree={modelTree}
          modelTree2={modelTree2}
          setModelTree={setModelTree}
          setModelTree2={setModelTree2}
          cardsInput={cardsSource} 
          configToken={configToken}
          setConfigFilterCallback={setConfigFilterCallback} 
          setCardsSourceCallback={setCardsSourceCallback}
          setConfigTokenCallback={setConfigTokenCallback}
          />
      </div>
      <Divider variant="middle" />

      <TokenizacaoPanel 
        configToken={configToken} 
        callbackLoadData={setConfigTokenCallback}/>

      <Divider variant="middle" />

      <FilteringAndSetPanel 
        cardsSource={cardsSource} 
        configInput={configFilter}
        setConfigFilterCallback={setConfigFilterCallback} 
        tree={modelTree}
        setTree={setModelTree}
        tree2={modelTree2}
        setTree2={setModelTree2}
        />

      <Divider variant="middle" />

      <div style={{ backgroundColor: '#75E6DA'}}>
        <CalcPanel 
          modelTree={modelTree}
          modelTree2={modelTree2}
          setModelTree={setModelTree}
          setModelTree2={setModelTree2}
          cardsInput={cardsSource} 
          configToken={configToken}
          configFilter={configFilter}
          setResults={setResults}
        />
      </div>
    </div>
  )
}