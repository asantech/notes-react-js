import { createRandomNum } from "./CreateRandomNum";

export function confirmDel(){
    let 
        randomNum = createRandomNum(10,90),
        confirmDelPromptResult 
    ;

    confirmDelPromptResult = prompt(`جهت تایید حذف کردن، عدد  ${randomNum} را وارد ورودی ذیل نمایید`);

    if(confirmDelPromptResult === null)
        return false;
    else if(confirmDelPromptResult.trim() === ''){
        alert('عددی را وارد ننموده اید.');
        return false;
    }else if(randomNum != confirmDelPromptResult.trim()){
        alert('عدد تایید حذف را اشتباه وارد نموده اید.');
        return false;
    }else
        return true;
}