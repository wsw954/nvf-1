const ACTIONS = {
  MAKE_SELECTED: "MAKE_SELECTED",
  MODEL_SELECTED: "MODEL_SELECTED",
  SELECT_CHOICE: "SELECT_CHOICE",
  CHECKBOX_CHOICE: "CHECKBOX_CHOICE",
  POPUP_CONFIRM: "POPUP_CONFIRM",
  POPUP_CANCEL: "POPUP_CANCEL",
};

//Set initial state
export const initialState = {
  selectedMake: "",
  selectedModel: "",
  choices: [],
  popup: {
    show: false,
    message: "",
    detail: {},
  },
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.MAKE_SELECTED:
      return {
        ...state,
        selectedMake: action.payload.make,
        selectedModel: "",
        choices: [],
      };
    case ACTIONS.MODEL_SELECTED:
      return {
        ...state,
        selectedModel: action.payload.model,
        choices: [],
      };
    case ACTIONS.SELECT_CHOICE:
      return {
        ...state,
        choices: [action.payload.choice],
      };
    case ACTIONS.CHECKBOX_CHOICE:
      return {
        ...state,
        choices: [action.payload.choice],
      };
    default:
      return state;
  }
}

export default reducer;
