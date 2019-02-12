let PayableContract = artifacts.require('./PayableContract.sol');

contract('PayableContract', (accounts) => {
  it('should have zero balance', async () => {
    let instance = await PayableContract.deployed();
    return instance.getBalance()
    .then((bal) => {
      assert.equal(bal, 0);
    })
    .catch((err) => {
      console.log(err);
    });    
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

  // it('should have more balance', async () => {
  //   let instance = await PayableContract.deployed();
  //   return instance.send(10, { from: accounts[0] })
  //   .then(() => {
  //     return instance.getBalance();
  //   })    
  //   .then((bal) => {
  //     assert.equal(bal, 10);
  //   });
  // });
});
