

document.addEventListener("DOMContentLoaded", main)


    const forms = document.getElementsByTagName("form")
    for(let form of forms)
    form.addEventListener("submit", (submittion) => {
        submittion.preventDefault()
    })

    function data(){
        const formData = new FormData(form)
            
        const clientsData = {
            name: formData.get("clientName"),
            location: formData.get("clientLocation"),
            contacts: formData.get("clientContact")
        }

        const eventData ={
            eventName: formData.get("eventName"),
            eventLocation: formData.get("eventLocation"),
            type: formData.get("eventType"),
            description: formData.get ("description"),
            date: formData.get ("date"),
            startTime:  formData.get ("startTime"),
            endTime:  formData.get ("endTime"),
            pictureURL:  formData.get ("picture")
        }
        
    }  

    function titleList(event) {
        const list = document.createElement('li');
        list.textContent = event.eventName;
        list.style.backgroundColor = "white";
        list.style.paddingBottom = "20px";
        list.style.paddingTop = "20px";
        list.style.border = "none";
        list.style.borderRadius = "5px";
        list.style.cursor = "pointer";
        list.style.width = "100%";
    }

    function displayEvent(){
    const eventDisplayer = document.getElementById("eventDisplay")

    }

    fetch("http://localhost:3000/events")
    .then(resp => resp.json())
    .then(event => {

    })


