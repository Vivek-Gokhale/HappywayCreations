let feedbackType = 0; // 0 for dislike, 1 for like

document.getElementById('likeButton').addEventListener('click', function() {
    feedbackType = 1;
    $('#feedbackModal').modal('show');
});

document.getElementById('dislikeButton').addEventListener('click', function() {
    feedbackType = 0;
    $('#feedbackModal').modal('show');
});

document.getElementById('feedbackForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const userEmail = document.getElementById('userEmail').value;
    const userMessage = document.getElementById('userMessage').value;

    // Prepare data to send
    const feedbackData = {
        user_email: userEmail,
        feedback: userMessage,
        type: feedbackType
    };
   

    // Send data to the server
    fetch('http://localhost:3000/submit-feedback', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(feedbackData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        $('#feedbackModal').modal('hide');
            document.getElementById('feedbackForm').reset(); // Reset the form
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});
