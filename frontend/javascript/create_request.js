const form = document.getElementById("requestForm");

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