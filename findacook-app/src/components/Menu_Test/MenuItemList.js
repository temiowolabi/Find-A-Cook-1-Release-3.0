//import React from 'react';
import React, { useState } from 'react';
import '../CSS/Style.css'
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/actions/cartActions';

// function MenuListItem() {

//     const [quantity, setQuantity] = useState(1);

//     if(quantity === 0){
//         setQuantity(1);
//     }

//     const { product } = useSelector(state => state.products);

//     const dispatch = useDispatch();

//     const handleAddToCart = () => {
// 		dispatch(addToCart(product));
// 	};

//     return(
//         <>      
//         <div className='menu-quick'>
//         <img id="cdogs" src="../images/corndogs.jpg" />
  
//             <h1>American Corndogs</h1>
//             <h4>4 Crunchy Corndogs w/ Ketchup and Mustard</h4>
//             <h4>€10</h4>
//             <div className='quantityDiv'>
//             <button className='btn-quantity-minus' onClick={() => setQuantity(quantity - 1)}>
//                 <FaMinusCircle />
//             </button>
//             <p className='quantity'>{quantity}</p>
//             <button className='btn-quantity-plus' onClick={() => setQuantity(quantity + 1)}>
//                 <FaPlusCircle />
//             </button>
//             </div>
//             <div className='add'>
//             <button className='addCartButton' onClick={handleAddToCart}>Add to Cart</button>
//         </div>
//  </div>
//             <div className='ingredients'>
//                 <h2>Ingredients</h2>


//                 <h2>Details</h2>
//                 <p>American-inspired corndogs - coated frankfurter sausages in a cornmeal batter, deep-fried and served with ketchup and yellow mustard.</p>
//             </div>
       
//         </>
//     )
// }


const MenuListItem = ({ product }) => {
    
}

export default MenuListItem