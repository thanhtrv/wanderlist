import {
    SET_USER_AUTH_TOKEN, SET_USER, SET_TOKEN_EXPIRY
} from '../actions/types'


//just for now, later we can use on device storage to store the last running
//maybe store a user object too? (with name, email, etc...?) -- We'll get to that later!
const initialState = {
    authToken: "",
    expiry: "",
    user: null
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_TOKEN_EXPIRY:
            return {
                ...state,
                expiry: state.expiry = action.data
            }
        case SET_USER:
            return {
                ...state,
                user: state.user = action.data
            }
        case SET_USER_AUTH_TOKEN:
            return {
                ...state,
                authToken: state.authToken = action.data
            }
        default:
            return state;
    }
}

export default userReducer;