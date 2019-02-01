pragma solidity >=0.4.23 <0.6.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "contracts/Math.sol";

contract TestMath {
    function testFunctions() public {
        Math math = new Math();
        Assert.equal(math.increment(10), 11, '');
        Assert.equal(math.decrement(10), 9, '');
    }
}

