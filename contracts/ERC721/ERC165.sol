pragma solidity >=0.4.23 <0.6.0;

import { IERC165 } from './IERC165.sol';

contract ERC165 is IERC165 {
    bytes4 private constant _INTERFACE_ID_ERC165 = 0x01ffc9a7;
    mapping(bytes4 => bool) _interfaceSupported;

    constructor() internal {
        registerInterface(_INTERFACE_ID_ERC165);
    }

    function supportsInterface(bytes4 interfaceId) external view returns (bool) {
        return _interfaceSupported[interfaceId];
    }

    function registerInterface(bytes4 interfaceId) internal {
        _interfaceSupported[interfaceId] = true;
    }
}