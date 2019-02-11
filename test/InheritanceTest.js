const InheritanceParent = artifacts.require('./InheritanceParent');
const InheritanceChild = artifacts.require('./InheritanceChild');

contract('InheritanceTest', function (accounts) {
  it('should test parent', async () => {
    const instance = await InheritanceParent.deployed();
    const res = await instance.getString();
    assert.equal(res, 'BASE_VALUE');

    await instance.setString('NEW_VALUE');

    const res2 = await instance.getString();
    assert.equal(res2, 'NEW_VALUE');
  });

  it('should test child', async () => {
    const instance = await InheritanceChild.deployed();
    let res = instance.getChildString();
    console.log('res3333', res);
    res = await res;
    assert.equal(res, 'BASE_VALUE_CHILD');

    await instance.setString('NEW_VALUE');

    const res2 = await instance.getString();
    assert.equal(res2, 'NEW_VALUE');

    const res3 = await instance.getChildString();
    assert.equal(res3, 'NEW_VALUE');
  });
});
