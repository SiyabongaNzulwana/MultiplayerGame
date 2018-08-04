const Timer = require('./timer');
const uuid = require('uuid');
const products = require('./products');

const generatedUuid = uuid();
/** class to create a game defination */
class Game {
  constructor(io) {
    this.s = (Math.floor(Math.random() * 10) % products.length - 1) * Math.floor(Math.random());
    this.playerCount = 0;
    this.gameId = generatedUuid;
    this.product = this.getRandomProduct();
    this.gameTimer = new Timer({
      initialTimer: 300,
      tickCallback: function (time) {
        io.sockets.in(gameId).emit('timer', { time })
      },
      finalCallback: function () {
        this.product = this.getRandomProduct();
        io.sockets.in(gameId).emit('roundOver', { type: 'timer', product })
      },
      loop: true
    })
  }

  connectPlayer(socket) {
    attachPlayer(socket);
    this.playerCount++;
    socket.emit('gameJoined', {
      gameId,
      product: this.product,
      playerCount
    });
    socket.broadcast.to(gameId).emit('playerJoined', { playerCount });
    if (playerCount === 1) gameTimer.start();
  }

  attachPlayer(socket) {
    socket.join(this.gameId)
    socket.on('disconnect', () => {
      if (--this.playerCount === 0)
        this.gameTimer.reset();
      socket.broadcast.to(gameId).emit('playerQuit', { playerCount });
    });

    socket.on('submitAnswer', data => {
      if (data.answerFromFrontEnd === products[this.s].answer) {
        gameTimer.restart();
        gameCard = getRandomCard();
        socket.emit('roundOver', { type: 'win', product });
        socket.broadcast.to(gameId).emit('roundOver', {
          type: 'loss',
          expression: data.answerFromFrontEnd,
          product
        });
      }
    })

  }

  getRandomProduct() {
    return products[this.s];
  }
}




