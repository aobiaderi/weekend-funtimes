var weatherDiv = $("#weather-info");
var weatherEl = $("#openweather-api");
var weatherTitle = $("#weather-title");
//Add animation to p tag in hero banner:
$(document).ready(function(){
    // Select the text of the "lead" class
    var words = $('.lead').text().split(" ");
    
    // Empty the text of the "lead" class
    $('.lead').empty();
    
    // Loop through each word in the words array
    $.each(words, function(i, v){
    // Append the current word in the loop as a span element to the "lead" class, hide it, and fade it in with a delay of 1000ms * (index + 1)
    $('.lead').append($('<span>').text(v).hide().fadeIn(1000 * (i+1)));
    });
    // Check and update the visit count
  updateVisitCount();

  // Show the modal when the page loads
  $("#myModal").modal("show");
    });

    function updateVisitCount() {
        // Check if the visit count is stored in local storage
        if (localStorage.getItem("visitCount")) {
          // If it is, increment the count
          var visitCount = parseInt(localStorage.getItem("visitCount"));
          visitCount++;
          localStorage.setItem("visitCount", visitCount);
        } else {
          // If it isn't, set the count to 1
          localStorage.setItem("visitCount", 1);
        }
        // Update the visit count in the modal
        $("#visitCount").text(localStorage.getItem("visitCount"));
      }
    //   make modal disappear after display
    setTimeout(function() {
        $("#myModal").modal("hide");
      }, 1500);

//  Add animation to images in jumbotron
var images = document.querySelectorAll('.image');
var currentImageIndex = 0;

setInterval(function() {
    images[currentImageIndex].style.display = 'none';
    currentImageIndex = (currentImageIndex + 1) % images.length;
    images[currentImageIndex].style.display = 'block';
}, 3000);

// Listen for click event on the submit button
$("#submitBtn").on("click", function (event) {
    // Prevent the default form submit behavior
    event.preventDefault();
    // Get the value of the city input
    var city = $("#cityInput").val();
    // Generate the new src URL for the iframe
    var newSrc = "https://www.google.com/maps/embed/v1/search?q=campsite+" + city + "&key=AIzaSyAdjP3RyKMzcagNwl7pXD76vnw9KXjmTc0";
    $("#maps-iframe").attr("src", newSrc);

    // Make an AJAX call to openweather api
    var apiURL = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=" + city + "&appid=32306d8e68f68c9295a794f157aaab66";
    $.ajax({
        url: apiURL,
        success: function (data) {
            console.log(data);
            $(weatherDiv).empty();
            $(weatherTitle).empty();
            var currentDate = new Date();
            var nextFriday = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + (5 - currentDate.getDay() + 7) % 7);
            nextFriday.setHours(9);
            nextFriday.setMinutes(0);

            var nextSaturday = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + (6 - currentDate.getDay() + 7) % 7);
            nextSaturday.setHours(9, 0, 0, 0);

            var weatherForNextFriday;
            var weatherForNextSaturday;
            
            // Display the weather information
            

            var weatherP = $("<p>").text("The forecast for next weekend at " + data.city.name + " is the following:");
            weatherTitle.append(weatherP);

            function displayWeather(date, weather) {
                // Loop through the list of weather data to find the weather for the next weekend
                for (var i = 0; i < data.list.length; i++) {
                    var currentWeather = data.list[i];
                    var weatherDate = new Date(currentWeather.dt * 1000);
                    if (weatherDate.getTime() >= date.getTime()) {
                        weather = data.list[i];
                        break;
                    }
                }
                

                // Create the Bootstrap card
                var card = $("<div>").addClass("card");
                var cardBody = $("<div>").addClass("card-body");
                $(card).append(cardBody);

                var cardTitle = $("<h3>").addClass("card-title");
                var formattedDate = weatherDate.toLocaleDateString("en-UK", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                });
                cardTitle.text(formattedDate);
                $(cardBody).append(cardTitle);

                // Add the weather icon
                var icon = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + weather.weather[0].icon + "@2x.png");
                $(cardBody).append(icon);

                // Add the temperature information
                var temperature = $("<p>").addClass("card-text").text("Temperature: " + weather.main.temp + "°C");
                $(cardBody).append(temperature);

                // Add the wind information
                var wind = $("<p>").addClass("card-text").text("Wind Speed: " + weather.wind.speed + " m/s");
                $(cardBody).append(wind);

                // Add the humidity information
                var humidity = $("<p>").addClass("card-text").text("Humidity: " + weather.main.humidity + "%");
                $(cardBody).append(humidity);

                // Add the card to the weatherDiv
                $(weatherDiv).append(card);

                // Append weatherDiv to weatherEl
                $(weatherEl).append(weatherDiv);

            }
            function weatherAdvise() {
                var weatherFri;
                var weatherSat;
                for (var i = 0; i < data.list.length; i++) {
                    var currentWeather = data.list[i];
                    var weatherDate = new Date(currentWeather.dt * 1000);
                    if (weatherDate.getTime() >= nextFriday.getTime()) {
                        weatherFri = currentWeather;
                        break;
                    }
                }
                for (var i = 0; i < data.list.length; i++) {
                    var currentWeather = data.list[i];
                    var weatherDate = new Date(currentWeather.dt * 1000);
                    if (weatherDate.getTime() >= nextSaturday.getTime()) {
                        weatherSat = currentWeather;
                        break;
                    }
                }
                var TempFri = weatherFri.main.temp;
                var TempSat = weatherSat.main.temp;
                var AddTemp = TempFri + TempSat;
                var AvgTemp = AddTemp / 2;

                var mainFri = weatherFri.weather[0].main;
                var mainSat = weatherSat.weather[0].main;

                if (mainFri != "Rain" && mainSat != "Rain" && AvgTemp.toFixed(2) > 14) {
                    var weatherAd = $("<h4>").text("The weather is good! Check out nearby campsites on the map!");
                    weatherTitle.prepend(weatherAd);
                } else {
                    var weatherAd = $("<h4>").text("The weather is not good! Check out our Movie Database below!");
                    weatherTitle.prepend(weatherAd);
                }
            }
            displayWeather(nextFriday, weatherForNextFriday);
            displayWeather(nextSaturday, weatherForNextSaturday);
            weatherAdvise();
        }
    });
});

