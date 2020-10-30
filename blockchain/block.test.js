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
    });

    it('generates a hash that matches the difficulty',()=>{
       expect(block.hash.substring(0, block.difficulty))
       .toEqual('0'.repeat(block.difficulty));
       console.log(block.toString());
    })

    it('lowers the difficulties for slowly mined blocks',()=>{
        expect(Block.adjustDifficulty(block, block.timestamp+360000))
        .toEqual(block.difficulty-1);
    })

    it('raises the difficulties for quickly mined blocks',()=>{
        expect(Block.adjustDifficulty(block, block.timestamp+1))
        .toEqual(block.difficulty+1);

    })
})