var InheritanceParent = artifacts.require("./InheritanceParent");
var InheritanceChild = artifacts.require("./InheritanceChild");

contract("InheritanceTest", function(accounts) {
    it('should test parent', async () => {
        let instance = await InheritanceParent.deployed();
        let res = await instance.getString();
        assert.equal(res, 'BASE_VALUE');

        await instance.setString('NEW_VALUE');

        let res2 = await instance.getString();
        assert.equal(res2, 'NEW_VALUE');
    });

    it('should test child', async () => {
        let instance = await InheritanceChild.deployed();
        let res = instance.getChildString();
        console.log('res3333', res);
        res = await res;
        assert.equal(res, 'BASE_VALUE_CHILD');

        await instance.setString('NEW_VALUE');

        let res2 = await instance.getString();
        assert.equal(res2, 'NEW_VALUE');

        let res3 = await instance.getChildString();
        assert.equal(res3, 'NEW_VALUE');
    });
});