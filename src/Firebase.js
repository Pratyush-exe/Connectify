import firebase from 'firebase';

const config = {
    projectId: 'chat-app-9be2b',
    apiKey: 'AIzaSyAm_Tj7RpD0e_0XwKgLKrQwO0uV6deaan4',
    databaseURL: 'https://chat-app-9be2b-default-rtdb.firebaseio.com'
  };
firebase.initializeApp(config);

export default firebase;