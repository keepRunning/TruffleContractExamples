pragma solidity >=0.4.23 <0.6.0;

import "contracts/PayableContract.sol";

contract PayingContract {

    function () external payable {}

    function payPayableContract(address payable addr, uint amount) public {
        require(address(this).balance >= amount);
        addr.transfer(amount);
    }
}