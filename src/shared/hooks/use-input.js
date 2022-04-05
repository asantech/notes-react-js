import {useState} from 'react';

const useInput = (props) => {

    const [val,setVal] = useState('');
    const [isTouched,setIsTouched] = useState(false);

    const valIsValid = props.validateVal(val);
    const hasErr = isTouched && !valIsValid;

    function inputChangeHandler(event){
        setVal(event.target.value);
    }

    function inputBlurHandler(event){
        setIsTouched(true);
    }

    return{
        val,
        hasErr,
        inputChangeHandler,
        inputBlurHandler,
    }
}

export default useInput;