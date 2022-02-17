import * as actions from './actionTypes';
import axios from '../../axios';
// import axios from 'axios';
export const authStart = () => {
    return {
        type:  actions.AUTH_START
    };
};

export const authSuccess = (idToken,userId) => {
    return {
        type: actions.AUTH_SUCCESS,
        tokenId: idToken,
        userId: userId
    }
}

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationDate");
    localStorage.removeItem("userId");
    return {
        type: actions.AUTH_LOGOUT
    }
}

export const setExpirationTime = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout())
        }, expirationTime*1000);
    }
}


export const authFail = (errorObject) => {
    return {
        type: actions.AUTH_FAIL,
        error: errorObject
    }
}


export const auth = (formData,isSignUp) => {
    return dispatch => {
        dispatch(authStart());
        const authData = {
            email: formData.email,
            password: formData.password,
            returnSecureToken: true
        }

        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAwvAUif_qF5HNkheUQEcvTm0yccmsnqms';

        if(!isSignUp){
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAwvAUif_qF5HNkheUQEcvTm0yccmsnqms';
        }
        axios.post(url,authData).then(response => {
            const expirationDate = new Date(new Date().getTime()+response.data.expiresIn*1000);
            // console.log(response.data);
            if(isSignUp){
                const userObject = {
                    userId: response.data.localId,
                    email: formData.email
                }
                axios.post("/users.json?auth=" + response.data.idToken, userObject).then(userResponse => {
                    // console.log(userResponse.data);
                    dispatch(authSuccess(response.data.idToken,userResponse.data.name));
                    dispatch(setExpirationTime(response.data.expiresIn));
                    localStorage.setItem("token", response.data.idToken);
                    localStorage.setItem("expirationDate", expirationDate);
                    localStorage.setItem("userId", userResponse.data.name);
                }).catch(error => {
                    dispatch(authFail(error.response.data.error))
                });
            }
            else {
                const queryParams = `?auth=${response.data.idToken}&orderBy="userId"&equalTo="${response.data.localId}"`;
                axios.get("/users.json" + queryParams).then(userResponse => {
                    // console.log(userResponse);
                    dispatch(authSuccess(response.data.idToken, Object.keys(userResponse.data)[0]));
                    dispatch(setExpirationTime(response.data.expiresIn));
                    localStorage.setItem("token", response.data.idToken);
                    localStorage.setItem("expirationDate", expirationDate);
                    localStorage.setItem("userId", Object.keys(userResponse.data)[0]);
                }).catch(error => {
                    // console.log(error);
                    dispatch(authFail(error.response.data.error))
                });
            }
            
        }).catch(error => {
            dispatch(authFail(error.response.data.error));
        })
    }
}
