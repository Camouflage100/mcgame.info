app.controller("serverListController", ["$scope", "$state", "$stateParams", "$http", "$timeout", "$interval", "$cookies", "moment", function ($scope, $state, $stateParams, $http, $timeout, $interval, $cookies, moment) {
    var usernameCookie = $cookies.get("username");
    var uuidCookie = $cookies.get("uuid");
    var accessTokenCookie = $cookies.get("accessToken");

    if (!usernameCookie || !uuidCookie || !accessTokenCookie) {
        $state.go("logout", {go: "login"});
        return;
    }

    $scope.navbar.tabs = [
        {}
    ];

    $scope.servers = [];
    $scope.refreshServers = function () {
        $http({
            method: "GET",
            url: "https://api.mcgame.info/servers",
            params: {},
            headers: {}
        }).then(function (response) {
            console.log(response);

            if (response.data.status == "ok") {
                $scope.servers = response.data.servers;
                $.each($scope.servers,function (index,server) {
                    var i=index;
                    $http({
                        method:"POST",
                        url:"https://api.mcgame.info/util/pingServer",
                        data:{ip:server.ip}
                    }).then(function (response) {
                        if(response.data.status=="ok"){
                            $scope.servers[i].ping=response.data.ping;
                        }
                        console.log($scope.servers)
                    })
                })

                $timeout(function () {
                    $(".tooltipped").tooltip();
                }, 1000);
            } else {
                Materialize.toast('Error: ' + response.data.msg, 4000)
            }
        }, function (response) {
            console.log(response)
            Materialize.toast('Unexpected Error: ' + response.data.msg, 4000)
            if (response.status == 403) {
                $state.go("login",{reload:true})
            }
        })
    };
    $scope.refreshServers();
    $interval($scope.refreshServers, 1000 * 60 * 10);


    window.addEventListener("focus", function (event) {
        $scope.refreshServers();
    });

    $timeout(function () {
        Materialize.updateTextFields();
    })
}]);