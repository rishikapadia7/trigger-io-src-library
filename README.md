## What is it?
This repository includes the src/ files of a Trigger.io application that I built as part of my first coop-term at Mosaic.  Trigger.io is a service and framework for writing hybrid mobile applications in HTML, CSS, and Javascript and then using the code inside a web-wrapper on a mobile device.  For more details visit:
[Trigger.io website](https://trigger.io/how-it-works/)

The App developed is a sample Library application that demonstrates CRUD functionalitity, along with making use of Trigger.io's API to access native controls such as Push Notifications, native top-bar and tab-bar, and a native date-time picker.

The original intent of this App when being developed at Mosaic was a proof-of-concept to indicate that Trigger.io is a viable option for mobile app development using web technologies.


## How does the Library Application work?
The user of this App is the Library manager who is able to add, view, update, and remove Books and Patrons.  When a book is added, the Patron (once added as well) would be able to checkout a book or multiple books if many books exist.  Once a book is checked out, it can be checked in and it becomes immediately available for checkout again.

The browsing branch includes in-app browsing functionality which is for the purpose of using an existing mobile website and browsing on that website yet still make use of native functionality.  This would avoid the need of making AJAX requests and fetching JSON and parsing it to display it in the app.  NOTE: this feature will only work with a Trigger.io paid account and currently this app is not configured to use it.

## How to Use
- Setup a Trigger.io account and create a new project and app within it
- Inside the created Trigger.io application, clone the files inside this repo to be inside the src/ folder
- Make sure the identity.json created before is still present in the src/ directory as it is differet for everyone
- Inside application.js and config.json, there are URLs representing a temporary server, these can be changed to access your own library server or the URL of the Rails app that I may deploy in the future.
- Run the Trigger.io app on your Android/iOS device or simulator to test

## Possible Future Expansion:
- Multiple users for the app (right now only supports one user for test purposes)
- Support for Facebook and Google Authentication
- Adding collaborators to personal library for library management
