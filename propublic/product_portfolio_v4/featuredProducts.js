let carousel = document.querySelector('.swiper-wrapper');

const loadFeaturedProducts = async () => {
    try {
        const response = await fetch('http://localhost:3000/featured-products');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const products = await response.json();
        
        if (!products || products.length === 0) {
            return false;
        }

        for (let i = 0; i < Math.min(5, products.length); i++) {
            const { product_id, product_image } = products[i];
            console.log(product_image);

            // Create carousel item elements
            let carouselItem = document.createElement('a');
            carouselItem.className = 'swiper-slide';
            carouselItem.href = `singleProductPage.html?id=${product_id}`;

            let img = document.createElement('img');
            img.src = product_image[1]; // Assuming product_image contains an array of image URLs

            carouselItem.appendChild(img);
            carousel.appendChild(carouselItem);

            // Add event listener to handle click
            carouselItem.addEventListener('click', function(event) {
                event.preventDefault();
                window.top.location.href = this.href; // Navigate and close the parent page
            });
        }

        // Reinitialize the Swiper to update with new items
        swiper.update();
    } catch (error) {
        console.error('Failed to load featured products:', error);
    }
};

loadFeaturedProducts();
