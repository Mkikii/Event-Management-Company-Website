document.addEventListener("DOMContentLoaded", main)

function main(){
    const clientForm = document.getElementById("clientDetailsForm")

    if(clientForm){
        clientForm.addEventListener("submit",(submission) => {
            submission.preventDefault()

            const clientsFormData = submission.target
            const eventFormData = document.getElementById("eventDetailsForm")

            newDetails(clientsFormData, eventFormData)
        })
    } else{
        alert("Form Not Found")
    }
 
}        

        function newDetails(clientsFormData, eventFormData){
            
            const clientsForm = new FormData(clientsFormData) 
            const eventForm = new FormData(eventFormData)
                    
            const clientsData = {
                name: clientsForm.get("clientName"),
                location: clientsForm.get("clientLocation"),
                contacts: clientsForm.get("clientContact")
            }

            const newClientDetails = {
                method :"POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(clientsData)
            }


            fetch("http://localhost:3000/clients", newClientDetails)
            .then(resp => resp.json())
            .then(client => {
                titleList(client)

                const eventsData ={
                clientId: client.id ,
                eventName: eventForm.get("eventName"),
                eventLocation: eventForm.get("eventLocation"),
                type: eventForm.get("eventType"),
                description: eventForm.get ("description"),
                date: eventForm.get ("date"),
                startTime:  eventForm.get ("startTime"),
                endTime:  eventForm.get ("endTime"),
                pictureURL:  eventForm.get ("picture")
                }

                const newEventData ={
                    method :"POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(eventsData)         
                }


                return fetch ("http://localhost:3000/events", newEventData)
            })
        
                .then(resp => resp.json())
                .then(event => {
                    eventDisplayer(event)
                })
                .catch(error => {
                    alert("Error during form submission. Please try again.")
                    console.log(error)
                })
                           
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

        list.addEventListener("click", () => {
            
            fetch(`http://localhost:3000/events?clientId=${client.id}`)
                .then(resp => resp.json())
                .then(events => {
                    const eventDisplay = document.getElementById("eventDisplay")
                    eventDisplay.innerHTML = ""

                    events.forEach(event => eventDisplayer(event))
                })
                .catch(error => {
                    alert("Error loading client-specific events. See console.");
                    console.error(error);
                })    
        })
    }

    function eventDisplayer(events){

         const eventDisplay = document.getElementById("eventDisplay")
        eventDisplay.innerHTML = ""


        const title = document.createElement("h3")
        title.textContent = events.eventName
        title.style.fontSize = "40px"
        title.style.marginTop  = "16px"
        title.style.marginBottom = "16px"


        const image = document.createElement("img")
        image.src = events.pictureURL;
        image.alt = events.description;
        image.style.alignSelf = "center"

        const description = document.createElement("p")
        description.textContent = events.description;

        const furtherdetails = document.createElement("li")

        const location = document.createElement("p")
        location.textContent = `Event Location: ${events.eventLocation}`

        const type = document.createElement("p")
        type.textContent = events.type

        const date = document.createElement("p")
        date.textContent = `On: ${events.date}`

        const time = document.createElement("p")
        time.textContent = `From: ${events.startTime} to ${events.endTime}`



        furtherdetails.appendChild(location)
        furtherdetails.appendChild(type)
        furtherdetails.appendChild(date)
        furtherdetails.appendChild(time)


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
    .catch(error => {
        alert("Error loading form data.",error)
    })

    


