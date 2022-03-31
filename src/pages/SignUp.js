import React, { useContext, useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";

import NotableElementInfoIcon from '../components/NotableElementInfoIcon';

import { useHttpClient } from '../shared/hooks/http-hook';

import AuthContext from '../contexts/auth-context';

function SignUp(props){

    let navigate = useNavigate();
    const usernameInputRef = useRef();
    const emailInputRef = useRef();
    const firstNameInputRef = useRef();
    const lastNameInputRef = useRef();
    const passwordInputRef = useRef();
    const passwordRepeatInputRef = useRef();
    const signUpFormSpinnerRef = useRef();
    const [signUpMethod,setSignUpMethod] = useState('email');

    const { sendRequest } = useHttpClient();

    const authContext = useContext(AuthContext);
 
    function signInFormDimmerDisplay(val){
        if(arguments.length){
            if(val === 'show')
                signUpFormSpinnerRef.current.classList.remove('visually-hidden');
            else if(val === 'hide')
                signUpFormSpinnerRef.current.classList.add('visually-hidden');
        }
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

    function firstNameInputOnFocusHandler(){

    }

    function lastNameInputOnFocusHandler(){
        
    }

    function cellphoneInputOnFocusHandler(){

    }

    function passwordInputOnFocusHandler(){
        passwordInputIsEmptyMsgDisplay('hide');
    }

    function passwordRepeatInputOnFocusHandler(){
        
    }

    function signUpMethodOnChangeHandler(e){
        setSignUpMethod(e.target.getAttribute('data-val'));
    }

    async function signUpHandler(){

        let invalidInputValsCount = 0;

        if(!usernameInputVal()){
            usernameInputIsEmptyMsgDisplay('show');
            invalidInputValsCount++;
        }

        if(!emailInputVal()){
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
            await sendRequest(
                'http://localhost:5000/api/users/sign-up',
                'POST',
                undefined,
                JSON.stringify({
                    username: usernameInputRef.current.value.trim(),
                    // firstName: ,
                    // lastName: ,
                    password: passwordInputRef.current.value.trim(),
                }),
            );

            authContext.signInHandler();
 
            signInFormDimmerDisplay('hide');
            navigate('../home', { replace: true });
        }catch(err){
            signInFormDimmerDisplay('hide');
        }
    }

    return (
        <div className="sign-up-page p-3">
            <div className="container py-4">        
                <div className="row">
                    <div className="col-3"></div>
                    <div className="col-6" style={{position: 'relative'}}>
                        <div ref={signUpFormSpinnerRef} className="modal-spinner-wrapper d-flex justify-content-center align-items-center visually-hidden">
                            <div className="spinner-border text-primary" role="status"></div>
                        </div>

                        <div className='mb-2'>
                            <div className="form-check form-check-inline">
                                <input id="sign-up-by-email" className='form-check-input' type="radio" data-val="email" name="sign-up-method" checked={signUpMethod === 'email' ? 'checked' : ''} onChange={signUpMethodOnChangeHandler}/>
                                <label className="form-check-label" htmlFor="sign-up-by-email">
                                    Email
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input id="sign-in-by-phone-number" className='form-check-input' type="radio" data-val="cellphone-number" name="sign-up-method" checked={signUpMethod === 'cellphone-number' ? 'checked' : ''} onChange={signUpMethodOnChangeHandler}/>
                                <label className="form-check-label" htmlFor="sign-in-by-phone-number">
                                    Cellphone Number
                                </label>
                            </div>    
                            <div className="form-check form-check-inline">
                                <input id="sign-in-by-both" className='form-check-input' type="radio" data-val="both" name="sign-up-method" checked={signUpMethod === 'both' ? 'checked' : ''} onChange={signUpMethodOnChangeHandler}/>
                                <label className="form-check-label" htmlFor="sign-in-by-both">
                                    Both
                                </label>
                            </div>    
                            <NotableElementInfoIcon 
                                elementLocation = 'sign-up-page'
                                elementName = 'sign-up-page'
                            />
                        </div>     
                        <div className='sign-in-form'>
                            <div className='mb-3'>
                                <label htmlFor="username-input" className="form-label">Username</label>
                                <input ref={usernameInputRef} type="text" className="form-control" id="username-input" placeholder="username" onFocus={usernameInputOnFocusHandler}/>
                                <div className="invalid-feedback">
                                    Please enter username
                                </div>
                            </div>
                            <div className='mb-3'>
                                <label htmlFor="first-name-input" className="form-label">First Name</label>
                                <input ref={firstNameInputRef} type="text" className="form-control" id="first-name-input" placeholder="first name" onFocus={firstNameInputOnFocusHandler}/>
                                <div className="invalid-feedback">
                                    Please enter first name
                                </div>
                            </div>
                            <div className='mb-3'>
                                <label htmlFor="last-name-input" className="form-label">Last Name</label>
                                <input ref={lastNameInputRef} type="text" className="form-control" id="last-name-input" placeholder="last name" onFocus={lastNameInputOnFocusHandler}/>
                                <div className="invalid-feedback">
                                    Please enter last name
                                </div>
                            </div>
                            <div className={'mb-3 ' + (signUpMethod === 'email' || signUpMethod === 'both' ? '' : 'visually-hidden')}>
                                <label htmlFor="email-input" className="form-label">Email</label>
                                <input ref={emailInputRef} type="email" className="form-control" id="email-input" placeholder="name@example.com" onFocus={emailInputOnFocusHandler}/>
                                <div className="invalid-feedback">
                                    Please enter email
                                </div>
                            </div>
                            <div className={'mb-3 ' + (signUpMethod === 'cellphone-number' || signUpMethod === 'both' ? '' : 'visually-hidden')}>
                                <label htmlFor="cellphone-input" className="form-label">Cellphone Number</label>
                                <input ref={emailInputRef} type="text" className="form-control" id="cellphone-input" placeholder="cellphone number" onFocus={cellphoneInputOnFocusHandler}/>
                                <div className="invalid-feedback">
                                    Please Cellphone Number
                                </div>
                            </div>
                            <div className='mb-3 col-lg-4'>
                                <label htmlFor="birth-date-input" className="form-label">Birth Date</label>
                                <input type="date" className="form-control" id="birth-date-input"/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password-input" className="form-label">Password</label>
                                <input ref={passwordInputRef} type="password" className="form-control" id="password-input" placeholder="password" onFocus={passwordInputOnFocusHandler}/>
                                <div className="invalid-feedback">
                                    Please enter password
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password-repeat-input" className="form-label">Password Repeat</label>
                                <input ref={passwordRepeatInputRef} type="password" className="form-control" id="password-repeat-input" placeholder="password repeat" onFocus={passwordRepeatInputOnFocusHandler}/>
                                <div className="invalid-feedback">
                                    Please enter password repeat
                                </div>
                            </div>
                            <button type="text" className="btn btn-primary" onClick={signUpHandler}>Sign in</button>
                        </div>
                    </div>
                    <div className="col-3"></div>
                </div>
            </div>
        </div>
    ); 
}

export default SignUp;