import React from 'react';
import _Products from '../Menu_Test/_Products'

import { useSelector } from 'react-redux';

const AdminBody = () => {

    const {products} = useSelector(state => state.products)
    console.log('cool', products)

    return(
        <>

                <div>
                    {products && products.map(product => (
                        <_Products key={product._id} product={product} />
                    ))}
                </div>


        </>
    );
}

export default AdminBody