export const initAuth = () => {
  return window.gapi.auth2.init({
    client_id: "YOUR_CLIENT_ID", //paste your client ID here
    scope: "https://www.googleapis.com/auth/analytics.readonly",
  });
};

// export const renderButton = () => {
//     window.gapi.signin2.render("signin-button", {
//       scope: "profile email",
//       width: 240,
//       height: 50,
//       longtitle: true,
//       theme: "dark",
//       onsuccess: onSuccess,
//       onfailure: onFailure,
//     });
//   };
export const checkSignedIn = () => {
  return new Promise((resolve, reject) => {
    initAuth() //calls the previous function
      .then(() => {
        const auth = window.gapi.auth2.getAuthInstance(); //returns the GoogleAuth object
        resolve(auth.isSignedIn.get()); //returns whether the current user is currently signed in
      })
      .catch((error) => {
        reject(error);
      });
  });
};