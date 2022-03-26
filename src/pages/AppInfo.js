import React, {useState,useEffect,useCallback} from 'react';

import { InfoCircle } from 'react-bootstrap-icons';

function AppInfo() {

  const [appInfoPageContent,setAppInfoPageContent] = useState('');

  const fetchElementDataHandler = useCallback(async () => {

    try{
        const response = await fetch('http://localhost:5000/api/elements-notes/',{
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                elementNoteLocation: 'app-info-page',
                elementNoteName: 'app-info-page',
            }),
        });

        const data = await response.json();
        if(!response.ok)
            throw new Error(data.message);

        setAppInfoPageContent(data.note);
    }catch(err){
        console.log(err);
    }
  },[]);

  useEffect(()=>{
    fetchElementDataHandler();
  },[]);
  
  return (
    <div className='add-scope-page container-fluid'>   
        <div className='page-title-box'>
          <h4 className='inline page-title'>
              App Info
          </h4>
          <InfoCircle/> 
        </div>    
        <div dangerouslySetInnerHTML={{__html: appInfoPageContent}} />   
    </div>
  );
}

export default AppInfo;
