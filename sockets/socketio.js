const IO = require('socket.io');


let Instance = null;



async function init(server) {
  Instance = IO( server );

  Instance.use( (socket, next) => {
    console.log(socket)
    next()
  })
  
  Instance.of(/^\/[a-z]{3}-[a-z]{4}-[a-z|0-9]{3}$/gi).on('connection', (socket) => {

    console.log('--- NS new socket:', socket.id);

    // let t = setTimeout(test, 5000);

    socket.on('disconnect', (reason) => {
      console.log('NS socket', socket.id, 'has disconnected:', reason);
      // clearTimeout(t);
    })

    return Instance;
  });


  Instance.on('connection', (socket) => {
    console.log('--- new socket:', socket.id);

    // let t = setTimeout(test, 5000);

    socket.on('disconnect', (reason) => {
      console.log('socket', socket.id, 'has disconnected:', reason);
      // clearTimeout(t);
    })
    

  });


  Instance.on('new_namespace', (namespace) => {
    console.log('new namespace created', namespace.name)
  });


}



async function send(channel, data) {

  console.log('...sending data to', channel, JSON.stringify(data) );

  Instance.of(channel).emit('data', data);

}


// function test() {
//   send('/XXX-XXXX-XXX',{
//     "action": "base_navigation",
//     "responseText": "ok vado in film",
//     "name": "opensection",
//     "params": {
//       "destination": "film"
//     }
//   })
// }


module.exports = {init, send};
