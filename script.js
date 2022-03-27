let g_red = '#red';
let g_green = '#green';
let g_blue = '#blue';

let g_lastGuess;

let roundCount = 0;
let highScore = 0;

let lbl_btnSendGuess = 'Send guess';
let lbl_btnTryAgain = 'Try again';
let lbl_yourScore = 'Your score: ';
let lbl_yourGuess = 'It was your guess: ';
let g_language = 'en';

const music = new Audio('sound.mp3');

window.onload = function() {
    start();
    music.loop = true;
    music.playbackRate = 2;
    music.pause();
    music.volume = 0.2;
};

function changeLanguage(){
    if(g_language == 'en'){
        g_language = 'pt';
        lbl_btnSendGuess = 'Enviar palpite';
        lbl_btnTryAgain = 'Tentar novamente';
        lbl_yourScore = 'Sua pontuação: ';
        lbl_yourGuess = 'Seu palpite: ';
    }
    else if(g_language == 'pt'){
        g_language = 'es';
        lbl_btnSendGuess = 'Enviar conjetura';
        lbl_btnTryAgain = 'Intentar otra vez';
        lbl_yourScore = 'Tu puntuación: ';
        lbl_yourGuess = 'Fue tu suposición: ';
    }
    else if(g_language == 'es'){
        g_language = 'en';
        lbl_btnSendGuess = 'Send guess';
        lbl_btnTryAgain = 'Try again';
        lbl_yourScore = 'Your score: ';
        lbl_yourGuess = 'It was your guess: ';
    }

    document.getElementById('btnSendGuess').innerHTML = lbl_btnSendGuess;
    document.getElementById('btnTryAgain').innerHTML = lbl_btnTryAgain;
    document.getElementById('lblYourScore').innerHTML = lbl_yourScore;
    document.getElementById('lblGuess').innerHTML = lbl_yourGuess + g_lastGuess;
}

function changeOppacity(increase, id) {
    var box = document.getElementById(id);
    var oppArrayIncrease = ['0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7', '0.8', '0.9', '1'];
    var oppArrayDecrease = ['0.9', '0.8', '0.7', '0.6', '0.5', '0.4', '0.3', '0.2', '0.1', '0'];
    if (increase)
        oppArray = oppArrayIncrease;
    else
        oppArray = oppArrayDecrease;

    var x = 0;
    (function next() {
        box.style.opacity = oppArray[x];
        if (++x < oppArray.length) {
            setTimeout(next, 5);
        }
    })();

    if (increase)
        box.style.display = 'block';
    else
        box.style.display = 'none';
}

function start() {
    changeOppacity(false, 'answer');
    changeOppacity(true, 'form');
    updateColors();

    document.getElementById('redGuess').value = 0;
    document.getElementById('greenGuess').value = 0;
    document.getElementById('blueGuess').value = 0;

    document.body.style.background = 'var(--two)';

    document.getElementById('highScore').innerHTML = parseInt(highScore);
    document.getElementById('roundCount').innerHTML = roundCount;
}

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

function verifyGuess(id) {
    var guess = parseInt(document.getElementById(id).value);

    if (guess < 0)
        guess = 0;
    else if (guess > 255 || isNaN(guess))
        guess = 255
    return guess;
}

function getScore(redGuess, greenGuess, blueGuess) {
    var redDif = Math.abs(g_red - redGuess);
    var greenDif = Math.abs(g_green - greenGuess);
    var blueDif = Math.abs(g_blue - blueGuess);

    return parseInt(100 - ((redDif + greenDif + blueDif) / (2.55 * 3)));
}

function updateScore(start, end, duration) {
    var obj = document.getElementById('score');
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);

        obj.innerHTML = Math.floor(progress * (end - start) + start);

        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function verifyAnswer() {
    var redGuess = verifyGuess('redGuess');
    var greenGuess = verifyGuess('greenGuess');
    var blueGuess = verifyGuess('blueGuess');

    var score = getScore(redGuess, greenGuess, blueGuess);

    if (score > highScore)
        highScore = score;
    roundCount += 1;

    changeOppacity(false, 'form');
    changeOppacity(true, 'answer');

    movePercentageBar(1, g_red);
    movePercentageBar(2, g_green);
    movePercentageBar(3, g_blue);

    g_lastGuess = '(' + redGuess + ',' + greenGuess + ',' + blueGuess + ')';
    document.getElementById('lblGuess').innerHTML = lbl_yourGuess + g_lastGuess;

    var goalRGB = 'rgb(' + g_red + ',' + g_green + ',' + g_blue + ')';
    var guessRGB = 'rgb(' + redGuess + ',' + greenGuess + ',' + blueGuess + ')';

    document.body.style.background = 'linear-gradient(135deg,' + goalRGB + ' 50%,' + guessRGB + ' 50%)  no-repeat fixed center';

    updateScore(0, score, 30 * score);
}

function movePercentageBar(colour, newPosition) {
    var percentage = parseInt(newPosition / 2.55);
    var i = 0;
    if (i == 0) {
        i = 1;

        var elem;
        if (colour == 1)
            elem = document.getElementById('redProgress');
        else if (colour == 2)
            elem = document.getElementById('greenProgress');
        else if (colour == 3)
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
        elem.innerHTML = '<b>' + newPosition + '</b>';
    }
}