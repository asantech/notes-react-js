import React , {Component} from 'react';

import { InfoCircle } from 'react-bootstrap-icons';

class NotesManagement extends Component {


    componentDidMount(){
 
    }

    render(){
        return (
            <div className="notes-management-page container-fluid">
                <h4 className='inline page-title'>
                    Notes Management
                </h4>
                <InfoCircle/>
            </div>
        ); 
    }
}

export default NotesManagement;