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

    const name = document.getElementById("employeeName").value;
    const employeeId = document.getElementById("employeeId").value;
    const floor = document.getElementById("floor").value;
    const pantry = document.getElementById("pantry").value;
    const issueType = document.getElementById("issueType").value;
    const description = document.getElementById("description").value;

    const requestData = {
        employeeName: name,
        employeeId: employeeId,
        floor: floor,
        pantry: pantry,
        issueType: issueType,
        description: description
    };

    if (editIndex !== null) {
        requests[editIndex] = requestData;
        localStorage.setItem("facilityRequests", JSON.stringify(requests));
        localStorage.removeItem("editIndex");
        alert("Request updated successfully!");
    } else {
        requests.push(requestData);
        localStorage.setItem("facilityRequests", JSON.stringify(requests));
        alert("Request submitted successfully!");
    }

    form.reset();
    window.location.href = "view_request.html";
});