window.onload = function () {
    const products = document.getElementById('productos');
    const orderby = document.getElementById('orderby');
    const urlProducts = "https://api-diego-prueba.herokuapp.com/api/products";
    const urlCategory = "https://api-diego-prueba.herokuapp.com/category";
    const urlSearch = "https://api-diego-prueba.herokuapp.com/search?name=";
    const busqueda = document.querySelector('.busqueda');
    const botoBuscar = document.querySelector('.buscar');

    let category = "";
    let search = "";
    let urlF = urlProducts;

    //crea las cartas donde se mustran los productos
    function productCard(product) {
        let card = document.createElement('div');
        card.className = "card item col-4 mx-3";
        card.innerHTML = `
        <img srcset="${product.url_image ? product.url_image : ""}, https://www.lincolnparksmiles.com/wp-content/uploads/2019/05/beverages-carbonated-drink-cold-drink-1571849.jpg" alt="${product.url_image}" class="card-img-top image" >
        <div class="card-body">
            <h5 class="card-title fs-4">${product.name}</h5>
        </div>
            ${(product.discount > 0) ? `
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger off">
                ${product.discount}% OFF
                    <span class="visually-hidden">unread messages</span>
                </span>
                <p class='card-text fs-4 text-danger'>Precio: <span class="text-decoration-line-through">$${product.price}</span> $${product.price - (product.price * product.discount / 100)} </p>`
                :
                "<p class='card-text fs-4'>Precio: $" + product.price + "</p>"
            }        
        <a href="#" class="btn btn-warning mb-3">Agregar al carrito</a>
        `;
        return card;
    }

    //decide que url se va a usar para obtener los productos
    function url(category, search) {
        if (category == "") {
            if (search == "") {
                return urlProducts;
            } else {
                return urlSearch + search;
            }
        } else {            
            return urlCategory + "/" + category;
        }
    }

    //obtiene los productos de la API y los muestra con productCard con try catch
    function getProducts(url) {
        fetch(url)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                products.innerHTML = "";
                data.forEach(product => {
                    try {
                        products.appendChild(productCard(product));
                    } catch (error) {
                        console.log(error);
                        //if fails, try again
                        getProducts(url);
                    }
                });
            })
            .catch(function (error) {
                console.log(error);
                getProducts(url);
            });
    }

    //ordena los productos que se muestran en pantalla segun categorias
    orderby.addEventListener('change', function () {
        category = orderby.value;
        urlF = url(category, search);
        console.log(category, urlF);
        getProducts(urlF);
        category = "";
    });
    
    botoBuscar.addEventListener('click', function () {
        search = busqueda.value;
        urlF = url(category, search);
        console.log(search, urlF);
        getProducts(urlF);
        search = "";
    });
    

    getProducts(urlF);
}

