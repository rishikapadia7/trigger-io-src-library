var baseUrl = "https://rkap7-mosaic.fwd.wf/";
forge.logging.info('javascript file loaded');

$(function() {
  if (forge.is.android()) {
    forge.ui.enhanceAllInputs();
  }
});
//forge.ui.enchanceInput('#checkout-date');

$(function () {
  var filePath = window.location.pathname.split('/');
  var n = filePath.length;

  var models = filePath[n - 2].toString();
  var model = models.substring(0, models.length - 1);
  var filename = filePath[n - 1].toString();
  forge.logging.info('got the filename: ' + filename);

  //IF Checkin
  if (filename == 'checkin.html') {
    forge.topbar.setTitle('Checkin Books');

    var pagecontent = $("#checkins");
    pagecontent.empty();

    forge.logging.info('about to make ajax request.');

    forge.request.ajax({
      url: baseUrl + "checkin.json",
      dataType: "json",
      success: function (data) {
        forge.logging.info("success");
        //forge.logging.info(data);
        $.each(data, function(key, val) {
          //forge.logging.info('val.author: ' + val.title);
         
          var p = $('<p id="' + val.id + '"></p>');
          var checkin = $("<a class='checkin' href='javascript:void(0)?id=" + val.id + "'>Checkin</a>");
          p.append(checkin);
          p.append('| ');
          p.append(val.first_name + " " + val.last_name);
          p.append('| ');
          p.append(val.title + ' by ' + val.author);
          p.append('| ');
          
          pagecontent.append(p);
          
        })    
      },
      error: function (error) {
        forge.logging.error(JSON.stringify(error));
      }
    })

    $('.checkin').live("click", function() {
      event.preventDefault();
      forge.logging.info('got clicked');
      var ahref = $(this).attr('href');
      var ahrefSplit = ahref.split('=');
      var modelId = ahrefSplit[1];

      forge.logging.info('about to make ajax request.');
      forge.request.ajax({
        url: baseUrl + "checkin_action/" + modelId + ".json",
        dataType: "json",
        type: 'POST',
        data: {},
        success: function (data) {
          forge.logging.info("success checkin");
          removal('p#' + modelId);
          sendPush('New Checkin', 'transactions/index.html');
        },
        error: function (error) {
          forge.logging.error(model + "_____ " + JSON.stringify(error));
        }
      })

    });
  }

  //IF checkout
  if (filename == 'checkout.html') {
    forge.topbar.setTitle('Checkout Books');
    $("#books").empty();
    $("#patrons").empty();

    forge.logging.info('about to make ajax request.');

    forge.request.ajax({
      url: baseUrl + "checkout.json",
      dataType: "json",
      success: function (data) {
        forge.logging.info("success getting checkout data");
        //forge.logging.info(data);
        $.each(data, function(key, val) {
        //  forge.logging.info('val.patron_id: ' + val.patron_id);
         
          var input = $('<input id="patron__' + val.patron_id + '__' + val.patron_id + '" name="patron[&#27;' + val.patron_id + '&#x27;]" type="radio" value="' + val.patron_id + '" />');
          var label = $('<label for="transaction_' + val.first_name + ' ' + val.last_name + '">' + val.first_name + ' ' + val.last_name + '</label>');
          var br = $('<br>');
          
          $('#patrons').append(input);
          $('#patrons').append(label);
          $('#patrons').append(br);
          $('#patrons').append('<br>');

          input = $('<input id="books__' + val.book_id + '_" name="books[&#27;' + val.book_id + '&#x27;]" type="checkbox" value="' + val.book_id + '" />');
          label = $('<label for="transaction_' + val.title + ' by ' + val.author + '">' + val.title + ' by ' + val.author + '</label>');
          
          $('#books').append(input);
          $('#books').append(label);
          $('#books').append(br);
        })

        $('form.new_' + model).live("submit", function() {
          
          forge.logging.info('clicked');
          $('form.new_' + model).attr('action', 'index.html');

          //trigger adds a disabled attribute for android which does not allow DATE to be sent to server
          if (forge.is.android()) {
            $('#checkout_date').removeAttr("disabled");
          }

          forge.logging.info('$this: ' + $(this));

          var submitData = $(this).serialize();
          forge.logging.info('Submit_data to server: ' + submitData);
          
          event.preventDefault();

          forge.request.ajax({
            url: baseUrl + "transactions.json",
            type: 'POST',
            data: submitData,
            dataType: "json",
            success: function (data) {
              forge.logging.info('successing in checking out book');
              sendPush('New Checkout', 'transactions/index.html');
              forge.logging.info('Should have sent message by now');
              window.location = "index.html";
              
              forge.logging.info('Checkout push notification sent');
            },
            error: function (error) {
              forge.logging.error(JSON.stringify(error));
            }
          });
        });
      },
      error: function (error) {
        forge.logging.error(JSON.stringify(error));
      }
    })

  }

});