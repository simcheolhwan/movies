export const initial: State = {
  groupWith: "best",
  asc: false,
  best: false,
  title: "",
}

const reducer = (state: State, payload: Partial<State>): State => ({
  ...state,
  ...payload,
})

export default reducer
