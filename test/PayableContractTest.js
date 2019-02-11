const PayableContract = artifacts.require('./PayableContract.sol');

contract('PayableContract', function (accounts) {
  it('should have zero balance', async () => {
    const instance = await PayableContract.deployed();
    const bal = await instance.getBalance();
    console.log('bal', bal);
    assert.equal(bal, 0);
  });

  it('should have zero balance - promise based', async () => {
    return PayableContract.deployed()
      .then((instance) => {
        return instance.getBalance();
      })
      .then((res) => {
        console.log('res', res);
        assert.equal(res, 0);
      })
      .catch((err) => { console.log(err); });
  });

  it('should have more balance', async () => {
    const instance = await PayableContract.deployed();
    await instance.send(10, { from: accounts[0] });
    const bal = await instance.getBalance();
    console.log('bal', bal);
    assert.equal(bal, 10);
  });
});
