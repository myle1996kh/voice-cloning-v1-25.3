console.log("Script.js loaded successfully");

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed");

    // Ensure the form exists before adding the event listener
    const voiceForm = document.getElementById('voiceForm');
    if (!voiceForm) {
        console.error("voiceForm element not found!");
        return;
    }

    console.log("voiceForm element found, attaching event listener");

    voiceForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const loadingSpinner = document.getElementById('loadingSpinner');
        const resultMessage = document.getElementById('resultMessage');

        // More specific error messages
        if (!loadingSpinner) {
            console.error("loadingSpinner element not found!");
        }
        if (!resultMessage) {
            console.error("resultMessage element not found!");
        }
        if (!loadingSpinner || !resultMessage) {
            console.error("Required elements not found: loadingSpinner or resultMessage");
            return;
        }

        // Log which button was clicked
        const buttonName = event.submitter ? event.submitter.name : 'unknown';
        console.log(`Form submitted with button: ${buttonName}`);

        // Show loading spinner
        loadingSpinner.style.display = 'block';
        resultMessage.style.display = 'none';

        // Create FormData and add the submitter's name (upload or generate)
        const formData = new FormData(voiceForm);
        if (event.submitter && event.submitter.name) {
            formData.append(event.submitter.name, '');
        }

        // Log FormData contents for debugging
        for (let [key, value] of formData.entries()) {
            console.log(`FormData entry: ${key} = ${value}`);
        }

        fetch('/', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            console.log("Fetch successful, updating result message");
            // Parse the HTML response to extract the message
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const newMessageDiv = doc.querySelector('#resultMessage');
            const newMessageContent = newMessageDiv ? newMessageDiv.innerHTML : '<h3>Error:</h3><p>No result message found in response.</p>';

            // Update the resultMessage div
            resultMessage.innerHTML = newMessageContent;
            resultMessage.style.display = 'block';
            loadingSpinner.style.display = 'none';
        })
        .catch(error => {
            console.error('Fetch error:', error);
            loadingSpinner.style.display = 'none';
            resultMessage.style.display = 'block';
            resultMessage.innerHTML = `<h3>Error:</h3><p>Failed to process request: ${error.message}</p>`;
        });
    });
});