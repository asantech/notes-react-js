import React, { useState, useEffect, useCallback, Fragment } from 'react';

import { useSelector } from 'react-redux';

import ScopeCard from '../components/cards/ScopeCard';

import { useHttpClient } from '../shared/hooks/http-hook';

import { ArrowRepeat } from 'react-bootstrap-icons';

import NotableElementInfoIcon from '../components/NotableElementInfoIcon';

import PageUnaccessibilityMsg from '../components/PageUnaccessibilityMsg';

import './Home.css';

function Home(){

    const auth = useSelector(state => state.auth);

    const { sendReq, err, clearErr } = useHttpClient();

    const [scopeDatas, setScopeData] = useState([]);
    const [isLoadingCards, setLoadingCards] = useState(false);

    const fetchScopesHandler = useCallback(async () => {

        setLoadingCards(true);
        clearErr(); // چرا اینجا؟

        try{
            const resData = await sendReq('http://localhost:5000/api/scopes');
            setScopeData(resData);
        }catch(err){
 
        }

        setLoadingCards(false);
    },[]);

    useEffect(() => {
        fetchScopesHandler();
    },[fetchScopesHandler]);

    function refreshPageData(){
        fetchScopesHandler();
    }

    let content = <p>No subjects added</p>;

    if(scopeDatas.length > 0)
        content = scopeDatas.map((scope,i) => (
            <ScopeCard
                key = {scope._id}
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
                !auth.userIsSignedIn ?
                <PageUnaccessibilityMsg/>
                :
                <Fragment>
                    <div className='page-title-box'>
                        <h4 className='inline page-title'>
                            Home
                        </h4>
                        <NotableElementInfoIcon 
                            notableElementLocation = 'home-page'
                            notableElementName = 'home-page'
                        />
                        <ArrowRepeat className='m-2' onClick={refreshPageData}/>
                    </div>
                    <div className="row">
                        <div className="subject-cards-segment">
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