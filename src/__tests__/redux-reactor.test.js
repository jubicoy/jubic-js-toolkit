/* @flow */
/* eslint-env mocha */

import { createStore, applyMiddleware } from 'redux'
import { expect } from 'chai'

import { reactorMiddleware } from '../redux-reactor'

describe('redux-reactor', () => {
  type State = number
  type Action
    = { type: 'increment' }
    | { type: 'decrement' }
    | { type: 'noop' }
  function testReducer (state: State = 0, action: Action): State {
    switch (action.type) {
      case 'increment':
        return state + 1
      case 'decrement':
        return state - 1
      default:
        return state
    }
  }

  function testReactor (
    dispatch: (Action) => void,
    action: Action,
    getState: () => State
  ) {
    switch (action.type) {
      case 'noop':
        dispatch({ type: 'decrement' })
        dispatch({ type: 'decrement' })
        break
    }
  }

  it('passes actions to reactor and allows reactor to dispatch', () => {
    const plainStore = createStore(
      testReducer
    )
    const reactorStore = createStore(
      testReducer,
      applyMiddleware(reactorMiddleware(testReactor))
    )

    expect(plainStore.getState()).to.equal(0)
    expect(reactorStore.getState()).to.equal(0)

    plainStore.dispatch({ type: 'increment' })
    reactorStore.dispatch({ type: 'increment' })
    expect(plainStore.getState()).to.equal(1)
    expect(reactorStore.getState()).to.equal(1)

    plainStore.dispatch({ type: 'increment' })
    reactorStore.dispatch({ type: 'increment' })
    expect(plainStore.getState()).to.equal(2)
    expect(reactorStore.getState()).to.equal(2)

    plainStore.dispatch({ type: 'decrement' })
    reactorStore.dispatch({ type: 'decrement' })
    expect(plainStore.getState()).to.equal(1)
    expect(reactorStore.getState()).to.equal(1)

    plainStore.dispatch({ type: 'noop' })
    reactorStore.dispatch({ type: 'noop' })
    expect(plainStore.getState()).to.equal(1)
    expect(reactorStore.getState()).to.equal(-1)
  })
})
