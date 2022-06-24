export const initialState = {
     openTokenPopup : false,
  };
  
  export const actionTypes = {
    OPEN_TOKEN_POPUP : "OPEN_TOKEN_POPUP"
  
  };
  
  const reducer = (state, action) => {
    console.log(action);
    switch (action.type) {
      case actionTypes.OPEN_TOKEN_POPUP:
        return {
          type: actionTypes.OPEN_TOKEN_POPUP,
          openTokenPopup : action.openTokenPopup
        }
      default:
        return state;
    }
  };
  
  export default reducer;
  