const button = document.getElementById("rems");
button.addEventListener("click",async() => {
    await fetch("/",(error)=>{
        console.log(error);
        
    })
    console.log("pusshed button");
})
