$(".current-box").hide();
$(".forecast-banner").hide();
var forecastdisplay;

function allStorage() {
    var values = [],
        keys = Object.keys(localStorage),
        i = keys.length;
    while (i--) {
        values.push(localStorage.getItem(keys[i]));
    }
    for (j = 0; j < values.length; j++) {
        $(".prev-list").prepend("<button class='prev-city mt-1'>" + values[j] + "</button>");
    }
}
allStorage();

$(".clear").on("click", function() {
    localStorage.clear();
    $(".prev-city").remove();
});

$(".search").on("click", function() {
    var subject = $(".subject").val();
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + subject + "&appid=3c34658c8e0e9fdb71064b81293a3704";
    var queryURL2 = "https://api.openweathermap.org/data/2.5/forecast?q=" + subject + "&appid=3c34658c8e0e9fdb71064b81293a3704";
    var lat;
    var lon;
    if (forecastdisplay === true) {
        $(".forecast-day").remove();
        forecastdisplay = false;
    }

    $.ajax({
        url: queryURL,
        method: "GET",
        statusCode: {
            404: function() {
                return;
            }
        }
    }).then(function(response) {
        $(".prev-list").prepend("<button class='prev-city mt-1'>" + subject + "</button>");
        localStorage.setItem(subject, subject);
        $(".current-box").show();
        $(".forecast-banner").show();
        var iconcode = response.weather[0].icon;
        var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
        $(".icon").attr('src', iconurl)
        lat = response.coord.lat;
        lon = response.coord.lon;
        $(".current-city").text(response.name + " " + moment().format('l'));
        var currentTemp = response.main.temp * (9 / 5) - 459.67;
        $(".current-temp").text("Temperature: " + currentTemp.toFixed(1) + " °F");
        $(".current-hum").text("Humidity: " + response.main.humidity + "%");
        $(".current-wind").text("Wind Speed: " + response.wind.speed + " MPH");
        queryURL = "http://api.openweathermap.org/data/2.5/forecast?id=524901&APPID=77314ab291abe0a7757a9d67c15fc924" + lat + "&lon=" + lon;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            $(".current-uv").text("UV Index: " + response[0].value);
        })
    })

    $.ajax({
        url: queryURL2,
        method: "GET"
    }).then(function(response) {
        var forecastTimes = response.list;
        for (i = 0; i < forecastTimes.length; i++) {
            if (forecastTimes[i].dt_txt[12] === "2") {
                var forecastdate = forecastTimes[i].dt_txt;
                var forecastdatedisplay = forecastdate.charAt(5) + forecastdate.charAt(6) + "/" + forecastdate.charAt(8) + forecastdate.charAt(9) +
                    "/" + forecastdate.charAt(0) + forecastdate.charAt(1) + forecastdate.charAt(2) + forecastdate.charAt(3);
                var forecasticon = forecastTimes[i].weather[0].icon;
                var forecasticonurl = "http://openweathermap.org/img/w/" + forecasticon + ".png";
                var forecastTemp = forecastTimes[i].main.temp * (9 / 5) - 459.67;
                var forecastHum = forecastTimes[i].main.humidity;
                if (forecastdisplay === false || forecastdisplay === undefined) {
                    $(".forecast-list").append("<div class='my-3 pb-3 col-md-2 col-lg-2 forecast-day'>" +
                        "<h5>" + forecastdatedisplay + "<h5>" +
                        "<img class='ficon' src=" + forecasticonurl + " alt='Weather icon'>" +
                        "<div>Temp: " + forecastTemp.toFixed(1) + " °F" +
                        "</div><div>Humidity: " + forecastHum +
                        "%</div></div></div>");
                }
            }
        }
        forecastdisplay = true;
    })
});

$(document).on("click", ".prev-city", function() {
    var subject = $(this).text();
    $(".subject").val(subject);
    $(".search").click();
    $(this).remove();
});