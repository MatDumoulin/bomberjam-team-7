const baseModel = require("./base-model");
<<<<<<< HEAD
const baseModel2 = require("./base-model-2-deeper");
=======
const mathieu = require("./mathieu-1");
>>>>>>> b9ffeaa831e2e6d4789c47cd3bd6308850629675

const { RandomBot } = require("./randomBot");

module.exports = {
    RandomBot,
    bot: baseModel,
<<<<<<< HEAD
    botsToCompare: [baseModel, baseModel2, baseModel2, baseModel]
=======
    botsToCompare: [baseModel, baseModel, mathieu, baseModel]
>>>>>>> b9ffeaa831e2e6d4789c47cd3bd6308850629675
}