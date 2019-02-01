pragma solidity >=0.4.23 <0.6.0;

contract ERC223ReceivingContract { 
    function tokenFallback(address _from, uint _value, bytes memory _data) public;
}