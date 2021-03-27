const Token = artifacts.require("./Token.sol");

contract("Token", () => {
  let token
  it("Creates Token on Network", async () => {
    token = await Token.deployed()
    const totalSupply = await token.totalSupply()
    assert.equal(await token.constructor.web3.utils.fromWei(totalSupply.toString()), 10000)
    assert.equal(await token.name(), "Corwintine")
    assert.equal(await token.symbol(), "CRWN")
  })

  it("Successful transfer from one account to another", async () => {
    token = await Token.deployed()
    const accounts = await token.constructor.web3.eth.getAccounts()
    let account1Total = await token.balanceOf(accounts[0])
    let account2Total = await token.balanceOf(accounts[1])

    assert.equal(await token.constructor.web3.utils.fromWei(account1Total.toString()), 10000)
    assert.equal(await token.constructor.web3.utils.fromWei(account2Total.toString()), 0)

    await token.transfer(accounts[1], token.constructor.web3.utils.toWei('10'))
    account1Total = await token.balanceOf(accounts[0])
    account2Total = await token.balanceOf(accounts[1])

    assert.equal(await token.constructor.web3.utils.fromWei(account1Total.toString()), 9990)
    assert.equal(await token.constructor.web3.utils.fromWei(account2Total.toString()), 10)
  })

  it("Failed transfer from one account to another", async () => {
    token = await Token.deployed()
    try {
      const accounts = await token.constructor.web3.eth.getAccounts()
      await token.transfer(accounts[0], 10000000)
    } catch (err) {
      assert.equal(err.reason, "ERC20: transfer amount exceeds balance")
    }
  })
})