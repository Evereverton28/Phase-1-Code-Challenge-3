document.addEventListener('DOMContentLoaded', function () {
    // Fetch the details of the first movie
    fetch('http://localhost:3000/films/1')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(movie => {
        console.log(movie);
        // Display the details of the first movie
        displayMovieDetails(movie);
      })
      .catch(error => {
        console.error('There was a problem with fetching the first movie:', error);
      });
  
    // Fetch all movies
    fetch('http://localhost:3000/films')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(movies => {
        console.log(movies);
        // Populate the menu of all movies
        updateMovieList(movies);
        // Add event listeners to each movie item in the menu
        movies.forEach(movie => {
          const listItem = document.getElementById(`movie-${movie.id}`);
          listItem.addEventListener('click', () => {
            // Remove the previous event listener
            document.getElementById('buy-ticket').removeEventListener('click', buyTicket);
            displayMovieDetails(movie);
          });
        });
      })
      .catch(error => {
        console.error('There was a problem with fetching all movies:', error);
      });
  });
  
  function displayMovieDetails(movie) {
    const posterElement = document.getElementById('poster');
    const titleElement = document.getElementById('title');
    const runtimeElement = document.getElementById('runtime');
    const showtimeElement = document.getElementById('showtime');
    const ticketNumElement = document.getElementById('ticket-num');
    const descriptionElement = document.getElementById('film-info');
    const buyTicketButton = document.getElementById('buy-ticket');
    const deleteButton = document.getElementById('delete-button');
  
    // Set poster image
    posterElement.src = movie.poster;
    // Set movie title
    titleElement.textContent = movie.title;
    // Set runtime
    runtimeElement.textContent = `${movie.runtime} minutes`;
    // Set showtime
    showtimeElement.textContent = movie.showtime;
    // Set movie description
    descriptionElement.textContent = movie.description;
    // Calculate available tickets
    const availableTickets = movie.capacity - movie.tickets_sold;
    ticketNumElement.textContent = availableTickets > 0 ? availableTickets : "Sold Out";
    // Add event listener to buy ticket button
    buyTicketButton.addEventListener('click', () => buyTicket(movie));
    // Add event listener to delete button
    deleteButton.addEventListener('click', () => {
      deleteFilm(movie.id);
    });
  }
  
  function updateMovieList(movies) {
    const filmsList = document.getElementById('films');
    filmsList.innerHTML = ''; // Clear previous list
  
    movies.forEach(movie => {
      const listItem = document.createElement('li');
      listItem.textContent = movie.title;
      listItem.classList.add('film', 'item');
      listItem.id = `movie-${movie.id}`;
      // Append delete button
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.id = 'delete-button';
      deleteButton.classList.add('delete-button'); // Add a class for styling
      listItem.appendChild(deleteButton);
      filmsList.appendChild(listItem);
    });
  }
  
  function buyTicket(movie) {
    const availableTickets = movie.capacity - movie.tickets_sold;
    const ticketNumElement = document.getElementById('ticket-num');
  
    if (availableTickets > 0) {
      // Update tickets_sold count on the server
      fetch(`http://localhost:3000/films/${movie.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tickets_sold: movie.tickets_sold + 1
        })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(updatedMovie => {
        // Update the displayed number of available tickets
        const updatedAvailableTickets = updatedMovie.capacity - updatedMovie.tickets_sold;
        ticketNumElement.textContent = updatedAvailableTickets > 0 ? updatedAvailableTickets : "Sold Out";
        // If there are no more available tickets, disable the "Buy Ticket" button
        const buyTicketButton = document.getElementById('buy-ticket');
        if (updatedAvailableTickets === 0) {
          buyTicketButton.textContent = "Sold Out";
          buyTicketButton.disabled = true;
        }
      })
      .catch(error => {
        console.error('There was a problem with buying a ticket:', error);
      });
    }
  }

  function deleteFilm(filmId) {
    // Delete film on the server
    fetch(`http://localhost:3000/films/${filmId}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Optionally, you can remove the film from the list here if needed
    })
    .catch(error => {
      console.error('There was a problem deleting the film:', error);
    });
  }

  function createTickets(filmId, numberOfTickets) {
    fetch('http://localhost:3000/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        film_id: filmId,
        number_of_tickets: numberOfTickets
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(newTicket => {
      console.log('New ticket created:', newTicket);
      // Do something with the response, like displaying a confirmation message
    })
    .catch(error => {
      console.error('There was a problem creating a new ticket:', error);
    });
  }
