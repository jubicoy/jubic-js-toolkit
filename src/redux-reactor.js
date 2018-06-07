/* @flow */
'use strict'

type Store<S, A> = {
  dispatch: (A) => void,
  getState: () => S
}
type Middleware<S, A>
  = Store<S, A>
  => Dispatch<A>
  => (A)
  => void
export type Dispatch<A> = (A) => void
export type Reactor<S, A> = (dispatch: Dispatch<A>, action: A, getState: () => S) => void

export function reactorMiddleware<S, A> (
  ...reactors: Array<Reactor<S, A>>
): Middleware<S, A> {
  let reacting: boolean = false
  return (store: Store<S, A>) => (next) => (action) => {
    if (!reacting) {
      reacting = true
      reactors.forEach((r) => r(store.dispatch, action, store.getState))
      reacting = false
    }
    next(action)
  }
}
