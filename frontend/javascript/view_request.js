const requestList = document.getElementById("requestList");
let requests = JSON.parse(localStorage.getItem("facilityRequests")) || [];

function displayRequests() {
    if (requests.length === 0) {
        requestList.innerHTML = "<p>No requests submitted yet.</p>";
        return;
    }

    let output = "";

    requests.forEach(function(request, index) {
        output += `
            <div style="border:1px solid black; padding:15px; margin-bottom:15px;">
                <h3>Ticket Dashboard</h3>
                <p><strong>Request ID:</strong> ${request.requestId}</p>
                <p><strong>Submitted At:</strong> ${request.submittedAt}</p>
                <p><strong>Status:</strong> ${request.status}</p>

                <button onclick="toggleDetails(${index})">Open Request</button>

                <div id="details-${index}" style="display:none; margin-top:15px; border-top:1px solid #ccc; padding-top:15px;">
                    <p><strong>Employee Name:</strong> ${request.employeeName}</p>
                    <p><strong>Employee ID:</strong> ${request.employeeId}</p>
                    <p><strong>Floor:</strong> ${request.floor}</p>
                    <p><strong>Pantry:</strong> ${request.pantry}</p>
                    <p><strong>Issue Type:</strong> ${request.issueType}</p>
                    <p><strong>Description:</strong> ${request.description}</p>
                    <p><strong>Facility Comment / Action Taken:</strong> ${request.comment ? request.comment : "No comments yet"}</p>
                    <p><strong>Delete Reason:</strong> ${request.deleteReason ? request.deleteReason : "Not deleted"}</p>

                    <br>

                    <label for="status-${index}"><strong>Change Status:</strong></label><br>
                    <select id="status-${index}" ${request.status === "Deleted" ? "disabled" : ""}>
                        <option value="New" ${request.status === "New" ? "selected" : ""}>New</option>
                        <option value="In Progress" ${request.status === "In Progress" ? "selected" : ""}>In Progress</option>
                        <option value="Resolved" ${request.status === "Resolved" ? "selected" : ""}>Resolved</option>
                        <option value="Deleted" ${request.status === "Deleted" ? "selected" : ""}>Deleted</option>
                    </select>

                    <br><br>

                    <label for="comment-${index}"><strong>Facility Comment / Action Taken:</strong></label><br>
                    <textarea id="comment-${index}" rows="4" cols="50" ${request.status === "Deleted" ? "disabled" : ""}>${request.comment ? request.comment : ""}</textarea>

                    <br><br>

                    <button onclick="updateRequest(${index})" ${request.status === "Deleted" ? "disabled" : ""}>Update Request</button>
                    <button onclick="editRequest(${index})" ${request.status === "Deleted" ? "disabled" : ""}>Edit</button>

                    <br><br>

                    <label for="deleteReason-${index}"><strong>Reason to Delete:</strong></label><br>
                    <textarea id="deleteReason-${index}" rows="2" cols="50" ${request.status === "Deleted" ? "disabled" : ""}>${request.deleteReason ? request.deleteReason : ""}</textarea>

                    <br><br>

                    <button onclick="deleteRequest(${index})" ${request.status === "Deleted" ? "disabled" : ""}>Delete</button>
                </div>
            </div>
        `;
    });

    requestList.innerHTML = output;
}

function toggleDetails(index) {
    const detailsDiv = document.getElementById(`details-${index}`);

    if (detailsDiv.style.display === "none") {
        detailsDiv.style.display = "block";
    } else {
        detailsDiv.style.display = "none";
    }
}

function updateRequest(index) {
    const updatedStatus = document.getElementById(`status-${index}`).value;
    const updatedComment = document.getElementById(`comment-${index}`).value.trim();

    requests[index].status = updatedStatus;
    requests[index].comment = updatedComment;

    localStorage.setItem("facilityRequests", JSON.stringify(requests));

    alert("Request updated successfully!");
    location.reload();
}

function editRequest(index) {
    localStorage.setItem("editIndex", index);
    window.location.href = "create_request.html";
}

function deleteRequest(index) {
    const reason = document.getElementById(`deleteReason-${index}`).value.trim();

    if (reason === "") {
        alert("Please enter a reason before deleting the request.");
        return;
    }

    const confirmDelete = confirm(
        "Are you sure you want to delete this request?\n\nReason: " + reason
    );

    if (!confirmDelete) {
        return;
    }

    requests[index].status = "Deleted";
    requests[index].deleteReason = reason;

    localStorage.setItem("facilityRequests", JSON.stringify(requests));

    alert("Request marked as deleted successfully!");
    location.reload();
}

displayRequests();