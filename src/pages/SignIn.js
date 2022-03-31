import React, { useContext, useState, useRef } from 'react';

import { useNavigate } from 'react-router-dom';

import AuthContext from '../contexts/auth-context';

import NotableElementInfoIcon from '../components/NotableElementInfoIcon';

import { useHttpClient } from '../shared/hooks/http-hook';

function SignIn(){

    const authContext = useContext(AuthContext);

    const { isLoading , sendRequest } = useHttpClient();

    let navigate = useNavigate();
    const usernameInputRef = useRef();
    const emailInputRef = useRef();
    const passwordInputRef = useRef();
    const [signInMethod,setSignInMethod] = useState('username');

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

    async function signInBtnOnClickHandler(){ // بررسی شود که آیا از useCallback استفاده شود؟

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

        try{
            await sendRequest(
                'http://localhost:5000/api/users',
                'POST',
                undefined,
                JSON.stringify({
                    username: usernameInputRef.current.value.trim(),
                    password: passwordInputRef.current.value.trim(),
                }),
            );

            authContext.signInHandler();
       
            navigate('../home', { replace: true });
        }catch(err){
 
        }
    }

    return (
        <div className="sign-in-page p-3">
            <div className="container py-4">        
                <div className="row">
                    <div className="col-3"></div>
                    <div className="col-6" style={{position: 'relative'}}>
                        <div className={'spinner-wrapper d-flex justify-content-center align-items-center' + (isLoading ? '' : ' visually-hidden')}>
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
                            <NotableElementInfoIcon 
                                elementLocation = 'sign-in-page'
                                elementName = 'sign-in-page'
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
                            <button type="text" className="btn btn-primary" onClick={signInBtnOnClickHandler}>Sign in</button>
                        </div>
                    </div>
                    <div className="col-3"></div>
                </div>
            </div>
        </div>
    ); 
}

export default SignIn;