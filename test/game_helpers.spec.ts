import * as chai from "chai"
import { generateNewGameState } from "../src/game_helpers"
import { State } from "../src/types"
import { DEFAULT_STARTING_POSITION } from "../src/consts"

const { expect } = chai

describe("generateNewGameState unit test", () => {
  it('should throw when both provided input(s) are smaller than 2', () => {
    expect(
      () => generateNewGameState({ width: 1, height: 1})
    ).to.throw('Invalid game board dimension')
  })

  it("should return output with required attributes",() => {
    const width = 3
    const height = 4

    const output: State = generateNewGameState({ width, height })

    expect(output).to.have.property('width', width).that.is.a('number')
    expect(output).to.have.property('height', height).that.is.a('number')
    expect(output).to.have.property('score', 0).that.is.a('number')

    expect(output).to.have.property('snake').that.is.an('object')
    expect(output.snake).to.have.property('x', DEFAULT_STARTING_POSITION.x)
    expect(output.snake).to.have.property('y', DEFAULT_STARTING_POSITION.y)
    
    expect(output.fruit).to.have.property('x').that.is.a('number')
    expect(output.fruit).to.have.property('y').that.is.a('number')

    expect(output).to.have.property('fruit').that.is.an('object')
    expect(output.fruit).to.have.property('x').that.is.a('number')
    expect(output.fruit).to.have.property('y').that.is.a('number')
  })
})