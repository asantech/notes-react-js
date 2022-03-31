import React, { useContext, useState, useEffect, useCallback, Fragment } from 'react';

import ScopeCard from '../components/cards/ScopeCard';

import { useHttpClient } from '../shared/hooks/http-hook';

import './Home.css';

import AuthContext from '../contexts/auth-context';

import PageUnaccessibilityMsg from '../components/PageUnaccessibilityMsg';

function Home(){

    const authContext = useContext(AuthContext);

    const {sendRequest, err, clearErr} = useHttpClient();

    const [scopeDatas, setScopeData] = useState([]);
    const [isLoadingCards, setLoadingCards] = useState(false);

    const fetchScopesHandler = useCallback(async () => {

        setLoadingCards(true);
        clearErr(); // چرا اینجا؟

        try{
            await sendRequest('http://localhost:5000/api/scopes');
        }catch(err){
 
        }

        setLoadingCards(false);
    },[]);

    useEffect(() => {
        fetchScopesHandler();
    },[fetchScopesHandler]);

    let content = <p>No subjects added</p>;

    if(scopeDatas.length > 0)
        content = scopeDatas.map((scope,i) => (
            <ScopeCard
                key = {'scope'+i}
                name = {scope.name}
            />
        ));

    if(err)
        content = <p>{err}</p>;

    if(isLoadingCards)
        content = <p>Loading ...</p>;

    return (
        <div className="home-page p-3">
            {
                !authContext.userIsSignedIn ?
                <PageUnaccessibilityMsg/>
                :
                <Fragment>
                    <div className="row row-cols-2">
                        <div className="subject-cards-segment col col-md-6">
                            <div className="subject-cards-container">
                                {content}
                            </div>
                        </div>
                    </div>
                </Fragment>
            }
        </div>
    ); 
}

export default Home;