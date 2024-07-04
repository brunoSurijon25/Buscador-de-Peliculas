
document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = 'd47ba4bc';
    const inputBuscar = document.getElementById('inputBuscar');
    const botonBuscar = document.getElementById('botonBuscar');
    const peliculasCards = document.getElementById('peliculasCards');

    botonBuscar.addEventListener('click', () => {
        const query = inputBuscar.value;
        buscarPeliculas(query);
    });

    // PELICULAS

    async function buscarPeliculas(query) {
        try {
            const response = await fetch(`http://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`);
            const data = await response.json();
            mostrarPeliculas(data.Search);
        } catch (error) {
            console.error('Error al buscar las películas:', error);
        }
    }
    

    function mostrarPeliculas(peliculas) {
        peliculasCards.innerHTML = '';
        peliculas.forEach(pelicula => {
            const peliculaCard = document.createElement('div');
            peliculaCard.classList.add('card', 'm-2');
            peliculaCard.style.width = '18rem';
            peliculaCard.innerHTML = `
                <img src="${pelicula.Poster}" class="card-img-top" alt="${pelicula.Title}">
                    <div class="card-body d-flex flex-column align-items-center justify-content-between">
                    <h5 class="card-title">${pelicula.Title}</h5>
                    <p class="card-text">${pelicula.Year}</p>
                    <div class="mt-auto">
                        <button class="btn btn-primary mb-2 agregar-favorito" data-id="${pelicula.imdbID}">Agregar a favoritos</button>
                        <button class="btn btn-info ver-detalle" data-id="${pelicula.imdbID}">Ver Detalle</button>
                    </div>
        </div>
            `;
            peliculasCards.appendChild(peliculaCard);
        });
        eventosAgregarFavoritos();
        eventosVerDetalle();
    }

    // FAVORITOS

    function eventosAgregarFavoritos() {
        const botonesFavoritos = document.querySelectorAll('.agregar-favorito');
        botonesFavoritos.forEach(boton => {
            boton.addEventListener('click', () => {
                const id = boton.getAttribute('data-id');
                agregarFavoritos(id);
            });
        });
    }

    function agregarFavoritos(id) {
        const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
        if (!favoritos.includes(id)) {
            favoritos.push(id);
            localStorage.setItem('favoritos', JSON.stringify(favoritos));
            Swal.fire('Pelicula agregada a favoritos');
        } else {
            Swal.fire('Esta pelicula ya está en favoritos');
        }
    }

    //

    function eventosVerDetalle() {
        const botonesDetalle = document.querySelectorAll('.ver-detalle');
        botonesDetalle.forEach(boton => {
            boton.addEventListener('click', async () => {
                const id = boton.getAttribute('data-id');
                const detalle = await buscarDetallePelicula(id);
                mostrarDetallePelicula(detalle);
            });
        });
    }

    async function buscarDetallePelicula(id) {
        try {
            const response = await fetch(`http://www.omdbapi.com/?i=${id}&apikey=${API_KEY}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al obtener detalle de la película:', error);
        }
    }

    function mostrarDetallePelicula(pelicula) {
        Swal.fire({
            title: pelicula.Title,
            html: `
                <p><strong>Año:</strong> ${pelicula.Year}</p>
                <p><strong>Director:</strong> ${pelicula.Director}</p>
                <p><strong>Actores:</strong> ${pelicula.Actors}</p>
                <p><strong>Sinopsis:</strong> ${pelicula.Plot}</p>
            `,
            confirmButtonText: 'Cerrar'
        });
    }
});

