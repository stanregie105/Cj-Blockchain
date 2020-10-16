const Block = require('./block');

class Blockchain {
    constructor(){
        this.chain = [Block.genesis()];
    }

    addBlock(data){
      const lastBlock = this.chain[this.chain.length-1];
      const block = Block.mineBlock(lastBlock, data);
      this.chain.push(block);
      return block;
    }

    isValid(chain){
       if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false;
     for(let i=1; i<chain.length;i++){
         const block = chain[i];
         const lastBlock = chain[i-1];
         if(block.lastHash !== lastBlock.hash
         || block.hash !== Block.blockHash(block)){
             return false;
         }
         
     }
     return true;    
}

   replaceChain(newChain){
       if(newChain.length<=this.chain.length){
           console.log('Recieved chain length is not longer than the curent chain');
           return;
       }else if(!this.isValid(newChain)){
           console.log('The recieved chain is not valid');
           return;
       }

       console.log('Replacing block chain with newChain');
       this.chain = newChain;
   }
}

module.exports = Blockchain;