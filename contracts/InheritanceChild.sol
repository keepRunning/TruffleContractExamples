pragma solidity ^0.4.0;

import "contracts/InheritanceParent.sol";
import "contracts/MathLibrary.sol";

contract InheritanceChild is InheritanceParent {
    string public childVal  = 'BASE_VALUE_CHILD';

    function getChildString() public view returns (string) {
        return childVal;
    }

     function setString(string newVal) public {
        val = newVal;
        childVal = newVal;
    }
}