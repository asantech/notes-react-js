import { authActions} from './auth-slice';

export const signIn = () => {
    return (dispatch) => {
        localStorage['userIsSignedIn'] = '1';
        dispatch(authActions.signIn());
    }
}

export const signOut = () => {
    return (dispatch) => {
        localStorage.removeItem('userIsSignedIn');
        dispatch(authActions.signOut());
    }
}

export const isSignedIn = () => {
    return (dispatch) => {
        if(localStorage['userIsSignedIn'] === '1')
            dispatch(authActions.signIn());
    }
}