const ACTIONS = {
  INITIAL_CONFIGURATION: "INITIAL_CONFIGURATION",
  OPTION_CHANGE: "OPTION_CHANGE",
  POPUP_CONFIRM: "POPUP_CONFIRM",
  POPUP_CANCEL: "POPUP_CANCEL",
};

export function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.INITIAL_CONFIGURATION:
      return { ...state, availableChoices: [action.payload] };
    case ACTIONS.OPTION_CHANGE:
      return {
        ...state,
        availableChoices: action.payload.availableChoices,
        selectedChoices: action.payload.selectedChoices,
        popup: action.payload.popup,
      };
    case ACTIONS.POPUP_CONFIRM:
      return {
        ...state,
        availableChoices: action.payload.availableChoices,
        selectedChoices: action.payload.selectedChoices,
        popup: action.payload.popup,
      };
    case ACTIONS.POPUP_CANCEL:
      console.log("Handle POPUP_CANCEL");
      return {
        ...state,
        availableChoices: action.payload.availableChoices,
        selectedChoices: action.payload.selectedChoices,
        popup: action.payload.popup,
      };
    default:
      return state;
  }
}
