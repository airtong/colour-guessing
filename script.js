window.onload = function() {
    updateColors();
};

let g_red = '#red';
let g_green = '#green';
let g_blue = '#blue';

function getJson(red, green, blue) {
    var baseURL = 'https://www.thecolorapi.com/scheme?rgb=(';
    var mode = 'monochrome-dark';

    var finalURL = ')&mode=' + mode + '&count=5&format=json';
    var url = baseURL + red + ',' + green + ',' + blue + finalURL;
    var httpreq = new XMLHttpRequest(); // a new request
    httpreq.open('GET', url, false);
    httpreq.send(null);
    return httpreq.responseText;
}

function updateColors() {
    var red = Math.floor(Math.random() * 256);
    var green = Math.floor(Math.random() * 256);
    var blue = Math.floor(Math.random() * 256);
    var json_obj = JSON.parse(getJson(red, green, blue));

    var r = document.querySelector(':root');

    r.style.setProperty('--zero', json_obj.colors[0].hex.value);
    r.style.setProperty('--one', json_obj.colors[1].hex.value);
    r.style.setProperty('--two', json_obj.colors[2].hex.value);
    r.style.setProperty('--three', json_obj.colors[3].hex.value);
    r.style.setProperty('--four', json_obj.colors[4].hex.value);

    g_red = json_obj.colors[2].rgb.r;
    g_green = json_obj.colors[2].rgb.g;
    g_blue = json_obj.colors[2].rgb.b;
}

function verifyGuess(guess) {
    if(guess < 0)
        guess = 0;
    else if(guess > 255 || isNaN(guess))
        guess = 255
    return guess;
}

function verifyAnswer() {
    var redGuess = parseInt(document.getElementById('redGuess').value);
    var greenGuess = parseInt(document.getElementById('greenGuess').value);
    var blueGuess = parseInt(document.getElementById('blueGuess').value);

    redGuess = verifyGuess(redGuess);
    greenGuess = verifyGuess(greenGuess);
    blueGuess = verifyGuess(blueGuess);

    var redDif = Math.abs(g_red - redGuess);
    var greenDif = Math.abs(g_green - greenGuess);
    var blueDif = Math.abs(g_blue - blueGuess);

    var score = parseInt(100 - ((redDif + greenDif + blueDif) / (2.55 * 3)));

    document.getElementById('score').innerHTML = score;

    var form = document.getElementById('form');
    form.style.display = 'none';
    var answer = document.getElementById('answer');
    answer.style.display = 'block';

    move(1,g_red);
    move(2,g_green);
    move(3,g_blue);

    document.getElementById('lblGuess').innerHTML = 'Seu palpite foi: (' + redGuess + ',' + greenGuess + ',' + blueGuess + ')';

    var goalRGB = 'rgb('+g_red+','+g_green+','+g_blue+')';
    var guessRGB = 'rgb('+redGuess+','+greenGuess+','+blueGuess+')';
    document.body.style.background = 'linear-gradient(135deg,'+goalRGB+' 50%,'+guessRGB+' 50%)';
}


function move(colour, newPosition) {
    var percentage = parseInt(newPosition/2.55);
    var i = 0;
    if (i == 0) {
        i = 1;

        var elem;
        if(colour==1)
            elem = document.getElementById('redProgress');
        else if(colour==2)
            elem = document.getElementById('greenProgress');
        else if(colour==3)
            elem = document.getElementById('blueProgress');

        var width = 1;
        var id = setInterval(frame, 10);

        function frame() {
            if (width >= percentage) {
                clearInterval(id);
                i = 0;
            } else {
                width++;
                elem.style.width = width + '%';
            }
        }

        elem.innerHTML = '<b>'+newPosition+'</b>';
    }
}