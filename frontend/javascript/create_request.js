const form = document.getElementById("requestForm");

form.addEventListener("submit", function(event) {

    event.preventDefault();

    const name = document.getElementById("employeeName").value;
    const floor = document.getElementById("floor").value;
    const pantry = document.getElementById("pantry").value;
    const issue = document.getElementById("issueType").value;
    const description = document.getElementById("description").value;

    alert(
        "Employee Name: " + name +
        "\nFloor: " + floor +
        "\nPantry: " + pantry +
        "\nIssue Type: " + issue +
        "\nDescription: " + description
    );

});