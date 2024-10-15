
## Simulador de Carrito de Compras de Biohacking

Este proyecto es un simulador de carrito de compras enfocado en productos relacionados con el biohacking. Utiliza HTML, CSS (Tailwind) y JavaScript para crear una experiencia interactiva que permite a los usuarios añadir productos a un carrito, modificar las cantidades, y finalizar la compra.


## Funcionalidades

**Visualización de productos**: Los productos se cargan dinámicamente desde un archivo JSON y se muestran en formato de tarjetas.

**Carrito de compras interactivo**: Los usuarios pueden añadir productos al carrito, modificar las cantidades o eliminarlos.

**Modal para finalizar compra**: El usuario puede ver un resumen de su compra, introducir sus datos y finalizar el pedido.

**Persistencia con LocalStorage**: El carrito y los datos de usuario se almacenan en el navegador para que no se pierdan al actualizar la página.

**Interfaz responsiva**: El diseño es totalmente adaptable a diferentes tamaños de pantalla.
## Tecnologías Utilizadas

**HTML5**: Estructura base del proyecto.

**Tailwind CSS**: Para el estilo y diseño responsivo.

**JavaScript**: Para la funcionalidad interactiva como la gestión del carrito de compras y la interacción con el DOM.

**Font Awesome**: Para los íconos del carrito y otros elementos visuales.

**LocalStorage**: Para guardar el estado del carrito y los datos del usuario entre sesiones.

**SweetAlert js**: Es una librería de JavaScript para mostrar mensajes a los usuarios.
## Estructura del Proyecto

**index.html**: Contiene la estructura del sitio y los elementos visuales.

**js/cart.js**: Archivo que contiene la lógica del carrito de compras y la interacción con LocalStorage.

**js/products.json**: Archivo JSON que contiene la lista de productos.
## Instrucciones de Uso

**Abrir el proyecto**: Puedes abrir el archivo index.html en tu navegador para interactuar con la aplicación.

**Añadir productos al carrito**: Los usuarios pueden hacer clic en los botones "Añadir al carrito" para agregar productos.

**Modificar el carrito**: Puedes modificar la cantidad de productos o eliminarlos directamente desde el carrito.

**Finalizar compra**: En el carrito, haz clic en "Checkout" para ver el resumen de la compra, introducir tus datos y finalizar la compra.

**Persistencia**: El carrito y los datos del usuario se guardan automáticamente en el navegador, por lo que no se perderán al recargar la página.
## Instalación y Configuración

Para correr este proyecto de manera local:

Clona este repositorio:
git clone https://github.com/Fabiano-87/PFinal-andelman

Abre el archivo index.html en tu navegador.