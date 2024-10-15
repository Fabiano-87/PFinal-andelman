let productos = [];
let carrito = [];

async function fetchProductos() {
    try {
        const response = await fetch('js/products.json');
        if (!response.ok) {
            throw new Error('Error fetching products');
        }
        productos = await response.json();
        mostrarProductos();
    } catch (error) {
        console.error('Error:', error);
    }
}

fetchProductos();

function mostrarProductos() {
    const productosDiv = document.getElementById("productos");
    productosDiv.innerHTML = "";

    productos.forEach(producto => {
        const productoDiv = document.createElement("div");
        productoDiv.classList.add("relative", "border", "border-gray-700", "p-4", "text-center", "rounded-lg", "bg-black", "text-white", "w-full", "max-w-xs", "mx-auto");

        const descriptionModal = document.createElement("div");
        descriptionModal.classList.add("hidden", "absolute", "z-50", "bg-black", "bg-opacity-90", "rounded-lg", "transition-opacity", "duration-200", "opacity-0", "mt-2", "w-full");
        descriptionModal.style.marginLeft = "-16px";

        const modalContent = document.createElement("div");
        modalContent.classList.add("p-4", "rounded-lg", "text-white");

        modalContent.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}" class="w-16 h-16 object-cover mb-2 mx-auto">
            <p class="text-sm leading-relaxed">${producto.descripcion || "No description available."}</p>
        `;

        descriptionModal.appendChild(modalContent);
        productoDiv.appendChild(descriptionModal);

        const productImage = document.createElement("img");
        productImage.src = producto.imagen;
        productImage.alt = producto.nombre;
        productImage.classList.add("w-32", "h-32", "mx-auto", "rounded-lg", "object-cover", "mb-4", "hover:opacity-75");

        const productTitle = document.createElement("h3");
        productTitle.classList.add("text-lg", "font-bold");
        productTitle.textContent = producto.nombre;

        const productPrice = document.createElement("p");
        productPrice.classList.add("mb-2");
        productPrice.textContent = `Precio: $${producto.precio}`;

        const addToCartButton = document.createElement("button");
        addToCartButton.classList.add("bg-red-600", "hover:bg-red-700", "text-white", "py-2", "px-4", "mt-2", "rounded-lg", "text-lg", "font-semibold");
        addToCartButton.textContent = "Añadir al Carrito";
        addToCartButton.addEventListener('click', () => agregarAlCarrito(producto.id));

        productoDiv.appendChild(productImage);
        productoDiv.appendChild(productTitle);
        productoDiv.appendChild(productPrice);
        productoDiv.appendChild(addToCartButton);

        productosDiv.appendChild(productoDiv);

        let hoverTimeout;

        productImage.addEventListener('mouseenter', () => {
            clearTimeout(hoverTimeout);
            descriptionModal.classList.remove("hidden");
            setTimeout(() => {
                descriptionModal.classList.remove("opacity-0");
            }, 10);
        });

        productImage.addEventListener('mouseleave', () => {
            hoverTimeout = setTimeout(() => {
                descriptionModal.classList.add("opacity-0");
                setTimeout(() => {
                    descriptionModal.classList.add("hidden");
                }, 200);
            }, 100);
        });

        descriptionModal.addEventListener('mouseenter', () => {
            clearTimeout(hoverTimeout);
        });

        descriptionModal.addEventListener('mouseleave', () => {
            descriptionModal.classList.add("opacity-0");
            setTimeout(() => {
                descriptionModal.classList.add("hidden");
            }, 200);
        });
    });
}

mostrarProductos();

function agregarAlCarrito(idProducto) {
    const productoSeleccionado = productos.find(producto => producto.id === idProducto);
    const productoEnCarrito = carrito.find(producto => producto.id === idProducto);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
    } else {
        carrito.push({ ...productoSeleccionado, cantidad: 1 });
    }

    actualizarCarrito();
    actualizarIconoCarrito();
    guardarEnStorage();
}

function actualizarIconoCarrito() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = carrito.reduce((sum, producto) => sum + producto.cantidad, 0);

    if (totalItems > 0) {
        cartCount.textContent = totalItems;
        cartCount.classList.remove('hidden');
    } else {
        cartCount.classList.add('hidden');
    }
}

function actualizarCarrito() {
    const miniCartItemsDiv = document.getElementById('cart-items');
    miniCartItemsDiv.innerHTML = "";

    if (carrito.length === 0) {
        miniCartItemsDiv.innerHTML = `<p class="text-center text-gray-500">Tu carrito está vacío</p>`;
        document.getElementById('checkout-btn').classList.add('hidden');
    } else {
        let total = 0;
        carrito.forEach(producto => {
            total += producto.precio * producto.cantidad;
            miniCartItemsDiv.innerHTML += `
                <div class="flex flex-col justify-between items-start p-3 border border-white rounded-lg bg-gray-900 w-full">
                    <div class="w-full flex justify-between items-center">
                        <p class="text-sm font-semibold truncate w-3/5">${producto.nombre}</p>
                        <p class="text-sm font-semibold">$${(producto.precio * producto.cantidad).toFixed(2)}</p>
                    </div>
                    <div class="flex items-center space-x-2 mt-2 w-full">
                        <p class="text-xs text-gray-400">Cantidad: ${producto.cantidad}</p>
                        <div class="flex space-x-2 ml-auto">
                            <button class="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded" onclick="modificarCantidad(${producto.id}, -1)">-</button>
                            <button class="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded" onclick="modificarCantidad(${producto.id}, 1)">+</button>
                            <button class="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded" onclick="eliminarDelCarrito(${producto.id})">Eliminar</button>
                        </div>
                    </div>
                </div>
            `;
        });

        document.getElementById('total-modal').textContent = `Total: $${total.toFixed(2)}`;
        document.getElementById('checkout-btn').classList.remove('hidden');
    }

    guardarEnStorage();
}
function modificarCantidad(idProducto, cantidad) {
    const productoEnCarrito = carrito.find(producto => producto.id === idProducto);
    if (productoEnCarrito) {
        productoEnCarrito.cantidad += cantidad;
        if (productoEnCarrito.cantidad <= 0) {
            eliminarDelCarrito(idProducto);
        } else {
            actualizarCarrito();
            cargarResumenCompra();
        }
    }
}

function guardarEnStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function cargarEnStorage() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        actualizarCarrito();
        actualizarIconoCarrito();
    }
}

function abrirFinalizarCompra() {
    document.getElementById('mini-cart').classList.add('hidden');
    const modal = document.getElementById("modal-finalizar");
    modal.classList.remove("hidden");

    cargarResumenCompra();
}

function cargarResumenCompra() {
    const resumenDiv = document.getElementById("resumen-carrito");
    resumenDiv.innerHTML = "";

    let total = 0;
    carrito.forEach(producto => {
        total += producto.precio * producto.cantidad;
        resumenDiv.innerHTML += `
            <div class="flex flex-col justify-between items-start p-3 border border-white rounded-lg bg-gray-900 w-full">
                <div class="w-full flex justify-between items-center">
                    <p class="text-sm font-semibold truncate w-3/5">${producto.nombre}</p>
                    <p class="text-sm font-semibold">$${(producto.precio * producto.cantidad).toFixed(2)}</p>
                </div>
                <div class="flex items-center space-x-2 mt-2 w-full">
                    <p class="text-xs text-gray-400">Cantidad: ${producto.cantidad}</p>
                    <div class="flex space-x-2 ml-auto">
                        <button class="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded" onclick="modificarCantidad(${producto.id}, -1)">-</button>
                        <button class="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded" onclick="modificarCantidad(${producto.id}, 1)">+</button>
                        <button class="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded" onclick="eliminarDelCarrito(${producto.id})">Eliminar</button>
                    </div>
                </div>
            </div>
        `;
    });

    document.getElementById("total-modal").textContent = `Total: $${total.toFixed(2)}`;
}
function cerrarModal() {
    const modal = document.getElementById('modal-finalizar');
    modal.classList.add('hidden');
}

function eliminarDelCarrito(idProducto) {
    carrito = carrito.filter(producto => producto.id !== idProducto);
    actualizarCarrito();
    actualizarIconoCarrito();
    cargarResumenCompra();
    guardarEnStorage();
}

document.getElementById("datos-usuario").addEventListener("submit", function (e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const direccion = document.getElementById("direccion").value;

    if (nombre && email && direccion) {
        localStorage.setItem("nombre", nombre);
        localStorage.setItem("email", email);
        localStorage.setItem("direccion", direccion);

        carrito = [];
        actualizarCarrito();
        cerrarModal();
        abrirModalGracias();
    } else {
        Swal.fire({
            title: 'Error',
            text: 'Por favor, completa todos los campos.',
            icon: 'error',
            confirmButtonText: 'Cerrar',
            background: '#000',
            color: '#fff',
            confirmButtonColor: '#d32f2f'
        });
    }
});

function abrirModalGracias() {
    Swal.fire({
        title: '¡Muchas gracias por tu compra!',
        text: 'Tu compra ha sido realizada exitosamente.',
        icon: 'success',
        confirmButtonText: 'Cerrar',
        background: '#000',
        color: '#fff',
        confirmButtonColor: '#d32f2f'
    });
}

document.addEventListener("DOMContentLoaded", function () {
    mostrarProductos();

    const cartIcon = document.getElementById('cart-icon');
    const miniCart = document.getElementById('mini-cart');

    cartIcon.addEventListener('click', (event) => {
        event.preventDefault();
        miniCart.classList.toggle('hidden');
    });

    const nombre = localStorage.getItem("nombre");
    const email = localStorage.getItem("email");
    const direccion = localStorage.getItem("direccion");

    if (nombre) document.getElementById("nombre").value = nombre;
    if (email) document.getElementById("email").value = email;
    if (direccion) document.getElementById("direccion").value = direccion;

    cargarEnStorage();

    const checkoutBtn = document.getElementById('checkout-btn');
    const cancelarBtn = document.querySelector('.cancelar-btn');
    const cerrarGraciasBtn = document.querySelector('.cerrar-gracias-btn');

    if (checkoutBtn) checkoutBtn.addEventListener('click', abrirFinalizarCompra);
    if (cancelarBtn) cancelarBtn.addEventListener('click', cerrarModal);
    if (cerrarGraciasBtn) cerrarGraciasBtn.addEventListener('click', cerrarModalGracias);
});