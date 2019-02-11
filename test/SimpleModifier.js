const SimpleModifier = artifacts.require('./SimpleModifier');

contract('SimpleModifier', function (accounts) {
  const addr1 = accounts[0];
  const addr2 = accounts[1];
  it('should return true', async () => {
    const instance = await SimpleModifier.deployed();
    const res = await instance.doSomething({ from: addr1 });
    console.log('res1', res);
    assert.isTrue(res);
  });

  it('should return error', async () => {
    const instance = await SimpleModifier.deployed();
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
