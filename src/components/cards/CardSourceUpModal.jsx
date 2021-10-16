import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {TextField, Grid, Typography} from "@material-ui/core";
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import {DropzoneArea} from 'material-ui-dropzone'
import {sendDownload} from '../../services/Content/File';
import Parser from 'rss-parser';


import {getFeeds} from '../../services/Content/Rss';

// const RSS_URL = 'https://g1.globo.com/rss/g1/pop-arte/';
// const RSS_URL = 'http://noticias.r7.com/economia/feed.xml';
const RSS_URL = '';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function CardSourceUpModal({statusModal, handleClose}) {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [rssLink, setTextRssLink] = React.useState(RSS_URL);

  const handleRssText = (e) => {
    setTextRssLink(e.target.value);
  }

  const downloadFormat1 = async() => {
    const format = {"cards":[{"id":"...","name":"...","author":"...","thumb":"...","image":"...","url":"...","description":"....","category":"...","active":true,"items":[{"title":"...","pubDate":"2021-07-01 17:55:26","link":"","author":"","thumbnail":""}]}]};
    await sendDownload('card-format1.json', format);
  }

  const loadRssButton = async () => {
    let Source = await getFeeds(rssLink);

    Source['thumb'] = 'leak_add';
    Source['thumbColor'] = 'orange';
    Source['name'] = 'Rss';

    handleClose('rss', Source);
  }

  const loadFileRssContent = (file) => {
    const reader = new FileReader()
    reader.onload = async (e) => { 
      const contents = e.target.result;

      let parser = new Parser();

      parser.parseString(contents, function(opc, rssParsed){
        const d = new Date();
        const data = {
          items : stripAllArray(rssParsed['items']),
          thumb      : 'leak_add',
          description: 'Extracted : '+
            d.getFullYear()+'-'+d.getMonth()+'-'+d.getDay()+'-'+d.getHours(),
          name       : rssParsed['title'],
          thumbColor : 'red',
          category   : 'rss',
          url        : rssParsed['feedUrl'],
        };
        handleClose('rss', data)
      })

    };
    reader.readAsText(file)
  }

  const stripAllArray = (array) => {

    for(let a in array){

      let type = typeof array[a];

      if(type === 'object'){
        array[a] = stripAllArray(array[a])
      }else if(typeof array[a] ===  'string'){
        array[a] = array[a].replace(/(<([^>]+)>)/gi, "").trim(); 
      }
    }
    return array;
  }

  const loadCardContent = (file) => {
      const reader = new FileReader()
      reader.onload = async (e) => { 
        const json = JSON.parse(e.target.result);
        json['thumb'] = 'archive';
        json['thumbColor'] = 'blue';
        json['category'] = 'card';

        handleClose('card', json)
      };
      reader.readAsText(file)
  }

  const handleChange = (files) => {

    if(files[0]){
      let file     = files[0];
      file.date    = new Date();

      switch (file.type) {
        case 'text/xml':
          loadFileRssContent(file);
          break;
        case 'application/json':
          loadCardContent(file);
          break;
        default:
          alert('Formato não permitido')
      }
    }
  }

  useEffect(()=>{
    setOpen(statusModal)
  },[statusModal])

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={() => handleClose(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <form className={classes.root} noValidate autoComplete="off">
              <Grid container spacing={1}>
                <Grid item xs={10} md={10}>
                  <TextField 
                    onChange={handleRssText} 
                    id="standard-basic" 
                    label="Link Rss" 
                    fullWidth
                    value={rssLink}/>
                </Grid>
                <Grid xs={2} md={2} item>
                  <br/>
                  <Button  onClick={loadRssButton} variant="contained">
                    Adicionar
                  </Button>
                </Grid>
              </Grid>
            </form>
            <Typography variant="h5" component="h2">
              <center>Ou</center>
            </Typography>
            <Typography variant="h5" component="h2">
              adicione um arquivo abaixo no formato correto abaixo 
            </Typography>
            <DropzoneArea
              onChange={handleChange}
            />
            <p></p>
            <Typography variant="body2" gutterBottom>
              <i>arquivo txt com conteúdo para importar um documento só</i>
            </Typography>
            <Typography variant="body2" gutterBottom>
              <Button onClick={downloadFormat1} variant="outlined" color="secondary">
                <b>* Formato 2 </b>
              </Button>
              <i>
                Para importar um card completo
              </i>
            </Typography>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}