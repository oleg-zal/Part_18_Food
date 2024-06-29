import Modal from "./UI/Modal.jsx";
import {useContext} from "react";
import CartContext from "../store/CartContext.jsx";
import {currencyFormatter} from "../utils/formatting.js";
import Input from "./UI/Input.jsx";
import Button from "./UI/Button.jsx";
import UserProgressContext from "../store/UserProgressContext.jsx";
import useHttp from "../hooks/useHttp.js";
import Error from "./Error.jsx";

const requestConfig = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
}
export default function CheckOut() {
    const cartCtx = useContext(CartContext)
    const userProgressCtx = useContext(UserProgressContext)
    const {data, isLoading, error,sendRequest, clearData} =
        useHttp('http://localhost:3000/orders', requestConfig)

    const cartTotal = cartCtx.items.reduce((totalPrice, item) => {
        return totalPrice + item.quantity * item.price
    }, 0)
    function handleClose() {
        userProgressCtx.hideCheckout();
    }
    function handleFinish() {
        userProgressCtx.hideCheckout();
        cartCtx.clearCart()
        clearData()

    }
    function handleGoToCheckout() {
        userProgressCtx.showCheckout()
    }
    function handleSubmit(event) {
        event.preventDefault()
        const fd = new FormData(event.target)
        const customerData = Object.fromEntries(fd.entries());

        sendRequest(
            JSON.stringify({
                order: {
                    items: cartCtx.items,
                    customer: customerData
                }
            })
        );
    }
    let actions = (
        <>
            <Button type="button" textonly onClick={handleClose}>Close</Button>
            <Button onClick={handleGoToCheckout}>Submit Order</Button>
        </>
    )
    if (isLoading) {
        actions = <span>Sending order data ...</span>
    }
    if (data && !error) {
        return (
            <Modal open={userProgressCtx.progress === 'checkout'} onClose={handleClose}>
                <h2>Success!!!</h2>
                <p>Your order was submitted successfully</p>
                <p className="modal-actions">
                    <Button onClick={handleFinish}>OK</Button>
                </p>
            </Modal>
        )
    }
    return (
        <Modal open={userProgressCtx.progress === 'checkout'} onClose={handleClose}>
            <form onSubmit={handleSubmit}>
                <h2>Checkout</h2>
                <p>Total Amount: {currencyFormatter.format(cartTotal)}</p>
                <Input label="Full Name" type="text" id="name"/>
                <Input label="E-mail Address" type="email" id="email"/>
                <Input label="Street" type="text" id="street"/>
                <div>
                    <Input label="Postal Code" type="text" id="postal-code"/>
                    <Input label="City" type="text" id="city"/>
                </div>
                {error && <Error title="Failed to submit order" message={error}/>}
                <p className="modal-actions">{actions}</p>
            </form>
        </Modal>
    )
}