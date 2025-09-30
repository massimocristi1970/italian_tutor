exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      firebaseConfig: {
        apiKey: process.env.AIzaSyAMlShSEWBzHhKTL6lcFYVec1U6i_kNco0,
        authDomain: process.env.italiantutorapp.firebaseapp.com,
        projectId: process.env.italiantutorapp,
        storageBucket: process.env.italiantutorapp.firebasestorage.app,
        messagingSenderId: process.env.915130971011,
        appId: process.env.1:915130971011:web:171cfb69941fdf7997fcb6
      }
    })
  };
};