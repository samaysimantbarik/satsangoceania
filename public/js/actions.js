
 $(document).ready(function() {

    $("#registerlink").click(function(){
      console.log("inside");
        $.ajax({
            type: "GET",
            url: "api/users/resgister/",
        }).done(function(data){
          
                            });
    })

    $("#addmember").click(function(){
      console.log("inside");
        $.ajax({
            type: "post",
            url: "api/members/",
        }).done(function(data){
          
                            });
    })

    

    $("#logout").click(function(){
      console.log("inside");
        $.ajax({
            type: "post",
            url: "logout/",
        }).done(function(data){
          
                            });
    })
      });


 
