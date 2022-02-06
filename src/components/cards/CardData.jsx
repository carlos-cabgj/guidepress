import React from "react";
import {
  Card, 
  CardMedia, 
  CardActionArea, 
  CardContent, 
  Grid, 
  ListItem, 
  makeStyles
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Button from '@material-ui/core/Button';
import Moment from 'react-moment';

import ItemCardStyle from './ItemCardStyle.jsx';
import {FormattedMessage} from 'react-intl';

// import envs from "../../services/constants/prod.json";

const useStyles = makeStyles((theme) => (ItemCardStyle(theme)));

export default function CardData({ indice, dataObj, handleOpenModal }) {

  const classes = useStyles();
  const [data] = React.useState(dataObj.attrs);

  return (
    <Card className={classes.root} display="inline">
      <CardContent>
        <CardActionArea>
          <Typography variant="body2" color="initial" component="p">
            {data.name}
          </Typography>
          <ListItem divider key={'div1'} />
          <br />
          <CardMedia
            className={classes.imgChange}
            component="img"
            image={data.thumb}
            height="140px"
            width="100%"
            alt=""
            title=""
          >
          </CardMedia>

          {/* <Icon>elderly</Icon>
          <Icon >priority_high</Icon> */}

        </CardActionArea>

        <Button variant="contained" onClick={() => handleOpenModal(indice)} color="secondary">
          <FormattedMessage id="app.addContent"/>
        </Button>

        <Typography variant="body2" color="initial" component="p">
          <FormattedMessage id="app.description"/>
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {data.description}
        </Typography>

        <br />

        <Grid container spacing={0}>
          <Grid item xs={6} md={6} sm={6}>
            <Typography variant="body2" color="initial" component="span">
              <b><FormattedMessage id="app.Status"/></b>:
              
            </Typography>
            <Typography variant="body2" color="error" component="span">
              {data.status}
            </Typography>
          </Grid>
          <Grid item xs={6} md={6} sm={6}>
            <Typography variant="body2" color="initial" component="span">
              <b><FormattedMessage id="app.Date"/></b>:
            </Typography>
            <Typography variant="body2" color="error" component="span">
              <Moment format="DD/MM/YYYY">
                {data.vinculacao}
              </Moment>
            </Typography>
          </Grid>
        </Grid>
    </CardContent>
    </Card >
  )
}