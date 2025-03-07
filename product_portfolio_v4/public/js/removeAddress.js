export const removeAddress = async (aid) => {
    try {
        const response = await fetch('http://localhost:3000/remove-address', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ aid: aid }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const result = await response.json();
        return result; // This could be a success message or any other response from your server
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        throw error; // Propagate the error to the calling function or handle it accordingly
    }
};
