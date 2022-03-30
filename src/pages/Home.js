import React, { useState, useEffect, useCallback } from 'react';

import ScopeCard from '../components/cards/ScopeCard';

import { useHttpClient } from '../shared/hooks/http-hook';

import './Home.css';

function Home(){

    const [scopeDatas, setScopeData] = useState([]);
    const [isLoadingCards, setLoadingCards] = useState(false);

    const {sendRequest, err, clearErr} = useHttpClient();

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
            <div className="row row-cols-2">
                <div className="subject-cards-segment col col-md-6">
                    <div className="subject-cards-container">
                        {content}
                    </div>
                </div>
            </div>
        </div>
    ); 
}

export default Home;