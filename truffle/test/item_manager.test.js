const ItemManager = artifacts.require("../contracts/ItemManager.sol");
const Item = artifacts.require("../contracts/Item.sol");

contract("ItemManager", (accounts) => {
  it("... should let you create new Items", async () => {
    const itemManagerInstance = await ItemManager.deployed();
    // const itemInstance = await Item.deployed();

    // console.log(accounts);

    const itemName = "test1";
    const itemPrice = 500;

    const result = await itemManagerInstance.createItem(itemName, itemPrice, {
      from: accounts[0],
    });

    assert.equal(result.logs[0].args._itemIndex, 0, "It's not the first item");

    const item = await itemManagerInstance.items(0);
    assert.equal(item._identifier, itemName, "The item has a different name");
  });
});
