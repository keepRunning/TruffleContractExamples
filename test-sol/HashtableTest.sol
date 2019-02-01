pragma solidity >=0.4.23 <0.6.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Hashtable.sol";

contract HashtableTest {
    function testSetValue() public {
        Hashtable ht = new Hashtable();
        bytes32 key = "Hello";
        bytes32 value = "Result";
        ht.setValue(key, value);

        Assert.equal(ht.getValue(key), value , "Test Failed");
    }

    function testContainsKey() public {
        Hashtable ht = new Hashtable();
        ht.setValue("ABC", "DEF");
        Assert.isTrue(ht.containsKey("ABC"), "");
        Assert.isFalse(ht.containsKey("ABCD"), "");
    }
}


