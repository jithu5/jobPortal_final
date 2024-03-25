
const toggleButtons = document.querySelectorAll(".toggleButton");
const toggleDivs = document.querySelectorAll(".confirmWait");

toggleButtons.forEach((toggleButton, index) => {
  toggleButton.addEventListener("click", function() {
    const diName = toggleButton.getAttribute('data-name');
    const divName = toggleDivs[index].getAttribute('data-target');

    console.log(diName);
    console.log("hello there");
    console.log(divName);

    if (diName === divName) {
      if (toggleDivs[index].style.display === "none" || toggleDivs[index].style.display === "") {
        toggleDivs[index].style.display = "flex";
        console.log("hello");
        toggleButton.innerText = "HIDE";
      } else {
        console.log("hey");
        toggleButton.innerText = "SHOW";
        toggleDivs[index].style.display = "none";
      }
    }
  });
});



const profileUser = document.querySelector(".container");
const profileDetails = document.querySelector(".profile-container");
const profileBody = document.querySelector(".profileBody");
const idProfile = document.querySelector(".idProfile");

profileUser.addEventListener("click", () => {
    // Modify the style or perform other actions
    if (window.innerWidth <= 1130){
      profileUser.style.transition = 'transform 1.5s ease-in'; 
    profileUser.style.transform = 'translateY(-300px)';
   // idProfile.style.width = "40%";
    profileDetails.style.visibility = 'visible'; 
    profileDetails.style.transform = 'translateY(300px)';
  profileDetails.style.transition = "transform 1s ease-out";
    }
    else{  
    profileUser.style.transition = 'transform 1.5s ease-in'; 
    profileUser.style.transform = 'translateX(-300px)';
    profileDetails.style.visibility = 'visible'; 
    profileDetails.style.transform = 'translateX(300px)';
  profileDetails.style.transition = "transform 1s ease-out";// Assuming the container has a height of 100%
}
});


// edit 

/*const showText = document.querySelector(".prefernceAdd");
const editBtn = document.querySelector(".edit");
const addBtn = document.querySelector(".addBtn");
const preferElement = document.querySelector(".prefH4");
const tempHead = document.querySelector(".h1Hide");

editBtn.addEventListener("click", ()=>{
  console.log("edit");

  //access the para of h4

 if(showText.className == "prefernceAdd"){ 
  showText.classList.add("prefernceRem");
  showText.classList.remove("prefernceAdd");
   console.log("hai");
  //type of input
  addBtn.style.display="block";
  var inputElement = document.createElement("input");
  inputElement.type="text";
  inputElement.value = preferElement.innerText;
  
  //replace
  if (preferElement.parentNode) {
    preferElement.parentNode.replaceChild(inputElement, preferElement);
  } else {
    console.error("Parent node not found for preferElement");
  }
  
}
else{
  console.log("dei");
  showText.classList.add("prefernceAdd");
  showText.classList.remove("prefernceRem");

  // new input to text
  if (tempHead && preferElement && preferElement.parentNode) {
    tempHead.innerText = inputElement.value;
    preferElement.innerText = tempHead.innerText;
    preferElement.parentNode.removeChild(inputElement);
  } else {
    console.error("Temp head, prefer element, or its parent node not found");
  }


  
  }

});*/

const inputDiv = document.querySelector(".editInput");//editdiv alert
const editBtn = document.querySelector(".edit");//edit button
const currentPref = document.querySelector(".prefH4");//1 prefer
const currentPref1 = document.querySelector(".pref1H4");//2 prefer
const currentPref2 = document.querySelector(".pref2H4");//3 prefer
const inputElement = document.querySelector("#inputBox");//input box
const submitButton = document.querySelector(".submit-btn");//submit btn
const cancelBtn = document.querySelector(".cancel-btn");//cancel btn
const addButn = document.querySelector(".addNew");
const newPref1 = document.querySelector("#inputBox1");// pref new 1
const newPref2 = document.querySelector("#inputBox2");// pref new 2


editBtn.addEventListener("click",()=>{
  console.log("start");
  inputDiv.style.display="flex";//open the alert box

  //acces the text in input
  inputElement.value=currentPref.innerText;

});

submitButton.addEventListener("click",()=>{
  console.log("you clicked on submit");
  if(inputElement.value == currentPref.innerText){
    console.log("nothings to change ");
  }
  else{
    currentPref.innerText = inputElement.value;
  }//end of if for first prefernce
  //logic for displaying preference
  if (inputElement.value!=="") {
    

  
  if(newPref1.value!==""){//only works when there is a value oin first preference
    currentPref1.style.display="block";
    currentPref1.innerText=newPref1.value;
    console.log("display prefernce 2");
  }
  else if(newPref1.value===""){//won't show second pref
    currentPref1.style.display="none";
    console.log(newPref1.value);
  }


  if(newPref1.value!=="" && inputElement.value!=="" ){//only when 1,pref and 2,pref present
    currentPref2.style.display="block";
    currentPref2.innerText=newPref2.value;
    console.log("display preference 3");
  }
  else if(newPref2.value===""){//if second is null pref won,t show
    currentPref2.style.display="none";
    console.log(newPref2.value);
  }

}
else{
  inputDiv.style.display="none"; }       
});

//add new pref function
addButn.addEventListener("click",()=>{
  console.log("hey iots me");
  if (window.getComputedStyle(newPref1).display === "none")
{//prefernce 1 shown
    newPref1.style.display="block";
    console.log("new pref1 is shown ");
  }
  else if(window.getComputedStyle(newPref2).display ==="none" &&
  window.getComputedStyle(newPref1).display === "block" ){//prefernce 2 is shown
    newPref2.style.display="block";
    console.log("new pref2 is shown");
  }
  else{
    console.log("nothings here");
  }
});


cancelBtn.addEventListener("click",()=>{
  console.log("you clicked cancel");
  inputDiv.style.display="none";
});



