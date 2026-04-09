const requestList = document.getElementById("requestList");
const searchInput = document.getElementById("searchInput");

let requests = [];
let currentFilter = "All";
let statusChartInstance = null;

const urlParams = new URLSearchParams(window.location.search);
let openIdFromUrl = urlParams.get("openId");
let currentOpenedTicketId = openIdFromUrl ? Number(openIdFromUrl) : null;

function clearHighlights() {

    
    document.querySelectorAll(".request-summary").forEach(card => {
        card.classList.remove("highlight-ticket");
    });
}

function showInlineMessage(id, text, type = "success") {
    const box = document.getElementById(`msg-${id}`);

    if (!box) return;

    box.textContent = text;
    box.className = "inline-message";

    if (type === "success") {
        box.classList.add("inline-success");
    } else {
        box.classList.add("inline-error");
    }

    box.style.display = "block";

    setTimeout(() => {
        box.style.display = "none";
    }, 4000);
}

function openTicketById(ticketId) {
    if (!ticketId) {
        return;
    }

    setTimeout(() => {
        clearHighlights();

        const detailsDiv = document.getElementById(`details-${ticketId}`);
        const cardDiv = document.getElementById(`card-${ticketId}`);

        if (detailsDiv) {
            detailsDiv.style.display = "block";
        }

        if (cardDiv) {
            cardDiv.classList.add("highlight-ticket");
            cardDiv.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, 100);
}

function openRequestedTicketFromUrl() {
    if (!openIdFromUrl) {
        return;
    }

    const ticketId = Number(openIdFromUrl);
    currentOpenedTicketId = ticketId;
    openTicketById(ticketId);

    const cleanUrl = window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);

    openIdFromUrl = null;
}

function showEditSuccessMessageFromRedirect() {
    const ticketId = sessionStorage.getItem("editSuccessTicketId");
    const message = sessionStorage.getItem("editSuccessMessage");

    if (!ticketId || !message) {
        return;
    }

    setTimeout(() => {
        openTicketById(Number(ticketId));
        showInlineMessage(Number(ticketId), message, "success");
        sessionStorage.removeItem("editSuccessTicketId");
        sessionStorage.removeItem("editSuccessMessage");
    }, 200);
}

async function loadRequests() {
    try {
        const response = await fetch("http://127.0.0.1:5000/requests");
        requests = await response.json();

        updateDashboardStats();
        setActiveFilterCard(currentFilter);
        renderFilteredRequests();
        
        if (openIdFromUrl) {
            openRequestedTicketFromUrl();
        } 
        else if (currentOpenedTicketId) {
            openTicketById(currentOpenedTicketId);
        }
        
        showEditSuccessMessageFromRedirect();
    } catch (error) {
        console.error("Error fetching requests:", error);
        requestList.innerHTML = "<p>Error loading requests.</p>";
    }
}

function updateDashboardStats() {
    const total = requests.length;
    const newCount = requests.filter(request => request.status === "New").length;
    const inProgressCount = requests.filter(request => request.status === "In Progress").length;
    const resolvedCount = requests.filter(request => request.status === "Resolved").length;
    const deletedCount = requests.filter(request => request.status === "Deleted").length;

    document.getElementById("totalRequests").textContent = total;
    document.getElementById("newRequests").textContent = newCount;
    document.getElementById("inProgressRequests").textContent = inProgressCount;
    document.getElementById("resolvedRequests").textContent = resolvedCount;
    document.getElementById("deletedRequests").textContent = deletedCount;

    createStatusChart(newCount, inProgressCount, resolvedCount, deletedCount);
}

function createStatusChart(newCount, inProgressCount, resolvedCount, deletedCount) {
    const ctx = document.getElementById("statusChart").getContext("2d");

    if (statusChartInstance) {
        statusChartInstance.destroy();
    }

    statusChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["New", "In Progress", "Resolved", "Deleted"],
            datasets: [{
                label: "Tickets",
                data: [newCount, inProgressCount, resolvedCount, deletedCount]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

function getFilteredRequests() {
    let filteredRequests = requests;

    if (currentFilter !== "All") {
        filteredRequests = filteredRequests.filter(request => request.status === currentFilter);
    }

    const searchValue = searchInput ? searchInput.value.toLowerCase().trim() : "";

    if (searchValue !== "") {
        filteredRequests = filteredRequests.filter(request =>
            (request.requestId && request.requestId.toLowerCase().includes(searchValue)) ||
            (request.employeeName && request.employeeName.toLowerCase().includes(searchValue)) ||
            (request.employeeId && request.employeeId.toLowerCase().includes(searchValue)) ||
            (request.issueType && request.issueType.toLowerCase().includes(searchValue))
        );
    }

    return filteredRequests;
}

function getStatusClass(status) {
    if (status === "New") return "status-new";
    if (status === "In Progress") return "status-progress";
    if (status === "Resolved") return "status-resolved";
    if (status === "Deleted") return "status-deleted";
    return "";
}

function displayRequests(data) {
    if (data.length === 0) {
        requestList.innerHTML = "<p>No matching requests found.</p>";
        return;
    }

    let output = "";

    data.forEach(function(request) {
        const statusClass = getStatusClass(request.status);
        const requestId = request.id;

        output += `
            <div class="card request-summary" id="card-${requestId}">
                <p><strong>Request ID:</strong> ${request.requestId ? request.requestId : "N/A"}</p>
                <p><strong>Submitted At:</strong> ${request.submittedAt ? request.submittedAt : "N/A"}</p>
                <p><strong>Status:</strong> <span class="status-text ${statusClass}">${request.status ? request.status : "New"}</span></p>

                <button onclick="toggleDetails(${requestId})">Open Request</button>

                <div id="details-${requestId}" class="request-details" style="display:none;">
                    <div id="msg-${requestId}" class="inline-message"></div>

                    <p><strong>Employee Name:</strong> ${request.employeeName}</p>
                    <p><strong>Employee ID:</strong> ${request.employeeId}</p>
                    <p><strong>Floor:</strong> ${request.floor}</p>
                    <p><strong>Pantry:</strong> ${request.pantry}</p>
                    <p><strong>Issue Type:</strong> ${request.issueType}</p>
                    <p><strong>Description:</strong> ${request.description}</p>
                    <p><strong>Assigned To:</strong> ${request.assignedTo ? request.assignedTo : "Not assigned yet"}</p>
                    <p><strong>Facility Comment / Action Taken:</strong> ${request.comment ? request.comment : "No comments yet"}</p>
                    <p><strong>Delete Reason:</strong> ${request.deleteReason ? request.deleteReason : "Not deleted"}</p>

                    <div class="inline-field">
                        <label for="assignedTo-${requestId}"><strong>Assign To:</strong></label>
                        <input type="text" id="assignedTo-${requestId}" value="${request.assignedTo ? request.assignedTo : ""}" ${request.status === "Deleted" ? "disabled" : ""}>
                    </div>

                    <div class="inline-field">
                        <label for="status-${requestId}"><strong>Change Status:</strong></label>
                        <select id="status-${requestId}" ${request.status === "Deleted" ? "disabled" : ""}>
                            <option value="New" ${request.status === "New" ? "selected" : ""}>New</option>
                            <option value="In Progress" ${request.status === "In Progress" ? "selected" : ""}>In Progress</option>
                            <option value="Resolved" ${request.status === "Resolved" ? "selected" : ""}>Resolved</option>
                            <option value="Deleted" ${request.status === "Deleted" ? "selected" : ""}>Deleted</option>
                        </select>
                    </div>

                    <div class="inline-field">
                        <label for="comment-${requestId}"><strong>Facility Comment / Action Taken:</strong></label>
                        <textarea id="comment-${requestId}" rows="4" ${request.status === "Deleted" ? "disabled" : ""}>${request.comment ? request.comment : ""}</textarea>
                    </div>

                    <div class="action-buttons">
                        <button onclick="updateRequest(${requestId})" ${request.status === "Deleted" ? "disabled" : ""}>Update Request</button>
                        <button onclick="editRequest(${requestId})" ${request.status === "Deleted" ? "disabled" : ""}>Edit</button>
                    </div>

                    <div class="inline-field">
                        <label for="deleteReason-${requestId}"><strong>Reason to Delete:</strong></label>
                        <textarea id="deleteReason-${requestId}" rows="2" ${request.status === "Deleted" ? "disabled" : ""}>${request.deleteReason ? request.deleteReason : ""}</textarea>
                    </div>

                    <div class="action-buttons">
                        <button onclick="deleteRequest(${requestId})" ${request.status === "Deleted" ? "disabled" : ""}>Delete</button>
                    </div>
                </div>
            </div>
        `;
    });

    requestList.innerHTML = output;
}

function renderFilteredRequests() {
    const filteredRequests = getFilteredRequests();
    displayRequests(filteredRequests);

    const label = document.getElementById("filterLabel");
    if (label) {
        label.innerHTML = `<strong>Showing:</strong> ${currentFilter} Tickets`;
    }
}

function setActiveFilterCard(status) {
    document.querySelectorAll(".stats-card").forEach(card => {
        card.classList.remove("active-filter");
    });

    if (status === "All") document.getElementById("filter-all").classList.add("active-filter");
    if (status === "New") document.getElementById("filter-new").classList.add("active-filter");
    if (status === "In Progress") document.getElementById("filter-progress").classList.add("active-filter");
    if (status === "Resolved") document.getElementById("filter-resolved").classList.add("active-filter");
    if (status === "Deleted") document.getElementById("filter-deleted").classList.add("active-filter");
}

function filterRequests(status) {
    currentFilter = status;
    setActiveFilterCard(status);
    renderFilteredRequests();
    
    if (currentOpenedTicketId) {
        openTicketById(currentOpenedTicketId);
    }
    
    requestList.scrollIntoView({ behavior: "smooth" });
}

function searchRequests() {
    renderFilteredRequests();
    
    if (currentOpenedTicketId) {
        openTicketById(currentOpenedTicketId);
    }
}

function resetSearch() {
    if (searchInput) {
        searchInput.value = "";
    }
    currentFilter = "All";
    setActiveFilterCard("All");
    renderFilteredRequests();
}

function toggleDetails(id) {
    const detailsDiv = document.getElementById(`details-${id}`);
    const cardDiv = document.getElementById(`card-${id}`);

    if (detailsDiv.style.display === "none") {
        clearHighlights();
        detailsDiv.style.display = "block";
        cardDiv.classList.add("highlight-ticket");
        currentOpenedTicketId = id;
    } else {
        detailsDiv.style.display = "none";
        cardDiv.classList.remove("highlight-ticket");

        const msgBox = document.getElementById(`msg-${id}`);
        if (msgBox) {
            msgBox.style.display = "none";
        }

        if (currentOpenedTicketId === id) {
            currentOpenedTicketId = null;
        }
    }
}

async function updateRequest(id) {
    const request = requests.find(item => item.id === id);

    const updatedAssignedTo = document.getElementById(`assignedTo-${id}`).value.trim();
    const updatedStatus = document.getElementById(`status-${id}`).value;
    const updatedComment = document.getElementById(`comment-${id}`).value.trim();
    const updatedDeleteReason = document.getElementById(`deleteReason-${id}`).value.trim();

    const updatedData = {
        employeeName: request.employeeName,
        employeeId: request.employeeId,
        floor: request.floor,
        pantry: request.pantry,
        issueType: request.issueType,
        description: request.description,
        status: updatedStatus,
        comment: updatedComment,
        assignedTo: updatedAssignedTo,
        deleteReason: updatedDeleteReason
    };

    try {
        currentOpenedTicketId = id;

        const response = await fetch(`http://127.0.0.1:5000/requests/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedData)
        });
        
        if (response.ok) {
            await loadRequests();
            
            setTimeout(() => {
                openTicketById(id);
                showInlineMessage(id, "Request updated successfully!");
            }, 200);
        
        } else {
            
            setTimeout(() => {
                openTicketById(id);
                showInlineMessage(id, "Error updating request.", "error");
            }, 200);
        }
    } catch (error) {
        console.error("Error:", error);
        
        setTimeout(() => {
            openTicketById(id);
            showInlineMessage(id, "Server error while updating request.", "error");
        }, 200);
    }
}

function editRequest(id) {
    window.location.href = `./create_request.html?id=${id}`;
}

async function deleteRequest(id) {
    const request = requests.find(item => item.id === id);
    const reason = document.getElementById(`deleteReason-${id}`).value.trim();

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

    try {
        currentOpenedTicketId = id;

        const response = await fetch(`http://127.0.0.1:5000/requests/${id}`, {
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
            await loadRequests();
            
            setTimeout(() => {
                openTicketById(id);
                showInlineMessage(id, "Request deleted successfully!");
            }, 200);
        
        } else {
            setTimeout(() => {
                openTicketById(id);
                showInlineMessage(id, "Error deleting request.", "error");
            }, 200);
        }
    } catch (error) {
        console.error("Error:", error);
        
        setTimeout(() => {
            openTicketById(id);
            showInlineMessage(id, "Server error while deleting request.", "error");
        }, 200);
    }
}

loadRequests();