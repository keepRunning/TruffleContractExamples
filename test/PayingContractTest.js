let PayingContract = artifacts.require('./PayingContract.sol');
// let PayableContract = artifacts.require('./PayableContract.sol');
// const truffleAssert = require('truffle-assertions');

contract('Paying contract', function (accounts) {
  it('should do its stuff', async () => {
    // let payableContractInstance = await PayableContract.deployed();
    let PayingContractInstance = await PayingContract.deployed();

    await PayingContractInstance.send(20, { from: accounts[0] });
    let newBal = await web3.eth.getBalance(PayingContractInstance.address);
    assert.equal(newBal, 20);

    // await PayingContractInstance.payPayableContract(payableContractInstance.address, 10);
    // return payableContractInstance.getBalance()
    //   .then((res) => {
    //     assert.equal(res, 10);
    //     return web3.eth.getBalance(PayingContractInstance.address);
    //   })
    //   .then((newBal) => {
    //     assert.equal(newBal, 10);
    //     return truffleAssert.reverts(PayingContractInstance.payPayableContract(payableContractInstance.address, 20));
    //   });
  });
});
