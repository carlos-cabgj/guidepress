import React, {useEffect} from "react";
import {
  Card, 
  CardActionArea, 
  CardContent, 
  Grid, 
  ListItem, 
  Switch,
  withStyles,
  makeStyles
} from "@material-ui/core";
import Icon from '@material-ui/core/Icon';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from "@material-ui/core/Typography";
import Button from '@material-ui/core/Button';
import moment from 'moment'
import ItemCardStyle from './ItemCardStyle.jsx';
import {FormattedMessage} from 'react-intl';


const useStyles = makeStyles((theme) => (ItemCardStyle(theme)));

const IOSSwitch = withStyles((theme) => ({
  root: {
    width: 42,
    height: 26,
    padding: 0,
    margin: theme.spacing(1),
  },
  switchBase: {
    padding: 1,
    '&$checked': {
      transform: 'translateX(16px)',
      color: theme.palette.common.white,
      '& + $track': {
        backgroundColor: '#52d869',
        opacity: 1,
        border: 'none',
      },
    },
    '&$focusVisible $thumb': {
      color: '#52d869',
      border: '6px solid #fff',
    },
  },
  thumb: {
    width: 24,
    height: 24,
  },
  track: {
    borderRadius: 26 / 2,
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: theme.palette.grey[50],
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border']),
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});

export default function CardSource({ 
  indice, 
  sourceObj, 
  handleOpenModal, 
  handleOpenSetModal, 
  handleUpdCard 
}) {


  const classes = useStyles();
  const [item, setItem] = React.useState(sourceObj);

  useEffect(() => {
    setItem(sourceObj)
  }, [sourceObj] )

  const handleCardOptions = (event) => {
    handleOpenSetModal(indice);
  }

  const handleUpdConfig = (key, value) => {
    let newItem = item;
    if(key === 'active'){
      newItem.set(key, !newItem.get('active'));
    }else{
      newItem.set(key, value);
    }
    handleUpdCard(indice, newItem);
  }

  return (
    <Card className={classes.root} display="inline">
      <CardContent>
        <CardActionArea onClick={handleCardOptions}>
          <Typography variant="body2" color="initial" component="p">
            {item.get('name')} 
            <br/>
            {item.get('id')}
          </Typography>
          <ListItem divider key={'div1'} />
          <br />
          <div className={classes.imgChange}>
            <Icon style={{ fontSize: 100, color : item.get('thumbColor')}}>
              {item.get('thumb')}
            </Icon>
          </div>

        </CardActionArea>

        <Button variant="contained" onClick={() => handleOpenModal(indice)} color="secondary">
          <FormattedMessage id="app.addContent"/>
        </Button>

        <Typography variant="body2" color="initial" component="p">
          <FormattedMessage id="app.description"/>
        </Typography>

        <Typography variant="body2" color="textSecondary" component="p">
          {item.get('description')}
        </Typography>

        <br />

        <Grid container spacing={0}>
          <Grid item xs={6} md={6} sm={6}>
            <Typography variant="body2" color="initial" component="span">
              <b><FormattedMessage id="app.Status"/></b>:
            </Typography>
            <Typography variant="body2" color="error" component="span">
              {item.get('status')}
            </Typography>
          </Grid>
          <Grid item xs={6} md={6} sm={6}>
            <Typography variant="body2" color="initial" component="span">
              <b><FormattedMessage id="app.Date"/></b>:
            </Typography>
            <Typography variant="body2" color="error" component="span">
              {moment(item.get('vinculacao')).format('DD/MM/Y')}
            </Typography>
          </Grid>
          <Grid item xs={6} md={6} sm={6}>
            {item.get('status') !== 'new' ? <FormControlLabel
              control={
                <IOSSwitch 
                checked={item.get('active')}
                onChange={(event) => handleUpdConfig('active', event.target.value)}
                name="checkedB" />
              }
              label={'ativar'}
            /> :
              <b></b>
            }
          </Grid>
        </Grid>
    </CardContent>
    </Card>
  )
}