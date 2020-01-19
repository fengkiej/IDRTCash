const {
    constants,
    expectEvent,
    expectRevert
} = require("@openzeppelin/test-helpers");
const { TestHelper } = require('@openzeppelin/cli');
const { Contracts  } = require('@openzeppelin/upgrades');
const { MAX_UINT256, ZERO_ADDRESS } = constants;

const OZIDRTCashV1 = Contracts.getFromLocal('IDRTCashV1');
const OZIDRTCashV2 = Contracts.getFromLocal('IDRTCashV2');

const ERC20IDRT = artifacts.require("ERC20IDRTSample");
const Lighthouse = artifacts.require("Lighthouse");
const IDRTCashV1 = artifacts.require("IDRTCashV1");
const IDRTCashV2 = artifacts.require("IDRTCashV2");

contract('IDRTCashV1', ([admin, user, other]) => {
    beforeEach(async function () {
        this.project = await TestHelper();
        this.IDRTCashV1Proxy = await this.project.createProxy(OZIDRTCashV1);
        
        this.denominations = [1000, 2000, 5000, 10000, 20000, 50000, 100000];
        this.erc20 = await ERC20IDRT.new({ from: admin });
        this.lighthouse = await Lighthouse.new({ from: admin });

        this.erc20Decimals = await this.erc20.decimals();
        this.contract = await IDRTCashV1.at(this.IDRTCashV1Proxy.address);

        await this.erc20.transfer(user, 100000000, { from: admin });
        await this.lighthouse.write(0, 0);
        await this.contract.initialize(this.denominations, this.erc20.address, this.lighthouse.address);
    });

    describe('V1', function() {
        describe('Denominations', function () {
            it('should have correct IDR denominations', async function () {
                this.denominations.forEach(async (item, index) => {
                    assert.equal(await this.contract.denominations(index), item);
                });
            });
        });

        describe('Approval', function () {
            describe('IDRTCashV1 is not approved to spend user\'s funds', function () {
                it('should reverts mint transaction', async function () {
                    await expectRevert(this.contract.mint(this.denominations[0] ** this.erc20Decimals, { from: user }),
                        "IDRTCash: there is not enough allowance to spend on behalf of msg.sender, please enable the token first");
                });
            });

            describe('IDRTCashV1 is approved to spend user\'s funds', async function () {
                beforeEach(async function () {
                    await this.erc20.approve(this.contract.address, MAX_UINT256, { from: user });
                });
                
                it('should execute mint transaction', async function () {
                    expectEvent(await this.contract.mint(this.denominations[0] * (10 ** this.erc20Decimals), { from: user }), "Transfer");
                });
            });
        });

        describe('Minting', function () {
            beforeEach(async function () {
                await this.erc20.approve(this.contract.address, MAX_UINT256, { from: user });
            });

            it("should mint multiple ERC721 tokens", async function () {
                const mintAmount = 188000 * (10 ** this.erc20Decimals); // Sum of all denominations, using Greedy should mint 1 each
                expectEvent(await this.contract.mint(mintAmount , { from: user }), "Transfer");

                this.denominations.forEach(async (_, index) => {
                    let tokenId = await this.contract.tokenOfOwnerByIndex(user, index);
                    assert.equal(await this.contract.tokenDenom(tokenId), index);
                });
            });

            it("should receive the minted amount of token", async function () {
                const sendAmount = this.denominations[0] * (10 ** this.erc20Decimals);
                expectEvent(await this.contract.mint(sendAmount , { from: user }), "Transfer");
                assert.equal(await this.erc20.balanceOf(this.contract.address), sendAmount);
            });

            it("should not receive the token that is not minted", async function () {
                const mintAmount = this.denominations[0] * (10 ** this.erc20Decimals);
                const sendAmount = this.denominations[0] * (10 ** this.erc20Decimals) + 1;
                expectEvent(await this.contract.mint(sendAmount , { from: user }), "Transfer");
                assert.equal(await this.erc20.balanceOf(this.contract.address), mintAmount);
            });

            it("should revert if balance less than amount", async function () {
                // 200000000 is greater than { ERC20IDRTSample initial minted amount to account[0] }
                await expectRevert(this.contract.mint(200000000, { from: user }), "ERC20: transfer amount exceeds balance");
            });

            it("should revert if the contract is paused", async function() {
                await this.contract.pause({ from: admin });

                await expectRevert(this.contract.mint(100, { from: user }), "Pausable: paused");
            });
        });

        describe('Burning', function () {
            beforeEach(async function () {
                await this.erc20.approve(this.contract.address, MAX_UINT256, { from: user });

                const mintAmount = 188000 * (10 ** this.erc20Decimals); // Sum of all denominations, using Greedy should mint 1 each
                expectEvent(await this.contract.mint(mintAmount , { from: user }), "Transfer");
            });

            it("should burn the token if burn(tokenId) is called by its owner", async function () {
                const tokenId = await this.contract.tokenOfOwnerByIndex(user, 0);
                expectEvent(await this.contract.burn(tokenId , { from: user }), "Transfer", { from: user, to: ZERO_ADDRESS, tokenId: tokenId });
            });

            it("should burn multiple tokens if burnBatch(tokenIds[]) is called by its owner", async function () {
                let tokenIds = [];

                for (const index in this.denominations) {
                    let tokenId = await this.contract.tokenOfOwnerByIndex(user, index);
                    tokenIds.push(tokenId);
                }
                burnBatchTx = await this.contract.burnBatch(tokenIds, { from: user });

                tokenIds.forEach((tokenId, _) => {
                    expectEvent(burnBatchTx, "Transfer", { from: user, to: ZERO_ADDRESS, tokenId: tokenId })
                })
            });

            it("should revert if the contract is paused", async function() {
                await this.contract.pause({ from: admin });

                let tokenId = await this.contract.tokenOfOwnerByIndex(user, 0);
                await expectRevert(this.contract.mint(tokenId, { from: user }), "Pausable: paused");
            });

            it("should revert for invalid tokenId", async function () {
                await expectRevert(this.contract.burn(MAX_UINT256 , { from: user }), "ERC721: owner query for nonexistent token");
            });

            it("should revert if some tokens in tokenIds is not owned by user on burnBatch(tokenIds[])", async function () {            
                let tokenIds = [];

                for (const index in this.denominations) {
                    let tokenId = await this.contract.tokenOfOwnerByIndex(user, index);
                    tokenIds.push(tokenId);
                }

                await this.contract.transferFrom(user, other, tokenIds[1], { from: user });

                await expectRevert(this.contract.burnBatch(tokenIds, { from: other }), "IDRTCash: msg.sender is not the owner of the token");
            });

            it("should revert if some tokens in tokenIds is invalid on burnBatch(tokenIds[])", async function () {        
                let tokenIds = [];

                for (const index in this.denominations) {
                    let tokenId = await this.contract.tokenOfOwnerByIndex(user, index);
                    tokenIds.push(tokenId);
                }
                tokenIds.push(MAX_UINT256);

                await expectRevert(this.contract.burnBatch(tokenIds, { from: other }), "IDRTCash: msg.sender is not the owner of the token");
            });

            it("should revert if sender does not own the token", async function () {
                const tokenId = await this.contract.tokenOfOwnerByIndex(user, 0);
                await expectRevert(this.contract.burn(tokenId , { from: other }), "IDRTCash: msg.sender is not the owner of the token");
            });
        });
    });
});