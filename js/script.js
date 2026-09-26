// =========================================
// ELEMENTOS
// =========================================

const searchInput = document.getElementById("searchInput");

const categoryButtons =
    document.querySelectorAll(".category-button");

const productCards =
    document.querySelectorAll(".product-card");

const noResults =
    document.getElementById("noResults");


// =========================================
// CARRINHO
// =========================================

const cartButton =
    document.getElementById("cartButton");

const cartClose =
    document.getElementById("cartClose");

const cartSidebar =
    document.getElementById("cartSidebar");

const cartOverlay =
    document.getElementById("cartOverlay");

const cartItems =
    document.getElementById("cartItems");

const cartCount =
    document.getElementById("cartCount");

const cartTotal =
    document.getElementById("cartTotal");


// =========================================
// MODAL DO PRODUTO
// =========================================

const productModalOverlay =
    document.getElementById("productModalOverlay");

const productModalClose =
    document.getElementById("productModalClose");

const modalProductImage =
    document.getElementById("modalProductImage");

const modalProductName =
    document.getElementById("modalProductName");

const modalProductDescription =
    document.getElementById("modalProductDescription");

const modalProductPrice =
    document.getElementById("modalProductPrice");

const modalTotal =
    document.getElementById("modalTotal");

const modalQuantity =
    document.getElementById("modalQuantity");

const modalIncrease =
    document.getElementById("modalIncrease");

const modalDecrease =
    document.getElementById("modalDecrease");

const modalAddButton =
    document.getElementById("modalAddButton");

const productObservation =
    document.getElementById("productObservation");

const extraOptions =
    document.querySelectorAll(".extra-option input");


// =========================================
// ESTADO
// =========================================

let currentCategory = "todos";

let cart = [];

let selectedProduct = null;

let selectedQuantity = 1;

let selectedBasePrice = 0;


// =========================================
// PREPARAR IDs DOS PRODUTOS
// =========================================

productCards.forEach((product, index) => {

    product.dataset.id =
        `product-${index + 1}`;

});


// =========================================
// ABRIR CARRINHO
// =========================================

function openCart() {

    cartSidebar.classList.add("active");

    cartOverlay.classList.add("active");

    document.body.style.overflow = "hidden";

}


// =========================================
// FECHAR CARRINHO
// =========================================

function closeCart() {

    cartSidebar.classList.remove("active");

    cartOverlay.classList.remove("active");

    document.body.style.overflow = "";

}


// =========================================
// EVENTOS DO CARRINHO
// =========================================

if (cartButton) {

    cartButton.addEventListener(
        "click",
        openCart
    );

}

if (cartClose) {

    cartClose.addEventListener(
        "click",
        closeCart
    );

}

if (cartOverlay) {

    cartOverlay.addEventListener(
        "click",
        closeCart
    );

}


// =========================================
// ABRIR MODAL DO PRODUTO
// =========================================

function openProductModal(product) {

    if (!product) return;


    selectedProduct = product;

    selectedQuantity = 1;


    // Nome

    const name =
        product.querySelector("h3")
        .textContent
        .trim();


    // Descrição

    const description =
        product.querySelector("p")
        .textContent
        .trim();


    // Preço

    const priceText =
        product.querySelector(".price")
        .textContent
        .trim();


    const price =
        parseFloat(
            priceText
            .replace("R$", "")
            .replace(/\./g, "")
            .replace(",", ".")
            .trim()
        );


    // Imagem

    const image =
        product.querySelector("img").src;


    selectedBasePrice = price;


    // Preencher modal

    modalProductName.textContent =
        name;

    modalProductDescription.textContent =
        description;

    modalProductImage.src =
        image;

    modalProductImage.alt =
        name;

    modalProductPrice.textContent =
        `R$ ${formatPrice(price)}`;


    modalQuantity.textContent =
        selectedQuantity;


    // Limpar adicionais

    extraOptions.forEach(option => {

        option.checked = false;

    });


    // Limpar observação

    productObservation.value = "";


    // Atualizar preço

    updateModalTotal();


    // Abrir

    productModalOverlay.classList.add(
        "active"
    );

    document.body.style.overflow =
        "hidden";

}


// =========================================
// FECHAR MODAL DO PRODUTO
// =========================================

function closeProductModal() {

    productModalOverlay.classList.remove(
        "active"
    );

    document.body.style.overflow = "";

    selectedProduct = null;

}


if (productModalClose) {

    productModalClose.addEventListener(
        "click",
        closeProductModal
    );

}


if (productModalOverlay) {

    productModalOverlay.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                productModalOverlay
            ) {

                closeProductModal();

            }

        }
    );

}


// =========================================
// CLIQUE NOS PRODUTOS
// =========================================

productCards.forEach(product => {

    product.addEventListener(
        "click",
        () => {

            openProductModal(product);

        }
    );

});


