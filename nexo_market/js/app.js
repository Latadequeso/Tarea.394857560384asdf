
const products = [
    {
        id: 1,
        name: "Audífonos Pulse Air",
        category: "Tecnología",
        price: 129900,
        old: 159900,
        image: "img/audifonos.jpg",
        bg: "#f6dfd0",
        tag: "MÁS VENDIDO"
    },
    {
        id: 2,
        name: "Jarrón Aura",
        category: "Hogar",
        price: 74900,
        image: "img/jarron.jpg",
        bg: "#e9e4d6",
        tag: "NUEVO"
    },
    {
        id: 3,
        name: "Reloj Nova",
        category: "Accesorios",
        price: 189900,
        image: "img/reloj.jpg",
        bg: "#e5ebd4",
        tag: "DESTACADO"
    },
    {
        id: 4,
        name: "Botella Move",
        category: "Deporte",
        price: 49900,
        image: "img/botella.jpg",
        bg: "#dce9e9",
        tag: ""
    },
    {
        id: 5,
        name: "Lámpara Nube",
        category: "Hogar",
        price: 99900,
        image: "img/lampara.jpg",
        bg: "#f1e8d8",
        tag: "NUEVO"
    },
    {
        id: 6,
        name: "Parlante Mini Beat",
        category: "Tecnología",
        price: 89900,
        image: "img/parlante.jpg",
        bg: "#e2e5ed",
        tag: ""
    },
    {
        id: 7,
        name: "Gorra Weekend",
        category: "Accesorios",
        price: 59900,
        image: "img/gorra.jpg",
        bg: "#eee0df",
        tag: ""
    },
    {
        id: 8,
        name: "Mat de yoga Flow",
        category: "Deporte",
        price: 84900,
        image: "img/mat-yoga.jpg",
        bg: "#e4e9d9",
        tag: ""
    }
];

let activeCategory = "Todos";
let searchTerm = "";
let cart = [];

const money = value =>
    new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
    }).format(value);

const grid = document.getElementById("productGrid");
const empty = document.getElementById("emptyState");


// -------------------- 1. MOSTRAR PRODUCTOS --------------------

function renderProducts() {

    let list = products.filter(p =>
        (activeCategory === "Todos" || p.category === activeCategory) &&
        (`${p.name} ${p.category}`).toLowerCase().includes(searchTerm)
    );

    const sort = document.getElementById("sortSelect").value;

    if (sort === "low") {
        list.sort((a, b) => a.price - b.price);
    }

    if (sort === "high") {
        list.sort((a, b) => b.price - a.price);
    }

    grid.innerHTML = list.map(p => `
        <article class="product-card">

            <div class="product-image" style="background:${p.bg}">

                ${p.tag ? `<span class="tag">${p.tag}</span>` : ""}

                <img
                    class="product-photo"
                    src="${p.image}"
                    alt="${p.name}"
                    loading="lazy"
                >

                <button
                    class="quick-add"
                    data-add="${p.id}"
                    aria-label="Añadir ${p.name} al carrito"
                >
                    +
                </button>

            </div>

            <div class="product-meta">

                <span class="product-category">${p.category}</span>

                <h3>${p.name}</h3>

                <span class="product-price">
                    ${money(p.price)}

                    ${p.old ? `
                        <span class="product-old">
                            ${money(p.old)}
                        </span>
                    ` : ""}

                </span>

            </div>

        </article>
    `).join("");

    empty.hidden = list.length !== 0;
}


// -------------------- 2. NOTIFICACIONES --------------------

function notify(message) {

    const toast = document.getElementById("toast");

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(notify.timer);

    notify.timer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2200);
}


// -------------------- 3. AÑADIR AL CARRITO --------------------

function addToCart(id) {

    const found = cart.find(x => x.id === id);

    if (found) {
        found.qty++;
    } else {
        cart.push({
            id,
            qty: 1
        });
    }

    renderCart();

    notify("Producto añadido a tu carrito");
}


// -------------------- 4. MOSTRAR CARRITO --------------------

