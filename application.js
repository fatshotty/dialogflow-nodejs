const Express = require('express');
const BodyParser = require('body-parser');
const DialogFlow = require('./dialogflow/dialogflow');
const HTTPServer = require('http');
const SocketIO = require('./sockets/socketio')

const App =  Express();

App.use( BodyParser.json() )
App.use( BodyParser.text() )


App.param('channel_id', (req, res, next, value) => {

  if ( !value ) {
    return next( new Error('specify channel, please') );
  }


  // TODO: search channels in socket.io instances
  // let channel_found = false;


  // if ( ! channel_found ) {
  //   return next( new Error('no channel found') );
  // }

  next();

})



App.post('/v/:channel_id', async (req, res, next) => {

  let channel = req.params.channel_id;

  try {
    let command = await DialogFlow.parse( req.body );
    SocketIO.send( channel, command );
  } catch(e) {
    console.error(e);
    next(e);
  }

  next('OK');

});


App.get('/v/:channel_id', async (req, res, next) => {

  let channel = req.params.channel_id;

  try {
    let command = await DialogFlow.parse( req.query.text );
    SocketIO.send( channel, command );
  } catch(e) {
    console.error(e);
    next(e);
  }

  next('OK');

});


App.use( function errorHandler(err, req, res, next) {

  if  ( err instanceof Error ) {
    res.status(422).end(err.message);
    return;
  }

  if ( !res.statusCode || res.statusCode >= 400 ) {
    res.status(200);
  }

  res.end( err );

})


const Server = HTTPServer.createServer(App);

SocketIO.init(Server);

Server.listen(5002, '0.0.0.0', () =>{
  console.log('listening on port', 5002);
})
