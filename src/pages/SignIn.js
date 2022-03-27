import React, {useState, useRef} from 'react';
import { useNavigate } from 'react-router-dom';

import { InfoCircle } from 'react-bootstrap-icons';

function SignIn(props){

    let navigate = useNavigate();
    const signInFormSpinnerRef = useRef();
    const usernameInputRef = useRef();
    const emailInputRef = useRef();
    const passwordInputRef = useRef();
    const [signInMethod,setSignInMethod] = useState('username');
 
    function signInFormDimmerDisplay(val){
        if(arguments.length){
            if(val === 'show')
                signInFormSpinnerRef.current.classList.remove('visually-hidden');
            else if(val === 'hide')
                signInFormSpinnerRef.current.classList.add('visually-hidden');
        }
    }

    function signInMethodOnChangeHandler(e){
        setSignInMethod(e.target.getAttribute('data-val'));
    }

    function usernameInputVal(){
        return usernameInputRef.current.value;
    }

    function emailInputVal(){
        return emailInputRef.current.value;
    }

    function passwordInputVal(){
        return passwordInputRef.current.value;
    }

    function usernameInputIsEmptyMsgDisplay(val){
        if(arguments.length){
            if(val === 'show')
                usernameInputRef.current.classList.add('is-invalid');
            else if(val === 'hide')
                usernameInputRef.current.classList.remove('is-invalid');
        }
    }

    function emailInputIsEmptyMsgDisplay(val){
        if(arguments.length){
            if(val === 'show')
                emailInputRef.current.classList.add('is-invalid');
            else if(val === 'hide')
                emailInputRef.current.classList.remove('is-invalid');
        }
    }

    function passwordInputIsEmptyMsgDisplay(val){
        if(arguments.length){
            if(val === 'show')
                passwordInputRef.current.classList.add('is-invalid');
            else if(val === 'hide')
                passwordInputRef.current.classList.remove('is-invalid');
        }
    }

    function usernameInputOnFocusHandler(){
        usernameInputIsEmptyMsgDisplay('hide');
    }

    function emailInputOnFocusHandler(){
        emailInputIsEmptyMsgDisplay('hide');
    }

    function passwordInputOnFocusHandler(){
        passwordInputIsEmptyMsgDisplay('hide');
    }

    async function signInHandler(){

        let invalidInputValsCount = 0;

        if(
            signInMethod === 'username' &&
            !usernameInputVal()
        ){
            usernameInputIsEmptyMsgDisplay('show');
            invalidInputValsCount++;
        }

        if(
            signInMethod === 'email' &&
            !emailInputVal()
        ){
            emailInputIsEmptyMsgDisplay('show');
            invalidInputValsCount++;
        }

        if(!passwordInputVal()){
            passwordInputIsEmptyMsgDisplay('show');
            invalidInputValsCount++;
        }

        if(invalidInputValsCount)
            return;
        
        signInFormDimmerDisplay('show');

        try{
            const response = await fetch('http://localhost:5000/api/users',{
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({
                    username: usernameInputRef.current.value.trim(),
                    password: passwordInputRef.current.value.trim(),
                }),
            });

            const data = await response.json();
            if(!response.ok)
                throw new Error(data.message);

            localStorage.setItem('userIsSignedIn','1');
            props.setUserIsSignedIn(true);
            usernameInputRef.current.value = '';
            passwordInputRef.current.value = '';
            signInFormDimmerDisplay('hide');
            navigate('../home', { replace: true });
        }catch(err){
            console.log('err',err);
            signInFormDimmerDisplay('hide');
        }
    }

    return (
        <div className="sign-in-page p-3">
            <div className="container py-4">        
                <div className="row">
                    <div className="col-3"></div>
                    <div className="col-6" style={{position: 'relative'}}>
                        <div ref={signInFormSpinnerRef} className="modal-spinner-wrapper d-flex justify-content-center align-items-center visually-hidden">
                            <div className="spinner-border text-primary" role="status"></div>
                        </div>  
                        <div>
                            <div className="form-check form-check-inline">
                                <input id="sign-in-by-username" className='form-check-input' type="radio" data-val="username" name="sign-in-method" checked={signInMethod === 'username' ? 'checked' : ''} onChange={signInMethodOnChangeHandler}/>
                                <label className="form-check-label" htmlFor="sign-in-by-username">
                                    Username
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input id="sign-in-by-email" className='form-check-input' type="radio" data-val="email" name="sign-in-method" checked={signInMethod === 'email' ? 'checked' : ''} onChange={signInMethodOnChangeHandler}/>
                                <label className="form-check-label" htmlFor="sign-in-by-email">
                                    Email
                                </label>
                            </div> 
                            <InfoCircle
                                data-element-location = 'sign-in-page'
                                data-element-name = 'sign-in-page'
                                onClick = {props.ElementDescInfoIconOnClickHandler}
                            />      
                        </div>   
                        <div className='sign-in-form'>
                            <div className={'mb-3 ' + (signInMethod === 'username' ? '' : 'visually-hidden')}>
                                <label htmlFor="username-input" className="form-label">Username</label>
                                <input ref={usernameInputRef} type="text" className="form-control" id="username-input" placeholder="username" onFocus={usernameInputOnFocusHandler}/>
                                <div className="invalid-feedback">
                                    Please enter username
                                </div>
                            </div>
                            <div className={'mb-3 ' + (signInMethod === 'email' ? '' : 'visually-hidden')}>
                                <label htmlFor="email-input" className="form-label">Email</label>
                                <input ref={emailInputRef} type="email" className="form-control" id="email-input" placeholder="name@example.com" onFocus={emailInputOnFocusHandler}/>
                                <div className="invalid-feedback">
                                    Please enter email
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password-input" className="form-label">Password</label>
                                <input ref={passwordInputRef} type="password" className="form-control" id="password-input" placeholder="password" onFocus={passwordInputOnFocusHandler}/>
                                <div className="invalid-feedback">
                                    Please enter password
                                </div>
                            </div>
                            <button type="text" className="btn btn-primary" onClick={signInHandler}>Sign in</button>
                        </div>
                    </div>
                    <div className="col-3"></div>
                </div>
            </div>
        </div>
    ); 
}

export default SignIn;