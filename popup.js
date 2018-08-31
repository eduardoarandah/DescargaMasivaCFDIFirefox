var allLinks = [];

function descargarxml() {
    //los xml están en el array en posición 0
    document.getElementById('status').textContent = "Descargando XML...";
    // console.log(allLinks);
    // console.log(allLinks[0]);
    // console.log(allLinks[2]);
    for (var i = 0; i < allLinks[0].length; i++) {
        //https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/downloads        
        var liga = allLinks[0][i];
        var name = allLinks[2][i] + ".xml";
        // console.log("descargando url:" + liga + " nombre: " + name);
        browser.downloads.download({
            url: liga,
            saveAs: false,
            filename: name
        });
    }
}

function descargarpdf() {
    //los xml están en el array en posición 1
    document.getElementById('status').textContent = "Descargando PDF...";
    for (var i = 0; i < allLinks[1].length; i++) {
        //https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/downloads
        var liga = allLinks[1][i];
        var name = allLinks[2][i] + ".pdf";
        // console.log("descargando url:" + liga + " nombre: " + name);
        browser.downloads.download({
            url: liga,
            saveAs: false,
            filename: name
        });
    }
}
//listener que recibe los enlaces de send_links.js
browser.runtime.onMessage.addListener(function(links) {
    // console.log("ejecutando linksEncontrados");
    allLinks = links;
    //cambiamos los textos de los botones
    document.getElementById('cuenta-xml').innerText = allLinks[0].length;
    document.getElementById('cuenta-pdf').innerText = allLinks[1].length;
});
window.onload = function() {
    //botones
    document.getElementById('descargarxml').onclick = descargarxml;
    document.getElementById('descargarpdf').onclick = descargarpdf;
    //enlaces
    document.getElementById('analizar').onclick = function() {
        browser.tabs.create({
            url: 'https://analizador-cfdi.netlify.com/'
        });
    }
    document.getElementById('iralsat').onclick = function() {
        browser.tabs.create({
            url: 'https://portalcfdi.facturaelectronica.sat.gob.mx'
        });
    }
    document.getElementById('enlace').onclick = function() {
        browser.tabs.create({
            url: 'https://eduardoarandah.github.io/'
        });
    }
    document.getElementById('manual').onclick = function() {
        browser.tabs.create({
            url: 'https://github.com/eduardoarandah/DescargaMasivaCFDIFirefox'
        });
    }
    //esta función inyecta un JS a la tab activa para enviar los enlaces al listener
    browser.windows.getCurrent(function(currentWindow) {
        browser.tabs.query({
            active: true,
            windowId: currentWindow.id
        }, function(activeTabs) {
            //checar si url contiene "https://portalcfdi.facturaelectronica.sat.gob.mx/"
            var url = activeTabs[0].url;
            var estamos_en_sat = url.startsWith("https://portalcfdi.facturaelectronica.sat.gob.mx");
            if (estamos_en_sat) {
                browser.tabs.executeScript(activeTabs[0].id, {
                    file: 'inject.js'
                });
            }
        });
    });
};