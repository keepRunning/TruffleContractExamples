let SimpleModifier = artifacts.require('./SimpleModifier');

contract('SimpleModifier', function (accounts) {
  let addr1 = accounts[0];
  let addr2 = accounts[1];
  it('should return true', async () => {
    let instance = await SimpleModifier.deployed();
    let res = await instance.doSomething({ from: addr1 });
    console.log('res1', res);
    assert.isTrue(res);
  });

  it('should return error', async () => {
    let instance = await SimpleModifier.deployed();
    let result;
    try {
      result = await instance.doSomething({ from: addr2 });
    } catch (e) {
      console.log(e);
      result = false;
    }
    assert.isFalse(result);
  });
});
