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
            document.getElementById('eredmeny').innerHTML = 'name=' + talalat.results[0].nameFull + '<br />' + 'serial=' + talalat.results[0].uid + '<br />' + 'email=' + talalat.results[0].mail[0] + '<br />' + 'notesmail=' + talalat.results[0].notesEmail;
        },

        porgoAlj: function() {
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
                }
            }
            console.log("request sent succesfully");
        });
        return promiseObj;
    }

    //function processUserDetailsResponse(userData) { console.log("render user details", userData); }

    function processBpResponse(searchResult) {
        console.log("render BP response", searchResult);
        VObj.kiIras(searchResult);
    }

    function errorHandler(statusCode) { console.log("failed with status", statusCode); }

    function bluepagesKereses() {
        var keresettNev = VObj.nevBeolvasas();
        if (keresettNev != '') {
            var bpUrl = 'https://w3-services1.w3-969.ibm.com/myw3/unified-profile/v1/search/user?query=' + keresettNev + '&rows=1&searchConfig=optimized_search';
            makeAjaxCall(bpUrl).then(processBpResponse, errorHandler);
        } else {
            alert('Nem írtál be nevet!');
        }
        //VObj.bevitelimezoTorles();
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