pragma solidity >=0.4.23 <0.6.0;

contract PayableContract {
    function () external payable {
    }
    
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

}