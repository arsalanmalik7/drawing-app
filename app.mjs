let canvas = document.querySelector("#screen");
let ctx = canvas.getContext("2d");

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

let isDrawing = false;
let prevMouseX, prevMouseY, snapShot;
let selectedTool = 'pointer';



const drawRect = (event) => {
    ctx.strokeRect(event.offsetX, event.offsetY, prevMouseX - event.offsetX, prevMouseY - event.offsetY);
}

const drawCircle = (event) => {
    ctx.beginPath();
    let radius = Math.sqrt(Math.pow((prevMouseX - event.offsetX), 2) + Math.pow((prevMouseY - event.offsetY), 2))
    ctx.arc(prevMouseX, prevMouseY, radius, 50, 0, 2 * Math.PI);
    ctx.stroke();
}

function startDrawing(event) {
    isDrawing = true;
    prevMouseX = event.offsetX;
    prevMouseY = event.offsetY;
    ctx.beginPath();
    let sizeInput = document.querySelector("#sizeOfPointer");
    sizeInput.addEventListener('input', function () {
        size = sizeInput.value;
        ctx.lineWidth = size;
    });
    snapShot = ctx.getImageData(0, 0, canvas.width, canvas.height)
    let colorPickers = document.querySelector(".colors").value;
    ctx.strokeStyle = colorPickers;
    ctx.lineCap = 'round'
    ctx.stroke();
}



function draw(event) {
    if (!isDrawing) return;
    ctx.putImageData(snapShot, 0, 0);
    let colorPickers = document.querySelector(".colors").value;

    if (selectedTool === 'pointer' || selectedTool === "eraser") {
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : colorPickers;
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
    } else if (selectedTool === 'square') {
        drawRect(event);
        ctx.stroke();
    } else if (selectedTool === 'circle') {
        drawCircle(event);
    }
}
toolBtn = document.querySelectorAll(".tool");
toolBtn.forEach(btn => {
    btn.addEventListener('click', () => {
        selectedTool = btn.id;
        console.log(selectedTool);
    })
});

function stopDrawing(event) {
    isDrawing = false;
}

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

let textBox = null;

// Add event listener to the "Add Text Box" button
const addTextBoxButton = document.querySelector('#addText');
addTextBoxButton.addEventListener('click', () => {
    createTextBox();
});

// Function to create the text box element
function createTextBox() {
    // Create the text box input element
    textBox = document.createElement('input');
    textBox.type = 'text';
    textBox.cols = '20';
    textBox.rows = '4';
    textBox.placeholder = 'Enter text';
    textBox.style.position = 'absolute';
    textBox.style.top = '10px';
    textBox.style.left = '10px';

    // Append the text box to the body or a container element
    document.body.appendChild(textBox);

    // Focus on the text box to allow immediate input
    textBox.focus();
}

// Function to handle user input on the text box
function handleTextInput() {
    if (textBox) {
        // Clear the canvas
        // ctx.clearRect(0, 0, canvas.width, canvas.height);
        let colorPickers = document.querySelector(".colors").value;

        // Set the font properties
        ctx.font = '24px Arial';
        ctx.fillStyle = colorPickers;

        // Draw the text on the canvas
        ctx.fillText(textBox.value, 100, 100);
    }
}

// Event listener for handling text input changes
document.addEventListener('input', handleTextInput);

// image upload
let upload = document.querySelector("#uploadImage");
upload.addEventListener('change', handleImageUpload);
function handleImageUpload(e) {
    const reader = new FileReader();
    reader.onload = function (event) {
        const img = new Image();
        // Event listener for image load
        img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;
            // Draw the image on the canvas
            ctx.drawImage(img, 0, 0);
        };
        // Set the source of the image
        img.src = event.target.result;
    };
    // Read the selected file as Data URL
    reader.readAsDataURL(e.target.files[0]);
}

// clear canvas
let clearBoard = document.querySelector("#clearBoard");
clearBoard.addEventListener('click', function dontRepeat() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 0;
})

canvas.addEventListener("mouseover", function () {
    toolBtn = document.querySelectorAll(".tool");
    toolBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            selectedTool = btn.id;
            console.log(selectedTool);
        })

    })
    if (selectedTool === 'eraser') {

        canvas.style.cursor = "cell"

    } else {
        canvas.style.cursor = "crosshair";

    }
});


document.querySelector('#save').addEventListener('click', function () {
    canvas.toBlob(function (blob) {
        saveAs(blob, 'output.png');
    }, 'image/png');
});












