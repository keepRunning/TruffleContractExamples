let InheritanceParent = artifacts.require('./InheritanceParent');
let InheritanceChild = artifacts.require('./InheritanceChild');

contract('InheritanceTest', (accounts) => {
  // it('should test parent', async () => {
  //   let instance = await InheritanceParent.deployed();
  //   return instance.getParentString().then((res) => {
  //     assert.equal(res, 'BASE_VALUE');
  //     return instance.setString('NEW_VALUE');
  //   }).then(() => {
  //     return instance.getParentString();
  //   }).then((res2) => {
  //     assert.equal(res2, 'NEW_VALUE');
  //   });
  // });

  it('should test child', async () => {
    let instance = await InheritanceChild.deployed();
    let res = await instance.getChildString();
    console.log('res3333', res);
    assert.equal(res, 'BASE_VALUE_CHILD');

    await instance.setString('NEW_VALUE');

    let res2 = await instance.getParentString();
    assert.equal(res2, 'NEW_VALUE');

    let res3 = await instance.getChildString();
    assert.equal(res3, 'NEW_VALUE');
  });
});
