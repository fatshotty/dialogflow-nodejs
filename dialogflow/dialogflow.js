const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');
const {Config} = require('../utils');


const PROJECT_ID = Config.PROJECT_ID;

/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} projectId The project to be used
 */
async function parse(query, lang = 'it-IT') {
  // A unique identifier for the given session
  const sessionId = uuid.v4();

  // Create a new session
  const sessionClient = new dialogflow.SessionsClient();
  const sessionPath = sessionClient.projectAgentSessionPath(
    PROJECT_ID,
    sessionId
  );

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: query,
        // The language used by the client (en-US)
        languageCode: lang,
      },
    },
  };

  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  console.log('Detected intent');
  const result = responses[0].queryResult;
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);
  if (result.intent) {
    console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    console.log('  No intent matched');
  }
  console.log( JSON.stringify(result, null, 2));


  return {
    action: result.action,
    responseText: result.fulfillmentText,
    name: result.intent.displayName,
    params: (() => {
      let keys = Object.keys(result.parameters.fields);
      let res = {};
      for ( let k of keys ) {
        res[ k ] = result.parameters.fields[ k ].stringValue;
      }
      return res;
    })()
  }

}


// parse('vai a film').then( (w) => {
//   console.log( JSON.stringify(w, null, 2) );
// })


module.export = {
  parse
};