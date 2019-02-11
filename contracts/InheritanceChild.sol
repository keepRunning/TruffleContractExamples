pragma solidity >=0.4.23 <0.6.0;

import "contracts/InheritanceParent.sol";

contract InheritanceChild is InheritanceParent {
    string public childVal  = 'BASE_VALUE_CHILD';

    function getChildString() public view returns (string memory) {
        return childVal;
    }

     function setString(string memory newVal) public {
        val = newVal;
        childVal = newVal;
    }
}