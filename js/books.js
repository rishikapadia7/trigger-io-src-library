var baseUrl = "https://rkap7-mosaic.fwd.wf/";

// $(document).ready(function() {
//   $('a.destroy').live('click', function(event) {
//     alert('beginning');
//   })
// });
$(function () {
  //forge.logging.info("getting");
  var filePath = window.location.pathname.split('/');
  var n = filePath.length;

  var models = filePath[n - 2].toString();
  var model = models.substring(0, models.length - 1);
  var filename = filePath[n - 1].toString();

  //IF INDEX
  if (models + '/' + filename == models + '/index.html') {
    forge.topbar.setTitle(capitaliseFirstLetter(models));

    if (models == 'transactions') {
      forge.topbar.setTitle('Transactions History');
    }

    var pagecontent = $("#" + models);
    pagecontent.empty();

    forge.request.ajax({
      url: baseUrl + models + ".json",
      dataType: "json",
      success: function (data) {
        forge.logging.info("success");
        
        $.each(data, function(key, val) {
          //forge.logging.info('key:' + key + 'val.title:' + val.title);
          
          var p = $('<p id="' + val.id + '"></p>');
          var show = $("<a href='show.html?id=" + val.id + "'>Show</a>");
          var edit = $("<a href='edit.html?id=" + val.id + "'>Edit</a>");
          var destroy = $("<a class='destroy' data-confirm='Are you sure?'' href='javascript:void(0)?id=" + val.id + "'>Destroy</a>");
          
          //STATE MODEL specific view code
          
          if (model == 'book') {
            p.append(val.title + ' by ' + val.author + ' ' + val.checked_out.toString());
            p.append(' ');
            p.append(show);
            p.append(' ');
            p.append(edit)
            p.append(' ');
          }

          if (model == 'patron') {
            p.append(val.first_name + " " + val.last_name);
            p.append(' ');
            p.append(show);
            p.append(' ');
            p.append(edit)
            p.append(' ');

          }

          if (model == 'transaction' && filename == 'index.html') {
            p.append(val.first_name + " " + val.last_name);
            p.append('| ');
            p.append(val.title + ' by ' + val.author);
            p.append('| ');
            p.append(val.checkout_date);
            p.append('| ');
            p.append(val.checkin_date);
            p.append('| ');

          }
          
          p.append(destroy);

          pagecontent.append(p);
          
        })    
      },
      error: function (error) {
        forge.logging.error(JSON.stringify(error));
      }
    })

    $('.destroy').live("click", function() {
      event.preventDefault();
      var ahref = $(this).attr('href');
      var ahrefSplit = ahref.split('=');
      var modelId = ahrefSplit[1];

      forge.request.ajax({
        url: baseUrl + models + "/delete/" + modelId + ".json",
        dataType: "json",
        type: 'POST',
        data: {},
        success: function (data) {
          forge.logging.info("success " + model + " delete");
          removal('p#' + modelId);
          sendPush(model + ' ' + modelId + ' destroyed.', models + '/' + 'index.html');
        },
        error: function (error) {
          forge.logging.error(model + "_____ " + JSON.stringify(error));
        }
      })

    });
  }

  //IF SHOW
  if (filename.indexOf('show.html') == 0) {
    
    forge.topbar.setTitle('Show ' + capitaliseFirstLetter(model));

    var new_path = window.location.toString();
    var split_path = new_path.split('=');
    var modelId = split_path[1];

    forge.request.ajax({
      url: baseUrl + models + "/" + modelId + ".json",
      dataType: "json",
      success: function (data) {
        forge.logging.info("success " + model);
        forge.logging.info(data);

        if (model == 'book') {
          $('#title').append(data.title);
          $('#author').append(data.author);
          $('#checked_out').append(data.checked_out.toString());
        }
        
        if (model == 'patron') {
          $('#first_name').append(data.first_name);
          $('#last_name').append(data.last_name);
        }


        $('a#edit').attr('href', 'edit.html?id=' + modelId.toString());
      },
      error: function (error) {
        forge.logging.error(JSON.stringify(error));
      }
    })
  }
  //EDIT
  if (filename.indexOf('edit.html') == 0) {
    forge.topbar.setTitle('Edit ' + capitaliseFirstLetter(model));

    var new_path = window.location.toString();
    var split_path = new_path.split('=');
    var modelId = split_path[1];
    
    forge.request.ajax({
      url: baseUrl + models + "/" + modelId + ".json",
      dataType: "json",
      success: function (data) {
        forge.logging.info("success " + model);
        // forge.logging.info(data);
        // forge.logging.info(data.title);
        
        if (model == 'book') {
          $('#book_title').attr('value', data.title);
          $('#book_author').attr('value', data.author);
        }
        if (model == 'patron') {
          $('#patron_first_name').attr('value', data.first_name);
          $('#patron_last_name').attr('value', data.last_name);
        }

        $('a#show').attr('href', 'show.html?id=' + modelId.toString());

        $('form.edit_' + model).attr('action', 'show.html?id=' + modelId);

        //SUBMIT EDIT FORM
        $('form.edit_' + model).submit(function() {
          //THIS is form input data, and serialized data is readable by server
          event.preventDefault();
          var submitData = $(this).serialize();

          forge.request.ajax({
            url: baseUrl + models + "/" + modelId + ".json",
            type: 'PUT',
            data: submitData,
            dataType: "json",
            success: function (data) {
              forge.logging.info('Now finished submitting edit');
              forge.logging.info(submitData);
              window.location = "index.html";

              sendPush('Edit ' + model + ' ' + modelId, models + '/show.html?id=' + modelId);

            },
            error: function (error) {
              forge.logging.error(JSON.stringify(error));
            }
          })

        });
      },
      error: function (error) {
        forge.logging.error(JSON.stringify(error));
      }
    })
  }

  //New
  if (filePath[n - 1].toString().indexOf('new.html') == 0) {
    forge.topbar.setTitle('New ' + capitaliseFirstLetter(model));
    //SUBMIT NEW BOOK
    $('form.new_' + model).submit(function() {
      //THIS is form input data, and serialized data is readable by server
      $('form.new_' + model).attr('action', 'index.html');
      var submitData = $(this).serialize();

      event.preventDefault();

      forge.request.ajax({
        url: baseUrl + models + ".json",
        type: 'POST',
        data: submitData,
        dataType: "json",
        success: function (data) {
          forge.logging.info(submitData);
          forge.logging.info(data);
          sendPush('New ' + model, models + '/show.html?id=' + data.id);
          forge.logging.info('push msg sent');
          window.location = "index.html";
          forge.logging.info('redirect successful');

        },
        error: function (error) {
          forge.logging.error(JSON.stringify(error));
        }
      })
    });

  }

});



