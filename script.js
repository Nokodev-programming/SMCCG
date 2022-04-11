// Get #hexdecimal
var hexdecimal = document.getElementById("hexdecimal");
var colorpickerinput = document.getElementById("colorpickerinput");

var ColorMode = true
var NMode = true
var RMode = true

function loop(){
    requestAnimationFrame(loop);
    var hex = colorpickerinput.value.toString(16);
    hexdecimal.textContent = hex
    hexdecimal.style.color = hex
}

function updateOutput(){
    if(ColorMode == false)if(NMode == false)if(RMode == false){
        alert("You cannot disable all Toggleable Mode('s). Use notepad.js.org instead for that. Resetting to default.")
        document.getElementById("colortoggle").checked = true;document.getElementById("togglen").checked = true;document.getElementById("toggler").checked = true;
        ColorMode = true;NMode = true;RMode = true;
        updateOutput()
        return;
    }
    var output = document.getElementById("output");
    var selectedstring = document.getElementById("selectedstring");

    if(selectedstring.value.match(/[^\x00-\x7F]/g)){selectedstring.value = selectedstring.value.replace(/[^\x00-\x7F]/g, ''); alert("You cannot use unicode characters in your message!");return;}
    if(ColorMode)output.textContent = "#ffffff " + selectedstring.value;else output.textContent = selectedstring.value;

    var split = output.textContent.split(" ");
    for (var i = 0; i < split.length; i++) {
        if(ColorMode)if (split[i].match(/^#[0-9A-F]{6}$/i)) split[i] = '<mark style="color: '+ split[i] +'">'
        if(ColorMode)if (split[i].match(/^##[0-9A-F]{6}$/i)) split[i] = '#' + split[i]
        if(NMode)if (split[i] == "\\n") split[i] = '<br>'
        if(RMode)if (split[i] == "\\r") split[i] = '<mark style="color: #ffffff">'
        if(NMode)if (split[i] == "\\\\n") split[i] = '\\n'
        if(RMode)if (split[i] == "\\\\r") split[i] = '\\r'
    }
    var joined = split.join(" ");
    output.innerHTML =  joined;
}
document.getElementById("selectedstring").onkeydown = function(){updateOutput()};
document.getElementById("selectedstring").onkeyup   = function(){updateOutput()};

document.getElementById("docsbutton").onclick       = function(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){if (this.readyState == 4 && this.status == 200){
        document.getElementById("selectedstring").value = this.responseText;
        updateOutput();
    }};

    xhttp.open("GET", "docs.txt", true);
    xhttp.send();
};
document.getElementById("genefile").onclick        = function(){
    if(document.getElementById("loadfile").files.length == 0) return alert("No file selected!");
    var file = document.getElementById("loadfile").files[0];
    if(!file.name.endsWith(".smccg")) return alert("The file you selected is not a .smccg file!");
    var reader = new FileReader();
    reader.onload = function(e) {document.getElementById("selectedstring").value = reader.result; updateOutput();};
    reader.readAsText(file);
};
document.getElementById("doinfile").onclick        = function(){
    var text = document.getElementById("selectedstring").value;
    var filename = "download [INPUT].smccg";
    var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
    
    if (window.navigator.msSaveOrOpenBlob) {window.navigator.msSaveBlob(blob, filename);} else {
        var a = document.createElement("a");
        a.href = window.URL.createObjectURL(blob);
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
};
document.getElementById("dooufile").onclick        = function(){
    const confirm = window.confirm("You choosed Download the file from the output. This text is not completly perfect like \\n's. Are you sure to download")
    if(!confirm) return;
    // Do the same as doinfile but get the data from #output
    var text = document.getElementById("output").textContent;
    var filename = "download [OUTPUT].smccg";
    var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
    
    // download the file other than saveas
    if (window.navigator.msSaveOrOpenBlob) {window.navigator.msSaveBlob(blob, filename);} else {
        var a = document.createElement("a");
        a.href = window.URL.createObjectURL(blob);
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
};

document.getElementById("colortoggle").onclick      = function(){ColorMode = !ColorMode;updateOutput();};
document.getElementById("togglen").onclick          = function(){NMode = !NMode;updateOutput();};
document.getElementById("toggler").onclick          = function(){RMode = !RMode;updateOutput();};
loop();