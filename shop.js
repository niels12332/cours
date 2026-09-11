const products = [
    {
        id: 'mini-pc-lab',
        name: 'Mini PC Lab',
        price: 389,
        description: 'Machine dédiée aux VM, à la journalisation et aux exercices isolés. Aucune attaque sur un système tiers.',
        colors: [{ name: 'Noir', className: 'color-black' }, { name: 'Bleu', className: 'color-blue' }],
        gradient: ['#0b1728', '#1b805f'],
        image: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=900&q=80'
    },
    {
        id: 'raspberry-pi-kit',
        name: 'Raspberry Pi Lab Kit',
        price: 119,
        description: 'Carte, boîtier, alimentation et stockage pour héberger des services d’apprentissage et des prototypes réseau.',
        colors: [{ name: 'Noir', className: 'color-black' }, { name: 'Bleu', className: 'color-blue' }],
        gradient: ['#0c1022', '#315ca1'],
        image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=900&q=80'
    },
    {
        id: 'managed-switch',
        name: 'Switch manageable 8 ports',
        price: 79,
        description: 'Pour séparer les VLAN de test, observer les flux et garder le lab isolé du réseau familial.',
        colors: [{ name: 'Blanc', className: 'color-white' }, { name: 'Noir', className: 'color-black' }],
        gradient: ['#172d3c', '#5a9da5'],
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80'
    },
    {
        id: 'monitor-24',
        name: 'Écran 24 pouces IPS',
        price: 149,
        description: 'Écran confortable pour suivre les logs, la documentation et plusieurs terminaux sans fatigue.',
        colors: [{ name: 'Noir', className: 'color-black' }],
        gradient: ['#241a24', '#ad4b63'],
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80'
    },
    {
        id: 'keyboard-mechanical',
        name: 'Clavier mécanique compact',
        price: 69,
        description: 'Périphérique filaire précis pour écrire du code et administrer les machines du lab.',
        colors: [{ name: 'Noir', className: 'color-black' }, { name: 'Blanc', className: 'color-white' }],
        gradient: ['#18222a', '#49717c'],
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80'
    },
    {
        id: 'usb-network-adapter',
        name: 'Adaptateur réseau USB',
        price: 29,
        description: 'Interface supplémentaire pour les exercices réseau contrôlés et la capture sur son propre environnement.',
        colors: [{ name: 'Noir', className: 'color-black' }, { name: 'Vert signal', className: 'color-green' }],
        gradient: ['#241a24', '#ad4b63'],
        image: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=900&q=80'
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
const searchInput = document.querySelector('#shop-search');
const accountButton = document.querySelector('#account-button');
const accountDialog = document.querySelector('#account-dialog');
const accountForm = document.querySelector('#account-form');
const accountMessage = document.querySelector('#account-message');

function formatPrice(value) {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
}

function renderProducts() {
    productGrid.replaceChildren();

    const query = searchInput.value.trim().toLocaleLowerCase('fr');
    const visibleProducts = products.filter((product) => `${product.name} ${product.description}`.toLocaleLowerCase('fr').includes(query));

    visibleProducts.forEach((product) => {
        const card = document.createElement('article');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-art" style="--product-dark: ${product.gradient[0]}; --product-light: ${product.gradient[1]}"><img src="${product.image}" alt="${product.name}" loading="lazy"></div>
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

    if (!visibleProducts.length) {
        productGrid.innerHTML = '<p class="no-results">Aucun équipement ne correspond à cette recherche.</p>';
    }
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

searchInput.addEventListener('input', renderProducts);
accountButton.addEventListener('click', () => accountDialog.showModal());
accountForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.querySelector('#account-email').value.trim();
    localStorage.setItem('trs4-demo-account', email);
    accountMessage.textContent = `Session locale ouverte pour ${email}.`;
    accountForm.reset();
});

renderProducts();
renderCart();