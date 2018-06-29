var M, V, C;

M = (function () {
    return {
    };
})();

V = (function () {

    return {
        nevBeolvasas: function () {
            return document.getElementById('nev').value;
        },

        bevitelimezoTorles: function () {
            document.getElementById('nev').value = '';
        },

        kiIras: function (talalat) {
            document.getElementById('eredmeny').innerHTML += 'name=' + talalat.results[0].nameFull + '<br />' + 'serial=' + talalat.results[0].uid + '<br />' + 'email=' + talalat.results[0].mail[0] + '<br />' + 'notesID=' + talalat.results[0].notesEmail + '<br />';
        },

        porgoIndulj: function () {
            document.getElementById('spinner').style.display = 'block';
        },

        porgoAlj: function () {
            document.getElementById('spinner').style.display = 'none';
        },
    };
})();

C = (function (MObj, VObj) {
    function makeAjaxCall(url) {
        var promiseObj = new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.send();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        console.log("xhr done successfully");
                        resolve(JSON.parse(xhr.responseText));
                    } else {
                        reject(xhr.status);
                        console.log("xhr failed");
                    }
                } else {
                    console.log("xhr processing going on");
                    VObj.porgoIndulj();
                }
            }
            console.log("request sent succesfully");
        });
        return promiseObj;
    }   

    function processBpResponse(searchResult) {
        console.log("render BP response", searchResult);
        setTimeout(function () {           
            VObj.porgoAlj();
            VObj.kiIras(searchResult);            
        }, 2000);
    }

    function errorHandler(statusCode) { console.log("failed with status", statusCode); }

    function urlKeszito(keresoSzo) {
        return 'https://w3-services1.w3-969.ibm.com/myw3/unified-profile/v1/search/user?query=' + keresoSzo + '&rows=1&searchConfig=optimized_search';
    }

    function bluepagesKereses() {
        var keresettNev = VObj.nevBeolvasas();
        if (keresettNev != '') {            
            makeAjaxCall(urlKeszito(keresettNev)).then(function (result) {
                processBpResponse(result);
                var manager = JSON.stringify(result.results[0].manager).slice(5, 14);
                return makeAjaxCall(urlKeszito(manager));                
            })
            .then(function(newResult) {
                return processBpResponse(newResult);
            })
            .catch(errorHandler);                
        } else {
            alert('Nem írtál be nevet!');
        }        
    }

    return {
        init: function () {
            document.getElementById('keresgomb').addEventListener('click', bluepagesKereses);
            document.addEventListener('keypress', function (e) {
                var key = e.which || e.keyCode;
                if (key === 13) { bluepagesKereses(); }
            });
        }
    };
})(M, V);

C.init();