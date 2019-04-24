//import { DATETIME } from "mysql2/lib/constants/types";

try{
add(3,function(err,info){
 
 if(err){
   console.log("errorrrrr:"+err.message);
 }else{
   console.log("info::"+info);
 }

});
}
catch(e){
  console.log(e.message);
}


function add(a,b,next){
  try{
    if(b===0){
      next(new Error("error as denominator is 0"))
    }
    else{
     var res=a/b;
      next("",res);
         }
    }
  catch(e){
 //  next(new Error(e.message));
    throw Error("One or more params are missing");
  }
}