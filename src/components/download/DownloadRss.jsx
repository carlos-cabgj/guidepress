import React, { useEffect, useState} from "react";
import {
    Divider,
    FormControl,
    Grid,
    InputLabel,
    ListItem,
    makeStyles,
    MenuItem,
    Select,
    Title,
    TextField
} from "@material-ui/core";

import Typography from "@material-ui/core/Typography";
import CardRss from '../cards/CardRss';

// const useStyles = makeStyles((theme) => (ItemCardStyle(theme)));

export default function DownloadRss({cardsInput}) {

    // const classes = useStyles();
    const [cards, setCards ] = useState(cardsInput);

    useEffect(() => {
      setCards(cardsInput)
    }, [cardsInput])

    return (
      <div>
        <Typography variant="h5" gutterBottom>
          <FormattedMessage id="app.Data"/>
        </Typography>
        <br/>
        <Grid container>
          <Grid container spacing={3}>
            {cards.map((card, index) => {
              <Grid item xs={12}>
                <CardRss data={card}/>
              </Grid>
            })}
          </Grid>
        </Grid>
      </div>
    )
}