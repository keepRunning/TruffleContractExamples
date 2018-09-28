pragma solidity ^0.4.23;

contract SimpleModifier {

    address owner;
    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(owner == msg.sender);
        _;
    }

    function doSomething() public view onlyOwner() returns (bool) {
        return true;
    }
}