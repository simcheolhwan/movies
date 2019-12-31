export const initial: State = {
  groupWith: 'best',
  asc: false,
  best: false,
  title: ''
}

export default (state: State, payload: Partial<State>): State => ({
  ...state,
  ...payload
})
