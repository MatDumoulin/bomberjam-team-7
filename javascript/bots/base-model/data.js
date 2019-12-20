const { ALL_TILES, BOARD, DIRECTIONS } = require("../game-constants");
const { createMap } = require("../utils");

/*
*   Transforms a gameState into an input for your neural network given the playerId.
*   You'll need to improve this.
*/
function gameStateToModelInputConverter(state, playerId) {
    const currentPlayer = state.players[playerId];
    const otherPlayers = Object.values(state.players).filter(player => player.id !== playerId);
    const bombRangePerPlayer = createMap(state.width, state.height);
    const bombRemainingPerPlayer = createMap(state.width, state.height);
    const currentPlayerPositionMap = createMap(state.width, state.height);
    currentPlayerPositionMap[currentPlayer.x][currentPlayer.y] = 1;
    bombRangePerPlayer[currentPlayer.x][currentPlayer.y] = currentPlayer.bombRange;
    bombRemainingPerPlayer[currentPlayer.x][currentPlayer.y] = currentPlayer.bombsLeft;

    const otherPlayersPositionMap = createMap(state.width, state.height);
    for (const otherPlayer of otherPlayers) {
        otherPlayersPositionMap[otherPlayer.x][otherPlayer.y] = 1;
        bombRangePerPlayer[otherPlayer.x][otherPlayer.y] = otherPlayer.bombRange;
        bombRemainingPerPlayer[otherPlayer.x][otherPlayer.y] = otherPlayer.bombsLeft;
    }

    const bonusMap = createMap(state.width, state.height);
    const bonuses = Object.values(state.bonuses);
    for(const bonus of bonuses){
        bonusMap[bonus.x][bonus.y] = bonus.type == "bomb"? 1 : 2
    }

    const blocksMap = createMap(state.width, state.height);
    for (let x = 0; x < state.width; x++) {
        for (let y = 0; y < state.height; y++) {
            const tile = state.tiles[x + y * state.width];
            if(tile === ALL_TILES.block) {
                blocksMap[x][y] = 1;
            }
        }
    }

    const wallsMap = createMap(state.width, state.height);
    for (let x = 0; x < state.width; x++) {
        for (let y = 0; y < state.height; y++) {
            const tile = state.tiles[x + y * state.width];
            if(tile === ALL_TILES.wall) {
                wallsMap[x][y] = 1;
            }
        }
    }

    const explosionsMap = createMap(state.width, state.height);
    for (let x = 0; x < state.width; x++) {
        for (let y = 0; y < state.height; y++) {
            const tile = state.tiles[x + y * state.width];
            if(tile === ALL_TILES.explosion) {
                explosionsMap[x][y] = 1;
            }
        }
    }

    // Predicting the explosions of bombs
    const bombsArray = Object.values(state.bombs);
    const bombsMap = createMap(state.width, state.height);
    let sortedBombs = bombsArray.sort((a, b) => a.countdown - b.countdown);

    while(sortedBombs.length > 0) {
        const bomb = sortedBombs.shift();
        for(const direction of DIRECTIONS) {
            for (let i = 1; i <= bomb.bombRange; ++i) {
                const x = bomb.x + i * direction[0];
                const y = bomb.y + i * direction[1];

                // Stop propagating if the explosion hits a wall or a box
                if(blocksMap[x][y] === 1 || wallsMap[x][y] === 1) {
                    break;
                }

                const bombImpacted = bombsArray.find(bomb => bomb.x === x && bomb.y && y);

                if (bombImpacted) {
                    bombImpacted.countdown = bomb.countdown;
                }

                if(bombsMap[bomb.x][bomb.y] !== 0) {
                    bombsMap[bomb.x][bomb.y] = Math.min(bombsMap[bomb.x][bomb.y], bomb.countdown / DEFAULT_BOMB_COUNTDOWN);
                }
            }
        }

        sortedBombs = sortedBombs.sort((a, b) => a.countdown - b.countdown);
    }

    /*
    *   You can encode global state as a feature map filled with the value.
    *   This will make the convolutions see this information all the time.
    */
    const suddenDeathMap = createMap(state.width, state.height, state.suddenDeathCountdown === 0 ? 1 : 0);

    return [
        currentPlayerPositionMap,
        otherPlayersPositionMap,
        blocksMap,
        wallsMap,
        explosionsMap,
        bombsMap,
        suddenDeathMap,
        bombRangePerPlayer,
        bonusMap,
        bombRemainingPerPlayer
    ];
}

/*
*   Do not forget to update this to match the dimensions that "gameStateToModelInputConverter" returns.
*   It will be used to compile your model.
*/
const NUMBER_OF_FEATURES = 10;
const DATA_SHAPE = [NUMBER_OF_FEATURES, BOARD.width, BOARD.height]

module.exports = {
    gameStateToModelInputConverter,
    DATA_SHAPE
}