// =========================================
// BOTÕES +
// =========================================

const addButtons =
    document.querySelectorAll(".add-button");


addButtons.forEach(button => {

    button.addEventListener(
        "click",
        event => {

            // Impede o clique de subir
            // para o card

            event.stopPropagation();


            const product =
                button.closest(".product-card");


            openProductModal(product);

        }
    );

});


// =========================================
// QUANTIDADE DO MODAL
// =========================================

if (modalIncrease) {

    modalIncrease.addEventListener(
        "click",
        () => {

            selectedQuantity++;

            modalQuantity.textContent =
                selectedQuantity;

            updateModalTotal();

        }
    );

}


if (modalDecrease) {

    modalDecrease.addEventListener(
        "click",
        () => {

            if (selectedQuantity <= 1) {
                return;
            }


            selectedQuantity--;

            modalQuantity.textContent =
                selectedQuantity;

            updateModalTotal();

        }
    );

}


// =========================================
// ADICIONAIS
// =========================================

extraOptions.forEach(option => {

    option.addEventListener(
        "change",
        updateModalTotal
    );

});


// =========================================
// CALCULAR PREÇO DO MODAL
// =========================================

function getSelectedExtras() {

    const extras = [];

    let extrasTotal = 0;


    extraOptions.forEach(option => {

        if (option.checked) {

            extras.push({
                name: option.value,
                price: Number(
                    option.dataset.extraPrice
                )
            });


            extrasTotal +=
                Number(
                    option.dataset.extraPrice
                );

        }

    });


    return {
        extras,
        extrasTotal
    };

}


// =========================================
// ATUALIZAR TOTAL DO MODAL
// =========================================

function updateModalTotal() {

    if (!selectedProduct) {
        return;
    }


    const {
        extrasTotal
    } = getSelectedExtras();


    const total =
        (
            selectedBasePrice +
            extrasTotal
        ) * selectedQuantity;


    modalTotal.textContent =
        `R$ ${formatPrice(total)}`;

}


// =========================================
// ADICIONAR AO CARRINHO
// =========================================

if (modalAddButton) {

    modalAddButton.addEventListener(
        "click",
        () => {

            if (!selectedProduct) {
                return;
            }


            const productId =
                selectedProduct.dataset.id;


            const productName =
                selectedProduct.querySelector("h3")
                .textContent
                .trim();


            const productImage =
                selectedProduct.querySelector("img")
                .src;


            const productDescription =
                selectedProduct.querySelector("p")
                .textContent
                .trim();


            const {
                extras,
                extrasTotal
            } = getSelectedExtras();


            const observation =
                productObservation.value.trim();


            const finalPrice =
                selectedBasePrice +
                extrasTotal;


            // Criamos uma identificação
            // específica para produto + adicionais
            // + observação

            const cartItemKey =
                JSON.stringify({

                    productId,

                    extras: extras.map(
                        extra => extra.name
                    ),

                    observation

                });


            const existingProduct =
                cart.find(item =>

                    item.key === cartItemKey

                );


            if (existingProduct) {

                existingProduct.quantity +=
                    selectedQuantity;

            } else {

                cart.push({

                    key: cartItemKey,

                    id: productId,

                    name: productName,

                    description: productDescription,

                    price: finalPrice,

                    image: productImage,

                    quantity: selectedQuantity,

                    extras,

                    observation

                });

            }


            updateCart();

            closeProductModal();

            openCart();

        }
    );

}


// =========================================
// ALTERAR QUANTIDADE NO CARRINHO
// =========================================

function changeQuantity(
    cartItemKey,
    change
) {

    const product =
        cart.find(
            item => item.key === cartItemKey
        );


    if (!product) {
        return;
    }


    product.quantity += change;


    if (product.quantity <= 0) {

        cart =
            cart.filter(
                item => item.key !== cartItemKey
            );

    }


    updateCart();

}


// =========================================
// ATUALIZAR CARRINHO
// =========================================

function updateCart() {

    renderCart();

    updateCartCount();

    updateCartTotal();

}


// =========================================
// RENDERIZAR CARRINHO
// =========================================

