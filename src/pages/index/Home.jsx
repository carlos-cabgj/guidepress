import { useState } from 'react';
// import {runModel} from '../../services/Ai/Main.js';
import MainHeader from '../../components/header/MainHeader.jsx';
import DataContents from '../../components/download/DataContents.jsx';

import CalcPanel from '../../components/panel/CalcPanel.jsx';

import DataEntity from '../../entities/DataEntity.js'

//TESTERS
import {feeds} from '../../dataG1.js';
//

import {
    Divider
} from "@material-ui/core";

export default function Home() {

    let iniCard = feeds[0];
    iniCard['status'] = 'ok';
    // const [cardsData, setCardsData ] = useState([1]);
    const [cardsData, setCardsData] = useState([new DataEntity(iniCard)]);

    // runModel()

    return (
      <div>
        <MainHeader/>
        <DataContents cardsInput={cardsData} setCardsInput={setCardsData}/>
        <Divider variant="middle" />
        <CalcPanel cardsInput={cardsData}/>
        <Divider variant="middle" />
      </div>
    )
}