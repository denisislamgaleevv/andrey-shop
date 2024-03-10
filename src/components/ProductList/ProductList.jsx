import React, {useState} from 'react';
import './ProductList.css';
import {ProductItem} from "./ProductItem/ProductItem";
import {useTelegram} from "../../hooks/useTelegram";
import {useCallback, useEffect} from "react";

const products = [
    {id: '1', title: 'картошка', price: 10, description: 'сырая, вкусная', img: 'https://ros-test.info/images/article/5d3eee44c3e1b.jpg'},
    {id: '2', title: 'картошка', price: 1000, description: 'фиолетовая, вкусная', img: 'https://potato.professorhome.ru/sites/default/files/2019-09/fioletovyj.jpg'},
    {id: '3', title: 'картошка', price: 35, description: 'варёная, с зеленью', img: 'https://s1.eda.ru/StaticContent/Photos/131207233339/131213215718/p_O.jpg'},
    {id: '4', title: 'картошка', price: 150, description: 'запечёная, с сыром', img: 'https://s1.eda.ru/StaticContent/Photos/120214125956/160611124434/p_O.jpg'},
    {id: '5', title: 'картошка', price: 220, description: 'жареная, с маслом', img: 'https://s1.eda.ru/StaticContent/Photos/170306185211/210216083616/p_O.jpg'},
    {id: '6', title: 'картошка', price: 265, description: 'жареная, без масла', img: 'https://lifehacker.ru/wp-content/uploads/2016/12/Depositphotos_40511149_original_1481039070-e1481039178443.jpg'},
    {id: '7', title: 'картошка', price: 115, description: 'фри, солёная', img: 'https://california22.ru/wp-content/uploads/2018/06/0705202212_PotatoFree-1600x1600.png'},
    {id: '8', title: 'картошка', price: 110, description: 'по деревенски, солёная', img: 'https://static.farfor.ru/cache/1d/27/1d27072aede00e5622f2e401c4a5fe3a.png'},
    {id: '9', title: 'картошка', price: 110, description: 'спиралью, на палочке', img: 'https://discontdom.ru/upload/iblock/68c/68cba35a45238e7fd45fe4d64201a5ed.jpeg'},
    {id: '10', title: 'кофе', price: 65, description: 'с молоком', img: 'https://images.gastronom.ru/3gGKfMps0F4RPGXkRLJq2i3F4gGirruK7w_fSL8Ell4/pr:article-cover-image/g:ce/rs:auto:0:0:0/L2Ntcy9hbGwtaW1hZ2VzLzM0OGVjNWVhLTgwODktNGNmMi1hNDY2LWMxZjU5MDczNDAyMy5qcGc'},
    {id: '11', title: 'кофе', price: 65, description: 'с сахаром', img: 'https://www.taberacoffee.ru/upload/310523-4.jpg'},
    {id: '12', title: 'газировка', price: 80, description: 'со льдом, случайный вкус', img: 'https://lh3.googleusercontent.com/proxy/SykLHgOwxTilGlcV8eNZuvP5qj01m-Bj6w9CpsJ3xnQcmwh9g4pv-N_NHsm9HlQBSe_SrCFuNsMwWIWyKf02BK8q4tPB'},
]


const getTotalPrice = (items = []) => {
    return items.reduce((acc, item) => {
        return acc += item.price
    }, 0)
}

export const ProductList = () => {
    const [addedItems, setAddedItems] = useState([]);

    const {tg, queryId, onClose} = useTelegram();

    const onSendData = useCallback(() => {
        
        const data = {
            products: addedItems,
            totalPrice: getTotalPrice(addedItems),
            queryId,
        }
        fetch('http://85.119.146.179:8000/web-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        
    }, [addedItems])

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData)
        return () => {
            tg.offEvent('mainButtonClicked', onSendData)
        }
    }, [onSendData])

    const onAdd = (product) => {
        const alreadyAdded = addedItems.find(item => item.id === product.id);
        let newItems = [];

        if(alreadyAdded) {
            newItems = addedItems.filter(item => item.id !== product.id);
        } else {
            newItems = [...addedItems, product];
        }

        setAddedItems(newItems)

        if(newItems.length === 0) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
            tg.MainButton.setParams({
                text: `Купить ${getTotalPrice(newItems)}`
            })
            tg.onClose()
        }
    }

    return (
        <div className={'list'}>
            {products.map(item => (
                <ProductItem
                    product={item}
                    onAdd={onAdd}
                    className={'item'}
                />
            ))}
        </div>
    );
};
 