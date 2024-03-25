


const currentDate = new Date();
const currentTime = currentDate.toLocaleTimeString();
const cancelBtn = document.getElementsByClassName("cancel-button");
const showBtn = document.getElementsByClassName("show-button")[0];
const showJobDetail = document.getElementsByClassName("showJobDetails");

console.log(currentTime);
var newTime = new Date('2024-03-08T11:31:00');


for (let i = 0; i < cancelBtn.length; i++) {
    console.log(cancelBtn[i]);
    if (currentDate > newTime) {
        console.log("h");
        console.log(cancelBtn[i].style.display);
        cancelBtn[i].style.display="none";
        
        
        
    }
    
}

/*showBtn.addEventListener("click",function(){
    console.log("bb");
    for (let i = 0; i < showJobDetail.length; i++) {  
      
    
    if (showJobDetail[i].style.display == "none") {
        showJobDetail[i].style.display = " contents";
      console.log("hello");
      showBtn.innerText="HIDE";
    } else {
      console.log("hey");
      showBtn.innerText="SHOW";
      showJobDetail[i].style.display = "none";
    }
  }
  });*/


