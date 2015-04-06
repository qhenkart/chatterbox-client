$(document).ready(function(){




  var getMessages = function(){
    $.ajax({
      // always use this url
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'GET',
      contentType: 'application/json',
      data:'order=-createdAt&limit=20',
      success: function (data) {
        displayMessages(data);
      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to get message');
      }
    });
  }

  var displayMessages = function(data){
    var messages = data.results;
    $(".chat").html('');
    _.each(messages, function(obj){
      //username :  text
      if(obj.text && obj.username) {
        var $message = '<p>'+obj.username+': '+obj.text+'</p>';
        $('.chat').append($message);
      }
    });
    console.log(messages);
  }


  var postMessages = function(){

    var message = {
      'username': window.location.search.split('=')[1],
      'text': $('#chatbox').val(),
      'roomname': 'lobby'
    };

    $('#chatbox').val('');


    $.ajax({
      // always use this url
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(message),
      success: function (data) {
       console.log("message was sent");
       getMessages();
      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to get message');
      }
    });
  }

  $('#submit').on('click', function(event) {
    // event.stopPropogation();
    event.preventDefault();
    postMessages();
  });




  getMessages();

});
