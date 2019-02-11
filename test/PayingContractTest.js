let PayingContract = artifacts.require('./PayingContract.sol');
let PayableContract = artifacts.require('./PayableContract.sol');

contract('Paying contract', function (accounts) {
  it('should do its stuff', async () => {
    let payableContractInstance = await PayableContract.deployed();
    let PayingContractInstance = await PayingContract.deployed();
    
    await PayingContractInstance.send(20, { from: accounts[0] });
    let newBal = await web3.eth.getBalance(PayingContractInstance.address);
    assert.equal(newBal, 20);

    await PayingContractInstance.payPayableContract(payableContractInstance.address, 10);
    let res = await payableContractInstance.getBalance();
    assert.equal(res, 10);

    newBal = await web3.eth.getBalance(PayingContractInstance.address);
    assert.equal(newBal, 10);

    try {
      await PayingContractInstance.payPayableContract(payableContractInstance.address, 20);
      assert(false);
    } catch (e) {
      assert(true);
    }
  });
});
