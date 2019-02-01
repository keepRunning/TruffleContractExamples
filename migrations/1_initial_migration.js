var Migrations = artifacts.require("./Migrations.sol");
var Hashtable = artifacts.require("./Hashtable.sol");
var MathLibrary = artifacts.require("./MathLibrary.sol");
var Math1 = artifacts.require("./Math.sol");
var SimpleModifier = artifacts.require("./SimpleModifier.sol");
var InheritanceParent = artifacts.require("./InheritanceParent.sol");
var InheritanceChild = artifacts.require("./InheritanceChild.sol");
var PayableContract = artifacts.require("./PayableContract.sol");
var PayingContract = artifacts.require("./PayingContract.sol"); 

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(Hashtable);
  deployer.deploy(MathLibrary).then(() => {
    deployer.deploy(Math1);
  });
  //deployer.link(MathLibrary, Math1);
  deployer.deploy(SimpleModifier);
  deployer.deploy(InheritanceParent);
  deployer.deploy(InheritanceChild);
  deployer.deploy(PayableContract);
  deployer.deploy(PayingContract);
};
