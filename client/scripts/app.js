
var app = {
  server: "https://api.parse.com/1/classes/chatterbox",
  currentRoom: 'lobby',
  rooms: {},

  init: function(){
      app.fetch();
      app.populateRooms();
  },

  send: function(message){
    $.ajax({
      // always use this url
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(message),
      success: function (data) {
       console.log("message was sent");
       app.fetch();
      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to get message');
      }
    });
  },

  fetch: function(){
    $.ajax({
      // always use this url
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'GET',
      contentType: 'application/json',
      data:{order:'-createdAt', limit:20, where:'{"roomname":"'+app.currentRoom+'"}'},
      success: function (data) {
        $("#chats").html('');
        _.each(data.results, function(obj){
          app.addMessage(obj);
        });
      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to get message');
      }
    });
  },

  addMessage: function(message){
    if(message.text && message.username) {
      if(/<script>/.test(message.text)){
        message.text = "GTFO Hacker!!!"
      }

      var $message = '<p>'+message.username+': '+message.text+'</p>';
      $('#chats').append($message);
    }
  },

  clearMessages: function(){
    $("#chats").html('');
  },

  populateRooms: function(){
    $.ajax({
      // always use this url
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'GET',
      contentType: 'application/json',
      data:{order:'-createdAt',limit:100},
      success: function (data) {
        _.each(data.results, function(obj){
          if(obj.roomname){
            app.rooms[obj.roomname] = obj.roomname;
          }
        });
        app.chatList();

      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to get message');
      }
    });
  },

  chatList: function() {
    _.each(app.rooms, function(room) {
      if(room.length < 50 && !(/<script>/.test(room)) && (room !== "lobby")){
        var $option = '<option>'+room+'</option>';
        $('#chatrooms').append($option);
      }
    });
  }
}




//======================================================================//


$(document).ready(function(){

  app.init();




//checks for sent message
  $('#submit').on('click', function(event) {
    event.preventDefault();
    var message = {
      'username': window.location.search.split('=')[1],
      'text': $('#chatbox').val(),
      'roomname': app.currentRoom
    };
    app.send(message);

    $('#chatbox').val('');
  });

//checks for changing chatrooms on dropdown
$("#chatrooms").change(function() {
  app.currentRoom = this.value;
  app.fetch();
});

//checks for create new room
$('#createroom').on('click', function(event){
  $(".chatroom").toggleClass("hidden")
});

$("#chatroomsubmit").on('click', function(e){
  app.currentRoom = $('#chatroombox').val();
  app.fetch();
});


  //getMessages();
  // populateRooms();
   setInterval(app.fetch, 15000);

});
