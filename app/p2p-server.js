const Websocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5001;

//$ HTTP_PORT =3002 P2P_PORT=5003 PEERS= ws://localhost:5001, ws://localhost:5002 npm run dev
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

class P2pServer {
    constructor(blockchain){
        this.blockchain = blockchain;//this makes the p2pserver share its individual chain object with each other
        this.sockets = [];//contains alist of the connected ws services connected to the server

    }

    listen(){
      const server= new Websocket.Server({port:P2P_PORT});
      server.on('connection', socket=> this.connectSocket(socket));
      this.connectToPeers();
      console.log(`Listening for peer-to-peer connections on: ${P2P_PORT}`);
    }// starts up the server

    connectToPeers(){
        peers.forEach(peer=>{
            //ws://localhost:5001
            const socket = new Websocket(peer);
            socket.on('open',()=> this.connectSocket(socket));
        })
    }

    connectSocket(socket){
        this.sockets.push(socket);
        console.log('socket connected');
        this.messageHandler(socket);
        this.sendChain(socket);
    }

    messageHandler(socket){
      socket.on('message', message=>{
          const data = JSON.parse(message);
          this.blockchain.replaceChain(data);
      })
    }

    sendChain(socket){
      socket.send(JSON.stringify(this.blockchain.chain));
   }

    syncChains(){
       this.sockets.forEach(socket=> this.sendChain(socket));
    }//to send the updated blockchain of he current instance to all the socket pairs
}

module.exports= P2pServer;