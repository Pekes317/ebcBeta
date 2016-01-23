angular.module('ebc.services', ['backand', 'ngCookies'])

.service('APIInterceptor', function ($rootScope, $q, $cookieStore, Backand) {
  var service = this;

  service.request = function (config) {
    //config.headers['Authorization'] = Backand.getToken('access_token');
    //config.headers['Authorization'] = $cookieStore.get('backand_token');
    return config;
  };

  service.responseError = function (response) {
    if (response.status === 401) {
      $rootScope.$broadcast('unauthorized');
    }
    return $q.reject(response);
  };
})

.service('LoginService', function (Backand, BackandAuthService) {
  var service = this;

  //service.signin = function(email, password, appName) {
  service.signin = function (email, password) {
    //return Backand.signin(email, password);
    return BackandAuthService.signin(email, password);
  };

  service.signout = function () {
    return Backand.signout();
  };
})

.service('SignupService', function (Backand, $http) {
  var service = this;
  var newUser = {};

  service.signup = function (firstName, lastName, email, password, confirmPassword) {
    return Backand.signup(firstName, lastName, email, password, confirmPassword);
  };
})

.service('ResetPassword', function (Backand, $http) {
  var service = this;

  service.tempPassword = function (username, appName) {
    return Backand.requestResetPassword(username);
  }
})

.service('ItemsModel', function ($http, Backand) {
  var service = this,
    tableUrl = '/1/objects/',
    path = 'items/';

  function getUrl() {
    return Backand.getApiUrl() + tableUrl + path;
  }

  function getUrlForId(itemId) {
    return getUrl(path) + itemId + '?deep=true';
  }

  service.all = function () {
    return $http.get(getUrl() + '?deep=true');
  };

  service.fetch = function (itemId) {
    return $http.get(getUrlForId(itemId));
  };

  service.create = function (item) {
    return $http.post(getUrl(), item);
  };

  service.update = function (itemId, item) {
    return $http.put(getUrlForId(itemId), item);
  };

  service.destroy = function (itemId) {
    return $http.delete(getUrlForId(itemId));
  };
})

.service('UserModel', function ($http, Backand) {
  var service = this,
    tableUrl = '/1/objects/',
    path = 'users/';

  function getUrl() {
    return Backand.getApiUrl() + tableUrl + path;
  };

  function getUrlForId(userId) {
    return getUrl(path) + userId;
  };

  service.fetch = function (userId) {
    return $http.get(getUrlForId(userId));
  };

  service.update = function (userId, user) {
    return $http.put(getUrlForId(userId), user);
  };
})

.factory('CurrentUser', function ($http, Backand) {
  var myQuery = '/1/query/data/CurrentUser';

  return {
    getUser: function () {
      return $http.get(Backand.getApiUrl() + myQuery).then(function (response) {
        var data = response.data;
        for (var i in data) {
          var obj = data[i];
        }
        for (var d in obj) {
          var myUser = obj[d];
        }
        return myUser;
      });
    }
  }
})

.factory('FileManager', function ($http, $cordovaFileTransfer, $cordovaCamera, $ionicPlatform, $state, Backand) {
  var imageSign = {};
  var opt = {};

  return {
    getSigned: function () {
      if ($state.current.name == 'app.submit') {
        opt.preset = 'usersItem';
        opt.tag = Backand.getUsername();
      };
      if ($state.current.name == 'app.profile') {
        opt.preset = 'usersPic';
        opt.tag = Backand.getUsername();
      };

      return $http({
        url: 'http://ebc.beezleeart.com/upload/cloudinary_call.php',
        method: "POST",
        data: opt
      }).success(function (Data, status, headers, config) {
        imageSign = Data;
        return imageSign;
      }).error(function (data, status, headers, config) {
        //console.log("error", data);
      });
    }
  };
});
