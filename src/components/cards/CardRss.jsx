import React from "react";
import {Card, CardMedia, CardActionArea, CardContent, Icon, ListItem, makeStyles} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

// import ItemCardStyle from '../ItemCard/ItemCardStyle';
// import envs from "../../services/constants/prod.json";

// const useStyles = makeStyles((theme) => (ItemCardStyle(theme)));

export default function CardRss() {
    // const classes = useStyles();

    return (
        // <Card className={classes.root}  display="inline">
        <Card  display="inline">
            <CardActionArea onClick={{}}>
                <CardContent>
                    <Typography variant="body2" color="initial" component="p">
                        tipo 1
                    </Typography>
                  <ListItem button divider key={'div1'}/>
                  <br/>
                <CardMedia
                    component="img"
                    image="https://lumiere-a.akamaihd.net/v1/images/stitch-rasgando-papel-1920x1080_234e1a3f.png?region=0,0,1920,1080"
                    height="140px"
                    width="100%"
                    alt=""
                    title=""
                >
                </CardMedia>
					<Icon>elderly</Icon>
					<Icon >priority_high</Icon>

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
            </CardActionArea>
        </Card>
    )
}