import React, { useEffect, useState } from "react";

import {
  Button,
} from "@material-ui/core";

import Typography from "@material-ui/core/Typography";
import { FormattedMessage } from 'react-intl';

// import { renderButton, checkSignedIn } from "../../services/Content/Google.js";
import { checkSignedIn } from "../../services/Content/Google.js";

export default function GoogleAuth({ }) {

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
      <Typography variant="h6" gutterBottom>
        <FormattedMessage id="app.google.title" />
      </Typography>
      {!isSignedIn ? (
        <div id="signin-button"></div>
      ) : (
        <div>Coming soon...</div>
      )}
    </div>
  )
}