window['adrum-start-time'] = new Date().getTime();
(function (config) {

    var isProd = window.location.href.indexOf("//app.adeo.no") > -1;

    var isDev = window.location.href.match(/app\-\w+\.adeo\.no/) !== null;


    config.adrumExtUrlHttps = 'https://jsagent.adeo.no';
    config.beaconUrlHttps = 'https://eumgw.adeo.no';
    config.urlCapture = {
        filterURLQuery: true
    };
    if (isProd) {
        config.appKey = null;
        window["adrum-disable"] = true
    } else {
        config.appKey = 'EUM-AAB-AXT';
        if (!isDev) {
            window["adrum-disable"] = true
            // for lokal testing:
            //config.adrumExtUrlHttp = 'https://jsagent.adeo.no';
            //config.beaconUrlHttp = 'https://eumgw.adeo.no';
        }
    }

    config.xd = {enable: false};

})
(window['adrum-config'] || (window['adrum-config'] = {}));
