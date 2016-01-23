console.log('Script Launched');

var element = angular.element(document.body);

$ionicGesture.on('tap', function (e) {
  console.log('Tapped' + e + e.target);
}, element);