function renderCart() {

    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <span>🛒</span>

                <h3>
                    Seu carrinho está vazio
                </h3>

                <p>
                    Adicione algum produto do cardápio.
                </p>

            </div>

        `;

        return;

    }


    cartItems.innerHTML = "";


    cart.forEach(product => {

                const item =
                    document.createElement("div");


                item.classList.add(
                    "cart-item"
                );


                const extrasHTML =
                    product.extras &&
                    product.extras.length > 0

                    ?
                    `
                    <div class="cart-item-extras">
                        ${product.extras
                            .map(
                                extra =>
                                    `<small>+ ${extra.name}</small>`
                            )
                            .join("")}
                    </div>
                `

                : "";


        const observationHTML =
            product.observation

                ? `
                    <div class="cart-item-observation">
                        <small>
                            Obs: ${product.observation}
                        </small>
                    </div>
                `

                : "";


        item.innerHTML = `

            <div class="cart-item-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

            </div>


            <div class="cart-item-info">

                <h3>
                    ${product.name}
                </h3>


                <div class="cart-item-price">

                    R$ ${formatPrice(product.price)}

                </div>


                ${extrasHTML}

                ${observationHTML}


                <div class="cart-item-controls">

                    <button
                        class="quantity-button"
                        onclick="changeQuantity('${escapeAttribute(product.key)}', -1)"
                    >
                        −
                    </button>


                    <span class="quantity">
                        ${product.quantity}
                    </span>


                    <button
                        class="quantity-button"
                        onclick="changeQuantity('${escapeAttribute(product.key)}', 1)"
                    >
                        +
                    </button>

                </div>

            </div>

        `;


        cartItems.appendChild(item);

    });

}


// =========================================
// CONTADOR DO CARRINHO
// =========================================

function updateCartCount() {

    const totalItems =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );


    cartCount.textContent =
        totalItems;

}


// =========================================
// TOTAL DO CARRINHO
// =========================================

function updateCartTotal() {

    const total =
        cart.reduce(
            (sum, item) =>
                sum +
                (
                    item.price *
                    item.quantity
                ),
            0
        );


    cartTotal.textContent =
        `R$ ${formatPrice(total)}`;

}


// =========================================
// FORMATAÇÃO DE PREÇO
// =========================================

function formatPrice(value) {

    return Number(value).toLocaleString(
        "pt-BR",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );

}


// =========================================
// SEGURANÇA PARA ATRIBUTOS HTML
// =========================================

function escapeAttribute(value) {

    return String(value)
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");

}


// =========================================
// PESQUISA
// =========================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        filterProducts
    );

}


function filterProducts() {

    const searchTerm =
        searchInput.value
            .toLowerCase()
            .trim();


    let visibleProducts = 0;


    productCards.forEach(product => {

        const productName =
            product.querySelector("h3")
                .textContent
                .toLowerCase();


        const productDescription =
            product.querySelector("p")
                .textContent
                .toLowerCase();


        const productCategory =
            product.dataset.category;


        const matchesSearch =
            productName.includes(
                searchTerm
            ) ||
            productDescription.includes(
                searchTerm
            );


        const matchesCategory =
            currentCategory === "todos" ||
            productCategory === currentCategory;


        if (
            matchesSearch &&
            matchesCategory
        ) {

            product.style.display = "";

            visibleProducts++;

        } else {

            product.style.display = "none";

        }

    });


    noResults.style.display =
        visibleProducts === 0
            ? "block"
            : "none";

}


// =========================================
// CATEGORIAS
// =========================================

categoryButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            categoryButtons.forEach(
                btn => {

                    btn.classList.remove(
                        "active"
                    );

                }
            );


            button.classList.add(
                "active"
            );


            currentCategory =
                button.dataset.category;


            filterProducts();

        }
    );

});


// =========================================
// TECLA ESC
// =========================================

document.addEventListener(
    "keydown",
    event => {

        if (event.key !== "Escape") {
            return;
        }


        closeProductModal();

        closeCart();

    }
);
// =========================================
// CHECKOUT
// =========================================

const checkoutButton =
    document.getElementById("checkoutButton");

const checkoutOverlay =
    document.getElementById("checkoutOverlay");

const checkoutClose =
    document.getElementById("checkoutClose");

const checkoutForm =
    document.getElementById("checkoutForm");

const checkoutTotal =
    document.getElementById("checkoutTotal");

const addressFields =
    document.getElementById("addressFields");

const changeField =
    document.getElementById("changeField");

const paymentMethod =
    document.getElementById("paymentMethod");

const orderTypeInputs =
    document.querySelectorAll(
        'input[name="orderType"]'
    );


// =========================================
// ABRIR CHECKOUT
// =========================================

checkoutButton.addEventListener(
    "click",
    () => {

        if (cart.length === 0) {

            alert(
                "Seu carrinho está vazio."
            );

            return;

        }

        checkoutTotal.textContent =
            `R$ ${formatPrice(getCartTotal())}`;

        checkoutOverlay.classList.add(
            "active"
        );

        document.body.style.overflow =
            "hidden";

    }
);


// =========================================
// FECHAR CHECKOUT
// =========================================

function closeCheckout() {

    checkoutOverlay.classList.remove(
        "active"
    );

    document.body.style.overflow = "";

}


checkoutClose.addEventListener(
    "click",
    closeCheckout
);


checkoutOverlay.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            checkoutOverlay
        ) {

            closeCheckout();

        }

    }
);


// =========================================
// TIPO DO PEDIDO
// =========================================

orderTypeInputs.forEach(input => {

    input.addEventListener(
        "change",
        () => {

            if (
                input.checked &&
                input.value === "Entrega"
            ) {

                addressFields.style.display =
                    "block";

            }


            if (
                input.checked &&
                input.value === "Retirada"
            ) {

                addressFields.style.display =
                    "none";

            }

        }
    );

});


// =========================================
// PAGAMENTO
// =========================================

paymentMethod.addEventListener(
    "change",
    () => {

        if (
            paymentMethod.value ===
            "Dinheiro"
        ) {

            changeField.classList.add(
                "active"
            );

        } else {

            changeField.classList.remove(
                "active"
            );

        }

    }
);


// =========================================
// TOTAL DO CARRINHO
// =========================================

function getCartTotal() {

    return cart.reduce(
        (total, item) => {

            return total +
                (
                    item.price *
                    item.quantity
                );

        },
        0
    );

}


// =========================================
// FORMATA ITENS DO PEDIDO
// =========================================

function getOrderItemsText() {

    let text = "";


    cart.forEach(item => {

        text +=
            `${item.quantity}x ${item.name} — R$ ${formatPrice(
                item.price * item.quantity
            )}\n`;


        if (
            item.extras &&
            item.extras.length > 0
        ) {

            item.extras.forEach(extra => {

                text +=
                    `   + ${extra.name}\n`;

            });

        }


        if (item.observation) {

            text +=
                `   📝 ${item.observation}\n`;

        }


        text += "\n";

    });


    return text;

}


// =========================================
// ENVIAR PARA WHATSAPP
// =========================================

checkoutForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        // =====================================
        // DADOS
        // =====================================

        const name =
            document.getElementById(
                "customerName"
            ).value.trim();


        const phone =
            document.getElementById(
                "customerPhone"
            ).value.trim();


        const orderType =
            document.querySelector(
                'input[name="orderType"]:checked'
            ).value;


        const payment =
            paymentMethod.value;


        const observation =
            document.getElementById(
                "orderObservation"
            ).value.trim();


        const total =
            getCartTotal();


        // =====================================
        // ENDEREÇO
        // =====================================

        let addressText = "";


        if (orderType === "Entrega") {

            const address =
                document.getElementById(
                    "customerAddress"
                ).value.trim();


            const number =
                document.getElementById(
                    "customerNumber"
                ).value.trim();


            const neighborhood =
                document.getElementById(
                    "customerNeighborhood"
                ).value.trim();


            const city =
                document.getElementById(
                    "customerCity"
                ).value.trim();


            const cep =
                document.getElementById(
                    "customerCEP"
                ).value.trim();


            if (
                !address ||
                !number ||
                !neighborhood ||
                !city
            ) {

                alert(
                    "Preencha o endereço completo."
                );

                return;

            }


            addressText =
                `${address}, ${number}\n` +
                `${neighborhood}\n` +
                `${city}`;


            if (cep) {

                addressText +=
                    ` - CEP: ${cep}`;

            }

        } else {

            addressText =
                "Retirada no restaurante";

        }


        // =====================================
        // TROCO
        // =====================================

        let changeText = "";


        if (
            payment === "Dinheiro"
        ) {

            const changeFor =
                document.getElementById(
                    "changeFor"
                ).value.trim();


            if (changeFor) {

                changeText =
                    `\n💵 Troco para: ${changeFor}`;

            }

        }


        // =====================================
        // MONTAR MENSAGEM
        // =====================================

        const message = `🍔 *BURGER HOUSE*
━━━━━━━━━━━━━━━━━━

📋 *NOVO PEDIDO*

👤 *Cliente:* ${name}
📱 *Telefone:* ${phone}

🛒 *ITENS DO PEDIDO*

${getOrderItemsText()}━━━━━━━━━━━━━━━━━━
💰 *TOTAL: R$ ${formatPrice(total)}*

📍 *ENTREGA / RETIRADA*

${addressText}

💳 *PAGAMENTO*

${payment}${changeText}

${observation
    ? `\n📝 *OBSERVAÇÃO*\n${observation}\n`
    : ""
}
━━━━━━━━━━━━━━━━━━

Obrigado pela preferência! 🍔`;



        // =====================================
        // NÚMERO DO RESTAURANTE
        // =====================================

        const restaurantWhatsApp =
            "5511917770051";


        // =====================================
        // CRIAR LINK
        // =====================================

        const whatsappURL =
            `https://wa.me/${restaurantWhatsApp}?text=${encodeURIComponent(
                message
            )}`;


        // =====================================
        // ABRIR WHATSAPP
        // =====================================

        window.open(
            whatsappURL,
            "_blank"
        );

    }
);