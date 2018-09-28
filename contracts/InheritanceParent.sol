pragma solidity ^0.4.23;

contract InheritanceParent {
    string public val = 'BASE_VALUE';

    function getString() public view returns (string) {
        return val;
    }

    function setString(string newVal) public {
        val = newVal;
    }
}