export const initial: State = {
  groupWith: 'ratings',
  asc: false,
  ratings: undefined,
  title: ''
}

export default (state: State, payload: Partial<State>): State => ({
  ...state,
  ...payload
})
