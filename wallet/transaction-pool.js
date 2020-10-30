const Transaction = require('../wallet/transaction');

class TransactionPool{
    constructor(){
        this.transactions = [];
    }

    updateOrAddTransaction(transaction){
      let transactionWithId = this.transactions.find(t=>t.id===transaction.id);
      if(transactionWithId){
          this.transactions[this.transactions.indexOf(transactionWithId)]= transaction;
      }else{
          this.transactions.push(transaction);
      }
    }

    existingTransaction(address){
       return this.transactions.find(t=>t.input.address===address);
    }

    validTransactions(){
        return this.transactions.filter(transaction=>{
          const outputTotal = transaction.outputs.reduce((total, output)=>{
                return total + output.amount;
          },0);

          if(transaction.input.amount!==outputTotal){
              console.log(`Invalid transaction from ${transaction.input.address}`);
              return;
          }//check that total outputamount matches original balance in the input amount

          if(!Transaction.verifyTransaction(transaction)){
              console.log(`Invalid signature from ${transaction.input.address}`)
              return;
          }//ensure data is not corrupted after being signed by the sender

          return transaction;
        });
    }

    clear(){
        this.transactions = [];
    }
}

module.exports = TransactionPool;