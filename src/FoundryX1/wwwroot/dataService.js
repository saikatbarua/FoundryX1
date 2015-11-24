
// angular service directive
(function (app, undefined) {

    app.config(function ($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    });

   app.service('dataService', function ($http, $q) {
        this.getData = function (url) {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: url,
            }).
         success(function (data, status, headers, config) {
             deferred.resolve(data)
         }).
         error(function (data, status, headers, config) {
             deferred.reject(data);
         });
            return deferred.promise;
        }

        this.postData = function (url, data) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: url,
                data: data,
            }).
         success(function (data, status, headers, config) {
             deferred.resolve(data)
         }).
         error(function (data, status, headers, config) {
             deferred.reject(data);
         });
            return deferred.promise;
        }
        });


}(foApp));