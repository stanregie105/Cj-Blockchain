const {INITIAL_BALANCE} = require('../config');
const Transaction = require('./transaction');
const ChainUtil = require('../chain-util');
class Wallet {
    constructor(){
        this.balance=INITIAL_BALANCE;
        this.keyPair=ChainUtil.genKeyPair();
        this.publicKey =this.keyPair.getPublic().encode('hex');
    }

    toString(){
        return `Wallet -
        publicKey: ${this.publicKey.toString()}
        balance..: ${this.balance}`
    }

    sign(dataHash){
        return this.keyPair.sign(dataHash);
    }

    createTransaction(recipient, amount, blockchain,transactionPool){
        this.balance = this.calculateBalance(blockchain);
        if(amount> this.balance){
            console.log(`Amount: ${amount} exceeds current balance: ${this.balance}`);
            return;
        }

        let transaction = transactionPool.existingTransaction(this.publicKey);

        if(transaction){
          transaction.update(this,recipient, amount);
        }else{
          transaction = Transaction.newTransaction(this, recipient, amount);
          transactionPool.updateOrAddTransaction(transaction);
        }
        return transaction;
    }

    calculateBalance(blockchain){
      let balance = this.balance; 
      let transactions = [];
      blockchain.chain.forEach(block=> block.data.forEach(transaction=>{
          transactions.push(transaction);
      }));

      const walletInputTs = transactions
      .filter(transaction=>transaction.input.address===this.publicKey)//finds the most recent transaction for the wallet
      
      let startTime = 0;

      if(walletInputTs>0){
      const recentInputT = walletInputTs.reduce((prev, current)=>
      prev.input.timestamp>current.input.timestamp? prev:current
      )  
      balance = recentInputT.outputs.find(output.address===wallet.publicKey).amount;
      startTime = recentIntputT.input.timestamp;    
     }//finds the balance based on most recent timestamp
    
     transactions.forEach(transaction=>{
         if(transaction.input.timestamp>startTime){
             transaction.outputs.find(output=>{
                 if(output.address===this.publicKey){
                     balance += output.amount;
                 }
             })
         }
     })  
     return balance;
}

    static blockchainWallet(){
        const blockchainWallet = new this();
        blockchainWallet.address = 'blockchain-wallet';
        return blockchainWallet;
    }
}

module.exports = Wallet;