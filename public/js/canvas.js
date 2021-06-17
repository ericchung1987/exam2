var T2_images = [];

var number = 10;

var sketchWidth;
var sketchHeight;
var label_height;
var label_width;


var top_header_space = 0; // the logo and all takes this much space

function _(query) {
    return document.querySelector(query);
}

function preload() {
    for (var i = 1; i < 28; i++) {
        img = loadImage("images/T2/" + i + ".png");
        T2_images.push(img);
    }
}

function setup() {
    frameRate(24);
    sketchWidth = document.getElementById("squareContainer").offsetWidth;
    sketchHeight = document.getElementById("squareContainer").offsetHeight;
    let canvas = createCanvas(sketchWidth -40, sketchHeight);
    label_height = height /2.1;
    label_width = width / 2;

    canvas.style('display', 'block');
    imageMode(CENTER);
    canvas.parent("squareContainer");
    canvas.mouseWheel(changeImage); // attach listener to canvas


    //remove offlabel from the list
    // var element = document.getElementById('labelDropDown');
    // element.classList.remove('off-label');

}

function draw() {
    background(0);
    image(T2_images[number], label_width, label_height, 600, 600);
    drawLabel();
    drawCurrentSliceNumber();

}

// function windowResized() {
//     sketchWidth = document.getElementById("canvas_container").offsetWidth;
//     sketchHeight = document.getElementById("canvas_container").offsetHeight;
//     resizeCanvas(sketchWidth -40, sketchHeight);
//     background(255);
// }

// Change number according to scroll number delta
function changeImage(event) {
    if (event.deltaY > 0 && number < 26) {
        number++;

    } else if (event.deltaY < 0 && number > 0) {
        number--;
    }
    event.preventDefault();
}

// Add keyboard functionality
function keyPressed() {
    if (keyCode === DOWN_ARROW && number < 26) {
        number++;
    } else if (keyCode === UP_ARROW && number > 0) {
        number--;
    }
}

let movement_list = [];

// add scroll functionality, still cant get to work on mobile
function touchMoved(event) {

    var y = event.touches[0].pageY;

    if (event.target.id == "defaultCanvas0"){
        movement_list.push(y);
    }

    if (movement_list.length >2){
        movement_list.shift();
    }

    if (movement_list.length >1){
        let diff = movement_list[1]-movement_list[0];
        if (diff  > 0 && number < 26) {
            number++;
        } else if (diff < 0 && number > 0) {
            number--;
        }
        movement_list=[];
    }
    event.preventDefault();
}

function touchEnded(event) {
    // clear the movement list once touch release
    if (event.target.id == "defaultCanvas0"){
        movement_list = [];
    }
  }

let mousedrag_list = [];
function mouseDragged(event) {
    var y = event.pageY;

    if (event.target.id == "defaultCanvas0"){
        mousedrag_list.push(y);
    }

    if (mousedrag_list.length >10){
        mousedrag_list.shift();
    }

    if (mousedrag_list.length >9){
        let diff = mousedrag_list[9]-mousedrag_list[0];
        if (diff  > 0 && number < 26) {
            number++;
        } else if (diff < 0 && number > 0) {
            number--;
        }
        mousedrag_list=[];
    }
    event.preventDefault();
}

// stop propagation to avoid closing menu on clicking on it for label menu.
$(document).on('click', '#navbarTogglerDemo03 .dropdown-menu', function (e) {
    e.stopPropagation();
});


function drawLabel(){
    structure_list.forEach(function(structure, index){
        if (structure_display[index] == true && number < 27) {
            for (var i = 0; i < slice_data[number][structure].length; i++) {
                push();
                stroke(structure_color[index]); // Change the color
                strokeWeight(5); // Make the points 10 pixels in size
                point(label_width + slice_data[number][structure][i].pos_x, label_height + slice_data[number][structure][i].pos_y);
                strokeWeight(2);
                line(label_width + slice_data[number][structure][i].pos_x, label_height + slice_data[number][structure][i].pos_y,
                    label_width + slice_data[number][structure][i].text_pos_x, label_height + slice_data[number][structure][i].text_pos_y);
                textSize(12);
                fill(structure_color[index]);
                if (slice_data[number][structure][i].text_align == "LEFT") {
                    textAlign(LEFT, CENTER);
                    //this stroke of line is a horizontal line towards the left margin leading to where the label is
                    line(label_width + slice_data[number][structure][i].text_pos_x, label_height + slice_data[number][structure][i].text_pos_y,
                    label_width + 240, label_height + slice_data[number][structure][i].text_pos_y);
                    noStroke();
                    text(slice_data[number][structure][i].label, label_width + 250, label_height + slice_data[number][structure][i].text_pos_y);
                } else if (slice_data[number][structure][i].text_align == "RIGHT") {
                    textAlign(RIGHT, CENTER);
                    line(label_width + slice_data[number][structure][i].text_pos_x, label_height + slice_data[number][structure][i].text_pos_y,
                    label_width - 280, label_height + slice_data[number][structure][i].text_pos_y);
                    noStroke();
                    text(slice_data[number][structure][i].label, label_width - 290, label_height + slice_data[number][structure][i].text_pos_y);
                } else {
                    textAlign(CENTER);
                }
                pop();
                
            }
        }
    });
}

// to be removed when development is completed.
function drawCurrentSliceNumber(){
    push();
    textSize(16);
    noStroke();
    fill(255);
    text(number, 100, 100);
    pop();
}