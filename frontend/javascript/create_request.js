const form = document.getElementById("requestForm");

let editIndex = localStorage.getItem("editIndex");
let requests = JSON.parse(localStorage.getItem("facilityRequests")) || [];

if (editIndex !== null) {
    const request = requests[editIndex];

    if (request) {
        document.getElementById("employeeName").value = request.employeeName;
        document.getElementById("employeeId").value = request.employeeId;
        document.getElementById("floor").value = request.floor;
        document.getElementById("pantry").value = request.pantry;
        document.getElementById("issueType").value = request.issueType;
        document.getElementById("description").value = request.description;
    }
}

form.addEventListener("submit", function(event) {
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

    let requestData;

    if (editIndex !== null) {
        const oldRequest = requests[editIndex];

        requestData = {
            requestId: oldRequest.requestId,
            employeeName: name,
            employeeId: employeeId,
            floor: floor,
            pantry: pantry,
            issueType: issueType,
            description: description,
            submittedAt: oldRequest.submittedAt,
            status: oldRequest.status,
            comment: oldRequest.comment ? oldRequest.comment : "",
            deleteReason: oldRequest.deleteReason ? oldRequest.deleteReason : "",
            assignedTo: oldRequest.assignedTo ? oldRequest.assignedTo : ""
        };
    } else {
        let requestCounter = localStorage.getItem("requestCounter");

        if (!requestCounter) {
            requestCounter = 1;
        } else {
            requestCounter = parseInt(requestCounter) + 1;
        }

        localStorage.setItem("requestCounter", requestCounter);

        const year = new Date().getFullYear();
        const formattedNumber = String(requestCounter).padStart(3, "0");
        const requestId = `REQ-${year}-${formattedNumber}`;
        const submittedAt = new Date().toLocaleString();

        requestData = {
            requestId: requestId,
            employeeName: name,
            employeeId: employeeId,
            floor: floor,
            pantry: pantry,
            issueType: issueType,
            description: description,
            submittedAt: submittedAt,
            status: "New",
            comment: "",
            deleteReason: "",
            assignedTo: ""
        };
    }

    const detailsMessage =
        "Please verify your request details:\n\n" +
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

    if (editIndex !== null) {
        requests[editIndex] = requestData;
        localStorage.setItem("facilityRequests", JSON.stringify(requests));
        localStorage.removeItem("editIndex");

        alert("Request updated successfully!");
        form.reset();
        window.location.href = "view_request.html";
    } else {
        requests.push(requestData);
        localStorage.setItem("facilityRequests", JSON.stringify(requests));

        alert(
            "Your request has been submitted successfully!\n\n" +
            "Request ID: " + requestData.requestId +
            "\n\nPlease use this ID for future follow-up."
        );

        form.reset();
        window.location.href = "index.html";
    }
});