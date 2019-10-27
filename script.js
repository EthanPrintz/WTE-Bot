// Code started from https://ml5js.org/reference/api-charRNN/
// This uses a pre-trained model on a corpus of NYU Mercer Street Essays
// Along with some additional student works for WTE: Art and the World Class
// Created by Ethan Printz

//-------------------------------------------------------------
// GLOBAL VARIABLE DEFINITION
//-------------------------------------------------------------
// Create the LSTM Generator by passing it the model directory
let charRNN  = ml5.charRNN('./models/MercerCorpus/', modelReady);; 
let runningInference = false;
const buttonValues = {
  "lengthLine" : 140,
  "lengthParagraph" : 500,
  "lengthPage" : 1000,
  "tempLow" : 0.2,
  "tempModertate" : 0.4,
  "tempExtreme" : 0.8
}
const colorValues = {
  "lengthLine" : "#607D8B",
  "lengthParagraph" : "#455A64",
  "lengthPage" : "#37474F",
  "tempLow" : "#FFA726",
  "tempModerate" : "#FF7043",
  "tempExtreme" : "#EF5350"
}

//-------------------------------------------------------------
// AUTOCOMPLETE BUTTON SELECTION
//-------------------------------------------------------------
// When selection button is clicked
$(".selectOption").click(function(){
  // If there other elements selected
  if($(this).parent().find(".selectedOption").not(this).length){
    // Toggle CSS class
    $(this).parent().find(".selectedOption").not(this).removeClass("selectedOption");
    $(this).toggleClass("selectedOption");
    // Toggle image color - checking if it is currently color or white
    if($(this).find("img").attr("src").search("color") == -1){
      // Updated URL string for clicked element
      var updatedURL = $(this).find("img").attr("src").replace("white","color");
    } else{
      // Reset other elements' CSS
      $(this).parent().find("img").each(function (){
        $(this).attr("src", $(this).attr("src").replace("white","color"));
      });
      // Updated URL string for clicked element
      var updatedURL = $(this).find("img").attr("src").replace("color","white");
    }
    // Update Image Color
    $(this).find("img").attr("src",updatedURL);
  }
});

//-------------------------------------------------------------
// MODEL GENERATION
//-------------------------------------------------------------
// DOM Response Modification
// Hijack click to route it to new input field
$("#pageSheet").click(function(){
  $("#newInput").focus();
});

// Setup model generation on click or enter key
$("#newInput").on("click", generate);
$(document).keypress(function(e) {
  let keycode = (e.keyCode ? e.keyCode : e.which);
  if (keycode == '13') generate();
});

function modelReady() {
  $('#status').html('Model Loaded');
}
// Generate new text
function generate() {
  // prevent starting inference if we've already started another instance
  // TODO: is there better JS way of doing this?
  if(!runningInference) {
    runningInference = true;

    // Get the input text
    var input = $("#newInput").html().toLowerCase();

    // Clear previous input
    $("#newInput").remove();
    // Append HTML of input text
    $("#pageSheet").append(`<span class="oldInput">${input}</span><div id="loadingIcon"></div>`);

    // Check if there's something to send
    if (input.length > 0) {
      // This is what the LSTM generator needs
      // Seed text, temperature, length to outputs
      // TODO: What are the defaults?
      let data = {
        seed: input,
        temperature: getButtonValue('temp'),
        length: getButtonValue('length')
      };

      // Generate text with the charRNN
      charRNN.generate(data, gotData);
      
      // Upon getting results of model
      function gotData(err, result) {
        // Calculate styling of output text
        let style = `text-decoration-color:${
          colorValues[$(`#tempSelect .selectedOption`).attr("id")]
        };color:${
          colorValues[$(`#lengthSelect .selectedOption`).attr("id")]
        }`;
        // Remove loading icon
        $("#loadingIcon").remove();
        // Append HTML of output text
        $("#pageSheet").append(`<span class="generatedInput" style="${style}">${result.sample}</span>`);
        $("#pageSheet").append(`<div id="newInput" placeholder="Type starter here..." contenteditable="true"></div>`);
        $("#newInput").on("click", generate);
        // Update state variables
        runningInference = false;
      }

      // Get value of inputs
      // inputType can be 'length' or 'temp'
      function getButtonValue(inputType){
        let selectedOption = $(`#${inputType}Select .selectedOption`).attr("id");
        return buttonValues[selectedOption];
      }
    }
  }
}
