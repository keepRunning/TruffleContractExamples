pragma solidity ^0.4.23;

contract PayableContract {
    function () public payable {
    }
    
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

}