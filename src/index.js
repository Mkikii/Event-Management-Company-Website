document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("clientEventForm");
    form.addEventListener("submit", handleFormSubmit);
    loadInitialData();
});

function handleFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);

    const clientData = {
        name: formData.get("clientName"),
        location: formData.get("clientLocation"),
        contacts: formData.get("clientContact")
    };

    fetch("http://localhost:3000/clients", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(clientData)
    })
    .then(resp => resp.json())
    .then(client => {
        titleList(client);
        const eventData = {
            clientId: client.id,
            eventName: formData.get("eventName"),
            eventLocation: formData.get("eventLocation"),
            type: formData.get("eventType"),
            description: formData.get("description"),
            date: formData.get("date"),
            startTime: formData.get("startTime"),
            endTime: formData.get("endTime"),
            pictureURL: formData.get("picture")
        };

        return fetch("http://localhost:3000/events", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(eventData)
        });
    })
    .then(resp => resp.json())
    .then(event => {
        eventDisplayer(event);
    })
    .catch(err => {
        alert("An error occurred while submitting data.");
        console.error(err);
    });
}

function titleList(client) {
    const list = document.createElement("li");
    list.textContent = client.name;
    list.style.padding = "20px 0";
    list.style.borderRadius = "5px";
    list.style.cursor = "pointer";
    list.style.width = "100%";
    list.style.color = "bisque";
    list.style.listStyleType ="none"
    document.querySelectorAll("li").forEach(li => {
        li.addEventListener("mouseenter", () => {
        li.style.backgroundColor = "rgba(240, 248, 255, 0.522)"
        });

        li.addEventListener("mouseleave", () => {
        li.style.backgroundColor = ""
        });
    });

    const deleteBtn = document.createElement("button")
    deleteBtn.textContent = "Delete Client"
    deleteBtn.addEventListener("click",(event) => {
        event.stopPropagation()
        if(confirm("Are you sure you want to delete this data?")){
            fetch(`http://localhost:3000/clients/${clientId}`, {
                method: "DELETE"
            })
            .then(() => {
                alert("Client data has been deleted.")
                const eventDisplay = document.getElementById("eventDisplay")
                eventDisplay.innerHTML = ""
                list.remove()
                
            })
            .catch( error => {
                alert("Failed to delete data")
                console.log(error)
            })
        }
    })


    list.appendChild(deleteBtn)

    const clientList = document.getElementById("list");
    clientList.appendChild(list);

    list.addEventListener("click", () => {
        fetch(`http://localhost:3000/events?clientId=${client.id}`)
            .then(resp => resp.json())
            .then(events => {
                const eventDisplay = document.getElementById("eventDisplay");
                eventDisplay.innerHTML = "";
                events.forEach(event => eventDisplayer(event));
            });
    });
}

function eventDisplayer(event) {
    const eventDisplay = document.getElementById("eventDisplay");
    eventDisplay.innerHTML = "";

    const title = document.createElement("input");
    title.value = event.eventName;

    const location = document.createElement("input");
    location.value = event.eventLocation;

    const type = document.createElement("input");
    type.value = event.type;

    const date = document.createElement("input");
    date.type = "date";
    date.value = event.date;

    const startTime = document.createElement("input");
    startTime.type = "time";
    startTime.value = event.startTime;

    const endTime = document.createElement("input");
    endTime.type = "time";
    endTime.value = event.endTime;

    const description = document.createElement("input");
    description.value = event.description;

    const image = document.createElement("input");
    image.type = "url";
    image.value = event.pictureURL;


    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Save Changes";
    saveBtn.addEventListener("click", () => {
        const updatedEvent = {
            eventName: title.value,
            eventLocation: location.value,
            type: type.value,
            date: date.value,
            startTime: startTime.value,
            endTime: endTime.value,
            description: description.value,
            pictureURL: image.value
        };

        fetch(`http://localhost:3000/events/${event.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedEvent)
        })
        .then(res => res.json())
        .then(updated => {
            alert("Event updated!");
            eventDisplayer(updated); 
        });
    });

    const furtherDetails = document.createElement("div")
    furtherDetails.appendChild(location);
    furtherDetails.appendChild(type);
    furtherDetails.appendChild(date);
    furtherDetails.appendChild(startTime);
    furtherDetails.appendChild(endTime)

    eventDisplay.appendChild(title);
    eventDisplay.appendChild(image);
    eventDisplay.appendChild(description);
    eventDisplay.appendChild(furtherDetails);
    eventDisplay.appendChild(saveBtn)
}

function loadInitialData() {
    fetch("http://localhost:3000/clients")
        .then(resp => resp.json())
        .then(clients => {
            clients.forEach(client => titleList(client));
        });

    fetch("http://localhost:3000/events")
        .then(resp => resp.json())
        .then(events => {
            events.forEach(event => eventDisplayer(event));
        })
        .catch(error => {
            alert("Error loading data.");
            console.error(error);
        });
}







