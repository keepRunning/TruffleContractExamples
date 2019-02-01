pragma solidity >=0.4.23 <0.6.0;

contract InheritanceParent {
    string public val = 'BASE_VALUE';

    function getString() public view returns (string memory) {
        return val;
    }

    function setString(string memory newVal) public {
        val = newVal;
    }
}