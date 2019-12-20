const baseModel = require("./base-model");
const mathieu = require("./mathieu-1");

const { RandomBot } = require("./randomBot");

module.exports = {
    RandomBot,
    bot: baseModel,
    botsToCompare: [baseModel, baseModel, mathieu, baseModel]
}