let preveiwContainer = document.querySelector('.job-preview');
let previewBox = preveiwContainer.querySelectorAll('.preview');
let prefContainer = document.querySelector('.pre-preview')
let prefBox = prefContainer.querySelectorAll('.preferedprev')
var btn = document.getElementById('applyform')
var btn2 = document.getElementById('applyfpreform')
let applytbn;
document.querySelectorAll('.products-container .product').forEach(product =>{
    product.onclick = () =>{
        preveiwContainer.style.display='flex';
        let name= product.getAttribute('data-name');
        previewBox.forEach(preview =>{
            let target = preview.getAttribute('data-target');
console.log(target)
console.log(name);
            if(name == target){
              console.log("yes");
              console.log("hai");
                preview.classList.add('active');
                let btn=preview.children[1][7];
              const jobId= preview.children[1][0].value
              console.log("1",preview.children[1][1].value)
              console.log("2",preview.children[1][2].value)
              console.log("3",preview.children[1][3].value)
              console.log("4",preview.children[1][4].value)
              console.log("5",preview.children[1][5].value)
              console.log("6",preview.children[1][6].value)
              const job = preview.children[1][1].value
              const jobCat = preview.children[1][2].value
              const noOfWorkers= preview.children[1][3].value
                btn.onclick=async(event)=>{
                  try {
                    const response = await fetch('http://localhost:3000/apply', {
                        method: 'POST',
                        headers:{
                        "Content-Type":"application/json"
                        },
                        body: JSON.stringify({jobId,job,jobCat,noOfWorkers})
                    }).then((res)=>{
                        
                        res.json()
                        console.log(res.message);
                        console.log(res.status);
                        if(res.status==201){
                            showCustomPrompt("Applied Successfully");
                        }
                        else if(res.status=402){
                            showCustomPrompt("You Cannot Apply fot Your Own Job")
                        }
                        else if(res.status=403){
                          showCustomPrompt("You Have Already Applied For This Job")
                        }
                        else{
                          showCustomPrompt("Application Error..Please try again later")
                        }
                        
                        console.log(res)
                    })
                  
                  
                  } catch (error) {
                    console.error('Error posting job:', error);
                    showCustomPrompt('An error occurred while posting the job. Please try again later.'); // Display an error message if something went wrong
                  }
                  
                  
                }
                // applytbn=document.getElementById('applybtn');
                
                
            }
          
        });
      
        console.log(applytbn);
    };
  
});


previewBox.forEach(close =>{
    close.querySelector('.fa-times').onclick = () =>{
        close.classList.remove('active')
        preveiwContainer.style.display = 'none';
        
    };
});

document.querySelectorAll('.pre-container .pre').forEach(pre =>{
  pre.onclick = () =>{
      prefContainer.style.display='flex';
      let jobname= pre.getAttribute('data-name');
      prefBox.forEach(preferedprev =>{
          let jobtarget = preferedprev.getAttribute('data-target');
          console.log(jobname)
          console.log(jobtarget);
          if(jobname == jobtarget){
            preferedprev.classList.add('active');
            console.log("yes");
            console.log(preferedprev.children);
            console.log("1", preferedprev.children[1][0].value)
            console.log("2", preferedprev.children[1][1].value);
            console.log("3", preferedprev.children[1][2].value);
            console.log("4", preferedprev.children[1][3]);
            let btn2 = preferedprev.children[1][3];
            const jobId= preferedprev.children[1][0].value
            const job = preferedprev.children[1][1].value
            const jobCat = preferedprev.children[1][2].value
            

            btn2.onclick=async(event)=>{
              console.log("clicked");
              console.log(jobId,job,jobCat)
              try {
                const response = await fetch('http://localhost:3000/apply', {
                    method: 'POST',
                    headers:{
                    "Content-Type":"application/json"
                    },
                    body: JSON.stringify({jobId,jobCat,job})
                }).then((res)=>{
                    
                    res.json()
                    console.log(res.message);
                    console.log(res.status);
                    if(res.status==201){
                        showCustomPrompt("Applied Successfully");
                    }
                    else if(res.status=402){
                        showCustomPrompt("You Have Already Applied For This Job")
                    }
                    else if(res.status=403){
                      showCustomPrompt("You Cannot Apply fot Your Own Job")
                    }
                    else{
                      showCustomPrompt("Application Error..Please try again later")
                    }
                    
                    console.log(res)
                })
              
              
              } catch (error) {
                console.error('Error posting job:', error);
                showCustomPrompt('An error occurred while posting the job. Please try again later.'); // Display an error message if something went wrong
              }
            }
          
          }
      });
  };
});
console.log(applytbn);

prefBox.forEach(close =>{
  close.querySelector('.fa-times').onclick = () =>{
      close.classList.remove('active')
      prefContainer.style.display = 'none';
  };
});





document.addEventListener('DOMContentLoaded', function () {
    const clickableDiv = document.querySelector('.icon');
    const myDiv = document.getElementById('myDiv');
  
    clickableDiv.addEventListener('click', function () {
      // Toggle the display property of the div
      if (myDiv.style.display === 'none' || myDiv.style.display === '') {
        myDiv.style.display = 'block';
      } else {
        myDiv.style.display = 'none';
      }
    });
  });

//

//mobile navigation
let mobBtn=document.getElementById("bttn");
let mobMenu=document.getElementById("close");

console.log(mobBtn.className);

mobBtn.addEventListener("click",()=>{
  if(mobMenu.className=="nav-2"){
    mobMenu.classList.remove("nav-2")
    mobMenu.classList.add("show");
  }
  else{
    mobMenu.classList.remove("show")
    mobMenu.classList.add("nav-2");
  }
  
});
/*

let applyConfirmBox=document.getElementById("conApp");
let btnApply=document.getElementsByClassName("apply-job");
let prev=document.getElementsByClassName("preview");

console.log(btnApply);
for(let i=0;i<btnApply.length;i++){
 // prev.classList.remove("active");
  btnApply[i].addEventListener("click",()=>{


    applyConfirmBox.classList.remove("applyConfirm");
    applyConfirmBox.classList.add("show1");
    prev[i].classList.remove("active");

    setTimeout(()=>{
      applyConfirmBox.classList.remove("show1");
      applyConfirmBox.classList.add("applyConfirm");
    console.log(applyConfirmBox.className);
  },3000)
  });


}
/*
document.addEventListener('DOMContentLoaded', function () {
  const postForm = document.getElementById('postform');
  const postMessage = document.getElementById('postMessage');

  postForm.addEventListener('submit', async function (event) {
      event.preventDefault();

      try {
          const formData = new FormData(postForm);
          const response = await fetch('/postjob/postjob', {
              method: 'POST',
              body: formData,
          });

          const result = await response.json();

          // Update the paragraph content based on the response
          if (result.status === 'success') {
              postMessage.innerHTML = `<p style="color: green;">${result.message}</p>`;
          } else {
              postMessage.innerHTML = `<p style="color: red;">${result.message}</p>`;
          }
      } catch (error) {
          console.error('Error during fetch:', error);
          postMessage.innerHTML = '<p style="color: red;">An error occurred.</p>';
      }
  });
});
*/
function showCustomPrompt(message) {
  const customPrompt = document.getElementById('customPrompt');
  const promptMessage = document.getElementById('promptMessage');
  const promptOK = document.getElementById('promptOK');

  promptMessage.textContent = message;
  customPrompt.style.display = 'block';

  promptOK.onclick = function() {
      customPrompt.style.display = 'none';
  };
}


