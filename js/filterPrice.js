





// api() function invokes items from products.json file using API's fetch method
document.addEventListener('DOMContentLoaded', api)


// When cart clicked it shows buyed items
function showDrop() {
    let dropdown = document.querySelector('.cart-dropdown')
    let x = document.querySelector('.cart ion-icon[name="cart-outline"]');
    x.onclick = () => {
        dropdown.style.display = 'block'
    }
}


// onMouseLeave from cart it will be hidden
function hideDrop() {
    let dropdown = document.querySelector('.cart-dropdown')
    dropdown.style.display = 'none'
}


// bring items from products.json file using API's fetch method
let products = []
function api() {
    fetch('./product.json')
        .then(res => res.json())
        .then(data => {
            products = [...data]
            let title = []
            for (let i = 0; i < products.length; i++) {
                title.push(products[i].title)
            }
            liveSearch(title)
            mapProducts(products)
        })
        .catch(e => {
            console.log('Error :', e)
        })
}


// Live search
function liveSearch(title) {
    const autocomplete = document.querySelector('#autocomplete')
    const resultsHtml = document.querySelector('.prediction')

    autocomplete.oninput = () => {
        let userInput = autocomplete.value
        let result = title.filter(item => item
            .includes(userInput))
            .map(item => `<li >${item}</li>`)
            .join('') // bu  method chainning usulini standart ko'rinishi
        // let result = data.filter(item => item.includes(userInput)).map(item => `<li> ${item} </li>`).join('') // bu qisqaroq yo'li

        // bu maydalangan yo'li
        // let mapped = result.map(item=> `<li> ${item} </li>`)
        // let removeComma = listItem.join('')
        // resultsHtml.innerHTML = removeComma


        resultsHtml.innerHTML = result
        if (userInput === '') resultsHtml.innerHTML = ''
    }
    resultsHtml.onclick = function (event) {
        let setValue = event.target.innerText
        autocomplete.value = setValue
        resultsHtml.innerHTML = ''
    }
}


// renders products grid from api() function
function mapProducts(data) {
    let productsCard = document.querySelector('.for-you-container .grid-template')
    productsCard.innerHTML = data.map(i =>
        `<div class="rounded for-you-products bg-primary text-white p-20" id="${i.link}" data-category="${i.category}" data-price="${i.pricefilter}">
        <a href="# ">
            <div class="items__imgBox ">
                <img src="${i.image}" alt="Product Photo" class="items__imgBox-img">
            </div>
            <p class="product-content product-title">${i.title}</p>
            <p class="product-desc" style="display:none;">${i.description}</p>
        </a>
        <h3 class="product-price">$${i.price}</h3>
        <div class="d-flex d-row align-center ">
            <div class="rate d-flex d-row align-center ">
                <ion-icon name="star"></ion-icon>
                <ion-icon name="star"></ion-icon>
                <ion-icon name="star"></ion-icon>
                <ion-icon name="star-half-outline"></ion-icon>
                <ion-icon name="star-outline"></ion-icon>
            </div>
            <p style="font-size: 12px;">(${i.rating.rateCount})</p>
            <ion-icon name="cart-outline" class="product-add-to-cart" onclick="addItemTocart(${i.id})"> </ion-icon>
        </div>
    </div>`
    ).join('')
}

// Filters the products in page by category
function filterProds() {
    let indicator = document.querySelector('.indicator').children
    let productsContainer = document.querySelector('.products-grid2').children

    for (let i = 0; i < indicator.length; i++) {
        indicator[i].onclick = function () {
            for (let x = 0; x < indicator.length; x++) {
                indicator[x].classList.remove('active')
            }
            this.classList.add('active')
            const displayItems = this.getAttribute('data-filter')

            for (let z = 0; z < productsContainer.length; z++) {
                productsContainer[z].style.transform = 'scale(0)'
                productsContainer[z].style.display = 'none'
                if ((productsContainer[z].getAttribute('data-category') === displayItems) || displayItems === 'all') {
                    productsContainer[z].style.transform = 'scale(1)'
                    productsContainer[z].style.display = 'block'
                }
            }
        }
    }
}

name = new type(arguments);

filterProds()


