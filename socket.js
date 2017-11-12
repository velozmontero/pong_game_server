var Game = require('./js/Game');

module.exports = function(http) {
  var io = require('socket.io')(http);

  io.on('connection', function (socket) {
    console.log('a user connected');

    socket.emit('connected', 'conection established');

    socket.on('CHAT MESSAGE', function (data) {
      io.emit('CHAT MESSAGE', data);
    });

    socket.on('PLAYER JOIN', function(name){
      // console.log('Game', Game);
 
      console.log('Incoming Player ',name);
      
      Game.subscribe(socket, name, (Player, msg, ready) => {
        if(Player){
          io.emit('JOINED AS PLAYER', Player);
        }
        else {
          io.emit('JOINED AS EXPECTAROR', msg);
        }

        if (Player && ready){
          Game.initializeBall();
          io.emit('START GAME', Game);
        }
      });
    });

    socket.on('ACTION', function(action){
      console.log(action);

      switch (action.type) {
        case 'MOVE':
          Game.PLAYERS[socket.id].move(action.direction, true);
          break;

        case 'STOP':
          Game.PLAYERS[socket.id].move(action.direction, false);
          break;  
      
        default:
          console.log('NO ACTION');
          break;
      }
    });
  
    socket.on('GAME UPDATE', function () {
      Game.update();
    
      return io.emit('GAME UPDATE', Game);
    });

    socket.on('disconnect', function () {
      var removed = Game.removePerson(socket.id);

      if(removed){
        if (Object.keys(Game.PLAYERS).length){
          Game.stop();
        }
        else {
          Game.reset();
        }

        console.log('disconnected ', removed.name);
        return io.emit('END GAME', Game);
      }
      else {
        console.log('disconnected user');
      }
    }); 
  });
}
