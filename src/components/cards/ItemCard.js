import './ItemCard.css';

function ItemCard(props){
    
    return (
        <div className="item-card" data-id="">
            {props.title}
        </div>
    );
}

export default ItemCard;