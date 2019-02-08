pragma solidity >= 0.4.23 <0.6.0;

import { ERC165 } from './ERC165.sol';
import { IERC721 } from './IERC721.sol';
import { IERC721Receiver } from './IERC721Receiver.sol';

contract ERC721 is IERC721, ERC165 {

    mapping(address => uint256) _tokenCount;
    mapping(uint256 => address) _tokenOwner;
    mapping(uint256 => address) _tokenApproval;
    mapping(address => mapping(address => bool)) _tokenApprovalOperator;
    bytes4 private constant _ERCReceivingContractCode = 0x150b7a02; //bytes4(keccak("onERC721Received(address,address,uint256,bytes)"))
    bytes4 private constant _INTERFACE_ID_ERC721 = 0x80ac58cd;
    /*
     * 0x80ac58cd ===
     *     bytes4(keccak256('balanceOf(address)')) ^                                70a08231b98ef4ca268c9cc3f6b4590e4bfec28280db06bb5d45e689f2a360be
     *     bytes4(keccak256('ownerOf(uint256)')) ^                                  6352211e6566aa027e75ac9dbf2423197fbd9b82b9d981a3ab367d355866aa1c
     *     bytes4(keccak256('approve(address,uint256)')) ^                          095ea7b334ae44009aa867bfb386f5c3b4b443ac6f0ee573fa91c4608fbadfba
     *     bytes4(keccak256('getApproved(uint256)')) ^                              081812fc55e34fdc7cf5d8b5cf4e3621fa6423fde952ec6ab24afdc0d85c0b2e
     *     bytes4(keccak256('setApprovalForAll(address,bool)')) ^                   a22cb4651ab9570f89bb516380c40ce76762284fb1f21337ceaf6adab99e7d4a
     *     bytes4(keccak256('isApprovedForAll(address,address)')) ^                 e985e9c5c6636c6879256001057b28ccac7718ef0ac56553ff9b926452cab8a3
     *     bytes4(keccak256('transferFrom(address,address,uint256)')) ^             23b872dd7302113369cda2901243429419bec145408fa8b352b3dd92b66c680b
     *     bytes4(keccak256('safeTransferFrom(address,address,uint256)')) ^         42842e0eb38857a7775b4e7364b2775df7325074d088e7fb39590cd6281184ed
     *     bytes4(keccak256('safeTransferFrom(address,address,uint256,bytes)'))     b88d4fde60196325a28bb7f99a2582e0b46de55b18761e960c14ad7a32099465
     *
     *  In python console
     *  res = 0x70a08231 ^ 0x6352211e ^ 0x095ea7b3 ^ 0x081812fc ^ 0xa22cb465 ^ 0xe985e9c5 ^ 0x23b872dd ^ 0x42842e0e ^ 0xb88d4fde
     *  '{:x}'.format(res)
     */

    uint32 private constant _PREMINTED_TOKEN_COUNT = 100;
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    constructor() public {
        registerInterface(_INTERFACE_ID_ERC721);
    }

    function balanceOf(address owner) public view returns (uint256 balance) {
        require(owner != address(0));
        balance = _tokenCount[owner];
    }

    function ownerOf(uint256 tokenId) public view returns (address owner) {
        // require(tokenId != 0);
        require(_tokenOwner[tokenId] != address(0));
        owner = _tokenOwner[tokenId];
    }

    /**
     * @dev Approves another address to transfer the given token ID
     * The zero address indicates there is no approved address.
     * There can only be one approved address per token at a given time.
     * Can only be called by the token owner or an approved operator.
     * @param to address to be approved for the given token ID
     * @param tokenId uint256 ID of the token to be approved
     */
    function approve(address to, uint256 tokenId) public {        
        address owner = _tokenOwner[tokenId];
        require(to != owner);
        require(owner == msg.sender || _tokenApprovalOperator[owner][msg.sender] == true);

        _tokenApproval[tokenId] = to;
        emit Approval(owner, to, tokenId);
    }

    /**
     * @dev Gets the approved address for a token ID, or zero if no address set
     * Reverts if the token ID does not exist.
     * @param tokenId uint256 ID of the token to query the approval of
     * @return address currently approved for the given token ID
     */
    function getApproved(uint256 tokenId) public view returns (address operator) {
        require(_tokenExists(tokenId));
        operator = _tokenApproval[tokenId];
    }

    /**
     * @dev Sets or unsets the approval of a given operator
     * An operator is allowed to transfer all tokens of the sender on their behalf
     * @param to operator address to set the approval
     * @param approved representing the status of the approval to be set
     */
    function setApprovalForAll(address operator, bool approved) public {
        require(operator != msg.sender);
        require(operator != address(0));
        _tokenApprovalOperator[msg.sender][operator] = approved;
    }

    /**
     * @dev Tells whether an operator is approved by a given owner
     * @param owner owner address which you want to query the approval of
     * @param operator operator address which you want to query the approval of
     * @return bool whether the given operator is approved by the given owner
     */
    function isApprovedForAll(address owner, address operator) public view returns (bool) {
        return _tokenApprovalOperator[owner][operator];
    }

    /**
     * @dev Transfers the ownership of a given token ID to another address
     * Usage of this method is discouraged, use `safeTransferFrom` whenever possible
     * Requires the msg.sender to be the owner, approved, or operator
     * @param from current owner of the token
     * @param to address to receive the ownership of the given token ID
     * @param tokenId uint256 ID of the token to be transferred
     */
    function transferFrom(address from, address to, uint256 tokenId) public {        
        _validateTransfer(from, to, tokenId);
        _doTransfer(from, to, tokenId);
        emit Transfer(from, to, tokenId);
    }

    /**
     * @dev Internal function to transfer ownership of a given token ID to another address.
     * As opposed to transferFrom, this imposes no restrictions on msg.sender.
     * @param from current owner of the token
     * @param to address to receive the ownership of the given token ID
     * @param tokenId uint256 ID of the token to be transferred
     */
    function safeTransferFrom(address from, address to, uint256 tokenId) public {
        safeTransferFrom(from, to, tokenId, "");
    }

    /// @notice Transfers the ownership of an NFT from one address to another address
    /// @dev Throws unless `msg.sender` is the current owner, an authorized
    ///  operator, or the approved address for this NFT. Throws if `_from` is
    ///  not the current owner. Throws if `_to` is the zero address. Throws if
    ///  `_tokenId` is not a valid NFT. When transfer is complete, this function
    ///  checks if `_to` is a smart contract (code size > 0). If so, it calls
    ///  `onERC721Received` on `_to` and throws if the return value is not
    ///  `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`.
    /// @param _from The current owner of the NFT
    /// @param _to The new owner
    /// @param _tokenId The NFT to transfer
    /// @param data Additional data with no specified format, sent in call to `_to`
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public {
        _validateTransfer(from, to, tokenId);
        _doTransfer(from, to, tokenId);
        if(_isContract(to)) {
            require(_isERC721Received(from, to, tokenId, data));
        }
        emit Transfer(from, to, tokenId);
    }

    function _tokenExists(uint256 tokenId) internal view returns(bool) {
        return _tokenOwner[tokenId] != address(0);
    }

    function _validateTransfer(address from, address to, uint256 tokenId) internal {
        address owner = _tokenOwner[tokenId];
        require(from == owner);
        require(to != address(0));
        require(msg.sender == owner || msg.sender == _tokenApproval[tokenId] || _tokenApprovalOperator[owner][msg.sender] == true);
    }

    function _doTransfer(address from, address to, uint256 tokenId) internal {
        _tokenOwner[tokenId] = to;
        _tokenCount[from]--;
    }

    function _isContract(address addr) internal returns (bool) {
        uint256 size;
        assembly { size := extcodesize(addr) }
        return size > 0;
    }

    function _isERC721Received(address from, address to, uint256 tokenId, bytes memory data) internal returns (bool) {
        bytes4 retval = IERC721Receiver(to).onERC721Received(msg.sender, from, tokenId, data);
    }

    function _mint(address to, uint256 tokenId) internal {
        require(to != address(0));
        require(_tokenOwner[tokenId] == address(0));

        _tokenOwner[tokenId] = to;
        _tokenCount[to]++;

        emit Transfer(address(0), to, tokenId);
    }

    function _premintTokens() internal {
        for(uint32 i = 1; i <= _PREMINTED_TOKEN_COUNT; i++) {
            _mint(msg.sender, i);
        }
    }
}