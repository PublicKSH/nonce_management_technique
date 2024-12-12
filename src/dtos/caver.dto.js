class DeployKIP7TokenDTO {
    constructor({ name, symbol, decimals, initialSupply, deployAddress, imageUrl }) {
        this.name = name
        this.symbol = symbol
        this.decimals = decimals
        this.initialSupply = initialSupply
        this.deployAddress = deployAddress
        this.imageUrl = imageUrl
    }
}

class MintKIP7TokenDTO {
    constructor({ contractAddress, spenderAddress, amount, fromAddress }) {
        this.contractAddress = contractAddress;
        this.spenderAddress = spenderAddress;
        this.amount = amount;
        this.fromAddress = fromAddress;
    }
}

module.exports = {
    DeployKIP7TokenDTO,
    MintKIP7TokenDTO
};
