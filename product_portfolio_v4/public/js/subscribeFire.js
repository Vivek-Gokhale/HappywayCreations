import { subscribe } from './subscribe.js';

      document.addEventListener('DOMContentLoaded', () => {
          const subscribeButton = document.querySelector('.subscribe');
          subscribeButton.addEventListener('click', (event) => subscribe(event));
      });