
import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Button} from "@material-ui/core";
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import Backdrop from '@material-ui/core/Backdrop';

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

export default function CardSourceSetModal({
  statusModal, 
  handleDownloadCard, 
  handleDeleteCard,
  handleClose
}) {

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

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
            <Button variant="contained" onClick={handleDownloadCard} color="secondary">
              {/* <FormattedMessage id="app.addContent"/> */}
              Download
            </Button>
            <Button variant="contained" onClick={handleDeleteCard}>
              {/* <FormattedMessage id="app.addContent"/> */}
              Excluir Card
            </Button>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}