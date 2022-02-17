import { updateObject } from "../utility";
import * as actionTypes from '../Actions/actionTypes';

const initialState = {
    token: null,
    userId: null,
    error: null
}

const authStart = (state,action) => {
    return updateObject(state,{error: null});
}


const authSuccess = (state,action) => {
    return updateObject(state,{
        token: action.tokenId,
        userId: action.userId,
        error: null,
    })
}

const authFail = (state,action) => {
    return updateObject(state,{
        error: action.error
    })
}

const logout = (state, action) => {
    return updateObject(state,{
        token: null,
        userId: null,
        error: null
    })
}
const reducer = (state = initialState,action) => {
    switch(action.type){
        case actionTypes.AUTH_START: return authStart(state,action);
        case actionTypes.AUTH_SUCCESS: return authSuccess(state,action);
        case actionTypes.AUTH_FAIL: return authFail(state,action);
        case actionTypes.AUTH_LOGOUT: return logout(state, action);
        default: return state;
    }
}

export default reducer;
