//import { DATETIME } from "mysql2/lib/constants/types";


console.log("Hello");
a();
b();



 async function a(){
    console.log("Function 1 starts"+ Date());
  
  
     await sleep(3);
   // console.log(response);
    
    console.log("Function 1 end" + Date());
}

 async function b(){
    console.log("Function 2 starts"+ Date());
  
  
     sleep(3);
   // console.log(response);
    
    console.log("Function 2 end" + Date());
}

function sleep(seconds) 
{
  var e = new Date().getTime() + (seconds * 1000);
  while (new Date().getTime() <= e) {}
}