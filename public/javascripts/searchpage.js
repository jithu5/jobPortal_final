let preveiwContainer = document.querySelector('.job-preview');
let previewBox = preveiwContainer.querySelectorAll('.preview');

document.querySelectorAll('.products-container .product').forEach(product =>{
    product.onclick = () =>{
        preveiwContainer.style.display='flex';
        let name= product.getAttribute('data-name');
        previewBox.forEach(preview =>{
            let target = preview.getAttribute('data-target');
console.log(target)
console.log(name);
            if(name == target){
            console.log("yes")
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
            }
        });
    };
});
previewBox.forEach(close =>{
    close.querySelector('.fa-times').onclick = () =>{
        close.classList.remove('active')
        preveiwContainer.style.display = 'none';
    };
});

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
  