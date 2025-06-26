document.addEventListener("DOMContentLoaded", main)

function main(){
    const forms = document.getElementsByTagName("form")
        for(let form of forms){
            form.addEventListener("submit", (submittion) => {
                submittion.preventDefault()
        
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
            })
        }    
}        

    function titleList(clients) {
        const list = document.createElement('li');
        list.textContent = clients.name;
        list.style.backgroundColor = "white";
        list.style.paddingBottom = "20px";
        list.style.paddingTop = "20px";
        list.style.border = "none";
        list.style.borderRadius = "5px";
        list.style.cursor = "pointer";
        list.style.width = "100%";
        list.style.color = "grey"

        const clientList = document.getElementById("list")

        clientList.appendChild(list)
    }

    function eventDisplayer(events){

        const title = document.createElement("h3")
        title.style.fontSize = "40px"
        title.style.color = "grey"
        title.style.marginTop  = "16px"

        const image = document.createElement("img")
        image.src = events.pictureURL;
        image.alt = events.description;
        image.style.width = "95%"
        image.style.height = "600px"
        image.style.alignSelf = "center"

        const description = document.createElement("p")
        description.textContent = events.description;

        const furtherdetails = document.createElement("li")

        const location = document.createElement("p")
        location.textContent = `Event Location: ${events.eventLocation}`

        const type = document.createElement("p")
        type.textContent = events.type

        const date = document.createElement("p")
        date.textContent = events.date

        const time = document.createElement("p")
        time.textContent = `From: ${events.startTime} to ${events.endTime}`



        furtherdetails.appendChild(location)
        furtherdetails.appendChild(type)
        furtherdetails.appendChild(date)
        furtherdetails.appendChild(time)


        const eventDisplay = document.getElementById("eventDisplay")

        eventDisplay.appendChild(title)
        eventDisplay.appendChild(image)
        eventDisplay.appendChild(description)
        eventDisplay.appendChild(furtherdetails)
    }

    fetch("http://localhost:3000/clients")
        .then(resp => resp.json())
        .then(clients => {
            clients.forEach(client => {
            titleList(client)
        })
        return fetch("http://localhost:3000/events")
    })
    .then(resp => resp.json())
    .then(events => {
        events.forEach(event => {
            eventDisplayer(event)
        })
    })

    


