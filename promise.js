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
    };
})();

C = (function (MObj, VObj) {
    function bluepagesKereses() {
        var keresettNev = VObj.nevBeolvasas();
        if (keresettNev != '') {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var obj = JSON.parse(this.responseText);
                    document.getElementById('eredmeny').innerHTML = 'name=' + JSON.stringify(obj.results[0].nameFull) + '<br />' + 'serial=' + JSON.stringify(obj.results[0].uid) + '<br />' + 'email=' + JSON.stringify(obj.results[0].mail[0]) + '<br />' + 'notesmail=' + JSON.stringify(obj.results[0].notesEmail);                        
                }
            };
            xhttp.open('GET', 'https://w3-services1.w3-969.ibm.com/myw3/unified-profile/v1/search/user?query=' + keresettNev + '&rows=1&searchConfig=optimized_search', true);
            xhttp.send();
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