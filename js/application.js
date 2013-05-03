var baseUrl = "http://rkap7-mosaic.fwd.wf/";

var root = ''
var filePath = window.location.pathname.split('/');
var n = filePath.length;
var folderPath = filePath[n - 2].toString() + '/' + filePath[n - 1].toString();

if (filePath[n - 2].toString() + '/' + filePath[n - 1].toString() == 'src/index.html') {
  root = '';
  //Set topbar title
  forge.topbar.setTitle('Home');

  //Set an initial notificationPath for listener
  var randomTime = '' + new Date().getTime();
  forge.prefs.set('notifTime', randomTime,
    forge.logging.log('The initial notifTime has been set to: ' + randomTime));

} else {
  root = '../';
}


function capitaliseFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

//create navigation bar
$(function () {

  //TOPBAR configurations
  if (folderPath == 'src/index.html') {
    //Set topbar title
  }

  forge.topbar.setTint([84,34,219,230]);
  
  forge.tabbar.removeButtons();
//create tabbar
  forge.tabbar.addButton({
    icon: "img/home.jpg",
    text: "Home",
    index: 0
  }, function (button) {

    button.onPressed.addListener(function () {     
      window.location = root + 'index.html';
      button.setActive();
    });
  });

  forge.tabbar.addButton({
    icon: "img/books.png",
    text: "Books",
    index: 1
  }, function (button) {

    button.onPressed.addListener(function () {     
      forge.tabs.open( baseUrl + 'books')
      button.setActive();
    });
  });

  forge.tabbar.addButton({
    icon: "img/patron.png",
    text: "Patrons",
    index: 2
  }, function (button) {

    button.onPressed.addListener(function () {     
      
      window.location = baseUrl + 'patrons';
      button.setActive();
    });
  });

  forge.tabbar.addButton({
    icon: "img/checkout.png",
    text: "Checkout",
    index: 3
  }, function (button) {

    button.onPressed.addListener(function () {     
      
      forge.tabs.open( baseUrl + 'checkout')
      button.setActive();
    });
  });

  forge.tabbar.addButton({
    icon: "img/checkin.png",
    text: "Checkin",
    index: 4
  }, function (button) {

    button.onPressed.addListener(function () {     
      
      window.location = baseUrl + 'checkin';
      button.setActive();
    });
  });


  forge.tabbar.addButton({
    icon: "img/history.png",
    text: "History",
    index: 5
  }, function (button) {

    button.onPressed.addListener(function () {     
      
      window.location = baseUrl + 'history';
      button.setActive();
    });
  });

  forge.tabbar.setTint([84,34,219,230]);
  forge.tabbar.setActiveTint([220,78,90,255]);

});

forge.event.messagePushed.addListener(function (data) {
  if (data) {
        forge.logging.info('Notification has had some data passed');
    forge.prefs.get('notifTime', 
      function(oldNotifTime){
        forge.logging.log('oldNotifTime: ' + oldNotifTime);
        forge.logging.log('data.notificationTime: ' + data.notificationTime);
        forge.logging.log('data.appPath: ' + data.appPath);
        
        //perhaps needs a null checker in the if statement
        if (data.notificationTime != oldNotifTime) {

          forge.logging.log('data.appPath declared: ' + data.appPath);

          if (data.appPath) {
            
            data.appPath.toString();
            
            if (data.appPath.length == 0) {
              data.appPath = 'index.html';
            }
          } else {
            data.appPath = 'index.html';
          }

          forge.logging.info('notification_path before redirect: ' + data.appPath);
          //Generate a random unique value using time for the current notification
          forge.prefs.set('notifTime', data.notificationTime);
          forge.prefs.set('dataAppPath', data.appPath);
          
            window.location = root + data.appPath;
          
          forge.logging.info('notifTime set before redirect: ' + data.notificationTime);
        }
      }
    );
  }
});


var config = {
    parseAppId: '<parse app id here>',
    parseRestKey: 'parse rest key here>',
    streamName: 'library'
};

var pushChannel = 'recipients';



$(function() {

    forge.partners.parse.push.subscribe(pushChannel,
      function () {
        forge.logging.info("subscribed to recipients push notifications!");
      },
      function (err) {
        forge.logging.error("error subscribing to recipients notifications: "+ JSON.stringify(err));
      }
    );
});



var removal = function(elem) {
  $(elem).remove();
};


var sendPush = function(msg, notificationPath) {
  var randomTime = '' + new Date().getTime();
  forge.request.ajax({
    url: "https://api.parse.com/1/push.json",
    dataType: "json",
    type: 'POST',
    contentType: 'application/json',
    headers: {
        'X-Parse-Application-Id': config.parseAppId,
        'X-Parse-REST-API-Key': config.parseRestKey,
        'Content-Type': 'application/json'
    },
    data: JSON.stringify({"channels": [pushChannel],
        "data": {
          "alert": msg,
          "badge": "Increment",
          "appPath": notificationPath,
          "notificationTime": randomTime.toString()
        }
      }
    ),
    success: function (data) {
      forge.logging.info("push msg sent");
      forge.logging.info("data: " + data);
    },
    error: function (error) {
      forge.logging.error(JSON.stringify(error));
    }
  })
};