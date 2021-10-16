import React, { useState, useEffect } from 'react';
import MainHeader from '../../components/header/MainHeader.jsx';
import SourceContents from '../../components/download/SourceContents.jsx';

import CalcPanel from '../../components/panel/CalcPanel.jsx';
import ConfigPanel from '../../components/panel/ConfigPanel.jsx';
import TokenizacaoPanel from '../../components/panel/TokenizacaoPanel.jsx';
import FilteringAndSetPanel from '../../components/panel/FilteringAndSetPanel.jsx';

import SourceEntity from '../../entities/SourceEntity.js'

import {
    Divider
} from "@material-ui/core";

export default function Home() {

  const [cardsSource, setCardsSource] = useState([new SourceEntity()]);

  const [configFilter, setConfigFilter] = useState({
    'rssHostDownload1': 'https://api.rss2json.com/v1/api.json',
    'rssHostParam1'   : 'rss_url',
    'minItemPerCard'   : 1,
    'minCharsPerItem'   : 0,
    'minDate'   : null,
    'maxDate'   : null,
    'targetField' : 'content',
    'targetCardForComparison' : '',
  });

  const [configToken, setConfigToken] = useState({
    'divider' : '[-.,;!?\\\(\)\"\' ]',
    'ngrams' : 1,
    'minLength' : 2,
    'case' : '',
  });

  useEffect(() => {
    setCardsSource(cardsSource)
  }, [cardsSource] )

  const setConfigFilterCallback = (newConfig) => {
    setConfigFilter(newConfig)
  }

  const setCardsSourceCallback = (objCollection) => {

    let newArray = [...objCollection];

    if(newArray[newArray.length - 1].get('status') !== 'new'){
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
        />

      <Divider variant="middle" />

      <div style={{ backgroundColor: '#75E6DA'}}>
        <CalcPanel 
          cardsInput={cardsSource} 
          configToken={configToken}
          configFilter={configFilter}
        />
      </div>
    </div>
  )
}