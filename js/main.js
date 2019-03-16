$(document).ready(function(){
fetch('https://api.openweathermap.org/data/2.5/forecast?q=самара&lang=ru&units=metric&APPID=d7370c4f4680389e97fe267bbac3955e')
  .then(response => response.json())
  .then(json => createWeather(json));

function createWeather(data) {
	
	let item = [], 
			counter = 0,
			itemOnPage, //количество карточек на странице
			weatherIconMap=[],
			weekday=[],
			dateStr = [],
			description = [],
			temp =[];

	const box = $('#weather__box'),
				weatherDiv = $('.weather__wrap'),
				weatherNow = $('#weather__now');

	const optionsDate = {
			month: 'long',
		  day: 'numeric',
		};

	const optionsDay = {
		weekday: 'long',
	};

	// выбираем погоду только на 12 и 24 часов, без сегодня
	for (let i=0; i< data.list.length; i++) {
		if(data.list[i].dt % 43200 == 0 && new Date(data.list[i].dt*1000).getDate() != new Date().getDate()) {
			item[counter] = data.list[i];  // путь до параметров погоды
			counter++;
			};
	};

	// убираем сегодняшнюю ночь (day+1 / 00:00)
	item.shift(); 
	counter -=1;

	for (let i=0; i<counter; i++){
		dateStr[i] = new Date(item[i].dt*1000);
		weatherIconMap[i] = item[i].weather[0].icon;
		description[i] = item[i].weather[0].description;
		temp[i] = Math.round(item[i].main.temp);
	};

	weatherNow.append(`
		<h2>На ближайшее время</h2>
		<img class="weather-card__img" src="http://openweathermap.org/img/w/${data.list[0].weather[0].icon}.png" />
		<p class="weather-card__temp">${Math.round(data.list[0].main.temp)}&deg;</p>
		<p class="weather-card__description">${data.list[0].weather[0].description}</p>
		`);

	carouselWidth(); // определяем ширину карусели и количество карточек на странице в зависимости от ширины экрана

	for (let i=0; i<counter-1; i++) // counter-1  - убираем последний день, для которого нет данных о ночной погоде
	{
		if (i%2 == 0) {
			weekday[i]=dateStr[i].toLocaleString("ru", optionsDay).charAt(0).toUpperCase() + dateStr[i].toLocaleString("ru", optionsDay).substr(1).toLowerCase();
			box.append(` 
				<div class="weather__item weather-card">
				<p class="weather-card__weekday">${weekday[i]}</p>
				<h2 class="weather-card__date">${dateStr[i].toLocaleString("ru", optionsDate)}</h2>
				<img class="weather-card__img" src="http://openweathermap.org/img/w/${weatherIconMap[i]}.png" />
				<p class="weather-card__temp">Днем ${temp[i]}&deg;</p>
				<p class="weather-card__description">${description[i]}</p>
				<hr class="weather-card__separate">
				<img class="weather-card__img" src="http://openweathermap.org/img/w/${weatherIconMap[i+1]}.png" />
				<p class="weather-card__temp">Ночью ${temp[i+1]}&deg;</p>
				<p class="weather-card__description">${description[i+1]}</p>
				</div>`);
		};
	};

	showSlide(0);
	let currentSlide = 0;
	weatherDiv.find('a.previous').click(function(e){
		e.preventDefault();
		showSlide(currentSlide-1);
	});
	
	weatherDiv.find('a.next').click(function(e){
		e.preventDefault();
		showSlide(currentSlide+1);
	});

	function showSlide(i){
		let items = box.find('.weather__item');
		
		if (i >= items.length || i < 0 || box.is(':animated')){
			return false;
		}
		
		weatherDiv.removeClass('first last');
		if (items.length<=itemOnPage) {
			weatherDiv.addClass('first last');
		}
		if(i <= 0){
			weatherDiv.addClass('first');
		}
		else if (i == items.length-itemOnPage){
			weatherDiv.addClass('last');
		}

		box.animate({left:(-210*(i))+'px'}, function(){
			currentSlide = i;
		});
	};

	$(window).resize( () => {
		carouselWidth();
		showSlide(0);
	});

	$('.weather__carousel_arrow').css("opacity", "0.6");

		function carouselWidth(){
		let carouselWidth = 210;
		if ($(window).width() <= '600') {
			itemOnPage = 1;
		}
		else if ($(window).width() <= '800') {
			itemOnPage = 2;
		}
		else if ($(window).width() <= '1100' || ($(window).width() >= '1100' && counter < 8)) {
			itemOnPage = 3;
		} 
		else {
			itemOnPage = 4;
		}
		carouselWidth *= itemOnPage;
		$('.weather__carousel').css("width", `${carouselWidth}px`);
	};

};
});

// api на несколько дней
// https://api.openweathermap.org/data/2.5/forecast?q=самара&lang=ru&units=metric&APPID=d7370c4f4680389e97fe267bbac3955e

// api на сейчас
// https://api.openweathermap.org/data/2.5/weather?q=самара&lang=ru&units=metric&APPID=d7370c4f4680389e97fe267bbac3955e