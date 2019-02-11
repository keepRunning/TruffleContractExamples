const ERC721Testable = artifacts.require('./ERC721Testable');
const ERC721Receiver = artifacts.require('./ERC721Receiver');
const ERC721ReceiverTestable = artifacts.require('./ERC721ReceiverTestable');
const truffleAssert = require('truffle-assertions');

const _ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

contract('ERC721', (accounts) => {
  let instance;
  let latestTokenId = 200;
  beforeEach(async () => {
    instance = await ERC721Testable.deployed();
  });

  describe('Premined coins', async () => {
    it('should have premined coins', async () => {
      assert.equal((await instance.getPremintedTokenCount()).toNumber(),
        (await instance.balanceOf(accounts[0])).toNumber());
    });

    it('token owner verification', async () => {
      assert.equal(await instance.ownerOf(1), accounts[0]);
      const count = await instance.getPremintedTokenCount();
      assert.equal(await instance.ownerOf(count), accounts[0]); // 1 indexed tokens
    });
  });

  describe('Transfer', async () => {
    const account1 = accounts[0];
    const account2 = accounts[1];
    const tokenId1 = 101;
    const tokenId2 = 102;
    const tokenId3 = 103;
    before(async () => {
      await instance.mint(account1, tokenId1);
      await instance.mint(account1, tokenId2);
      await instance.mint(account1, tokenId3);
    });

    it('should assign token after mint', async () => {
      assert.equal(await instance.ownerOf(tokenId1), account1);
      assert.equal(await instance.ownerOf(tokenId2), account1);
      assert.equal(await instance.ownerOf(tokenId3), account1);
    });

    it('should assign token to another EOA', async () => {
      const account1Balance = await instance.balanceOf(account1);
      const account2Balance = await instance.balanceOf(account2);

      const result = await instance.safeTransferFrom(account1, account2, tokenId1);
      // truffleAssert.prettyPrintEmittedEvents(result);
      truffleAssert.eventEmitted(result, 'Transfer', (filter) => {
        return filter.from === account1 && filter.to === account2 && filter.tokenId.toNumber() === tokenId1;
      });

      assert.equal(await instance.ownerOf(tokenId1), account2);
      assert.equal((await instance.balanceOf(account1)).toNumber(), account1Balance - 1);
      assert.equal((await instance.balanceOf(account2)).toNumber(), account2Balance + 1);
    });

    it('should assign token to a contract', async () => {
      const receivingContract = await ERC721Receiver.deployed();
      const receivingContractAddress = receivingContract.address;
      const account1Balance = await instance.balanceOf(account1);

      const result = await instance.safeTransferFrom(account1, receivingContractAddress, tokenId2);
      // truffleAssert.prettyPrintEmittedEvents(result);
      truffleAssert.eventEmitted(result, 'Transfer', (filter) => {
        return filter.from === account1 &&
        filter.to === receivingContractAddress &&
        filter.tokenId.toNumber() === tokenId2;
      });
      // truffleAssert.eventEmitted(receivingContract.address, 'Receive', (filter) => {
      //     console.log('filter', filter);
      //     return true;
      // });

      assert.equal(await instance.ownerOf(tokenId2), receivingContractAddress);
      assert.equal((await instance.balanceOf(account1)).toNumber(), account1Balance - 1);
      assert.equal((await instance.balanceOf(receivingContractAddress)).toNumber(), 1);
    });

    it('should fail due to incorrect response from receiving contract', async () => {
      const receivingContract = await ERC721ReceiverTestable.deployed();
      const receivingContractAddress = receivingContract.address;
      await truffleAssert.reverts(instance.safeTransferFrom(account1, receivingContractAddress, tokenId3));
      assert.equal(await instance.ownerOf(tokenId3), account1);
    });
  });

  describe('Approve and ApproveAll', async () => {
    const account1 = accounts[0];
    const account2 = accounts[1];
    const account3 = accounts[2];
    const operator = accounts[3];

    it('should set approver', async () => {
      console.log('account1', account1);
      const tokenId = await mintNewToken(account1);
      assert(await instance.getApproved(tokenId), 0);
      const result = await instance.approve(account2, tokenId, { from: account1 });
      truffleAssert.eventEmitted(result, 'Approval', (filter) => {
        return filter.owner === account1 && filter.approved === account2 && filter.tokenId.toNumber() === tokenId;
      });
      assert(await instance.getApproved(tokenId), account2);
    });

    it('should remove approval', async () => {
      const tokenId = await mintNewToken(account1);
      await instance.approve(account2, tokenId, { from: account1 });
      assert(await instance.getApproved(tokenId), account2);
      const result = await instance.approve(_ZERO_ADDRESS, tokenId, { from: account1 });
      truffleAssert.eventEmitted(result, 'Approval', (filter) => {
        return filter.owner === account1 && filter.approved === _ZERO_ADDRESS && filter.tokenId.toNumber() === tokenId;
      });
      assert(await instance.getApproved(tokenId), 0);
    });

    it('should transfer through a approver', async () => {
      const tokenId = await mintNewToken(account1);
      await instance.approve(account2, tokenId, { from: account1 });
      const result = await instance.safeTransferFrom(account1, account3, tokenId, { from: account2 });
      // truffleAssert.prettyPrintEmittedEvents(result);
      truffleAssert.eventEmitted(result, 'Transfer', (filter) => {
        return filter.from === account1 && filter.to === account3 && filter.tokenId.toNumber() === tokenId;
      });
      assert.equal(await instance.ownerOf(tokenId), account3);
    });

    it('should fail transfer when not approved', async () => {
      const tokenId = await mintNewToken(account1);
      await truffleAssert.reverts(instance.safeTransferFrom(account1, account3, tokenId, { from: account2 }));
    });

    it('should set ApproveAll', async () => {
      const result = await instance.setApprovalForAll(operator, true, { from: account1 });
      truffleAssert.eventEmitted(result, 'ApprovalForAll', (filter) => {
        return filter.owner === account1 && filter.operator === operator && filter.approved === true;
      });
      assert.equal(await instance.isApprovedForAll(account1, operator), true);
      assert.equal(await instance.isApprovedForAll(account1, operator, { from: account2 }), true);
    });

    it('should remove ApproveAll', async () => {
      const result = await instance.setApprovalForAll(operator, false, { from: account1 });
      truffleAssert.eventEmitted(result, 'ApprovalForAll', (filter) => {
        return filter.owner === account1 && filter.operator === operator && filter.approved === false;
      });
      assert.equal(await instance.isApprovedForAll(account1, operator), false);
      assert.equal(await instance.isApprovedForAll(account1, operator, { from: account2 }), false);
    });

    it('should tranfer token through a operator - ApproveAll', async () => {
      const tokenId = await mintNewToken(account1);
      await instance.setApprovalForAll(operator, true, { from: account1 });
      const result = await instance.safeTransferFrom(account1, account3, tokenId, { from: operator });
      truffleAssert.eventEmitted(result, 'Transfer', (filter) => {
        return filter.from === account1 && filter.to === account3 && filter.tokenId.toNumber() === tokenId;
      });
      assert.equal(await instance.ownerOf(tokenId), account3);
    });

    it('should fail tranfer when approve all is not set', async () => {
      const tokenId = await mintNewToken(account1);
      await instance.setApprovalForAll(operator, false, { from: account1 });
      await truffleAssert.reverts(instance.safeTransferFrom(account1, account3, tokenId, { from: operator }));
      assert.equal(await instance.ownerOf(tokenId), account1);
    });
  });

  async function mintNewToken (account) {
    const tokenId = ++latestTokenId;
    await instance.mint(account, tokenId);
    return tokenId;
  }
});
