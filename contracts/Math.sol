pragma solidity ^0.4.23;

import "contracts/MathLibrary.sol";

contract Math {
    using MathLibrary for uint;

    function increment(uint val) public pure returns(uint) {
        return  val.increment();
    }

    function decrement(uint val) public pure returns(uint) {
        return val.decrement();
    }
}