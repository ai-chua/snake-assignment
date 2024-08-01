import { DEFAULT_STARTING_POSITION } from "./consts";
// types of inputs should already be correct, checked at api and returned appropriate response
export function generateNewGameState(_a) {
    var width = _a.width, height = _a.height;
    if (width === 1 && height === 1) {
        throw new Error('Invalid game board dimension');
    }
    return {
        width: width,
        height: height,
        snake: DEFAULT_STARTING_POSITION,
        fruit: {
            x: Math.floor(Math.random() * width),
            y: Math.floor(Math.random() * height),
        },
        score: 0,
    };
}
export function validateTick(_a) {
    var width = _a.width, height = _a.height, velX = _a.velX, velY = _a.velY, previousPositionX = _a.previousPositionX, previousPositionY = _a.previousPositionY;
    // Check if the movement is valid:
    // 1. The snake must only move along one axis per tick (either x or y, but not both).
    // 2. The velocity in each direction should be -1, 0, or 1.
    // 3. Should not have no movements
    var noMovement = velX === 0 && velY === 0;
    var movedAlongX = velY === 0 && (velX === 1 || velX === -1);
    var movedAlongY = velX === 0 && (velY === 1 || velY === -1);
    var isValidMovement = !noMovement && (movedAlongY || movedAlongX);
    // Calculate the new position
    var newPositionX = previousPositionX + velX;
    var newPositionY = previousPositionY + velY;
    // Check if the new position is within the game boundaries
    var isWithinBoundaries = (newPositionX >= 0 && newPositionX <= width &&
        newPositionY >= 0 && newPositionY <= height);
    return {
        movement: isValidMovement,
        withinBoundaries: isWithinBoundaries
    };
}
export function validateCurrentSession(gameState) {
    var ticks = gameState.ticks, height = gameState.height, width = gameState.width, score = gameState.score, _a = gameState.snake, lastSnakePosX = _a.x, lastSnakePosY = _a.y, _b = gameState.fruit, fruitPositionX = _b.x, fruitPositionY = _b.y;
    var currentSnakePositionX = lastSnakePosX;
    var currentSnakePositionY = lastSnakePosY;
    var validateTickResult = {
        withinBoundaries: true,
        movement: true
    };
    var _loop_1 = function (i) {
        var _c = ticks[i], velX = _c.velX, velY = _c.velY;
        var outcome = validateTick({
            width: width,
            height: height,
            velX: velX,
            velY: velY,
            previousPositionX: currentSnakePositionX,
            previousPositionY: currentSnakePositionY
        });
        var attrs = ["withinBoundaries", "movement"];
        attrs.forEach(function (attr) {
            // if previous result is true, but outcome is false
            if (validateTickResult[attr] && !outcome[attr]) {
                validateTickResult[attr] = outcome[attr];
            }
        });
        currentSnakePositionX += velX;
        currentSnakePositionY += velY;
    };
    for (var i = 0; i < ticks.length; i++) {
        _loop_1(i);
    }
    var tickOnFruitPositionX = fruitPositionX === currentSnakePositionX;
    var tickOnFruitPositionY = fruitPositionY === currentSnakePositionY;
    var caughtFruit = tickOnFruitPositionX && tickOnFruitPositionY;
    var updatedSnakePos = {
        x: currentSnakePositionX,
        y: currentSnakePositionY
    };
    console.log('updatedSnakePos', JSON.stringify(updatedSnakePos, null, 2));
    var movement = validateTickResult.movement, withinBoundaries = validateTickResult.withinBoundaries;
    var isGamePlayValid = withinBoundaries && movement;
    if (isGamePlayValid && caughtFruit) {
        return {
            canContinue: true,
            updatedScore: score + 1,
            updatedSnakePos: updatedSnakePos
        };
    }
    // all ok, just no fruit 
    if (isGamePlayValid) {
        return {
            canContinue: false,
            updatedScore: score,
            updatedSnakePos: updatedSnakePos
        };
    }
    // all the fails come through
    return {
        canContinue: false,
        updatedScore: score,
        updatedSnakePos: updatedSnakePos
    };
}
