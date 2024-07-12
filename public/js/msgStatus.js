document.addEventListener("DOMContentLoaded", ()=>{
    const params= new URLSearchParams(window.location.search)
    console.log(params);
    const message = params.get("message")
    const status = params.get("status")
    const msgCont = document.getElementById("displayMessage")
    if(message){
        if(status==='success'){
            msgCont.style.color='green'
        }else{
            msgCont.style.color='red'
        }
    }
    msgCont.innerText=message

    setTimeout(()=>{
        msgCont.innerText=''
    }, 2000)

})