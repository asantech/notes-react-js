import React , { useContext, useState, useEffect, useCallback, Fragment } from 'react';

import NotableElementInfoIcon from '../components/NotableElementInfoIcon';

import { Pencil, Trash } from 'react-bootstrap-icons';

import { useHttpClient } from '../shared/hooks/http-hook';

import AuthContext from '../contexts/auth-context';

import PageUnaccessibilityMsg from '../components/PageUnaccessibilityMsg';

function ScopesManagement(){

    const authContext = useContext(AuthContext);

    const [scopeDatas, setScopeData] = useState([]);

    const { isLoading, err, sendRequest, clearErr } = useHttpClient();

    let content;

    const fetchScopesHandler = useCallback(async () => {

        clearErr();

        try{
            const resData = await sendRequest('http://localhost:5000/api/scopes');

            const scopesArray = [];

            for(const id in resData)
                scopesArray.push(resData[id]);

            setScopeData(scopesArray);

        }catch(err){

        }
    },[]);

    useEffect(() => {
        fetchScopesHandler();
    },[fetchScopesHandler]);

    if(scopeDatas.length === 0)
        content = (
            <tr>
                <td colSpan="4">
                    No subjects added
                </td>
            </tr>
        );

    if(scopeDatas.length > 0)
        content = scopeDatas.map((scope,i) => (
            <tr key={i}>
                <th scope="row">{i+1}</th>
                <td>
                    <a href={scope.name}>{scope.name}</a>
                </td>
                <td>0</td>
                <td>
                    <div className="btn-group me-2" role="group" aria-label="First group">
                        <button type="button" className="btn btn-success btn-sm">
                            <i className="bi bi-trash-fill"></i>
                            <Pencil />
                        </button>
                    </div>
                    <div className="btn-group me-2" role="group" aria-label="Second group">
                        <button type="button" className="btn btn-danger btn-sm">
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
        <div className='scopes-management-page p-3'>
            {
                !authContext.userIsSignedIn ?
                <PageUnaccessibilityMsg />
                :
                <Fragment>
                    <div className='page-title-box'>
                        <h4 className='inline page-title'>
                            Scopes Management
                        </h4>
                        <NotableElementInfoIcon 
                            elementLocation = 'scopes-management-page'
                            elementName = 'scopes-management-page'
                        />
                    </div>
                    <div className="added-scopes-list-segment">
                        <table className="table table-bordered table-striped table-hover table-non-fluid table-sm">
                            <thead>
                                <tr>
                                    <th scope="col">R</th>
                                    <th scope="col">Name/Link</th>
                                    <th scope="col">Notes Count</th>
                                    <th scope="col"></th>
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

export default ScopesManagement;