// cart Parent
const cartBtn = document.querySelector('.cart')

// clears all items in cart
let clearCartBtn = document.querySelector('.clearAll')

// cart dropdown div 
const cartDropDown = document.querySelector('.cart-dropdown')

// cart dropDown container div
// CART CONTENT
const cartDropDownContainer = document.querySelector('.cart-dropdown-items-container')

// cart total amount 
const cartTotal = document.querySelector('.cart-total-price')

// cart items quntity counter dot
const cartItems = document.querySelector(".cart-quantity-counter")

// cart quantity of item 
const cartItemQuantity = document.querySelector('.cart-item-quantity')

// products parent
const productDOM = document.querySelector('.products-grid2')

// cart
let cart = []

// buttons
let buttonsDOM = []


// show cart on click
function showDrop() {
    let icon = document.querySelector('.cart ion-icon[name="cart-outline"]')
    icon.onclick = () => {
        cartDropDown.style.display = 'block'
    }
}

// hides cart when mouse hover overed
function hideDrop() {
    cartDropDown.style.display = 'none'
}

// getting products from json file
class Products {
    async getProducts() {
        try {
            let result = await fetch('product.json')
            let data = await result.json()
            return data
        } catch (e) {
            console.log('Error :', e)
        }
    }
}


// displying products
class UI {
    displayProducts(product) {
        let result = ''
        product.forEach(product => {
            result += `<div class="rounded for-you-products bg-primary text-white p-20" data-category="${product.category}" data-id="${product.id}" >
            <a href="#">
                <div class="items__imgBox ">
                    <img src="${product.image}" alt="Product Photo" class="items__imgBox-img">
                </div>
                <p class="product-content product-title">${product.title}</p>
                <p class="product-desc" style="display:none;">${product.description}</p>
            </a>
            <h3 class="product-price">$${product.price}</h3>
            <div class="d-flex d-row align-center ">
                <div class="rate d-flex d-row align-center ">
                    <ion-icon name="star"></ion-icon>
                    <ion-icon name="star"></ion-icon>
                    <ion-icon name="star"></ion-icon>
                    <ion-icon name="star-half-outline"></ion-icon>
                    <ion-icon name="star-outline"></ion-icon>
                </div>
                <p style="font-size: 12px;">(${product.rating.rateCount})</p>
                <button class="product-add-to-cart d-universal" data-id="${product.id}">
                    <ion-icon name="cart-outline"></ion-icon>
                </button>
            </div>
        </div>`
        })
        productDOM.innerHTML = result
    }
    getAddToCartBtn() {
        const btns = [...document.querySelectorAll('.product-add-to-cart')]
        buttonsDOM = btns
        btns.forEach(btn => {
            let id = btn.dataset.id
            let inCart = cart.find(item => item.id == id)
            btn.addEventListener('click', event => {
                if(inCart){
                    console.log(inCart)
                }
                cart.map(item=>{
                    item.id === event.target.id
                })

                // get product from products
                let cartItem = {...Storage.getProduct(id)}
                // add product to the cart
                cart = [...cart, cartItem]
                // save cart in LocalStorage
                Storage.saveCart(cart)
                // set cart values
                this.setCartValues(cart)
                // display cart item
                this.addCartItem(cartItem)
                // show the cart
            })
        })
    }
    setCartValues(cart) {
        let tempTotal = 0;
        let itemsTotal = 0;
        
        cart.map(item => {
            tempTotal += item.price * item.amount
            itemsTotal += item.amount
        })
        cartTotal.innerText = "$" + parseFloat(tempTotal.toFixed(2))
        cartItems.innerText = itemsTotal
    }
    addCartItem(item) {
        const div = document.createElement('div')
        div.classList.add('cart-dropdown-item','d-universal')
        div.innerHTML = `<div class="cart-imgBox">
                            <img src="${item.image}" class="items__imgBox-img">
                        </div>
                        <p class="cart-item-title color-primary">${item.title}</p>
                        <div class="cart-item-quantity d-flex flex-column justify-center">
                            <ion-icon name="chevron-up-outline" class="amount-up" data-id="${item.id}"></ion-icon>
                            <span class="cart-item-quantity-value">${item.amount}</span>
                            <ion-icon name="chevron-down-outline" class="amount-down" data-id="${item.id}"></ion-icon>
                        </div>
                        <p class="cart-item-price color-black">$${item.price}</p>
                        <ion-icon class="removeItem" name="trash-outline" data-id="${item.id}"></ion-icon>`
        cartDropDownContainer.append(div)
    }
    setupApp(){
        cart = Storage.getCart()
        this.setCartValues(cart)
        this.populate(cart)
    }
    populate(cart){
        cart.forEach(item=> this.addCartItem(item))
    }
    cartLogic(){
        clearCartBtn.addEventListener("click",()=>{this.clearCart()})
        cartDropDownContainer.addEventListener('click',e=>{
            if(e.target.classList.contains('removeItem')){
                let removeItem = e.target
                let id = removeItem.dataset.id
                cartDropDownContainer.removeChild(removeItem.parentElement)
                this.removeCartItem(id)
            }
            else if(e.target.classList.contains('amount-up')){
                let addAmount = e.target
                let id = addAmount.dataset.id
                let tempItem = cart.find(item => item.id == id)
                tempItem.amount++
                Storage.saveCart(cart)
                this.setCartValues(cart)
                addAmount.nextElementSibling.innerText = tempItem.amount
            }
            else if(e.target.classList.contains('amount-down')){
                let lowerAmount = e.target
                let id = lowerAmount.dataset.id
                let tempItem = cart.find(item => item.id == id)
                tempItem.amount--
                if(tempItem.amount > 0){
                    Storage.saveCart(cart)
                    this.setCartValues(cart)
                    lowerAmount.previousElementSibling.innerText = tempItem.amount
                }else{
                    cartDropDownContainer.removeChild(lowerAmount.parentElement.parentElement)
                    this.removeCartItem(id)
                }
            }
                
        })
    }
    clearCart(){
        let cartItem = cart.map(item => item.id)
        cartItem.forEach(id => this.removeCartItem(id))
        while(cartDropDownContainer.children.length > 0){
            cartDropDownContainer.removeChild(cartDropDownContainer.children[0])
        }
    }
    removeCartItem(id){
        cart = cart.filter(item=> item.id !=id)
        this.setCartValues(cart)
        Storage.saveCart(cart)
    }
}


class Storage {
    static saveProducts(product) {
        localStorage.setItem('products', JSON.stringify(product))
    }
    static getProduct(id) {
        let products = JSON.parse(localStorage.getItem('products'))
        return products.find(product => product.id == id)
    }
    static saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart))
    }
    static getCart(){
        return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []
    }
}

document.addEventListener('DOMContentLoaded', () => {

    const ui = new UI()

    const products = new Products()

    ui.setupApp()

    // get all products
    products.getProducts().then(product => {
        ui.displayProducts(product)
        Storage.saveProducts(product)
    }).then(() => {
        ui.getAddToCartBtn()
        ui.cartLogic()
    })
})