import { Link } from 'react-router-dom';

function PageUnaccessibilityMsg() {

    return (
        <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Alert !</h4>
            <p>You cannot access this page because you haven't signed in.</p>
            <hr/>
            <p className="mb-0">
                In order to sign in, click this link 
                <Link className="alert-link m-2" to="/sign-in" exact="true">
                    (sign in page)
                </Link>
                <br/>
                If you haven't signed up yet, click this link 
                <Link className="alert-link m-2" to="/sign-up" exact="true">
                    (sign up page)
                </Link>
            </p>
            
        </div>
    );
}

export default PageUnaccessibilityMsg;