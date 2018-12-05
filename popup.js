var allLinks = [];

function descargarxml() {
    //los xml están en el array en posición 0
    document.getElementById("status").textContent = "Descargando XML...";

    // Hacemos una copia de allLinks
    // luego ejecutamos un intervalo cada 1000 milisegundos para extraer un elemento del array y descargarlo
    // cuando no haya elementos, cancelar el intervalo.
    //los xml están en el array en posición 0
    var urls = allLinks[0];
    var nombres = allLinks[2];
    var interval = setInterval(function() {
        var url = urls.shift();
        var nombre = nombres.shift();
        if (url) {
            //Descargar el archivo
            browser.downloads.download({
                url: url,
                saveAs: false,
                filename: nombre + ".xml",
            });
        } else {
            clearInterval(this);
        }
    }, 1000);
}

function descargarpdf() {
    //los xml están en el array en posición 1
    document.getElementById("status").textContent = "Descargando PDF...";

    // Hacemos una copia de allLinks
    // luego ejecutamos un intervalo cada 1000 milisegundos para extraer un elemento del array y descargarlo
    // cuando no haya elementos, cancelar el intervalo.
    //los pdf están en el array en posición 1
    var urls = allLinks[1];
    var nombres = allLinks[2];
    var interval = setInterval(function() {
        var url = urls.shift();
        var nombre = nombres.shift();
        if (url) {
            //Descargar el archivo
            browser.downloads.download({
                url: url,
                saveAs: false,
                filename: nombre + ".pdf",
            });
        } else {
            clearInterval(this);
        }
    }, 1000);
}
//listener que recibe los enlaces de send_links.js
browser.runtime.onMessage.addListener(function(links) {
    // console.log("ejecutando linksEncontrados");
    allLinks = links;
    //cambiamos los textos de los botones
    document.getElementById("cuenta-xml").innerText = allLinks[0].length;
    document.getElementById("cuenta-pdf").innerText = allLinks[1].length;
});
window.onload = function() {
    //botones
    document.getElementById("descargarxml").onclick = descargarxml;
    document.getElementById("descargarpdf").onclick = descargarpdf;
    //enlaces
    document.getElementById("analizar").onclick = function() {
        browser.tabs.create({
            url: "https://analizador-cfdi.netlify.com/",
        });
    };
    document.getElementById("iralsat").onclick = function() {
        browser.tabs.create({
            url: "https://portalcfdi.facturaelectronica.sat.gob.mx",
        });
    };
    document.getElementById("enlace").onclick = function() {
        browser.tabs.create({
            url: "https://eduardoarandah.github.io/",
        });
    };
    document.getElementById("manual").onclick = function() {
        browser.tabs.create({
            url: "https://github.com/eduardoarandah/DescargaMasivaCFDIFirefox",
        });
    };
    //esta función inyecta un JS a la tab activa para enviar los enlaces al listener
    browser.windows.getCurrent(function(currentWindow) {
        browser.tabs.query(
            {
                active: true,
                windowId: currentWindow.id,
            },
            function(activeTabs) {
                //checar si url contiene "https://portalcfdi.facturaelectronica.sat.gob.mx/"
                var url = activeTabs[0].url;
                var estamos_en_sat = url.startsWith(
                    "https://portalcfdi.facturaelectronica.sat.gob.mx",
                );
                if (estamos_en_sat) {
                    browser.tabs.executeScript(activeTabs[0].id, {
                        file: "inject.js",
                    });
                }
            },
        );
    });
};
