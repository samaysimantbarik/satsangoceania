
 $(document).ready(function() {

    $("#registerlink").click(function(){
      console.log("inside");
        $.ajax({
            type: "GET",
            url: "api/users/resgister/",
        }).done(function(data){
          
                            });
    })
      });
 
