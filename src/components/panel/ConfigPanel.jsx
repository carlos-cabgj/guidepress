import React, { useEffect } from "react";

import {
  Grid, 
TextField,
  Button,
} from "@material-ui/core";

import moment from 'moment'
import Typography from "@material-ui/core/Typography";
import { FormattedMessage } from 'react-intl';
import {DropzoneArea} from 'material-ui-dropzone'

import {sendDownload} from '../../services/Content/File';

import SourceEntity from '../../entities/SourceEntity.js'

export default function ConfigPanel({
  configInput, 
  configToken,
  cardsInput, 
  modelTree,
  modelTree2,
  setModelTree,
  setModelTree2,
  setConfigFilterCallback,
  setCardsSourceCallback,
  setConfigTokenCallback
}) {

  const [config, setConfig] = React.useState(configInput);
  const [fileInfo, setFileData] = React.useState(null);
  const [qtdColsInfo] = React.useState(3);

    useEffect(() => {
      setConfig({...configInput})
    }, [configInput])

  const fillFileInfo = (file) => {
    if(file){
      setFileData([
        {"key" : 'name'    , "value" : file.name},
        {"key" : 'size'    , "value" : file.size},
        {"key" : 'type'    , "value" : file.type},
        {"key" : 'included', "value" : moment(file.date).format('HH:mm DD/MM/Y')},
      ]);
    }
  }

  const handleUpdConfig = (key, value) => {
    let newConfig = {...config};
    newConfig[key] = value;
    setConfigFilterCallback(newConfig)
  }

  const handleChange = (files) => {

    if(!files[0]){ return false; }

    let file     = files[0];
    file.date    = new Date();
    const reader = new FileReader()

    reader.onload = async (e) => { 
      const text = (e.target.result);

      loadFileConfig(JSON.parse(text))
      fillFileInfo(file);
    };
    reader.readAsText(file)
  }

  const loadFileConfig = async (data) => 
  {
    if(data?.config){
      setConfigFilterCallback(data['config']);
    }
    if(data?.cards){
      for(let i in data['cards']){
        data['cards'][i] = new SourceEntity(data['cards'][i])
      }
      setCardsSourceCallback([...data['cards']]);
    }
    if(data?.configToken){
      setConfigTokenCallback(data['configToken']);
    }
    if(data?.modelTree){
      setModelTree(data.modelTree);
    }
    if(data?.modelTree2){
      setModelTree2(data.modelTree2);
    }
  }

  const sendBackUpToDownload = async () => {
    await sendDownload('data-guide-press.json', generateBackUpData());
  }

  const generateBackUpData = () => {

    let cardsData = [];

    for(let i in cardsInput){
      if(cardsInput[i].get('status') !== 'new'){
        cardsData.push( cardsInput[i].attrs );
      }
    }

    let data = {
      "config"     : configInput,
      "configToken": configToken,
      "cards"      : cardsData,
      "modelTree" : modelTree,
      "modelTree2" : modelTree2
    };
    return data;
  }

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        <FormattedMessage id="app.loadOrDownloadData" />
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={2} md={2} sm={2}>
          <Button variant="contained" onClick={sendBackUpToDownload} color="primary">
            Download Base Completa
          </Button>
          <TextField 
            onChange={(event) => handleUpdConfig('rssHostDownload1', event.target.value)}
            id="standard-basic" 
            label="Link Rss" 
            fullWidth
            value={config.rssHostDownload1}
            />
          <TextField 
            onChange={(event) => handleUpdConfig('rssHostParam1', event.target.value)}
            id="standard-basic" 
            label="Param Rss" 
            fullWidth
            value={config.rssHostParam1}
            />

        </Grid>

        <Grid item xs={4} md={4} sm={4} >
          <DropzoneArea
            filesLimit={1}
            dropzoneText={"Aqui coloca o arquivo"}
            showPreviews={false}
            acceptedFiles={['application/json']}
            showPreviewsInDropzone={false}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={5} md={5} sm={5}>
          <Grid container spacing={2} align = "center" justifyContent = "center" alignItems = "center">
            {!fileInfo  ? 
              'Conteúdo não carregado'
              :
              fileInfo.map((item, index) => { 
              return (
                <React.Fragment key={'info-'+index}>
                  <Grid item xs={qtdColsInfo} md={qtdColsInfo} sm={qtdColsInfo}>
                    <b>{ item.key }</b>
                  </Grid>
                  <Grid item xs={qtdColsInfo} md={qtdColsInfo} sm={qtdColsInfo}>
                    {item.value}
                  </Grid>
                </React.Fragment>
              )
            })}
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}