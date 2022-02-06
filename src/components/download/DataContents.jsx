import React from "react";
import {
    Grid,
} from "@material-ui/core";

import Typography from "@material-ui/core/Typography";
import {FormattedMessage} from 'react-intl';

import CardData from '../cards/CardData';
import CardDataSetModal from '../cards/CardDataSetModal.jsx';
import CardDataUpModal from '../cards/CardDataUpModal.jsx';

import DataEntity from '../../entities/DataEntity.js'

// const useStyles = makeStyles((theme) => (ItemCardStyle(theme)));

export default function DownloadRss({cardsInput, setCardsInput}) {

  const [openModalUpData, setOpenModalUpData]   = React.useState(false);
  const [openModalSetData, setOpenModalSetData] = React.useState(false);
  const [indiceAtivo, setIndiceAtivo]           = React.useState(0);

  const handleCloseModalSetData = (data) => {
    setOpenModalSetData(false);
  }

  const handleCloseModalUpData = (data) => {
    let newCards = cardsInput;

    for(let i =0 ; i < data.length; ++i){
      data[i]['status'] = 'active';
      newCards[indiceAtivo].fill(data[i]);
    }

    let lastCard = newCards[newCards.length - 1];

    if(data[0] && lastCard.attrs.status !== 'new'){
      newCards.push(new DataEntity())
    }

    setCardsInput(newCards);
    setOpenModalUpData(false);
  };

  const handleOpenModalUpData = (indice) => {
    setIndiceAtivo(indice)
    setOpenModalUpData(true);
  };
  // const handleOpenModalSetData = (indice) => {
  //   setIndiceAtivo(indice)
  //   setOpenModalSetData(true);
  // };

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        <FormattedMessage id="app.Data"/>
      </Typography>
      <br/>
        <Grid container spacing={0}>
          {cardsInput.map((card, index) => {
            return (
              <Grid item key={'CardDatagrid-'+index}>
                <CardData handleOpenModal={handleOpenModalUpData} indice={index} dataObj={card}/>
              </Grid>
            )
          })}
        </Grid>
      <CardDataUpModal handleClose={handleCloseModalUpData} statusModal={openModalUpData}/>
      <CardDataSetModal handleClose={handleCloseModalSetData} statusModal={openModalSetData}/>
    </div>
  )
}