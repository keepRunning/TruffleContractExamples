pragma solidity ^0.4.23;
import "contracts/PayableContract.sol";

contract PayingContract {

    function () public payable {}

    function payPayableContract(address addr, uint amount) public {
        require(address(this).balance >= amount);
        addr.transfer(amount);
    }
}