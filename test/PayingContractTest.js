let PayingContract = artifacts.require('./PayingContract.sol');
let PayableContract = artifacts.require('./PayableContract.sol');

contract('Paying contract', function (accounts) {
  it('should do its stuff', async () => {
    let payableContractPromise = PayableContract.deployed();
    let payingContractPromise = PayingContract.deployed();
    await Promise.all([payableContractPromise, payingContractPromise]);
    let payableContract;
    let payingContract;
    await payableContractPromise.then((res) => { payableContract = res; });
    await payingContractPromise.then((res) => { payingContract = res; });

    await payingContract.send(20, { from: accounts[0] });
    let newBal = await web3.eth.getBalance(payingContract.address);
    assert.equal(newBal, 20);

    await payingContract.payPayableContract(payableContract.address, 10);
    let res = await payableContract.getBalance();
    assert.equal(res, 10);

    newBal = await web3.eth.getBalance(payingContract.address);
    assert.equal(newBal, 10);

    assert(true);

    try {
      await payingContract.payPayableContract(payableContract.address, 20);
      assert(false);
    } catch (e) {
      assert(true);
    }
  });
});
