angular.module('ebc.controllers', ['backand', 'ngCookies', 'ionic-material'])

.controller('AppCtrl', function ($rootScope, $scope, $ionicHistory, $ionicModal, $state, $ionicPopup, $ionicPlatform, $cordovaInAppBrowser, SignupService, ResetPassword) {
  $ionicModal.fromTemplateUrl('templates/resetPass.html', {
    id: '1',
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (reset) {
    $scope.modalReset = reset;
  });

  $scope.open = function (index) {
    if (index == 1) {
      $scope.modalReset.show();
    } else if (index == 2) {
      $scope.modalNum.show();
    } else if (index == 3) {
      $scope.modalEmail.show();
    }
  };
  $scope.closeReset = function () {
    $scope.modal.hide();
  };

  $scope.close = function (index) {
    if (index == 1) {
      $scope.modalReset.hide();
    } else if (index == 2) {
      $scope.modalNum.hide();
    } else if (index == 3) {
      $scope.modalEmail.hide();
    }

    $ionicHistory.clearCache();
    $ionicHistory.clearHistory();
  };

  $scope.user = {};

  $scope.getNewPass = function (user) {

    ResetPassword.tempPassword(user.email).then(function () {
      var resetPopup = $ionicPopup.alert({
        title: 'Reset Password',
        template: 'Please Check Your Email.',
        okText: 'Close',
        okType: 'button-calm'
      });
      resetPopup.then(function () {
        $scope.user = {};
        $scope.close(1);
        $scope.closeReset();
      });
    });
  };

  $scope.sampleCard = {
    svg: 'http://ebc.beezleeart.com/docs/samples/cory.svg',
    img: 'https://goo.gl/8gRvkX'
  };

  $scope.sampleFly = {
    svg: 'http://ebc.beezleeart.com/docs/samples/chucky.svg',
    img: 'https://goo.gl/UnPn5u'
  };

  $scope.sampleMsg = function (index) {
    var msgPop = null;

    if (index == 0) {
      var msgPop = $ionicPopup.alert({
        title: 'Sample Helper: SMS',
        template: 'This is where you Select Phone Number from the selected Contact',
        okType: 'button-calm'
      });
    };
    if (index == 1) {
      var msgPop = $ionicPopup.alert({
        title: 'Sample Helper: Contact Select',
        template: 'This is where you Select a Contact from you Phone',
        okType: 'button-calm'
      });
    };

    if (index == 2) {
      var msgPop = $ionicPopup.alert({
        title: 'Sample Helper: Email',
        template: 'This is where you Select Email from the selected Contact',
        okType: 'button-calm'
      });
    };

    msgPop.then(function (res) {
      //close msg
    });
  }

  $scope.newUser = {};

  $scope.createAccount = function (newUser) {
    if (newUser.password === newUser.confirmPassword) {
      SignupService.signup(newUser.firstName, newUser.lastName, newUser.email, newUser.password, newUser.confirmPassword).then(function () {
        var alertPopup = $ionicPopup.alert({
          title: 'Account Created!',
          template: 'Please Login',
          okType: 'button-calm'
        });
        alertPopup.then(function (res) {
          $state.go('login');
        });
      });
    } else {
      var alertPopup = $ionicPopup.alert({
        title: 'Passwords Don\'t match!',
        template: 'Please Re-Type Your Password',
        okType: 'button-assertive'
      })
      alertPopup.then(function (res) {

      });
    };
    this.newUser = null;
  };

  $scope.sample = function () {
    $state.go('app.card');
  };

  $scope.flyer = function () {
    $state.go('app.flyer');
  };
})

.controller('DashCtrl', function ($scope, $state, $window, $timeout, $cordovaFileTransfer, $cordovaCamera, $ionicLoading, $ionicPopup, $ionicPlatform, $ionicPopover, $ionicActionSheet, $http, Backand, FileManager, UserModel, CurrentUser, LoginService, ItemsModel) {
  $ionicPopover.fromTemplateUrl('templates/submitMenu.html', {
    scope: $scope
  }).then(function (popover) {
    $scope.popover = popover;
  });

  $scope.openPopover = function ($event) {
    $scope.popover.show($event);
  };

  $scope.closePopover = function () {
    $scope.popover.hide();
  };

  $scope.us = {};

  $scope.upProfile = function (us) {

    $scope.us.pic = $scope.person.pic;

    var usId = $scope.user;

    UserModel.update(usId, us).then(function () {
      UserModel.fetch(usId).then(function (p) {
        $scope.person = p.data;
      });
      $scope.us = null;
    });
  };

  $scope.password = {};

  $scope.passUpdate = function () {
    var pass = $scope.password;

    if (pass.new === pass.check) {
      Backand.changePassword(pass.current, pass.new).then(function () {
        var alertPopup = $ionicPopup.alert({
          title: 'Password Hass Been Changed!',
          template: 'Please User Your New Password',
          okType: 'button-calm'
        });
        alertPopup.then(function (res) {
          $scope.password = null;
        });
      });
    } else {
      var alertPopup = $ionicPopup.alert({
        title: 'Passwords Don\'t match!',
        template: 'Please Re-Type Your Password',
        okType: 'button-assertive'
      })
      alertPopup.then(function (res) {
        $scope.password = null;
      });
    }
  };

  $scope.submitForm = function () {
    $state.go('app.submit');
    $scope.closePopover();
  };

  $scope.newItem = function (item) {
    ItemsModel.create(item).then(function () {
      var alertPopup = $ionicPopup.alert({
        title: 'Item Created!',
        template: 'Thank You for Business. Your Card/Flyer will Ready In a Few Days',
        okType: 'button-calm'
      });
      alertPopup.then(function (res) {

      });
    });

    this.item = null;
  };

  $scope.popupLoader = function () {
    var imgPop = $ionicPopup.confirm({
      title: 'Upload Image',
      template: 'Image file name is ' + $scope.imgURI.substr($scope.imgURI.lastIndexOf('/') + 1),
      cancelText: 'Stop',
      cancelType: 'button-assertive',
      okText: 'Okay',
      okType: 'button-calm'
    });
    imgPop.then(function (res) {
      if (res) {
        $scope.uploadFile();
        console.log('Yes, Please!');
      } else {
        console.log('No, Error.');
      }
    });
  };

  $scope.password = {};

  $scope.passUpdate = function () {
    var pass = $scope.password;
    Backand.changePassword(pass.current, pass.new).then();
  };

  $scope.submitForm = function () {
    $state.go('app.submit');
    $scope.closePopover();
  };

  $scope.newItem = function (item) {
    ItemsModel.create(item).then(function () {
      var alertPopup = $ionicPopup.alert({
        title: 'Item Created!',
        template: 'Thank You for Business. Your Card/Flyer will Ready In a Few Days',
        okType: 'button-calm'
      });
      alertPopup.then(function (res) {

      });
    });

    this.item = null;
  };

  $scope.popupLoader = function () {
    var imgPop = $ionicPopup.confirm({
      title: 'Upload Image',
      template: 'Image file name is ' + $scope.imgURI.substr($scope.imgURI.lastIndexOf('/') + 1),
      cancelText: 'Stop',
      cancelType: 'button-assertive',
      okText: 'Okay',
      okType: 'button-calm'
    });
    imgPop.then(function (res) {
      if (res) {
        $scope.uploadFile();
        console.log('Yes, Please!');
      } else {
        console.log('No, Error.');
      }
    });
  };

  $ionicPlatform.ready(function () {
    $scope.takePic = function () {
      var options = {
        quality: 100,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.CAMERA,
        encodingType: Camera.EncodingType.JPEG,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
      };

      FileManager.getSigned().then(function (g) {
        $scope.signed = g.data;
      });

      $cordovaCamera.getPicture(options).then(function (imageData) {
        $scope.imgURI = imageData;
        $scope.popupLoader();
      }, function (err) {
        // An error occured. Show a message to the user
      });
    };

    $scope.getPic = function () {
      var options = {
        quality: 75,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        encodingType: Camera.EncodingType.JPEG,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
      };

      FileManager.getSigned().then(function (g) {
        $scope.signed = g.data;
      });

      $cordovaCamera.getPicture(options).then(function (imageData) {
        $scope.imgURI = imageData;
        $scope.popupLoader();
      }, function (err) {
        // An error occured. Show a message to the user
      });
    };
  });

  $ionicPlatform.ready(function () {
    $scope.uploadFile = function () {
      var server = "https://api.cloudinary.com/v1_1/ebccloud/image/upload";
      var filePath = $scope.imgURI;
      var trustAllHosts = true;
      var options = new FileUploadOptions();

      options.fileKey = 'file';
      options.fileName = $scope.imgURI.substr($scope.imgURI.lastIndexOf('/') + 1);
      options.mimeType = 'image/jpeg';
      options.httpMethod = 'POST';
      options.params = $scope.signed;

      $cordovaFileTransfer.upload(server, filePath, options, trustAllHosts).then(function (result) {
        //Success
        $ionicLoading.hide();
        var ra = result.response;
        var ad = JSON.parse(ra);
        $scope.itemPic = ad.url;
      }, function (err) {
        //Error
        $ionicLoading.hide();
        var myBad = $ionicPopup.alert({
          title: 'Upload has Failed!',
          template: 'Please Try Again',
          okType: 'button-assertive'
        });
        myBad.then(function (res) {

        });
        console.error("Error", err);
      }, function (progress) {
        // constant progress updates
        $ionicLoading.show({
          template: '<ion-spinner icon="android"></ion-spinner><br />Uploading...'
        });
        $scope.prog = (progress.loaded / progress.total) * 100;
      });
    };
  });

  $scope.uploader = function () {
    var choices = $ionicActionSheet.show({
      buttons: [
        {
          text: '<span class=""><i class="iconAction ion-android-camera"></i> Take from Camera</span>'
        },
        {
          text: '<span><i class="iconAction ion-android-image"></i> Pic from Gallery</span>'
        }
            ],
      titleText: 'Upload an Image',
      destructiveText: '<span class="assertive"><i class="iconAction ion-android-delete"></i> Exit</span>',
      buttonClicked: function (index) {
        if (index === 0) {
          $scope.takePic();
        }
        if (index === 1) {
          $scope.getPic();
        }
        return true;
      },
      destructiveButtonClicked: function () {
        choices();
      }
    });

    $timeout(function () {
      choices();
    }, 5000);
  };

  $scope.signout = function () {
    LoginService.signout().then(function () {
      $state.go('login');
      $window.location.reload(true);
    });
  };
})

.controller('LoginCtrl', function ($scope, $state, $ionicPopup, $rootScope, Backand, LoginService, CurrentUser, UserModel) {
  var login = this;

  function signin(user) {
    LoginService.signin(login.email, login.password)
      .then(function () {
        $rootScope.$broadcast('authorized');
        var alertPopup = $ionicPopup.alert({
          title: 'Login Suceessful!',
          template: 'Access Granted!',
          okType: 'button-calm'
        });
        alertPopup.then(function (res) {
          $state.go('app.cards');
        });
      }, function (error) {
        var myPopup = $ionicPopup.alert({
          title: 'Login failed!',
          template: 'Please Check Your Credentials.',
          okType: 'button-assertive'
        });
        myPopup.then(function (res) {
          login.email = null;
          login.password = null;
        });
      })
  }

  function bypass() {
    $state.go('signup');
  }

  login.bypass = bypass;
  login.signin = signin;
})

.controller('CardsCtrl', function ($scope, $state, ItemsModel) {
  ItemsModel.all().then(function (items) {
    $scope.cards = items.data.data;
  });
})

.controller('CardCtrl', function ($rootScope, $scope, $stateParams, $state, $ionicModal, $ionicPlatform, $ionicPopup, $cordovaContacts, $cordovaSms, $cordovaEmailComposer, $cordovaInAppBrowser, $cordovaInAppBrowser, ItemsModel) {
  ItemsModel.fetch($stateParams.cardId).then(function (item) {
    $scope.item = item.data;
  });

  $scope.sendee = {
    name: 'Contact',
    sub: 'Check Out My EBC Card/Flyer',
    msg: 'This is My EBC Card/Flyer',
    number: '(xxx) xxx-xxxx',
    email: 'someone@email.com'
  };

  $ionicPlatform.ready(function () {
    $scope.pickSend = function () {
      $cordovaContacts.pickContact().then(function (contact) {
        $scope.phSend = contact.phoneNumbers;
        $scope.emSend = contact.emails;
        $scope.mySend = contact.name;
        $scope.sendee.name = $scope.mySend.formatted;
        var contactPopup = $ionicPopup.alert({
          title: 'You Have Picked',
          template: $scope.sendee.name,
          okType: 'button-calm'
        })
      })
    };

    $scope.smsSend = function () {
      var text = $scope.sendee.msg + ' ' + $scope.item.media;

      $cordovaSms.send($scope.sendee.number, text).then(function () {
        // Success! SMS was sent
        $scope.msgSent();
      }, function (error) {
        // An error occurred
      });
    };

    $scope.emailSend = function () {
      var email = {
        to: $scope.sendee.email,
        subject: $scope.sendee.sub,
        body: $scope.sendee.msg + ' ' + $scope.item.media
      };

      $cordovaEmailComposer.open(email);
    };
  });

  $scope.msgSent = function () {
    var sentPopup = $ionicPopup.alert({
      title: 'Message Sent!',
      template: 'Your Message has been Sent.',
      okType: 'button-calm'
    });
    sentPopup.then(function (res) {

    });
  };

  $ionicModal.fromTemplateUrl('templates/email.html', {
    id: '3',
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (email) {
    $rootScope.modalEmail = email;
  });

  $ionicModal.fromTemplateUrl('templates/phone.html', {
    id: '2',
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (numbers) {
    $rootScope.modalNum = numbers;
  });
})

.run(function ($rootScope, $state, $ionicGesture, $ionicHistory, $cordovaInAppBrowser, LoginService, Backand, FileManager, CurrentUser, UserModel) {

  function unauthorized() {
    console.log("user is unauthorized, sending to login");
    $state.go('login');
  }

  function signout() {
    LoginService.signout();
    $state.go('login');
  }


  function newuser() {
    console.log("new user, sending to signup");
    $state.go('signup');
  }

  $rootScope.$on('unauthorized', function () {
    unauthorized();
  });

  $rootScope.$on('$ionicView.enter', function () {
    CurrentUser.getUser().then(function (id) {
      UserModel.fetch(id).then(function (obj) {
        $rootScope.person = obj.data;
      })
    })
    var prod = document.getElementById('prod');

    if (!prod) {
      console.log('not here');
    } else {
      var ebc = document.getElementById('prod').contentDocument;
      ebc.addEventListener('click', function (e) {
        var url = e.target.parentNode.href.animVal;
        e.preventDefault();

        $cordovaInAppBrowser.open(url, '_system');
      });

    };
  });

  $rootScope.$on('$cordovaInAppBrowser:exit', function (e, event) {
    $cordovaInAppBrowser.close();
  });

  $rootScope.$on('$stateChangeSuccess', function (event, toState) {
    if (toState.name == 'login') {
      signout();
    } else if (toState.name == 'signup') {
      newuser();
    } else if ((toState.name != 'login' || toState.name != 'signup') && Backand.getToken() === undefined) {
      unauthorized();
    }
  });
});
