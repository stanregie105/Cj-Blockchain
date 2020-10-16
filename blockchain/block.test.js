const Block = require('./block');

describe('Block',()=>{
   let data, lastBlock,block;
    beforeEach(()=>{
        data = 'bar';
        lastBlock = Block.genesis();
        block = Block.mineBlock(lastBlock,data);
    });// allows us run the same code for each of the tests
    it('sets the `data` to match the given input',()=>{
       expect(block.data).toEqual(data);
    })

    it('sets the lastHash to match the hash of the lastBlock',()=>{
       expect(block.lastHash).toEqual(lastBlock.hash);
    })
})