// when page loaded it shows the Pop-up
// const sale = document.querySelector('.temporary')
// let btn = sale.querySelector('.close-btn')
// let body = document.querySelector('body')
// document.addEventListener('DOMContentLoaded', () => {
//     setTimeout(() => {
//         sale.classList.remove('d-none')
//         sale.classList.add('d-flex')
//         wrapper.style.filter = 'blur(5px)'
//         body.style.userSelect = 'none'
//         body.scrollTo(0,0)
//     }, 1500)
// })


// hides the PopUp
// btn.addEventListener('click', removeSale)
// function removeSale() {
//     sale.classList.add('d-none')
//     wrapper.style.filter = 'blur(0)'
//     sale.style.position = 'relative'

// }




// decreases and removes product from cart when removeBtn is clicked
function removeCartItem(event) {
    let clicked = event.target
    clicked.parentElement.remove()
    let itemTitle = clicked.parentElement
    let title = itemTitle.querySelector('p').innerText
    let product = JSON.parse(localStorage.getItem('product'))
    for (let i = 0; i < product.length; i++) {
        if (product[i].title === title) {
            product.splice(index, 1)
        }
    }
    updateCartTotal()
    removeLocalItemQnty()
}


// decreases products quantity in localStorage when products removed from cart
function removeLocalItemQnty() {
    let product = localStorage.getItem('product')
    let productNumbers = localStorage.getItem('prodNumbers')
    if (productNumbers) {
        localStorage.setItem('prodNumbers', productNumbers - 1)
        for (let i = 0; i < product.length; i++) {
            localStorage.removeItem(product[i])
        }
        document.querySelector('.cart-quantity-counter').textContent = productNumbers - 1
    } else {
        localStorage.setItem('prodNumbers', 1)
        document.querySelector('.cart-quantity-counter').textContent = 1
    }
}


// product quantity can't be less than 1 in cart
function quantityChanged(event) {
    let input = event.target
    if (isNaN(input.value) || input.value <= 0) input.value = 1
    updateCartTotal()

}


// adds the product to cart when addToCart is clicked
function addItemTocart(id) {
    let currentProduct = products.find(item => item.id == id)
    let cartDropdownItem = document.createElement('div')
    cartDropdownItem.classList.add('cart-dropdown-item', 'd-universal')
    let cartDropdownContainer = document.querySelector('.cart-dropdown-items-container')
    let cartItemTitle = document.querySelectorAll('.cart-item-title')
    let cartQuantity = document.querySelectorAll('.cart-item-quantity')

    for (let i = 0; i < cartItemTitle.length; i++) {
        if (currentProduct.title == cartItemTitle[i].innerText) {
            cartQuantity[i].value++
            updateCartTotal()
            // alertPopup(cartQuantity[i].value, cartItyemTitle[i].innerText)
            return
        }
    }
    let content = `<div class="cart-imgBox">
                    <img src="${currentProduct.image}" class="items__imgBox-img">
                    </div>
                    <p class="cart-item-title color-primary">${currentProduct.title}</p>
                    <input class="cart-item-quantity" type="number" value="1">
                    <p class="cart-item-price color-black">$${currentProduct.price}</p>
                    <ion-icon name="trash-outline"></ion-icon>`
    cartDropdownItem.innerHTML = content
    cartDropdownContainer.append(cartDropdownItem)
    cartDropdownItem.querySelector('ion-icon[name="trash-outline"]').addEventListener('click', removeCartItem)
    cartDropdownItem.querySelector('ion-icon[name="trash-outline"]').addEventListener('click', itemCounter)
    cartDropdownItem.querySelector('.cart-item-quantity').addEventListener('change', quantityChanged)
    document.querySelector('.product-add-to-cart').addEventListener('click', countInStorage(currentProduct))

    itemCounter()
    updateCartTotal()
}


// counts the products in local storage
function countInStorage(product) {
    let prodInCart = product
    let productNumbers = localStorage.getItem('prodNumbers')
    productNumbers = parseInt(productNumbers)
    if (productNumbers) {
        localStorage.setItem('prodNumbers', productNumbers + 1)
        document.querySelector('.cart-quantity-counter').textContent = productNumbers + 1
    } else {
        localStorage.setItem('prodNumbers', 1)
        document.querySelector('.cart-quantity-counter').textContent = 1
    }

    saveToLocal(prodInCart)
}



