document.addEventListener('DOMContentLoaded', () => {
const productLink = document.querySelector('.nav-link[id="productsLink"]');
const contactLink = document.querySelector('.nav-link[id="contactLink"]');
const eventLink = document.querySelector('.nav-link[id="eventsLink"]');
const indexLink = document.querySelector('.nav-link[id="indexLink"]');

if (productLink) {
    productLink.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default page reload
        
        fetch('/products') // Ensure this matches your actual route or file
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                document.body.innerHTML = html; // Replace current content with new page
                history.pushState(null, '', '/products'); // Update URL without reload
            })
            .catch(error => console.error('Error loading products page:', error));
    });
}

if (contactLink) {
    contactLink.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default page reload
        
        fetch('/contact') // Ensure this matches your actual route or file
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                document.body.innerHTML = html; // Replace current content with new page
                history.pushState(null, '', '/contact'); // Update URL without reload
            })
            .catch(error => console.error('Error loading products page:', error));
    });
}
if (eventLink) {
    eventLink.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default page reload
        
        fetch('/events') // Ensure this matches your actual route or file
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                document.body.innerHTML = html; // Replace current content with new page
                history.pushState(null, '', '/events'); // Update URL without reload
            })
            .catch(error => console.error('Error loading products page:', error));
    });
}
if (indexLink) {
    indexLink.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default page reload
        
        fetch('/') // Ensure this matches your actual route or file
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                document.body.innerHTML = html; // Replace current content with new page
                history.pushState(null, '', '/'); // Update URL without reload
            })
            .catch(error => console.error('Error loading products page:', error));
    });
}
});