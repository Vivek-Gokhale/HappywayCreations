import { showToast } from "./showToast";

export async function subscribe(event) {
    event.preventDefault();

    const emailInput = document.querySelector('.emailInput');
    const email = emailInput.value;

    if (!email) {
        alert('Please enter an email');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        if (response.ok) {
            const result = await response.json();
            if (response.status === 201) {
                
                showToast('subscribed');
                document.querySelector('.emailInput').value = "";
            } else if (response.status === 202) {
                showToast('already-subscribed');
                document.querySelector('.emailInput').value = "";
                
            }
        } else {
            
            showToast('subscribed-failed');
            document.querySelector('.emailInput').value = "";
        }
    } catch (error) {
        console.error('Error subscribing:', error);
        alert('An error occurred while subscribing. Please try again later.');
    }
}
