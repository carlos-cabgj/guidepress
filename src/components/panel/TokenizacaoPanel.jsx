import React, { useEffect } from "react";

import {
  Grid, 
  TextField,
  Select,
} from "@material-ui/core";

import Typography from "@material-ui/core/Typography";
import { FormattedMessage, useIntl } from 'react-intl';
import FormControl from '@material-ui/core/FormControl';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  labelUp: {
    ...theme.typography.button,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1),
  },
    formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    width: '100%',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function TokenizacaoPanel({configToken, callbackLoadData}) {

  const classes = useStyles();
  const intl = useIntl();

  const [configs, setConfigs] = React.useState(configToken);

  useEffect(()=>{
    setConfigs({...configToken})
  },[configToken])

  const handleUpdConfig = (key, value) => {
    let newConfigs = configs;
    newConfigs[key] = value;
    callbackLoadData(newConfigs)
  }

  return (
    <div>
      <div className={classes.labelUp}>
        <Typography variant="h5" gutterBottom>
          <FormattedMessage id="app.tokenizerTitle" />
        </Typography>
      </div>
      <Grid container spacing={1}>
        <Grid item xs={2}>
          <FormattedMessage id="app.tokenizerRegexLabel" />
        </Grid>
        <Grid item xs={4}>
          <TextField 
            className={classes.formControl}
            inputProps={{ 
              form: {autocomplete: 'off'}, 
            }}
            value={configs.divider || ''}
            onChange={(event) => handleUpdConfig('divider', event.target.value)}
            id="outlined-basic" 
            label="" 
            variant="outlined" />
        </Grid>
        <Grid item xs={2}>
          <FormattedMessage id="app.tokenizerNGramsLabel" />
        </Grid>
        <Grid item xs={4}>
          <TextField  
            className={classes.formControl}
            inputProps={{ 
              form: {autocomplete: 'off'}, 
            }}
            value={configs.ngrams}
            onChange={(event) => handleUpdConfig('ngrams', event.target.value)}
            id="outlined-basic" 
            label="" 
            variant="outlined" />
        </Grid>
        <Grid item xs={2}>
          <FormattedMessage id="app.tokenizerCaseLabel" />
        </Grid>
        <Grid item xs={4}>
         <FormControl variant="outlined" className={classes.formControl}>
          <Select
            native
            value={configs.case}
            onChange={(event) => handleUpdConfig('case', event.target.value)}
            label="Case"
          >
            <option aria-label="None" value="" />
            <option value='upper'>
              {intl.formatMessage({id:"app.tokenizerCaseUpperLabel"})}
            </option>
            <option value='lower'>
              {intl.formatMessage({id:"app.tokenizerCaseLowerLabel"})}
            </option>
          </Select>
        </FormControl>
        </Grid>
        <Grid item xs={2}>
          <FormattedMessage id="app.tokenizerMinLengthLabel" />
        </Grid>
        <Grid item xs={4}>
          <TextField  
            className={classes.formControl}
            inputProps={{ 
              form: {autocomplete: 'off'}, 
            }}
            value={configs.minLength}
            onChange={(event) => handleUpdConfig('minLength', event.target.value)}
            id="outlined-basic" 
            label="" 
            variant="outlined" />
        </Grid>
        <Grid item xs={2}>
          <FormattedMessage id="app.tokenizerStopWordsLabel" />
        </Grid>
        <Grid item xs={4}>
          <TextField 
            onChange={(event) => handleUpdConfig('stopWords', event.target.value)}
            label="" 
            type="text"
            fullWidth
            value={configs.stopWords}
            variant="outlined"
          />
        </Grid>
      </Grid>
    </div>
  )
}