function renderCart() {

    const count = cart.reduce((n, x) => n + x.qty, 0);

    const total = cart.reduce((n, x) =>
        n + products.find(p => p.id === x.id).price * x.qty, 0
    );

    document.getElementById("cartCount").textContent = count;

    document.getElementById("cartSubtotal").textContent = money(total);

    const holder = document.getElementById("cartItems");

    holder.innerHTML = cart.length
        ? cart.map(x => {

            const p = products.find(y => y.id === x.id);

            return `
                <div class="cart-line">

                    <div class="cart-thumb" style="background:${p.bg}">
                        <img src="${p.image}" alt="${p.name}">
                    </div>

                    <div>

                        <h4>${p.name}</h4>

                        <small>${money(p.price)}</small>

                        <div class="qty-controls">

                            <button
                                data-qty="${p.id}"
                                data-delta="-1"
                                aria-label="Quitar uno"
                            >
                                −
                            </button>

                            <span>${x.qty}</span>

                            <button
                                data-qty="${p.id}"
                                data-delta="1"
                                aria-label="Añadir uno"
                            >
                                +
                            </button>

                        </div>

                    </div>

                    <strong>${money(p.price * x.qty)}</strong>

                </div>
            `;

        }).join("")
        : '<p class="cart-empty">Tu carrito está esperando algo especial.</p>';
}


// -------------------- 5. ABRIR Y CERRAR CARRITO --------------------

function toggleCart(open) {

    document.getElementById("cartDrawer")
        .classList.toggle("open", open);

    document.getElementById("drawerBackdrop")
        .classList.toggle("open", open);

    document.getElementById("cartDrawer")
        .setAttribute("aria-hidden", String(!open));
}


// -------------------- 6. FILTROS POR CATEGORÍA --------------------

document.getElementById("categoryList").addEventListener("click", e => {

    const b = e.target.closest("[data-category]");

    if (!b) return;

    activeCategory = b.dataset.category;

    document.querySelectorAll(".category-chip").forEach(x => {
        x.classList.toggle("active", x === b);
    });

    renderProducts();
});


// -------------------- 7. EVENTOS DE PRODUCTOS --------------------

grid.addEventListener("click", e => {

    const b = e.target.closest("[data-add]");

    if (b) {
        addToCart(Number(b.dataset.add));
    }
});


// -------------------- 8. ORDENAR PRODUCTOS --------------------

document.getElementById("sortSelect")
    .addEventListener("change", renderProducts);


// -------------------- 9. CONTROLES DEL CARRITO --------------------

document.getElementById("cartToggle")
    .addEventListener("click", () => toggleCart(true));

document.getElementById("closeCart")
    .addEventListener("click", () => toggleCart(false));

document.getElementById("drawerBackdrop")
    .addEventListener("click", () => toggleCart(false));


// -------------------- 10. MODIFICAR CANTIDADES --------------------

document.getElementById("cartItems").addEventListener("click", e => {

    const b = e.target.closest("[data-qty]");

    if (!b) return;

    const item = cart.find(x => x.id === Number(b.dataset.qty));

    item.qty += Number(b.dataset.delta);

    if (item.qty <= 0) {
        cart = cart.filter(x => x !== item);
    }

    renderCart();
});


// -------------------- 11. FINALIZAR COMPRA --------------------

document.getElementById("checkoutButton")
    .addEventListener("click", () => {

        notify(
            cart.length
                ? "¡Gracias! Esta es una demostración, no procesa pagos."
                : "Tu carrito está vacío."
        );

    });


// -------------------- 12. BUSCADOR --------------------

document.getElementById("searchToggle")
    .addEventListener("click", () => {

        document.getElementById("searchForm")
            .classList.toggle("open");

    });

document.getElementById("searchForm")
    .addEventListener("submit", e => {

        e.preventDefault();

        searchTerm = document.getElementById("searchInput")
            .value.trim().toLowerCase();

        activeCategory = "Todos";

        document.querySelectorAll(".category-chip").forEach(x => {

            x.classList.toggle(
                "active",
                x.dataset.category === "Todos"
            );

        });

        renderProducts();

        document.getElementById("catalogo").scrollIntoView();

    });


// -------------------- 13. MENÚ MÓVIL --------------------

document.getElementById("menuToggle")
    .addEventListener("click", () => {

        const nav = document.getElementById("mobileNav");

        const open = nav.classList.toggle("open");

        document.getElementById("menuToggle")
            .setAttribute("aria-expanded", String(open));

    });

document.querySelectorAll("#mobileNav a").forEach(a => {

    a.addEventListener("click", () => {

        document.getElementById("mobileNav")
            .classList.remove("open");

        document.getElementById("menuToggle")
            .setAttribute("aria-expanded", "false");

    });

});


// -------------------- 14. FORMULARIO DE SUSCRIPCIÓN --------------------

document.getElementById("newsletterForm")
    .addEventListener("submit", e => {

        e.preventDefault();

        document.getElementById("newsletterMessage")
            .textContent = "¡Gracias por suscribirte! (Demostración académica).";

        e.target.reset();

    });


// -------------------- 15. AÑO AUTOMÁTICO --------------------

document.getElementById("year").textContent = new Date().getFullYear();


// -------------------- 16. INICIALIZAR TIENDA --------------------

renderProducts();
renderCart();
