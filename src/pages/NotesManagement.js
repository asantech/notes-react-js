import React , {useState,useCallback,useEffect} from 'react';

import { Pencil,Trash } from 'react-bootstrap-icons';

import NotableElementInfoIcon from '../components/NotableElementInfoIcon';

function createRandomNum(min, max) {  
    return Math.floor(Math.random() * (max - min + 1) + min);
}  

function confirmDel(){
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

function delBtnOnClickHandler(){
    if(confirmDel()){

    };
}

function NotesManagement(){

    const [notesDatas, setNotesDatas] = useState([]);
    const [isLoadingCards, setLoadingCards] = useState(false);
    const [err, setErr] = useState(null);

    const fetchNotesHandler = useCallback(async () => {

        setLoadingCards(true);
        setErr(null);

        try{
            const response = await fetch('http://localhost:5000/api/notes',{
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                },
            });

            const data = await response.json();
            if(!response.ok)
                throw new Error(data.message); // آیا throw بماند؟

            setNotesDatas(data);
            setLoadingCards(false);
        }catch(err){
            setLoadingCards(false);
            setErr(err.message);
        }
    },[]);

    useEffect(() => {
        fetchNotesHandler();
    },[fetchNotesHandler]);

    let content;

    if(notesDatas.length === 0)
        content = (
            <tr>
                <td colSpan="4">
                    No Notes added
                </td>
            </tr>
        );

    if(notesDatas.length > 0)
        content = notesDatas.map((note,i) => (
            <tr key={i} id={note._id}>
                <td>{++i}</td>
                <td>{note.title}</td>
                <td>
                    <div className="btn-group me-2" role="group" aria-label="First group">
                        <button type="button" className="btn btn-success btn-sm">
                            <i className="bi bi-trash-fill"></i>
                            <Pencil />
                        </button>
                    </div>
                    <div className="btn-group me-2" role="group" aria-label="Second group">
                        <button type="button" className="btn btn-danger btn-sm" onClick={delBtnOnClickHandler}>
                            <Trash />
                        </button>
                    </div>
                </td>
            </tr>
        ));

    if(err)
        content = <tr>
            <td colSpan="4">{err}</td>
        </tr>;

    if(isLoadingCards)
        content = <tr>
            <td colSpan="4">Loading ...</td>
        </tr>;

    return (
        <div className="notes-management-page p-3">
            <div className='page-title-box'>
                <h4 className='inline page-title'>
                    Notes Management
                </h4>
                <NotableElementInfoIcon 
                    elementLocation = 'notes-management-page'
                    elementName = 'notes-management-page'
                />
            </div>    
            <div className="notes-list-segment">
                <table className="table table-bordered table-striped table-hover table-non-fluid table-sm">
                    <thead>
                        <tr>
                            <th className="col">R</th>
                            <th className="col">Note Title</th>
                            <th className="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {content}
                    </tbody>
                </table>
            </div>
        </div>
    ); 
}

export default NotesManagement;