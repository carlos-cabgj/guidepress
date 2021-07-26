import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {TextField, Grid, Typography} from "@material-ui/core";
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import {DropzoneArea} from 'material-ui-dropzone'

import {getFeeds} from '../../services/Content/Rss';

const RSS_URL = 'https://g1.globo.com/rss/g1/pop-arte/';

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

export default function CardDataUpModal({statusModal, handleClose}) {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [files, setFiles] = React.useState([]);
  const [text, setText] = React.useState(RSS_URL);

  const handleRssButton = async (files) => {
    let data = await getFeeds([text]);
    handleClose(data);
  }

  const handleRssText = (e) => {
    setText(e.target.value);
  }

  const handleChange = (files) => {
    setFiles(files);
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
        onClose={handleClose}
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
                    value={text}/>
                </Grid>
                <Grid xs={2} md={2} item>
                  <br/>
                  <Button  onClick={handleRssButton} variant="contained">
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
          </div>
        </Fade>
      </Modal>
    </div>
  );
}