import logoImg from '../assets/logo.jpg'
import Button from "./UI/Button.jsx";
import {useContext} from "react";
import CartContext from "../store/CartContext.jsx";
export default function Header() {
    const cartCtx = useContext(CartContext)
    const totalCartItems = cartCtx.items.reduce((totalNumberOfItems, item)=>{
        return totalNumberOfItems+item.quantity
    }, 0)
    return (
        <header id="main-header">
            <div id="title">
                <img src={logoImg} alt='Restaurant'/>
                <h1>React Food</h1>
            </div>
            <nav>
                <Button textonly>Cart ({totalCartItems})</Button>
            </nav>
        </header>
    )
}