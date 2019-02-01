pragma solidity >=0.4.23 <0.6.0;

contract Hashtable {
    mapping(bytes32 => bytes32) public hashtable;

    function containsKey(bytes32 key) public view returns (bool) {
        if(hashtable[key] == 0x0) {
            return false;
        }
        return true;
    }

    function getValue(bytes32 key) public view returns (bytes32) {
        return hashtable[key];
    }

    function setValue(bytes32 key, bytes32 value) public payable {

        hashtable[key] = value;
    }
}