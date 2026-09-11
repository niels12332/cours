const products = [
    {
        id: 'hoodie-signal',
        name: 'Hoodie Signal',
        price: 54.9,
        description: 'Sweat épais, coupe confortable et marquage discret TRS4.',
        colors: [{ name: 'Noir', className: 'color-black' }, { name: 'Vert signal', className: 'color-green' }],
        gradient: ['#0b1728', '#1b805f']
    },
    {
        id: 'hoodie-terminal',
        name: 'Hoodie Terminal',
        price: 59.9,
        description: 'Un hoodie sombre avec une énergie de terminal et des détails cyan.',
        colors: [{ name: 'Noir', className: 'color-black' }, { name: 'Bleu', className: 'color-blue' }],
        gradient: ['#0c1022', '#315ca1']
    },
    {
        id: 'tshirt-protocol',
        name: 'T-shirt Protocol',
        price: 24.9,
        description: 'T-shirt léger, logo minimal et coupe pensée pour tous les jours.',
        colors: [{ name: 'Blanc', className: 'color-white' }, { name: 'Noir', className: 'color-black' }],
        gradient: ['#172d3c', '#5a9da5']
    },
    {
        id: 'tshirt-redteam',
        name: 'T-shirt Red Team',
        price: 27.9,
        description: 'Une pièce nette pour afficher la curiosité sans faire de bruit.',
        colors: [{ name: 'Noir', className: 'color-black' }, { name: 'Vert signal', className: 'color-green' }],
        gradient: ['#241a24', '#ad4b63']
    }
];

const sizes = ['S', 'M', 'L', 'XL'];
const cart = [];
const productGrid = document.querySelector('#product-grid');
const cartItems = document.querySelector('#cart-items');
const cartEmpty = document.querySelector('#cart-empty');
const cartCount = document.querySelector('#cart-count');
const cartBadge = document.querySelector('#cart-badge');
const cartTotal = document.querySelector('#cart-total');
const cartTotalDetail = document.querySelector('#cart-total-detail');
const checkoutButton = document.querySelector('#checkout-button');
const paymentPanel = document.querySelector('#payment-panel');
const paymentForm = document.querySelector('#payment-form');
const paymentMessage = document.querySelector('#payment-message');

function formatPrice(value) {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
}

function renderProducts() {
    productGrid.replaceChildren();

    products.forEach((product) => {
        const card = document.createElement('article');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-art" style="--product-dark: ${product.gradient[0]}; --product-light: ${product.gradient[1]}"></div>
            <div class="product-info">
                <h2>${product.name}</h2>
                <p class="product-price">${formatPrice(product.price)}</p>
                <p class="product-description">${product.description}</p>
                <div class="product-options">
                    <label>Taille
                        <select data-size>
                            ${sizes.map((size) => `<option value="${size}">${size}</option>`).join('')}
                        </select>
                    </label>
                    <div>
                        <span class="product-options label">Couleur</span>
                        <div class="color-options">
                            ${product.colors.map((color, index) => `
                                <label class="${color.className}" title="${color.name}">
                                    <input type="radio" name="color-${product.id}" value="${color.name}" ${index === 0 ? 'checked' : ''}>
                                </label>
                            `).join('')}
                        </div>
                    </div>
                </div>
                <button class="button primary add-button" type="button" data-add="${product.id}">Ajouter au panier</button>
            </div>
        `;
        productGrid.append(card);
    });
}

function renderCart() {
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartCount.textContent = `${itemCount} ${itemCount === 1 ? 'article' : 'articles'}`;
    cartBadge.textContent = itemCount;
    cartTotal.textContent = formatPrice(total);
    cartTotalDetail.textContent = formatPrice(total);
    checkoutButton.disabled = cart.length === 0;
    cartEmpty.hidden = cart.length > 0;
    cartItems.replaceChildren();

    cart.forEach((item, index) => {
        const element = document.createElement('div');
        element.className = 'cart-item';
        element.innerHTML = `
            <div>
                <strong>${item.name} x${item.quantity}</strong>
                <small>Taille ${item.size} · ${item.color}</small>
            </div>
            <span class="cart-item-price">${formatPrice(item.price * item.quantity)}</span>
            <button class="remove-item" type="button" data-remove="${index}">Retirer</button>
        `;
        cartItems.append(element);
    });
}

productGrid.addEventListener('click', (event) => {
    const button = event.target.closest('[data-add]');
    if (!button) return;

    const product = products.find((entry) => entry.id === button.dataset.add);
    const card = button.closest('.product-card');
    const size = card.querySelector('[data-size]').value;
    const color = card.querySelector('input[type="radio"]:checked').value;
    const existing = cart.find((item) => item.id === product.id && item.size === size && item.color === color);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, size, color, quantity: 1 });
    }

    renderCart();
    button.textContent = 'Ajouté';
    window.setTimeout(() => { button.textContent = 'Ajouter au panier'; }, 900);
});

cartItems.addEventListener('click', (event) => {
    const button = event.target.closest('[data-remove]');
    if (!button) return;
    cart.splice(Number(button.dataset.remove), 1);
    renderCart();
});

checkoutButton.addEventListener('click', () => {
    paymentPanel.hidden = false;
    paymentPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

paymentForm.addEventListener('submit', (event) => {
    event.preventDefault();
    paymentMessage.textContent = 'Paiement simulé avec succès. Merci pour ta commande !';
    paymentForm.reset();
    cart.splice(0, cart.length);
    renderCart();
});

renderProducts();
renderCart();