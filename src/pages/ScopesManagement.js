import React , {useState, useEffect, useCallback} from 'react';

import { InfoCircle, Pencil,Trash } from 'react-bootstrap-icons';

function ScopesManagement(){

    const [scopeDatas, setScopeData] = useState([]);
    const [isLoadingCards, setLoadingCards] = useState(false);
    const [err, setErr] = useState(null);

    const fetchScopesHandler = useCallback(async () => {

        setLoadingCards(true);
        setErr(null);

        try{
            const response = await fetch('http://localhost:5000/api/scopes',{
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                },
            });

            const data = await response.json();
            if(!response.ok)
                throw new Error(data.message); // آیا throw بماند؟

            const scopesArray = [];

            for(const id in data)
                scopesArray.push(data[id]);

            setScopeData(scopesArray);
            setLoadingCards(false);
        }catch(err){
            setLoadingCards(false);
            setErr(err.message);
        }
    },[]);

    useEffect(() => {
        fetchScopesHandler();
    },[fetchScopesHandler]);

    let content;

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

    if(isLoadingCards)
        content = <tr>
            <td colSpan="4">Loading ...</td>
        </tr>;

    return (
        <div className="scopes-management-page container-fluid p-3">
            <div className='page-title-box'>
                <h4 className='inline page-title'>
                    Scopes Management
                </h4>
                <InfoCircle/>
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
        </div>
    ); 
}

export default ScopesManagement;