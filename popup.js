var allLinks = [];
//listener que recibe los enlaces de send_links.js
browser.runtime.onMessage.addListener(function(links) {
    // console.log("ejecutando linksEncontrados");
    allLinks = links;
    //cambiamos los textos de los botones
    document.getElementById('descargarxml').innerText = "Descargar " + allLinks[0].length + " XML";
    document.getElementById('descargarpdf').innerText = "Descargar " + allLinks[1].length + " PDF";
});

function descargarxml() {
    //los xml están en el array en posición 0
    document.getElementById('status').textContent = "Descargando XML...";
    // console.log(allLinks);
    // console.log(allLinks[0]);
    // console.log(allLinks[2]);
    for (var i = 0; i < allLinks[0].length; i++) {
        //https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/downloads        
        var liga = allLinks[0][i];
        var name = allLinks[2][i]+".xml";
        // console.log("descargando url:" + liga + " nombre: " + name);
        browser.downloads.download({
            url: liga,
            saveAs:false,
            filename:name
        });
    }
}

function descargarpdf() {
    //los xml están en el array en posición 1
    document.getElementById('status').textContent = "Descargando PDF...";
    for (var i = 0; i < allLinks[1].length; i++) {
        //https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/downloads
        var liga = allLinks[1][i];
        var name = allLinks[2][i]+".pdf";
        // console.log("descargando url:" + liga + " nombre: " + name);
        browser.downloads.download({
            url: liga,
            saveAs:false,
            filename:name
        });
    }
}
window.onload = function() {
    document.getElementById('descargarxml').onclick = descargarxml;
    document.getElementById('descargarpdf').onclick = descargarpdf;
    document.getElementById('analizar').onclick = function() {
        browser.tabs.create({
            url: 'https://analizador-cfdi.netlify.com/'
        });
    }
    document.getElementById('enlace').onclick = function() {
        browser.tabs.create({
            url: 'https://github.com/eduardoarandah'
        });
    }
    //esta función agrega un JS a la tab activa para enviar los enlaces al listener
    browser.tabs.executeScript({
        file: "/send_links.js"
    });
};