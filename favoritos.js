document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = 'd47ba4bc';
    const favoritosCards = document.getElementById('favoritosCards');

    async function actualizarFavoritos() {
        const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
        favoritosCards.innerHTML = '';

        for (const id of favoritos) {
            try {
                const response = await fetch(`http://www.omdbapi.com/?i=${id}&apikey=${API_KEY}`);
                const pelicula = await response.json();
                const peliculaCard = document.createElement('div');
                peliculaCard.classList.add('card', 'm-2');
                peliculaCard.style.width = '18rem';
                peliculaCard.innerHTML = `
                    <img src="${pelicula.Poster}" class="card-img-top" alt="${pelicula.Title}">
                    <div class="card-body">
                        <h5 class="card-title">${pelicula.Title}</h5>
                        <p class="card-text">${pelicula.Year}</p>
                        <button class="btn btn-danger eliminar-favorito" data-id="${pelicula.imdbID}">Eliminar de favoritos</button>
                    </div>
                `;
                favoritosCards.appendChild(peliculaCard);
            } catch (error) {
                console.error('Error al obtener los detalles de la película:', error);
            }
        }
        eventosEliminarFavorito();
    }

    function eventosEliminarFavorito() {
        const botonesEliminar = document.querySelectorAll('.eliminar-favorito');
        botonesEliminar.forEach(boton => {
            boton.addEventListener('click', () => {
                const id = boton.getAttribute('data-id');
                eliminarFavoritos(id);
            });
        });
    }

    function eliminarFavoritos(id) {
        let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
        favoritos = favoritos.filter(favoritosId => favoritosId !== id);
        localStorage.setItem('favoritos', JSON.stringify(favoritos));
        Swal.fire(`Película eliminada de favoritos`);
        actualizarFavoritos();
    }

    
    actualizarFavoritos();
});