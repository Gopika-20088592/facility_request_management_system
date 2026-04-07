const form = document.getElementById("requestForm");

const urlParams = new URLSearchParams(window.location.search);
const editId = urlParams.get("id");

async function loadRequestForEdit() {
    if (!editId) {
        return;
    }

    try {
        const response = await fetch(`http://127.0.0.1:5000/requests/${editId}`);
        const request = await response.json();

        if (response.ok && request) {
            document.getElementById("employeeName").value = request.employeeName || "";
            document.getElementById("employeeId").value = request.employeeId || "";
            document.getElementById("floor").value = request.floor || "";
            document.getElementById("pantry").value = request.pantry || "";
            document.getElementById("issueType").value = request.issueType || "";
            document.getElementById("description").value = request.description || "";

            const heading = document.querySelector("h1");
            if (heading) {
                heading.textContent = "Edit Facility Request";
            }

            const submitButton = form.querySelector("button[type='submit']");
            if (submitButton) {
                submitButton.textContent = "Update Request";
            }
        }
    } catch (error) {
        console.error("Error loading request for edit:", error);
        alert("Unable to load request for editing.");
    }
}

form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const name = document.getElementById("employeeName").value.trim();
    const employeeId = document.getElementById("employeeId").value.trim();
    const floor = document.getElementById("floor").value.trim();
    const pantry = document.getElementById("pantry").value.trim();
    const issueType = document.getElementById("issueType").value;
    const description = document.getElementById("description").value.trim();

    if (
        name === "" ||
        employeeId === "" ||
        floor === "" ||
        pantry === "" ||
        issueType === "" ||
        description === ""
    ) {
        alert("Please fill in all fields before submitting the request.");
        return;
    }

    const detailsMessage =
        "Please verify the below details:\n\n" +
        "Employee Name: " + name +
        "\nEmployee ID: " + employeeId +
        "\nFloor: " + floor +
        "\nPantry: " + pantry +
        "\nIssue Type: " + issueType +
        "\nDescription: " + description +
        "\n\nClick OK to confirm or Cancel to edit.";

    const isConfirmed = confirm(detailsMessage);

    if (!isConfirmed) {
        return;
    }

    if (editId) {
        try {
            const oldResponse = await fetch(`http://127.0.0.1:5000/requests/${editId}`);
            const oldRequest = await oldResponse.json();
            
            if (!oldResponse.ok) {
                alert("Unable to load request for update.");
                return;
            }
            
            const requestData = {
                employeeName: name,
                employeeId: employeeId,
                floor: floor,
                pantry: pantry,
                issueType: issueType,
                description: description,
                status: oldRequest.status || "New",
                comment: oldRequest.comment ? oldRequest.comment : "",
                deleteReason: oldRequest.deleteReason ? oldRequest.deleteReason : "",
                assignedTo: oldRequest.assignedTo ? oldRequest.assignedTo : ""
             };
             
            const response = await fetch(`http://127.0.0.1:5000/requests/${editId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestData)
            });
            
            if (response.ok) {
                sessionStorage.setItem("editSuccessTicketId", editId);
                sessionStorage.setItem("editSuccessMessage", "Request updated successfully!");
                window.location.replace(`./view_request.html?openId=${editId}`);
            } else {
                alert("Error updating request.");
            }
        } catch (error) {
            console.error("Error updating request:", error);
            alert("Server error. Make sure backend is running.");
        }
        return;
    }
    
    const requestData = {
        employeeName: name,
        employeeId: employeeId,
        floor: floor,
        pantry: pantry,
        issueType: issueType,
        description: description
    };
    
    try {
        const response = await fetch("http://127.0.0.1:5000/requests", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData)
        });

        const result = await response.json();

        if (response.ok) {
            alert(
                "Your request has been submitted successfully!\n\n" +
                "Request ID: " + result.requestId +
                "\n\nPlease use this ID for future follow-up."
            );

            form.reset();
            window.location.replace("./index.html");
        } else {
            alert("Error submitting request.");
        }
    } catch (error) {
        console.error("Error submitting request:", error);
        alert("Server error. Make sure backend is running.");
    }
});

loadRequestForEdit();