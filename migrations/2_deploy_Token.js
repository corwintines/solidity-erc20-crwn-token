const Token = artifacts.require("Token");

module.exports = (deployer) => {
  deployer.deploy(Token, 10000);
}