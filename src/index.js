document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("clientEventForm");
    form.addEventListener("submit", handleFormSubmit);
    loadInitialData();
});

function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const clientData = {
        name: formData.get("clientName"),
        location: formData.get("clientLocation"),
        contacts: formData.get("clientContact")
    };

    fetch("https://event-management-company-website.onrender.com/clients", {
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

        return fetch("https://event-management-company-website.onrender.com/events", {
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

    list.addEventListener("mouseenter", () => {
        list.style.backgroundColor = "rgba(240, 248, 255, 0.522)"
    });

    list.addEventListener("mouseleave", () => {
        list.style.backgroundColor = ""
    });

    const clientList = document.getElementById("list");
    clientList.appendChild(list);

    list.addEventListener("click", () => {
        fetch(`https://event-management-company-website.onrender.com/events?clientId=${client.id}`)
            .then(resp => resp.json())
            .then(events => {
                const eventDisplay = document.getElementById("eventDisplay");
                eventDisplay.innerHTML = "";
                events.forEach(event => eventDisplayer(event));
            });
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete Client";
    deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation()
        if (confirm("Are you sure you want to delete this client and their events?")) {
            fetch(`https://event-management-company-website.onrender.com/clients/${client.id}`, {
                method: "DELETE"
            })
            .then(() => {
                alert("Client deleted.");
                document.getElementById("eventDisplay").innerHTML = "";
                list.remove()

            })
            .catch(error => {
                alert("Failed to delete client.");
                console.error(error);
            });
        }
    });

    list.appendChild(deleteBtn)
}

function eventDisplayer(event) {
    const eventDisplay = document.getElementById("eventDisplay");
    eventDisplay.innerHTML = "";

    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "10px";

    const title = document.createElement("h3");
    title.textContent = event.eventName;

    const location = document.createElement("p");
    location.textContent = `Location: ${event.eventLocation}`;

    const type = document.createElement("p");
    type.textContent = `Type: ${event.type}`;

    const date = document.createElement("p");
    date.textContent = `Date: ${event.date}`;

    const time = document.createElement("p");
    time.textContent = `Time: ${event.startTime} - ${event.endTime}`;

    const description = document.createElement("p");
    description.textContent = `Description: ${event.description}`;

    const image = document.createElement("img");
    image.src = event.pictureURL;
    image.alt = "Event Image";
    image.style.maxWidth = "100%";

    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️ Edit Event";

    editBtn.addEventListener("click", () => {
        showEditForm(event, eventDisplay);
    });

    editBtn.addEventListener("mouseenter", () => {
        editBtn.style.backgroundColor = "rgba(240, 248, 255, 0.522)"
    });

    editBtn.addEventListener("mouseleave", () => {
        editBtn.style.backgroundColor = ""
    });

    container.append(title, location, type, date, time, description, image, editBtn);
    eventDisplay.appendChild(container);
}

function showEditForm(event, eventDisplay) {
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

    const description = document.createElement("textarea");
    description.value = event.description;

    const image = document.createElement("input");
    image.type = "url";
    image.value = event.pictureURL;

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "💾 Save Changes";

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
    
    saveBtn.addEventListener("mouseenter", () => {
        saveBtn.style.backgroundColor = "rgba(240, 248, 255, 0.522)"
    });

    saveBtn.addEventListener("mouseleave", () => {
        saveBtn.style.backgroundColor = ""
    });

        fetch(`https://event-management-company-website.onrender.com/events/${event.id}`, {
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

    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "10px";

    container.append(title, location, type, date, startTime, endTime, description, image, saveBtn);
    eventDisplay.appendChild(container);

}

function loadInitialData() {
    fetch("https://event-management-company-website.onrender.com/clients")
        .then(resp => resp.json())
        .then(clients => {
            clients.forEach(client => titleList(client));
        });

    fetch("https://event-management-company-website.onrender.com/events")
        .then(resp => resp.json())
        .then(events => {
            events.forEach(event => eventDisplayer(event));
        })
        .catch(error => {
            alert("Error loading data.");
            console.error(error);
        });
}
