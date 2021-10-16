
import React from "react";

import DateFnsUtils from '@date-io/date-fns';
import {
  Grid,
  TextField,
  Checkbox,
  Select
} from "@material-ui/core";

import { FormattedMessage, useIntl } from 'react-intl';
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import ptLocale from "date-fns/locale/pt-BR";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from "@material-ui/core/Typography";

import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
  labelUp: {
    ...theme.typography.button,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1),
  },
}));


export default function FilteringAndSetPanel({
  cardsSource, 
  configInput,
  setConfigFilterCallback
}) {

  const intl = useIntl();
  const classes = useStyles();
  const [checkedTypes, setCheckedTypes] = React.useState([false, false, false, false]);

  const renderSelectTypes = () => {
    let types = [];

    cardsSource.forEach((item, index) => {
      if(item.get('status') !== 'new' && item.get('category') && item.get('active')){
        for(let a in types){
          if(types[a] === item.get('category')){
            return false;
          }
        }
        types.push(item.get('category'));
      }
    });
    
     return types.map((type, index) => <FormControlLabel key={"checkfilter"+index}
        control={<Checkbox 
          checked={checkedTypes[index]} 
          onChange={() => handleTypeCheck(index)} 
          name="checkedA" />}
        label={type}
      />);
  }

  const renderSimilarityCheck = () => {
    let options = cardsSource.map((item, index) => {
      if(item.get('status') !== 'new'){
        return <option aria-label="content" value={item.get('id')} key={'comparisonOption'+index}>
          {item.get('name')+ '- '+item.get('id')}
        </option>
      }
      return '';
    });
    
    return <Select
            native
            value={configInput.targetCardForComparison}
            onChange={(event) => handleUpdConfig('targetCardForComparison', event.target.value)}
            label="targetCardForComparison"
          >
            <option aria-label="" value="" key={'comparisonOption00'}>
              {/* {intl.formatMessage({id:"app.FilterAndSetFieldContent"})} */}
              Não quero comprar fontes
            </option>
            {options}
          </Select>
  }

  const handleTypeCheck = (index) => {
    let newTypes = [...checkedTypes]
    newTypes[index] = !newTypes[index]; 
    setCheckedTypes(newTypes)
  }

  const handleUpdConfig = (key, value) => {
    let newConfigs = {...configInput};
    newConfigs[key] = value;
    setConfigFilterCallback(newConfigs)
  }

  return (
    <div>
      <div className={classes.labelUp}>
        <Typography variant="h5" gutterBottom>
          <FormattedMessage id="app.FilterAndSetTitle" />
        </Typography>
      </div>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Typography variant="h6" gutterBottom>
            Intervalo de tempo
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptLocale}>
                <DateTimePicker
                  label="Início"
                  clearable
                  inputVariant="outlined"
                  value={configInput?.minDate}
                  onChange={(event) => handleUpdConfig('minDate', event)}
                  inputProps={{ 
                    form: {autocomplete: 'off'}, 
                  }}
                />
              </MuiPickersUtilsProvider>
            </Grid>
            <Grid item xs={6}>
              <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptLocale}>
                <DateTimePicker
                  label="Fim"
                  clearable
                  inputVariant="outlined"
                  value={configInput?.maxDate}
                  onChange={(event) => handleUpdConfig('maxDate', event)}
                  inputProps={{ 
                    form: {autocomplete: 'off'}, 
                  }}
                />
              </MuiPickersUtilsProvider>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="h6" gutterBottom>
            Tipos de conteúdo permitidos
          </Typography>
          <Grid item xs={12}>
            {renderSelectTypes()}
          </Grid>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="h6" gutterBottom>
            Mínimo de itens no card (0 = sem limite)
          </Typography>
            <TextField 
              onChange={(event) => handleUpdConfig('minItemPerCard', event.target.value)}
              id="demo-helper-text-aligned-no-helper" 
              label="" 
              type="number"
              // fullWidth
              value={configInput?.minItemPerCard}
              inputProps={{ 
                  form: {autocomplete: 'off'}, 
                  inputMode: 'numeric', 
                  pattern: '[0-9]*' 
                }}
              variant="outlined"
            />
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6" gutterBottom>
            Mínimo de conteúdo em um item de card (0 = sem limite)
          </Typography>
            <TextField 
              onChange={(event) => handleUpdConfig('minCharsPerItem', parseInt(event.target.value))}
              id="demo-helper-text-aligned-no-helper" 
              label="" 
              type="number"
              value={configInput.minCharsPerItem}
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              variant="outlined"
            />
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6" gutterBottom>
            Campo usado para processamento
          </Typography>
          <Select
            native
            value={configInput.targetField}
            onChange={(event) => handleUpdConfig('targetField', event.target.value)}
            label="targetField"
          >
            <option aria-label="content" value="content">
              {intl.formatMessage({id:"app.FilterAndSetFieldContent"})}
            </option>
            <option aria-label="title" value="title">
              {intl.formatMessage({id:"app.FilterAndSetFieldTitle"})}
            </option>
          </Select>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6" gutterBottom>
            Fonte usada para comparação
          </Typography>
          <Grid item xs={12}>
            {renderSimilarityCheck()}
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}