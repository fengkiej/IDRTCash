pragma solidity 0.5.8;

import "@openzeppelin/contracts/lifecycle/Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";
import "@openzeppelin/upgrades/contracts/Initializable.sol";
import "../contracts/Ilighthouse.sol";

contract IDRTCashV1 is Initializable, ERC721Enumerable, Pausable {
    ILighthouse public lighthouse; 

    // ERC20 contract address
    ERC20Detailed public erc20;

    // ERC20 decimals
    uint internal erc20Decimals;

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
        erc20 = ERC20Detailed(erc20Address);
        erc20Decimals = erc20.decimals();

        denominations = denoms;
        denominations_length = denoms.length;

        _addPauser(_msgSender());
        
        lighthouse = ILighthouse(lighthouseAddress);
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

    function mint(uint amount) hasEnoughAllowance(amount) whenNotPaused external {
        (uint randomNumber, bool ok) = lighthouse.peekData();
        require(ok, "IDRTCashV1: Rhombus oracle contract does not return `ok`");

        uint mintAmount = amount.div(10 ** erc20Decimals);
        (uint[] memory mcArray, uint remainder) = makingChange(mintAmount);

        for (uint i; i < mcArray.length; i++) {
            while (mcArray[i] > 0) {
                uint nonce = mcArray[i];
                uint denomIndex = i;
                uint tokenId = uint(keccak256(abi.encodePacked(nonce, denomIndex, _msgSender(), randomNumber)));

                _mint(_msgSender(), tokenId);
                tokenDenom[tokenId] = denomIndex;

                mcArray[i]--;
            }
        }

        require(erc20.transferFrom(_msgSender(), address(this), mintAmount.sub(remainder).mul(10 ** erc20Decimals)));
    }

    function burn(uint tokenId) onlyOwnerOf(tokenId) whenNotPaused external {
        _burn(_msgSender(), tokenId);
        
        uint transferAmount = denominations[tokenDenom[tokenId]].mul(10 ** erc20Decimals);
        delete tokenDenom[tokenId];

        require(erc20.transfer(_msgSender(), transferAmount), "IDRTCash: ERC20 token transfer failed");
    }

    function burnBatch(uint[] calldata tokenIds) whenNotPaused external {
        for (uint i; i < tokenIds.length; i++) {
            burn(tokenIds[i]);
        }
    }
}