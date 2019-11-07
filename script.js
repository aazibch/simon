/*jshint browser: true, devel: true, jquery: true, esversion: 6*/
let randomSeq = [];
let playerSeq = [];
let count = 0;
let strictOn = false;
let intervalId;
let timeoutId;
const winningSteps = 20;

$(document).ready(function () {
    $("#strict-checkbox").prop("checked", false);
    
    $("#start-button").on("click", function () {
        $("#start-screen").addClass("hidden");
        $("#gameplay-screen").removeClass("hidden");
        startSeq();
    });
    
    $("#strict-checkbox").on("click", function () {
        strictOn = strictOn ? false : true;
    });

    loadAudio();
});

function loadAudio() {
    for (let i = 1; i < 5; i++) {
        const audio = document.createElement("audio");
        audio.src = "https://s3.amazonaws.com/freecodecamp/simonSound" + i + ".mp3";
        audio.preload = "auto";
        document.body.appendChild(audio);
        document.body.removeChild(audio);
    }
}

function startSeq () {
    count++;
    $("#count").text(count);
    randomSeq.push(getRandomNum());
    runRandSeq();

}

function getRandomNum () {
    let randomNum = Math.floor(Math.random() * 4).toString();
    
    while (randomNum === randomSeq[randomSeq.length - 1] && randomNum === randomSeq[randomSeq.length - 2])
        randomNum = Math.floor(Math.random() * 4).toString();
    
    return randomNum;
}

function runRandSeq () {
    let i = 0;
    
    intervalId = setInterval(function () {
        flashButton(randomSeq[i]);
        i++;
        
        if (i >= randomSeq.length) {
            clearInterval(intervalId);
            getInput();
        }
    }, 500);
}

function getInput () {
    $(".main-button").css("cursor", "pointer");
    $(".main-button").on("click", function () {
        let elem = $(this).attr("data-number");
        
        flashButton(elem);
        playerSeq.push(elem);
        checkState(checkInput());
    });
}

function checkInput () {
    if (randomSeq[playerSeq.length - 1] === playerSeq[playerSeq.length - 1]) {
        return true;
    }

    return false;
}

function checkState (isCorrect) {
    if (isCorrect && playerSeq.length === randomSeq.length) {
        // Correct sequence. Player wins.
        if (count === winningSteps) {
            notifyOfWin();
        }
        
        // Correct sequence. Game continues.
        else {
            playerSeq = [];
            startSeq();
        }
        
        $(".main-button").off();
        $(".main-button").css("cursor", "auto");
    } else if (!isCorrect) {   
        playerSeq = [];
        $(".main-button").off();
        $(".main-button").css("cursor", "auto");
        $("#game").effect("shake");
        displayMsg("Oops!");
        timeoutId = setTimeout(hideMsg, 700);
        
        // Incorrect sequence. Game resets, then continues.
        if (strictOn === true) {
            reset();
            timeoutId = setTimeout(startSeq, 700);
        }
        
        // Incorrect sequence. Game continues.
        else {
            timeoutId = setTimeout(runRandSeq, 700);
        }
    }
}

function displayMsg (msg) {
    $("#count").addClass("hidden");
    $("#message").removeClass("hidden");
    $("#message").text(msg);
}

function hideMsg () {
    $("#message").addClass("hidden");
    $("#count").removeClass("hidden");
} 

function notifyOfWin () {
    let i = 0;
    
    intervalId = setInterval(function () {
        $(".main-button").css("opacity", "0.7");

        timeoutId = setTimeout(function () {
            $(".main-button").css("opacity", "1");
        }, 150);
        
        i++;

        if (i === 5)
            clearInterval(intervalId);
    }, 300);
    
    displayMsg("You Win!");
}

function flashButton (elem) {
    let button = $(".main-button[data-number=" + elem + "]");
    
    button.css("opacity", "0.7");
    playAudio(parseInt(elem, 10) + 1);

    timeoutId = setTimeout(function () {
        button.css("opacity", "1");
    }, 250);
}

// Based on the accepted answer at https://stackoverflow.com/questions/6893080/html5-audio-play-sound-repeatedly-on-click-regardless-if-previous-iteration-h
function playAudio(soundNum){
    const audio = document.createElement("audio");
    audio.src = "https://s3.amazonaws.com/freecodecamp/simonSound" + soundNum + ".mp3";
    document.body.appendChild(audio);
    
    audio.addEventListener("ended", function () {
        document.body.removeChild(this);
    });
    
    audio.play();
}

function reset() {
    randomSeq = [];
    playerSeq = [];
    count = 0;
}

$("#reset-button").on("click", function () {
    reset();
    hideMsg();
    clearInterval(intervalId);
    clearTimeout(timeoutId);
    $("#gameplay-screen").addClass("hidden");
    $("#start-screen").removeClass("hidden");
    $(".main-button").css("opacity", "1");
    $(".main-button").off();
    $(".main-button").css("cursor", "auto");
});