// saves products to localStorage
function saveToLocal(prod) {
    let product = [];
    product = JSON.parse(localStorage.getItem('product')) || [];
    product.push(prod);
    localStorage.setItem('product', JSON.stringify(product))
    rebuildOnRefresh(prod)
}


// re-renders cart items when the page refreshed
function rebuildOnRefresh(product) {
    if (!product) {
        product = JSON.parse(localStorage.getItem('product'))
    }
    for (let k = 0; k < product.length; k++) {
        let cartDropdownItem = document.createElement('div')
        cartDropdownItem.classList.add('cart-dropdown-item', 'd-universal')
        let cartDropdownContainer = document.querySelector('.cart-dropdown-items-container')
        let cartItemTitle = document.querySelectorAll('.cart-item-title')
        let cartQuantity = document.querySelectorAll('.cart-item-quantity')

        for (let i = 0; i < cartItemTitle.length; i++) {
            if (product[k].title == cartItemTitle[i].innerText) {
                cartQuantity[i].value++
                updateCartTotal()
                // alertPopup(cartQuantity[i].value, cartItyemTitle[i].innerText)
                return
            }
        }
        let content = `<div class="cart-imgBox">
                            <img src="${product[k].image}" class="items__imgBox-img">
                            </div>
                            <p class="cart-item-title color-primary">${product[k].title}</p>
                            <input class="cart-item-quantity" type="number" value="1">
                            <p class="cart-item-price color-black">$${product[k].price}</p>
                            <ion-icon name="trash-outline"></ion-icon>`
        cartDropdownItem.innerHTML = content
        cartDropdownContainer.append(cartDropdownItem)
        cartDropdownItem.querySelector('ion-icon[name="trash-outline"]').addEventListener('click', removeCartItem)
        cartDropdownItem.querySelector('ion-icon[name="trash-outline"]').addEventListener('click', itemCounter)
        cartDropdownItem.querySelector('.cart-item-quantity').addEventListener('change', quantityChanged)
        itemCounter()
        updateCartTotal()
    }

    // let prod = product
}


// sets cart item's count equal to number of localTorage items
function onLoadCartNum() {
    let productNumbers = localStorage.getItem('prodNumbers')
    if (productNumbers) {
        document.querySelector('.cart-quantity-counter').textContent = productNumbers
    }
}


onLoadCartNum()
rebuildOnRefresh()


// shows pop-up like "You bought ${pcs} pcs from ${title}" when user bought smth 
// function alertPopup(pcs, title) {
//     let addItemBtn = document.querySelectorAll('.product-add-to-cart')
//     let alertBox = document.querySelector('.alert')
//     let alertText = alertBox.querySelector('.alert-text')
//     for (let i = 1; i < addItemBtn.length; i++)
//         addItemBtn[i].addEventListener('click', () => {
//             alertBox.style.display = 'block'
//             alertText.innerText = `You bought ${pcs} pcs from ${title}`
//             setTimeout(() => {
//                 alertBox.style.display = 'none'
//             }, 2000)
//         })
// }



// counts products in cart
function itemCounter() {
    let items = document.querySelectorAll('.cart-dropdown-item')
    let counter = document.querySelector('.cart-quantity-counter')
    for (let i = 0; i <= items.length; i++) {
        counter.innerText = i
    }
}



// calculates all price of bought items
function updateCartTotal() {
    let cartItemsContainer = document.querySelector('.cart-dropdown-items-container')
    let cartItems = cartItemsContainer.querySelectorAll('.cart-dropdown-item')
    let total = 0;
    for (let i = 0; i < cartItems.length; i++) {
        let cartItem = cartItems[i]
        let priceElement = cartItem.querySelectorAll('.cart-item-price')[0]
        let quantityElement = cartItem.querySelectorAll('.cart-item-quantity')[0]
        let price = parseFloat(priceElement.innerText.replace('$', ''))
        let quantity = quantityElement.value
        total = total + (price * quantity)
    }
    total = Math.round(total * 100) / 100
    document.querySelector('.cart-total-price').innerText = '$' + total
}
