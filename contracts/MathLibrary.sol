pragma solidity ^0.4.23;

library MathLibrary {
     function increment(uint _self) public pure returns (uint) {
        return _self + 1;
    }
    
      function decrement(uint _self) public pure returns (uint) {
        return _self - 1;
    }
}