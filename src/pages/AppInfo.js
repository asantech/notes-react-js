import React, { useState, useEffect, useCallback } from 'react';

import { useHttpClient } from '../shared/hooks/http-hook';

function AppInfo() {

  const [appInfoPageContent, setAppInfoPageContent] = useState('');

  const {isLoading, sendRequest} = useHttpClient();

  const fetchElementDataHandler = useCallback(async () => {

    try{
        const resData = await sendRequest(
            'http://localhost:5000/api/elements-notes/',
            'POST',
            undefined,
            JSON.stringify({
                  elementNoteLocation: 'app-info-page',
                  elementNoteName: 'app-info-page',
            })
        );

        setAppInfoPageContent(resData.note);
    }catch(err){

    }
  },[]);

  useEffect(() => {
    fetchElementDataHandler();
  },[]);
  
  return (
    <div className='add-scope-page p-3'>   
        <div className={'spinner-wrapper d-flex justify-content-center align-items-center' + (isLoading ? '' : ' visually-hidden')}>
          <div className="spinner-border text-primary" role="status"></div>
        </div> 
        <div className='page-title-box'>
          <h4 className='inline page-title'>
              App Info
          </h4>
        </div>    
        <div className="ck-editor-content-output" dangerouslySetInnerHTML={{__html: appInfoPageContent}} />   
    </div>
  );
}

export default AppInfo;
