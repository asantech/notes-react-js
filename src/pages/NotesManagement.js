import React , { useContext, useState, useCallback, useEffect, Fragment } from 'react';

import { useNavigate } from 'react-router-dom';

import { Pencil, Trash, Eye, ArrowRepeat } from 'react-bootstrap-icons';

import NotableElementInfoIcon from '../components/NotableElementInfoIcon';

import { confirmDel } from '../shared/funcs/ConfirmDel';

import AuthContext from '../contexts/auth-context';

import { useHttpClient } from '../shared/hooks/http-hook';

import PageUnaccessibilityMsg from '../components/PageUnaccessibilityMsg';

function NoteListRow(props){

    const navigate = useNavigate();

    const {isLoading: noteDelLoading, sendReq: sendNoteDelReq, err: noteDelErr, clearErr: clearNoteDelErr} = useHttpClient();

    async function delBtnOnClickHandler(event){
        if(confirmDel()){
            clearNoteDelErr();
    
            const noteRowId = event.target.closest('.note-row').getAttribute('data-id');
            try{
                const resData = await sendNoteDelReq(
                    `http://localhost:5000/api/notes/${noteRowId}`,
                    'DELETE'
                );
    
                props.setNotesDatas(resData);
            }catch(err){
        
            }
        };
    }

    function EditNoteBtnOnClickHandler(){
        navigate('../note',{
            state: {
                ...props.note,
            },
        });
    }

    function ObserveNoteBtnOnClickHandler(){

    }
 
    return (
        <tr className='note-row' data-id={props.note._id}>
            <td>{props.i + 1}</td>
            <td>{props.note.title}</td>
            {/* <td>{note.scope}</td> */}
            <td>
                <div className="btn-group me-2" role="group" aria-label="First group">
                    <button type="button" className="btn btn-warning btn-sm" onClick={ObserveNoteBtnOnClickHandler}>
                        <Eye />
                    </button>
                </div>
                <div className="btn-group me-2" role="group" aria-label="Second group">
                    <button type="button" className="btn btn-success btn-sm" onClick={EditNoteBtnOnClickHandler}>
                        <Pencil />
                    </button>
                </div>
                <div className="btn-group me-2" role="group" aria-label="Third group">
                    <button type="button" className="btn btn-danger btn-sm" onClick={delBtnOnClickHandler}>
                        <Trash />
                    </button>
                </div>
            </td>
            <td className={'note-row-spinner-container'+ (noteDelLoading ? '' : ' visually-hidden')}>
                <div className='spinner-wrapper d-flex justify-content-center align-items-center'>
                    <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                </div> 
            </td>
        </tr>
    )

}

function NotesManagement(){

    const authContext = useContext(AuthContext);
  
    const {isLoading: notesAreloading, sendReq: sendLoadNotesReq, err: loadNotesErr, clearErr: clearLoadNotesErr} = useHttpClient();

    const [notesDatas, setNotesDatas] = useState([]);

    async function refreshNotesList(){
        getNotesHandler();
    }

    const getNotesHandler = useCallback(async () => {

        clearLoadNotesErr();

        try{
            const resData = await sendLoadNotesReq('http://localhost:5000/api/notes');

            setNotesDatas(resData);
        }catch(err){
  
        }
    },[]);

    useEffect(() => {
        getNotesHandler();
    },[getNotesHandler]);

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
            <NoteListRow
                key = {note._id}
                i = {i}
                note = {note}
                setNotesDatas = {setNotesDatas}
            />
        ));

    if(loadNotesErr)
        content = <tr>
            <td colSpan="4">{loadNotesErr}</td>
        </tr>;

    if(notesAreloading)
        content = <tr>
            <td colSpan="4">Loading ...</td>
        </tr>;

    return (
        <div className="notes-management-page p-3">
            {
                !authContext.userIsSignedIn ?
                    <PageUnaccessibilityMsg/>
                :
                    <Fragment>
                        <div className='page-title-box'>
                            <h4 className='inline page-title'>
                                Notes Management
                            </h4>
                            <NotableElementInfoIcon 
                                elementLocation = 'notes-management-page'
                                elementName = 'notes-management-page'
                            />
                            <ArrowRepeat className='m-2' onClick={refreshNotesList}/>
                        </div>    
                        <div className="notes-list-segment">
                            <table className="table table-bordered table-striped table-hover table-non-fluid table-sm">
                                <thead>
                                    <tr>
                                        <th className="col">R</th>
                                        <th className="col">Note Title</th>
                                        {/* <th className="col">Scope</th> */}
                                        <th className="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {content}
                                </tbody>
                            </table>
                        </div>
                    </Fragment>
            }
        </div>
    ); 
}

export default NotesManagement;