pragma solidity >=0.4.23 <0.6.0;

import { ERC721 } from"./ERC721.sol";

contract ERC721Testable is ERC721 {

    function getPremintedTokenCount() public pure returns (uint256) {
        return _PREMINTED_TOKEN_COUNT;
    }

    function mint(address to, uint256 tokenId) public {
        _mint(to, tokenId);
    }
}