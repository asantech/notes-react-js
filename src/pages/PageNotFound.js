function PageNotFound(props) {
  
  return (
    <div className='page-not-found p-3'> 
        <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Page not found !</h4>
            <p>this requested page wasn't found on the server.</p>
            {props.err && (
              <>
                <hr/>
                <p className="mb-0">
                    {props.err}
                </p>
              </>
            )}
        </div>
    </div>
  );
}

export default PageNotFound;
