

document.getElementById('postform').addEventListener('submit', async (event) => {
    event.preventDefault();
    const job = document.getElementById('job').value;
    const cate = document.getElementById('cate').value;
    const desc  = document.getElementById('desc').value;
    const datee = document.getElementById('datee').value;
    const stime = document.getElementById('stime').value;
    const etime = document.getElementById('etime').value;
    const wage = document.getElementById('wage').value;
    const ph1 = document.getElementById('ph1').value;
    const ph2 = document.getElementById('ph2').value;
    const wno = document.getElementById('wno').value;
    const distri = document.getElementById('distri').value;
    const city = document.getElementById('city').value;
    const street = document.getElementById('street').value;
    const building = document.getElementById('building').value;
    const landmark = document.getElementById('landmark').value;
    const pin = document.getElementById('pin').value;

    
    console.log({job,cate,desc})

    try {
        const response = await fetch('http://localhost:3000/postjob/postjob', {
            method: 'POST',
            headers:{
            "Content-Type":"application/json"
            },
            body: JSON.stringify({job,cate,desc,datee,stime,etime,wage,ph1,ph2,wno,distri,city,street,building,landmark,pin})
        }).then((res)=>{
            
            res.json()
            console.log(res.message);
            console.log(res.status);
            if(res.status==200){
                showCustomPrompt("Posted Succesfully");
            }
            else{
                showCustomPrompt("posting failed")
            }
            
            console.log(res)
        })

       // const result =  response.
       // showCustomPrompt(result.message); // Display the response message in the custom prompt box
    } catch (error) {
        console.error('Error posting job:', error);
        showCustomPrompt('An error occurred while posting the job. Please try again later.'); // Display an error message if something went wrong
    }
    console.log(new FormData(event.target))
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
