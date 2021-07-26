import React, { useEffect, useState } from "react";

import {
  Button,
} from "@material-ui/core";

import Typography from "@material-ui/core/Typography";
import { FormattedMessage } from 'react-intl';
import { runModel } from '../../services/Ai/Main.js';
import { calcTfIdfCards } from '../../services/Ai/TfIdf.js';
// import { renderButton, checkSignedIn } from "../../services/Content/Google.js";
import { checkSignedIn } from "../../services/Content/Google.js";

export default function CalcPanel({ cardsInput }) {

  const execCalcs = () => {
    // let tfIdf = calcTfIdfCards(cardsInput)
  }

  execCalcs();

  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    window.gapi.load("auth2", init); //(1)
  });

  const init = () => { //(2)
    checkSignedIn()
      .then((signedIn) => {
        updateSignin(signedIn);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const updateSignin = (signedIn) => { //(3)
    setIsSignedIn(signedIn);
    if (!signedIn) {
      renderButton();
    }
  };

  const renderButton = () => {
    window.gapi.signin2.render("signin-button", {
      scope: "profile email",
      width: 240,
      height: 50,
      longtitle: true,
      theme: "dark",
      onsuccess: onSuccess,
      onfailure: onFailure,
    });
  };

  const onSuccess = (googleUser) => {
    console.log("Logged in as: " + googleUser.getBasicProfile().getName());
  };

  const onFailure = (error) => {
    console.error(error);
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        <FormattedMessage id="app.Calcs" />
      </Typography>
      <Button variant="contained" onClick={execCalcs} color="primary">
        Cálculos dos botões
      </Button>
      {renderButton()}
  
      {!isSignedIn ? (
        <div id="signin-button"></div>
      ) : (
        <div>Coming soon...</div>
      )}
    </div>
  )
}