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

        kiIras: function (mezo, kiirando) {
            document.getElementById(mezo).innerHTML = kiirando;
        },

        tablaTorles: function (tabla) {
            for (var i = 0; i < document.getElementById(tabla).getElementsByTagName("tr").length; i++) {
                document.getElementById(tabla).rows[i].cells[1].innerHTML = '';
            }
        },

        porgoIndulj: function (spinnerCount) {
            document.getElementById('spinner' + spinnerCount).style.display = 'block';
        },

        porgoAlj: function (spinnerCount) {
            document.getElementById('spinner' + spinnerCount).style.display = 'none';
        },
    };
})();

C = (function (MObj, VObj) {
    function makeAjaxCall(url) {
        return new Promise(function (resolve, reject) {
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
                }
            }
            console.log("request sent succesfully");
        });
    }

    function processBpResponse(type, searchResult) {
        var empData = [searchResult.results[0].nameFull, searchResult.results[0].uid, searchResult.results[0].mail[0], searchResult.results[0].notesEmail];
        var empDivList = ['FullName', 'Serial', 'Email', 'NotesID'];
        for (var i = 0; i < empData.length; i++) {
            VObj.kiIras(type + empDivList[i], empData[i]);
        }
        console.log("render BP response", type, empData);
    }

    function errorHandler(statusCode) { console.log("failed with status", statusCode); }

    function urlKeszito(keresoSzo) {
        return 'https://w3-services1.w3-969.ibm.com/myw3/unified-profile/v1/search/user?query=' + keresoSzo + '&rows=1&searchConfig=optimized_search';
    }

    function bluepagesKereses() {
        VObj.tablaTorles('eredmenyTablaEmp');
        VObj.tablaTorles('eredmenyTablaMan');
        var keresettNev = VObj.nevBeolvasas();
        if (keresettNev) {
            VObj.porgoIndulj('1');
            makeAjaxCall(urlKeszito(keresettNev)).then(function (result) {
                processBpResponse('emp', result);
                VObj.porgoAlj('1');
                VObj.porgoIndulj('2');
                return makeAjaxCall(urlKeszito(JSON.stringify(result.results[0].manager).split(',')[0].split('=')[1]));
            })
                .then(function (newResult) {
                    setTimeout(function () {
                        VObj.porgoAlj('2');
                        return processBpResponse('man', newResult);
                    }, 2000);
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