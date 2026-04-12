const requestList = document.getElementById("requestList");
const searchInput = document.getElementById("searchInput");

let requests = [];
let currentFilter = "All";

async function loadRequests() {
    try {
        const response = await fetch("http://34.224.215.71:5000/requests");
        requests = await response.json();
        updateCounts();
        showRequests();
        document.getElementById("filter-all").classList.add("active-filter");

    } catch (error) {
        requestList.innerHTML = "<p>Error loading requests.</p>";
    }
}

function updateCounts() {
    document.getElementById("totalRequests").textContent = requests.length;
    document.getElementById("newRequests").textContent = requests.filter(r => r.status === "New").length;
    document.getElementById("inProgressRequests").textContent = requests.filter(r => r.status === "In Progress").length;
    document.getElementById("resolvedRequests").textContent = requests.filter(r => r.status === "Resolved").length;
    document.getElementById("deletedRequests").textContent = requests.filter(r => r.status === "Deleted").length;
}

function getRequestsToShow() {
    let filtered = currentFilter === "All" ? requests : requests.filter(r => r.status === currentFilter);
    const search = searchInput.value.toLowerCase().trim();
    if (search) {
        filtered = filtered.filter(r =>
            r.requestId.toLowerCase().includes(search) ||
            r.employeeName.toLowerCase().includes(search) ||
            r.employeeId.toLowerCase().includes(search) ||
            r.issueType.toLowerCase().includes(search)
        );
    }
    return filtered;
}

function showRequests() {
    const data = getRequestsToShow();

    if (data.length === 0) {
        requestList.innerHTML = "<p>No matching requests found.</p>";
        return;
    }

    requestList.innerHTML = data.map(r => `
        <div class="card request-summary">
            <p><strong>Request ID:</strong> ${r.requestId}</p>
            <p><strong>Submitted At:</strong> ${r.submittedAt}</p>
            <p><strong>Status:</strong> ${r.status}</p>
            <button onclick="toggleDetails(${r.id})">Open Request</button>

            <div id="details-${r.id}" class="request-details" style="display:none;">
                <p><strong>Employee Name:</strong> ${r.employeeName}</p>
                <p><strong>Employee ID:</strong> ${r.employeeId}</p>
                <p><strong>Floor:</strong> ${r.floor}</p>
                <p><strong>Pantry:</strong> ${r.pantry}</p>
                <p><strong>Issue Type:</strong> ${r.issueType}</p>
                <p><strong>Description:</strong> ${r.description}</p>
                <p><strong>Assigned To:</strong> ${r.assignedTo || "Not assigned yet"}</p>
                <p><strong>Comment:</strong> ${r.comment || "No comments yet"}</p>
                <p><strong>Delete Reason:</strong> ${r.deleteReason || "Not deleted"}</p>

                <label>Assign To:</label>
                <input type="text" id="assignedTo-${r.id}" value="${r.assignedTo || ""}" ${r.status === "Deleted" ? "disabled" : ""}>

                <label>Change Status:</label>
                <select id="status-${r.id}" ${r.status === "Deleted" ? "disabled" : ""}>
                    <option value="New" ${r.status === "New" ? "selected" : ""}>New</option>
                    <option value="In Progress" ${r.status === "In Progress" ? "selected" : ""}>In Progress</option>
                    <option value="Resolved" ${r.status === "Resolved" ? "selected" : ""}>Resolved</option>
                    <option value="Deleted" ${r.status === "Deleted" ? "selected" : ""}>Deleted</option>
                </select>

                <label>Comment:</label>
                <textarea id="comment-${r.id}" rows="3" ${r.status === "Deleted" ? "disabled" : ""}>${r.comment || ""}</textarea>

                <button onclick="updateRequest(${r.id})" ${r.status === "Deleted" ? "disabled" : ""}>Update Request</button>

                <label>Reason to Delete:</label>
                <textarea id="deleteReason-${r.id}" rows="2" ${r.status === "Deleted" ? "disabled" : ""}>${r.deleteReason || ""}</textarea>
                <button onclick="deleteRequest(${r.id})" ${r.status === "Deleted" ? "disabled" : ""}>Delete</button>
            </div>
        </div>
    `).join("");
}

function filterRequests(status) {
    currentFilter = status;
    document.getElementById("filterLabel").innerHTML = "<strong>Showing:</strong> " + (status === "All" ? "All Tickets" : status + " Tickets");
    document.querySelectorAll(".stats-card").forEach(card => card.classList.remove("active-filter"));
    const cardMap = { "All": "filter-all", "New": "filter-new", "In Progress": "filter-progress", "Resolved": "filter-resolved", "Deleted": "filter-deleted" };
    document.getElementById(cardMap[status]).classList.add("active-filter");
    showRequests();
}

function searchRequests() {
    showRequests();
}

function resetSearch() {
    searchInput.value = "";
    currentFilter = "All";
    document.getElementById("filterLabel").innerHTML = "<strong>Showing:</strong> All Tickets";
    document.querySelectorAll(".stats-card").forEach(card => card.classList.remove("active-filter"));
    document.getElementById("filter-all").classList.add("active-filter");
    showRequests();
}

function toggleDetails(id) {
    const details = document.getElementById(`details-${id}`);
    details.style.display = details.style.display === "none" ? "block" : "none";
}

async function updateRequest(id) {
    const request = requests.find(item => item.id === id);

    const updatedData = {
        employeeName : request.employeeName,
        employeeId   : request.employeeId,
        floor        : request.floor,
        pantry       : request.pantry,
        issueType    : request.issueType,
        description  : request.description,
        status       : document.getElementById(`status-${id}`).value,
        comment      : document.getElementById(`comment-${id}`).value.trim(),
        assignedTo   : document.getElementById(`assignedTo-${id}`).value.trim(),
        deleteReason : document.getElementById(`deleteReason-${id}`).value.trim()
    };

    try {
        const response = await fetch(`http://34.224.215.71:5000/requests/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedData)
        });
        
        if (response.ok) {
            alert("Request updated successfully!");
            loadRequests();
        } else {
            alert("Error updating request.");
        }
    } catch (error) {
        alert("Server error while updating request.");
    }
}

async function deleteRequest(id) {
    const request = requests.find(item => item.id === id);
    const reason = document.getElementById(`deleteReason-${id}`).value.trim();

    if (!reason) { alert("Please enter a reason before deleting."); return; }

    if (!confirm("Are you sure you want to delete this request?")) return;

    try {
        const response = await fetch(`http://34.224.215.71:5000/requests/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                employeeName: request.employeeName,
                employeeId: request.employeeId,
                floor: request.floor,
                pantry: request.pantry,
                issueType: request.issueType,
                description: request.description,
                status: "Deleted",
                comment: request.comment,
                assignedTo: request.assignedTo,
                deleteReason: reason
            })
        });
        
        if (response.ok) {
            alert("Request deleted successfully!");
            loadRequests();
        } else {
            alert("Error deleting request.");
        }
    } catch (error) {
        alert("Server error while deleting request.");
    }
}

loadRequests();
