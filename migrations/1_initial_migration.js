const Migrations = artifacts.require('./Migrations.sol');
const Hashtable = artifacts.require('./Hashtable.sol');
const MathLibrary = artifacts.require('./MathLibrary.sol');
const Math1 = artifacts.require('./Math.sol');
const SimpleModifier = artifacts.require('./SimpleModifier.sol');
const InheritanceParent = artifacts.require('./InheritanceParent.sol');
const InheritanceChild = artifacts.require('./InheritanceChild.sol');
const PayableContract = artifacts.require('./PayableContract.sol');
const PayingContract = artifacts.require('./PayingContract.sol');
const ERC721Testable = artifacts.require('./ERC721/ERC721Testable.sol');
const ERC721Receiver = artifacts.require('ERC721/ERC721Receiver.sol');
const ERC721ReceiverTestable = artifacts.require('ERC721/ERC721ReceiverTestable.sol');

module.exports = function (deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(Hashtable);
  deployer.deploy(MathLibrary)
    .then(() => {
      deployer.deploy(Math1);
    })
    .catch((ex) => { });
  // deployer.link(MathLibrary, Math1);
  deployer.deploy(SimpleModifier);
  deployer.deploy(InheritanceParent);
  deployer.deploy(InheritanceChild);
  deployer.deploy(PayableContract);
  deployer.deploy(PayingContract);
  // deployer.deploy(ERC721);
  deployer.deploy(ERC721Testable);
  deployer.deploy(ERC721Receiver);
  deployer.deploy(ERC721ReceiverTestable, true);
};
