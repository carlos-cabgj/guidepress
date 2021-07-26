import React from "react";
import {
  Card, CardMedia, CardActionArea, CardContent, Icon, ListItem, makeStyles
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Button from '@material-ui/core/Button';


import ItemCardStyle from './ItemCardStyle.jsx';
// import envs from "../../services/constants/prod.json";

const useStyles = makeStyles((theme) => (ItemCardStyle(theme)));

export default function CardData({ indice, data, handleOpenModal }) {
  const classes = useStyles();

  return (
    <Card className={classes.root} display="inline">
      <CardContent>
        <CardActionArea>
          <Typography variant="body2" color="initial" component="p">
            tipo 1
          </Typography>
          <ListItem divider key={'div1'} />
          <br />
          <CardMedia
            className={classes.imgChange}
            component="img"
            image="/rss_p.png"
            height="140px"
            width="100%"
            alt=""
            title=""
          >
          </CardMedia>
          <Icon>elderly</Icon>
          <Icon >priority_high</Icon>

        </CardActionArea>
        <Button variant="contained" onClick={handleOpenModal} color="secondary">
          Adicionar Conteúdo
        </Button>

        <Typography variant="body2" color="initial" component="p">
          Acervo: 11
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          Especie:
        </Typography>
        <Typography variant="body2" color="initial" component="span">
          <b>Situação</b>:
        </Typography>
        <Typography variant="body2" color="error" component="span">
          123
        </Typography>

      </CardContent>
    </Card>
  )
}