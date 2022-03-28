import {useState, useCallback, useRef, useEffect} from 'react';

export const useHttpClient = () => {

    const [isLoading,setIsLoading] = useState(false);
    const [err,setErr] = useState();

    const activeHttpReqs = useRef([]);

    const sendRequest = useCallback(
        async (
            url, 
            method = 'GET', 
            body = null, 
            headers = {
                'Content-type': 'application/json',
            }
        ) => {
            try{
                setIsLoading(true);
                const httpAbortCtrl = new AbortController;
                activeHttpReqs.current.push(httpAbortCtrl);
                const res = await fetch(url,{
                    method,
                    body,
                    headers,
                    signal: httpAbortCtrl.signal
                });
        
                const resData = await res.json();
        
                if(!res.ok)
                    throw new Error(resData.message);

                return resData;
            }catch(err){
                setErr(err.message);
            }
            setIsLoading(false);
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