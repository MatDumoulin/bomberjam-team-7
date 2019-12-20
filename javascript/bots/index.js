const baseModel = require("./base-model");
const baseModel2 = require("./base-model-2-deeper");

const { RandomBot } = require("./randomBot");

module.exports = {
    RandomBot,
    bot: baseModel,
    botsToCompare: [baseModel, baseModel2, baseModel2, baseModel]
}