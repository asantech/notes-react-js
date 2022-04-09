import React, { useState, useRef } from 'react';

import { useDispatch } from 'react-redux';

import { authActions } from '../store/auth'

import { useNavigate } from 'react-router-dom';

import NotableElementInfoIcon from '../components/NotableElementInfoIcon';

import { useHttpClient } from '../shared/hooks/http-hook';

function SignUp(){

    let navigate = useNavigate();
    const usernameInputRef = useRef();
    const emailInputRef = useRef();
    const cellphoneNumInputRef = useRef();
    const firstNameInputRef = useRef();
    const lastNameInputRef = useRef();
    const passwordInputRef = useRef();
    const passwordRepeatInputRef = useRef();
    const signUpFormSpinnerRef = useRef();
    const [signUpMethod,setSignUpMethod] = useState('email');

    const { sendReq } = useHttpClient();

    const dispatch = useDispatch();
 
    function signUpFormDimmerDisplay(val){
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

    function firstNameInputVal(){
        return firstNameInputRef.current.value;
    }

    function lastNameInputVal(){
        return lastNameInputRef.current.value;
    }

    function emailInputVal(){
        return emailInputRef.current.value;
    }

    function cellphoneNumInputVal(){
        return cellphoneNumInputRef.current.value;
    }

    function passwordInputVal(){
        return passwordInputRef.current.value;
    }

    function passwordRepeatInputVal(){
        return passwordRepeatInputRef.current.value;
    }

    function usernameInputIsEmptyMsgDisplay(val){
        if(arguments.length){
            if(val === 'show')
                usernameInputRef.current.classList.add('is-invalid');
            else if(val === 'hide')
                usernameInputRef.current.classList.remove('is-invalid');
        }
    }

    function firstNameInputIsEmptyMsgDisplay(val){
        if(arguments.length){
            if(val === 'show')
                firstNameInputRef.current.classList.add('is-invalid');
            else if(val === 'hide')
                firstNameInputRef.current.classList.remove('is-invalid');
        }
    }

    function lastNameInputIsEmptyMsgDisplay(val){
        if(arguments.length){
            if(val === 'show')
                lastNameInputRef.current.classList.add('is-invalid');
            else if(val === 'hide')
                lastNameInputRef.current.classList.remove('is-invalid');
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

    function cellphoneNumInputIsEmptyMsgDisplay(val){
        if(arguments.length){
            if(val === 'show')
                cellphoneNumInputRef.current.classList.add('is-invalid');
            else if(val === 'hide')
                cellphoneNumInputRef.current.classList.remove('is-invalid');
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

    function passwordRepeatInputIsEmptyMsgDisplay(val){
        if(arguments.length){
            if(val === 'show')
                passwordRepeatInputRef.current.classList.add('is-invalid');
            else if(val === 'hide')
                passwordRepeatInputRef.current.classList.remove('is-invalid');
        }
    }

    function usernameInputOnFocusHandler(){
        usernameInputIsEmptyMsgDisplay('hide');
    }

    function emailInputOnFocusHandler(){
        emailInputIsEmptyMsgDisplay('hide');
    }

    function firstNameInputOnFocusHandler(){
        firstNameInputIsEmptyMsgDisplay('hide');
    }

    function lastNameInputOnFocusHandler(){
        lastNameInputIsEmptyMsgDisplay('hide');
    }

    function cellphoneNumInputOnFocusHandler(){
        cellphoneNumInputIsEmptyMsgDisplay('hide');
    }

    function passwordInputOnFocusHandler(){
        passwordInputIsEmptyMsgDisplay('hide');
    }

    function passwordRepeatInputOnFocusHandler(){
        passwordRepeatInputIsEmptyMsgDisplay('hide');
    }

    function signUpMethodOnChangeHandler(e){
        setSignUpMethod(e.target.getAttribute('data-val'));
    }

    async function signUpBtnOnClickHandler(){

        let validationErrsMsgs = [];
 
        if(!usernameInputVal()){
            validationErrsMsgs.push('username is empty');
            usernameInputIsEmptyMsgDisplay('show');
        }

        if(!firstNameInputVal()){
            validationErrsMsgs.push('first name is empty');
            firstNameInputIsEmptyMsgDisplay('show');
        }

        if(!lastNameInputVal()){
            validationErrsMsgs.push('last name is empty');
            lastNameInputIsEmptyMsgDisplay('show');
        }
 
        if(
            signUpMethod === 'email' ||
            signUpMethod === 'both' 
        )
            if(!emailInputVal()){
                validationErrsMsgs.push('email is empty');
                emailInputIsEmptyMsgDisplay('show');
            }

        if(
            signUpMethod === 'cellphone-num' ||
            signUpMethod === 'both' 
        )
            if(!cellphoneNumInputVal()){
                validationErrsMsgs.push('cellphone num is empty');
                cellphoneNumInputIsEmptyMsgDisplay('show');
            }
 
        if(!passwordInputVal()){
            validationErrsMsgs.push('password is empty');
            passwordInputIsEmptyMsgDisplay('show');
        }

        if(!passwordRepeatInputVal()){
            validationErrsMsgs.push('password repeat is empty');
            passwordRepeatInputIsEmptyMsgDisplay('show');
        }
 
        if(validationErrsMsgs.length)
            return;
       
        signUpFormDimmerDisplay('show');

        try{
            await sendReq(
                'http://localhost:5000/api/users/sign-up',
                'POST',
                undefined,
                JSON.stringify({
                    username: usernameInputRef.current.value.trim(),
                    firstName: firstNameInputRef.current.value.trim(),
                    lastName: lastNameInputRef.current.value.trim(),
                    password: passwordInputRef.current.value.trim(),
                    age: 32,
                }),
            );
 
            signUpFormDimmerDisplay('hide'); 
            dispatch(authActions.signIn());
            navigate('../home', { replace: true });
        }catch(err){
            signUpFormDimmerDisplay('hide');
        }
    }

    return (
        <div className="sign-up-page p-3">
            <div className="container py-4">        
                <div className="row">
                    <div className="col-3"></div>
                    <div className="col-6" style={{position: 'relative'}}>
                        <div ref={signUpFormSpinnerRef} className="spinner-wrapper d-flex justify-content-center align-items-center visually-hidden">
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
                                <input id="sign-in-by-cellphone-num" className='form-check-input' type="radio" data-val="cellphone-num" name="sign-up-method" checked={signUpMethod === 'cellphone-num' ? 'checked' : ''} onChange={signUpMethodOnChangeHandler}/>
                                <label className="form-check-label" htmlFor="sign-in-by-cellphone-num">
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
                            <div className={'mb-3 ' + (signUpMethod === 'cellphone-num' || signUpMethod === 'both' ? '' : 'visually-hidden')}>
                                <label htmlFor="cellphone-num-input" className="form-label">Cellphone Number</label>
                                <input ref={cellphoneNumInputRef} type="text" className="form-control" id="cellphone-num-input" placeholder="cellphone number" onFocus={cellphoneNumInputOnFocusHandler}/>
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
                            <button type="text" className="btn btn-primary" onClick={signUpBtnOnClickHandler}>Sign Up</button>
                        </div>
                    </div>
                    <div className="col-3"></div>
                </div>
            </div>
        </div>
    ); 
}

export default SignUp;