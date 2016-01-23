// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('ebc', ['ionic', 'ebc.controllers', 'ebc.services', 'ebc.constants', 'ionic-material', 'ionMdInput', 'backand', 'ngCookies', 'ngMessages', 'ngCordova'])
 
.run(function($ionicPlatform, $cordovaStatusbar) {
  $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleDefault();
      }
  });
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider, BackandProvider, $ionicConfigProvider) {
  //BackandProvider.manageDefaultHeaders();
  //BackandProvider.manageHttpInterceptor();
  BackandProvider.setAppName('ebc');
  BackandProvider.setSignUpToken('97245e9c-69d4-4d51-8992-6a33594ba280');
  //BackandProvider.setAnonymousToken('tokenName');
  
  $ionicConfigProvider.tabs.position('bottom');
  
  $stateProvider
  
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl as login'
  })
  
  .state('signup', {
      url: '/signup',
      templateUrl: 'templates/signup.html'
  })
  
    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'DashCtrl'
  })

  .state('app.submit', {
    url: '/submit',
    views: {
      'menuContent': {
        templateUrl: 'templates/submit.html'
      }
    }
  })

  .state('app.samples', {
    url: '/samples',
    views: {
      'menuContent': {
        templateUrl: 'templates/samples.html'
      }
    }
  })
  
  .state('app.card', {
    url: '/card',
    views: {
      'menuContent': {
        templateUrl: 'templates/sampleCard.html'
      }
    }
  })
  
  .state('app.flyer', {
    url: '/flyer',
    views: {
      'menuContent': {
        templateUrl: 'templates/sampleFlyer.html'
      }
    }
  })
  
  .state('app.profile', {
      url: '/profile',
      views: {
        'menuContent': {
          templateUrl: 'templates/profile.html'
        }
      }
    })
  .state('app.cards', {
      url: '/cards', 
      views: {
        'menuContent': {
          templateUrl: 'templates/cards.html',
          controller: 'CardsCtrl' 
        }
      }
    })

  .state('app.single', {
    url: '/cards/:cardId',
    views: {
      'menuContent': {
        templateUrl: 'templates/card.html',
        controller: 'CardCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/cards');
    
     $httpProvider.interceptors.push('APIInterceptor');

});
