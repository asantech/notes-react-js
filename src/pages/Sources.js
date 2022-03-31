import { useContext, Fragment } from 'react';

import NotableElementInfoIcon from '../components/NotableElementInfoIcon';

import AuthContext from '../contexts/auth-context';

import PageUnaccessibilityMsg from '../components/PageUnaccessibilityMsg';

function Sources(){

    const authContext = useContext(AuthContext);

    return (
        <div className="sources-page p-3">
            {
                !authContext.userIsSignedIn ?
                <PageUnaccessibilityMsg/>
                :
                <Fragment>
                    <div className="page-title-box">
                        <h4 className='inline page-title'>
                            Sources
                        </h4>
                        <NotableElementInfoIcon 
                            elementLocation = 'sources-page'
                            elementName = 'sources-page'
                        />
                    </div>
                </Fragment>
            }
        </div>
    ); 
}

export default Sources;