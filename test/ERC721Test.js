var ERC721Testable = artifacts.require('./ERC721Testable');
var ERC721Receiver = artifacts.require('./ERC721Receiver');
const truffleAssert = require('truffle-assertions');

contract('ERC721', (accounts) => {
    let instance;
    beforeEach(async () => {
        instance = await ERC721Testable.deployed();
    });

    describe('Premined coins', async () => {
        it('should have premined coins', async () => {
            assert.equal((await instance.getPremintedTokenCount()).toNumber(), (await instance.balanceOf(accounts[0])).toNumber());
        });

        it('token owner verification', async () => {
            assert.equal(await instance.ownerOf(1), accounts[0]);
            let count = await instance.getPremintedTokenCount();
            assert.equal(await instance.ownerOf(count), accounts[0]); // 1 indexed tokens
        });
    });

    describe('Transfer', async () => {
        let account1 = accounts[0];
        let account2 = accounts[1];
        let tokenId1 = 101;
        let tokenId2 = 102;
        before(async () => {           
            await instance.mint(account1, tokenId1);
            await instance.mint(account1, tokenId2);
        });

        it('should assign token after mint', async () => {
            assert.equal(await instance.ownerOf(tokenId1), account1);
            assert.equal(await instance.ownerOf(tokenId2), account1);
        })

        it('should assign token to another EOA', async () => {
            let account1Balance = await instance.balanceOf(account1);
            let account2Balance = await instance.balanceOf(account2);

            let result = await instance.safeTransferFrom(account1, account2, tokenId1);
            // truffleAssert.prettyPrintEmittedEvents(result);
            truffleAssert.eventEmitted(result, 'Transfer', (filter) => {
                return filter.from === account1 && filter.to === account2 && filter.tokenId.toNumber() === tokenId1;                   
            });

            assert.equal(await instance.ownerOf(tokenId1), account2);
            assert.equal((await instance.balanceOf(account1)).toNumber(), account1Balance - 1);
            assert.equal((await instance.balanceOf(account2)).toNumber(), account2Balance + 1);
        });

        it('should assign token to a contract', async () => {
            let receivingContract = await ERC721Receiver.deployed();
            let receivingContractAddress = receivingContract.address;
            let account1Balance = await instance.balanceOf(account1);

            let result = await instance.safeTransferFrom(account1, receivingContractAddress, tokenId2);
            // truffleAssert.prettyPrintEmittedEvents(result);
            truffleAssert.eventEmitted(result, 'Transfer', (filter) => {
                return filter.from === account1 && filter.to === receivingContractAddress && filter.tokenId.toNumber() === tokenId2;                   
            });
            // truffleAssert.eventEmitted(receivingContract.address, 'Receive', (filter) => {
            //     console.log('filter', filter);
            //     return true;
            // });

            assert.equal(await instance.ownerOf(tokenId2), receivingContractAddress);
            assert.equal((await instance.balanceOf(account1)).toNumber(), account1Balance - 1);
            assert.equal((await instance.balanceOf(receivingContractAddress)).toNumber(), 1);

        });


    });
});