import React from "react";
import {
    Grid,
} from "@material-ui/core";

import Typography from "@material-ui/core/Typography";
import {FormattedMessage} from 'react-intl';

import CardSource from '../cards/CardSource';
import CardSourceSetModal from '../cards/CardSourceSetModal.jsx';
import CardSourceUpModal from '../cards/CardSourceUpModal.jsx';
import {sendDownload} from '../../services/Content/File';

export default function SourceContents({cardsInput, setCardsInput}) {

  const [openModalUpSource, setOpenModalUpSource]   = React.useState(false);
  const [openModalSetSource, setOpenModalSetSource]   = React.useState(false);
  const [indiceAtivo, setIndiceAtivo]           = React.useState(0);

  const handleDeleteCard = async () => {
    let newCards = [...cardsInput];
    newCards.splice(0, 1);
    setCardsInput(newCards)
    setOpenModalSetSource(false);
  }

  const handleDownloadCard = async () => {
    await sendDownload('card-format1.json', cardsInput[indiceAtivo].attrs);
  }

  const handleCloseModalUpSource = (type, data) => {

    if(!type){
      setOpenModalUpSource(false);
      return false;
    }
    let newCards = cardsInput;

    data['category'] = type;
    data['status'] = 'active';
    data['active'] = true;

    newCards[indiceAtivo].fill(data);

    setCardsInput(newCards);
    setOpenModalUpSource(false);
  };

  const handleUpdCard = (indice, $item) => {
    let newCards = [...cardsInput];
    newCards[indice] = $item;
    setCardsInput(newCards);
  };

  const handleOpenModalUpSource = (indice) => {
    setIndiceAtivo(indice)
    setOpenModalUpSource(true);
  };

  const handleOpenSetModal = (indice) => {
    setIndiceAtivo(indice)
    setOpenModalSetSource(true);
  };

  const handleCloseModalSetSource = (data) => {
    setOpenModalSetSource(false);
  }

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        <FormattedMessage id="app.Data"/>
      </Typography>
      <br/>
      <Grid container spacing={0}>
        {cardsInput.map((card, index) => {
          return (
            <Grid item key={'CardSourcegrid-'+index}>
              <CardSource 
               indice={index} 
               handleUpdCard={handleUpdCard} 
               handleOpenModal={handleOpenModalUpSource}
               handleOpenSetModal={handleOpenSetModal} 
               sourceObj={card}/>
            </Grid>
          )
        })}
      </Grid>
      <CardSourceUpModal 
        handleClose={handleCloseModalUpSource} 
        statusModal={openModalUpSource}
      />
      <CardSourceSetModal 
        handleClose={handleCloseModalSetSource} 
        handleDownloadCard={handleDownloadCard} 
        handleDeleteCard={handleDeleteCard} 
        statusModal={openModalSetSource}
      />
    </div>
  )
}