var getMovieGenres = function () {
    var movieGenres = [];
    var genreQueryURL = "https://api.themoviedb.org/3/genre/movie/list?api_key=0b443d2c2139bab3c9172850e7125437&language=en-US";

    $.ajax({
        url: genreQueryURL,
        method: "GET"
    }).then(function (response) {
        for (var i = 0; i < response.genres.length; i++) {
            movieGenres.push(response.genres[i]);
        }
        searchMovieId(movieGenres);
    });
}

var searchMovieId = function (genres) {
    var movieApiEl = $(".container");
    var movieEl = $(".movie-genres");
    var movieCardEl = $(".movie-cards");

    //Iterate through the array of genres objects and dynamically create text elements
    for (var i = 0; i < genres.length; i++) {
        var btn = $("<button>").attr({
            name: genres[i].name,
            type: "button",
            class: "btn btn-light",
            id: genres[i].id
        }).text(genres[i].name);
        movieEl.append(btn);
    }

    //Click events for button elements will append the Query URL based on the ID 
    movieApiEl.on('click', '.btn', function () {
        movieCardEl.empty();

        var genreId = $(this).attr("id");
        var pageNo = (Math.floor(Math.random() * 100) + 1);
        console.log("Button clicked with ID: " + genreId);

        //Append ID to URL string
        var IdQueryURL = "https://api.themoviedb.org/3/discover/movie?api_key=0b443d2c2139bab3c9172850e7125437&with_genres=" + genreId + "&page=" + pageNo;

        $.ajax({
            url: IdQueryURL,
            method: "GET"
        }).then(function (response) {
            for (var i = 0; i < response.results.length; i++) {
                var movie = response.results[i];
                var posterPath = "https://image.tmdb.org/t/p/w500" + movie.poster_path;
                var card = $("<div>").addClass("card");
                var cardImage = $("<img>").addClass("card-img-top").attr("src", posterPath);
                var cardBody = $("<div>").addClass("card-body");
                var cardTitle = $("<h5>").addClass("card-title").text(movie.title);
                var cardText = $("<p>").addClass("card-text").text(movie.overview);

                cardBody.append(cardTitle, cardText);
                card.append(cardImage, cardBody);
                movieCardEl.append(card);
            }
        });
    });
}

getMovieGenres();


// javascript class for handling form submission

class FormSubmit {
    constructor(settings) {
        this.settings = settings;
        this.form = document.querySelector(this.settings.form);
        this.formBtn = document.querySelector(settings.button);
        if (this.form) {
            this.url = this.form.getAttribute('action');
        }
        this.sendForm = this.sendForm.bind(this);

    }

    // Display success message
    displaySuccess() {
        this.form.innerHTML = `
        <div class="alert alert-success" role="alert">
            ${this.settings.success}
        </div>
        `;
    }

    //display error message

    displayError(error) {
        console.error(error);
        this.form.innerHTML = `
        <div class="alert alert-danger" role="alert">
           ${this.settings.error}
        </div>
      `;
    }

    // function getFormData that retrieves data from a form and returns it as a FormData object. 
    getFormData() {
        const formData = new FormData();
        const fields = this.form.querySelectorAll("[name]");
        fields.forEach((field) => {
            formData.append(field.getAttribute("name"), field.value);
        });
        return formData;  
    }

    //This code is using the Fetch API to submit a form to a server. 
    //The sendForm function is an asynchronous function that is called when a form is submitted (triggered by the "submit" event)
    async sendForm(event) {
        event.preventDefault();
        this.formBtn.disabled = true;
        this.formBtn.innerText = "Submitting...";        
        try {
            await fetch(this.url, {
                method: 'POST',
                body: this.getFormData(),
            });
            this.displaySuccess();
          } catch (error) {
            this.displayError(error);
          }
    }
        

    // Init method that checks the form property 

    init () {
        if (this.form) this.formBtn.addEventListener("click", this.sendForm);
        return this;    
    }
}

const formSubmit = new FormSubmit({
    form: "[data-form]",
    button: "[data-fbtn]",
    success: "<h1 class=`success`>Thank you for your submission!</h1>",
    error: "<h1 class=`error`>Something went wrong! Please try again later!</h1>",
});

formSubmit.init();
