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

      return io.emit('GAME UPDATE', Game);
    });
  
    socket.on('GAME UPDATE', function () {
      Game.BALL.update(Game);

      for (var ID in Game.PLAYERS){
        Game.PLAYERS[ID].update(Game.dimensions);
        Game.PLAYERS[ID].update(Game.dimensions);
      }
    
      return io.emit('GAME UPDATE', Game);
    });

    socket.on('disconnect', function () {
      var removed = Game.removePerson(socket.id);

      if(removed){
        console.log('disconnected ', removed.name);
      }
      else {
        console.log('disconnected user');
      }
    }); 
  });
}
