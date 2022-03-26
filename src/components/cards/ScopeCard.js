import './ScopeCard.css';

function ScopeCard(props){
    
    return (
        <div className="scope-card">
            {props.name}
        </div>
    );
}

export default ScopeCard;