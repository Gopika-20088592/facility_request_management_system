const form = document.getElementById("requestForm");

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("employeeName").value;
    const employeeId = document.getElementById("employeeId").value;
    const floor = document.getElementById("floor").value;
    const pantry = document.getElementById("pantry").value;
    const issue = document.getElementById("issueType").value;
    const description = document.getElementById("description").value;

    const requestData = {
        employeeName: name,
        employeeId: employeeId,
        floor: floor,
        pantry: pantry,
        issueType: issue,
        description: description
    };

    let requests = JSON.parse(localStorage.getItem("facilityRequests")) || [];

    requests.push(requestData);

    localStorage.setItem("facilityRequests", JSON.stringify(requests));

    alert("Request submitted successfully!");

    form.reset();
});