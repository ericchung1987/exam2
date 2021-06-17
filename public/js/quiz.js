// Generate quiz question
let time = $('#time').html();

console.log(time);
let countDownDate =  parseInt(time) + 2700000;

// var urlParams = new URLSearchParams(window.location.search);
// let quiz; 

// for (key of urlParams.values()) {
//     quiz = key;
//     break;
// }


// canvas
var T2_images = [];

var q_number = 0;
var sketchWidth;
var sketchHeight;
var label_height;
var label_width;

function _(query) {
    return document.querySelector(query);
}

function preload() {
    
}

function setup() {
    frameRate(30);
    setInterval(timedown, 1000);

}

function draw() {

}


function timedown(){
    let current_time = new Date().getTime();
    let timeleft = countDownDate - current_time;
    // Calculating the days, hours, minutes and seconds left
    var hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((timeleft % (1000 * 60)) / 1000);

    // Result is output to the specific element
    // document.getElementById("hours").innerHTML = hours + "h "
    document.getElementById("mins").innerHTML = minutes + "m "
    document.getElementById("secs").innerHTML = seconds + "s "

    // Display the message when countdown is over
    if (timeleft < 0) {
        clearInterval(timedown);
        // document.getElementById("hours").innerHTML = ""
        document.getElementById("mins").innerHTML = ""
        document.getElementById("secs").innerHTML = ""
        document.getElementById("end").innerHTML = "TIME UP!!";
        document.getElementById("question_form").submit(); 
        alert("your time is up!");

        window.location.replace("/userpage");
    }
};
