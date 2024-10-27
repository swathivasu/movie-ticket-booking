const container = document.querySelector('.seat-container');
const seats = document.querySelectorAll('.row .seat');
const count = document.getElementById('count');
const total = document.getElementById('total');
const movieSelect = document.getElementById('movie');
const bookBtn = document.getElementById('book-btn');

// Define occupied seats for each movie
const occupiedSeatsData = {
    avengers: [0, 1], // Example of occupied seats for Avengers
    vaazhai: [],
    vettaiyan: [2, 3],
    amaran: [4, 5, 6]
};

let ticketPrice = +movieSelect.value;

// Populate UI with saved data
function populateUI() {
    const selectedMovieIndex = movieSelect.selectedIndex;
    const selectedMovie = movieSelect.options[selectedMovieIndex].dataset.movie;

    // Clear previously selected seats
    seats.forEach(seat => {
        seat.classList.remove('selected', 'occupied');
    });

    // Retrieve occupied seats for the selected movie
    const selectedSeats = JSON.parse(localStorage.getItem(`${selectedMovie}-selectedSeats`)) || [];
    const occupiedSeats = occupiedSeatsData[selectedMovie] || [];

    // Mark occupied seats
    occupiedSeats.forEach(index => {
        if (seats[index]) {
            seats[index].classList.add('occupied');
        }
    });

    // Mark previously selected seats
    selectedSeats.forEach(index => {
        if (seats[index]) {
            seats[index].classList.add('selected');
        }
    });

    updateSelectedCount();
}

// Save selected movie index and price
function setMovieData(movieIndex, moviePrice) {
    localStorage.setItem('selectedMovieIndex', movieIndex);
    localStorage.setItem('selectedMoviePrice', moviePrice);
}

// Update total and count
function updateSelectedCount() {
    const selectedSeats = document.querySelectorAll('.row .seat.selected');
    const seatsIndex = [...selectedSeats].map(seat => [...seats].indexOf(seat));

    const selectedMovie = movieSelect.options[movieSelect.selectedIndex].dataset.movie;
    localStorage.setItem(`${selectedMovie}-selectedSeats`, JSON.stringify(seatsIndex));

    const selectedSeatsCount = selectedSeats.length;
    count.innerText = selectedSeatsCount;
    total.innerText = selectedSeatsCount * ticketPrice;
}

// Movie select event
movieSelect.addEventListener('change', e => {
    ticketPrice = +e.target.value;
    setMovieData(e.target.selectedIndex, e.target.value);
    populateUI(); // Populate UI with the new movie's data
});

// Seat click event
container.addEventListener('click', e => {
    if (e.target.classList.contains('seat') && !e.target.classList.contains('occupied')) {
        e.target.classList.toggle('selected');
        updateSelectedCount();
    }
});

// Book button click event
bookBtn.addEventListener('click', () => {
    const selectedSeats = document.querySelectorAll('.row .seat.selected');
    if (selectedSeats.length > 0) {
        selectedSeats.forEach(seat => {
            seat.classList.add('occupied');
        });
        updateSelectedCount();
        
        // Store the payment amount in local storage for access on the payment page
        localStorage.setItem('paymentAmount', total.innerText);

        // Redirect to the payment page
        location.href = './payment.html';
    } else {
        alert("Please select at least one seat.");
    }
});

// Initial setup
populateUI();