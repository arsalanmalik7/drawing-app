window.addEventListener('load', () => {

    let canvas = document.querySelector("#screen");
    let ctx = canvas.getContext("2d");

    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;


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




    let crop = document.querySelector("#crop");
    let eraser = document.querySelector("#eraser");
    let pencil = document.querySelector("#pencil");
    let straightLine = document.querySelector("#line");
    let square = document.querySelector("#square");
    let circle = document.querySelector("#circle");
    let addtext = document.querySelector("#addText");
    let fillBucket = document.querySelector("#bucket");

    // clear canvas
    let clearBoard = document.querySelector("#clearBoard");
    clearBoard.addEventListener('click', function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    })

    let isDrawing = false;

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);



    canvas.addEventListener("mouseover", function () {
        canvas.style.cursor = "crosshair";
    });


    function startDrawing(event) {
        isDrawing = true;
        let rect = canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;

        let colorPickers = document.querySelector(".colors").value;
        ctx.strokeStyle = colorPickers;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y);
        let sizeInput = document.querySelector("#sizeOfPointer");
        sizeInput.addEventListener('input', function () {
            size = sizeInput.value;

            ctx.lineWidth = size;
        });

        ctx.lineCap = 'round'
        ctx.stroke();
    }

    function draw(event) {
        if (isDrawing) {
            let rect = canvas.getBoundingClientRect();
            let x = event.clientX - rect.left;
            let y = event.clientY - rect.top;

            ctx.lineTo(x, y);
            ctx.stroke();
        }

    }

    function stopDrawing(event) {
        isDrawing = false;
        ctx.stroke();
        draw(event);
    }
    let squareStartX = 0;
    let squareStartY = 0;
    let squareSize = 0;
    let isDrawingLine = false;
    let isDrawingSquare = false;
    // Event listener for the square button
    let squareButton = document.querySelector("#square");
    squareButton.addEventListener("click", function () {
        isDrawingSquare = !isDrawingSquare;
        squareButton.classList.toggle("active");

        if (isDrawingSquare) {
            canvas.addEventListener("mousedown", startDrawingSquare);
            canvas.addEventListener("mousemove", drawSquare);
            canvas.addEventListener("mouseup", endDrawingSquare);
            canvas.addEventListener("mouseout", stopDrawing);
        } else {
            canvas.removeEventListener("mousedown", startDrawingSquare);
            canvas.removeEventListener("mousemove", drawSquare);
            canvas.removeEventListener("mouseup", endDrawingSquare);
            canvas.removeEventListener("mouseout", stopDrawing);
        }
    });


    function startDrawingSquare(event) {
        isDrawing = true;
        squareStartX = event.clientX;
        squareStartY = event.clientY;
        lastX = squareStartX;
        lastY = squareStartY;
        saveCanvasState();
    }

    document.querySelector('#save').addEventListener('click', function () {
        canvas.toBlob(function (blob) {
            saveAs(blob, 'output.png');
        }, 'image/png');
    });


});



