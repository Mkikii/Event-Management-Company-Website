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

    const title = document.createElement("h3");
    title.textContent = event.eventName;
    title.style.fontSize = "40px";
    title.style.marginTop = "16px";
    title.style.marginBottom = "16px";

    const image = document.createElement("img");
    image.src = event.pictureURL;
    image.alt = event.description;
    image.style.alignSelf = "center";

    const description = document.createElement("p");
    description.textContent = event.description;

    const furtherDetails = document.createElement("li");

    const location = document.createElement("p");
    location.textContent = `Event Location: ${event.eventLocation}`;

    const type = document.createElement("p");
    type.textContent = `Type: ${event.type}`;

    const date = document.createElement("p");
    date.textContent = `On: ${event.date}`;

    const time = document.createElement("p");
    time.textContent = `From: ${event.startTime} to ${event.endTime}`;

    furtherDetails.appendChild(location);
    furtherDetails.appendChild(type);
    furtherDetails.appendChild(date);
    furtherDetails.appendChild(time);

    eventDisplay.appendChild(title);
    eventDisplay.appendChild(image);
    eventDisplay.appendChild(description);
    eventDisplay.appendChild(furtherDetails);
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
