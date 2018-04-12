angular.module('app', ['ngCookies']);

angular.module('app').factory('config', function () {
    return $.getJSON('js/config/mob-config.json').then(function (configJson) {
        return configJson;
    });
});
