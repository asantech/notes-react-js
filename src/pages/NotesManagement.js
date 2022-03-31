import React , { useContext, useState, useCallback, useEffect, Fragment} from 'react';

import { Pencil,Trash } from 'react-bootstrap-icons';

import NotableElementInfoIcon from '../components/NotableElementInfoIcon';

import { confirmDel } from '../shared/funcs/ConfirmDel';

import AuthContext from '../contexts/auth-context';

import { useHttpClient } from '../shared/hooks/http-hook';

import PageUnaccessibilityMsg from '../components/PageUnaccessibilityMsg';

function delBtnOnClickHandler(){
    if(confirmDel()){

    };
}

function NotesManagement(){

    const authContext = useContext(AuthContext);
  
    const {isLoading, sendRequest, err, clearErr} = useHttpClient();

    const [notesDatas, setNotesDatas] = useState([]);

    const fetchNotesHandler = useCallback(async () => {

        clearErr();

        try{
            const resData = await sendRequest('http://localhost:5000/api/notes');

            setNotesDatas(resData);
        }catch(err){
  
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

    if(isLoading)
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
                </Fragment>
            }
        </div>
    ); 
}

export default NotesManagement;