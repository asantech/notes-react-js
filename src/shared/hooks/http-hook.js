import {useState, useCallback, useRef, useEffect} from 'react';

export const useHttpClient = () => {

    const [isLoading,setIsLoading] = useState(false);
    const [err,setErr] = useState();

    const activeHttpReqs = useRef([]);

    const sendRequest = useCallback( 
        async (
            url, 
            method = 'GET', 
            headers = {
                'Content-type': 'application/json',
            },
            body = null,
        ) => {

            setIsLoading(true);

            const httpAbortCtrl = new AbortController;
            activeHttpReqs.current.push(httpAbortCtrl);
            
            try{
                const res = await fetch(url,{
                    method,
                    headers,
                    body,
                    signal: httpAbortCtrl.signal
                });
        
                const resData = await res.json();

                activeHttpReqs.current = activeHttpReqs.current.filter(
                    reqCtrl => reqCtrl !== httpAbortCtrl
                );
        
                if(!res.ok)
                    throw new Error(resData.message);

                // throw new Error('this is an err just for testing.');

                setIsLoading(false);
                return resData;
            }catch(err){
                setErr(err.message);
                setIsLoading(false);
                throw err;
            }
        }
    ,[]); 

    const clearErr = () => {
        setErr(null);
    }

    useEffect(()=> {
        return () => {
            activeHttpReqs.current.forEach(abortCtrl => abortCtrl.abort());
        }
    },[]);

    return {
        isLoading,
        err,
        sendRequest,
        clearErr
    }
}