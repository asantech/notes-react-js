import { Fragment } from 'react';

import { useSelector } from 'react-redux';

import NotableElementInfoIcon from '../components/NotableElementInfoIcon';

import PageUnaccessibilityMsg from '../components/PageUnaccessibilityMsg';

function Sources(){

    const auth = useSelector(state => state.auth);

    return (
        <div className="sources-page p-3">
            {
                !auth.userIsSignedIn ?
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