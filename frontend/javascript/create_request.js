const form = document.getElementById("requestForm");

form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const employeeName = document.getElementById("employeeName").value.trim();
    const employeeId = document.getElementById("employeeId").value.trim();
    const floor = document.getElementById("floor").value.trim();
    const pantry = document.getElementById("pantry").value.trim();
    const issueType = document.getElementById("issueType").value;
    const description = document.getElementById("description").value.trim();

    if (!employeeName || !employeeId || !floor || !pantry || !issueType || !description) {
        alert("Please fill in all fields.");
        return;
    }
    
    if (!confirm(
        "Please check the request details:\n\n" +
        "Employee Name: " + employeeName +
        "\nEmployee ID: "  + employeeId +
        "\nFloor: "        + floor +
        "\nPantry: "       + pantry +
        "\nIssue Type: "   + issueType +
        "\nDescription: "  + description
    )) return;
    
    try {
        const response = await fetch("http://34.224.215.71:5000/requests", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ employeeName, employeeId, floor, pantry, issueType, description })
        });
        const result = await response.json();
        if (response.ok) {
            alert("Request submitted successfully!\n\nRequest ID: " + result.requestId);
            form.reset();
            window.history.back();
        } else {
            alert("Error submitting request.");
        }
    } catch (error) {
        alert("Server error. Make sure backend is running.");
    }
});
