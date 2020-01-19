pragma solidity 0.5.8;

import "../contracts/Ilighthouse.sol";
import "@openzeppelin/upgrades/contracts/Initializable.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/drafts/Strings.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC721/ERC721Enumerable.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC721/ERC721Metadata.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC721/ERC721Pausable.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/ERC20Detailed.sol";

contract IDRTCashV1 is Initializable, ERC721Enumerable, ERC721Metadata, ERC721Pausable {
    // Rhombus lighthouse
    ILighthouse public lighthouse; 

    // ERC20 contract address
    ERC20Detailed public erc20;

    // ERC20 decimals
    uint internal erc20Decimals;

    // Base URI
    string internal _baseURI;

    // Mapping from token ID to token denominations
    mapping (uint256 => uint) public tokenDenom;

    // The IDRTCash denominations is indexed by `denominations` array
    uint[] public denominations;
    uint internal denominations_length;
    
    modifier onlyOwnerOf(uint tokenId) {
        require(_msgSender() == ownerOf(tokenId), "IDRTCash: msg.sender is not the owner of the token");
        _;
    }

    modifier hasEnoughAllowance(uint amount) {
        require(erc20.allowance(_msgSender(), address(this)) >= amount, "IDRTCash: there is not enough allowance to spend on behalf of msg.sender, please enable the token first");
        _;
    }

    function initialize(uint[] calldata denoms, address erc20Address, address lighthouseAddress) initializer external {
        ERC721.initialize();
        ERC721Enumerable.initialize();
        ERC721Metadata.initialize("IDRTCash", "IDRTC");
        ERC721Pausable.initialize(_msgSender());
        
        erc20 = ERC20Detailed(erc20Address);
        erc20Decimals = erc20.decimals();

        denominations = denoms;
        denominations_length = denoms.length;

        lighthouse = ILighthouse(lighthouseAddress);
    }

    /**
    * @dev Returns the base URI set via {_setBaseURI}. This will be
    * automatically added as a preffix in {tokenURI} to each token's URI, when
    * they are non-empty.
    */
    function baseURI() external view returns (string memory) {
        return _baseURI;
    }

    /**
     * @dev Returns the URI for a given token ID. May return an empty string.
     *
     * If the token's URI is non-empty and a base URI was set (via
     * {_setBaseURI}), it will be added to the token ID's URI as a prefix.
     *
     * Reverts if the token ID does not exist.
     */
    function tokenURI(uint256 tokenId) external view returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        // abi.encodePacked is being used to concatenate strings
        return string(abi.encodePacked(_baseURI, Strings.fromUint256(tokenId), ".json"));
    }

    function makingChange(uint remainder) internal returns (uint[] memory, uint) {
        uint[] memory result = new uint[](denominations_length);
        
        for (uint i = denominations_length; i > 0; i--) {
            while (remainder >= denominations[i - 1]) {
                result[i - 1]++;
                remainder -= denominations[i - 1];
            }
        }

        return (result, remainder);
    }

    function mint(uint amount) hasEnoughAllowance(amount) whenNotPaused public {
        (uint randomNumber, bool ok) = lighthouse.peekData();
        require(ok, "IDRTCashV1: Rhombus oracle contract does not return `ok`");

        uint mintAmount = amount.div(10 ** erc20Decimals);
        (uint[] memory mcArray, uint remainder) = makingChange(mintAmount);

        for (uint i; i < mcArray.length; i++) {
            while (mcArray[i] > 0) {
                uint localNonce = mcArray[i];
                uint denomIndex = i;
                uint tokenId = uint(keccak256(abi.encodePacked(localNonce, denomIndex, _msgSender(), randomNumber, blockhash(block.number - 1))));

                _mint(_msgSender(), tokenId);
                tokenDenom[tokenId] = denomIndex;

                mcArray[i]--;
            }
        }

        require(erc20.transferFrom(_msgSender(), address(this), mintAmount.sub(remainder).mul(10 ** erc20Decimals)));
    }

    function burn(uint tokenId) onlyOwnerOf(tokenId) whenNotPaused public {
        _burn(_msgSender(), tokenId);
        
        uint transferAmount = denominations[tokenDenom[tokenId]].mul(10 ** erc20Decimals);
        delete tokenDenom[tokenId];

        require(erc20.transfer(_msgSender(), transferAmount), "IDRTCash: ERC20 token transfer failed");
    }

    function burnBatch(uint[] memory tokenIds) whenNotPaused public {
        for (uint i; i < tokenIds.length; i++) {
            burn(tokenIds[i]);
        }
    }
}