import React from 'react';
import ReactDOM from 'react-dom/client';

// Load a remoteEntry file dynamically (for Module Federation)
function loadRemoteEntry(remoteUrl: string, scope: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = remoteUrl;
    script.type = 'text/javascript';
    script.async = true;

    script.onload = () => {
      console.log(`Remote entry loaded: ${remoteUrl}`);
      resolve();
    };
    script.onerror = () => {
      console.error(`Failed to load remote entry: ${remoteUrl}`);
      reject(new Error(`Failed to load remote entry: ${remoteUrl}`));
    };

    document.head.appendChild(script);
  });
}

// Load Orders app (Module Federation)
async function loadOrdersApp() {
  try {
    const manifestRes = await fetch('/manifest.json');
    const manifest = await manifestRes.json();
    const remoteUrl = manifest.orders.remoteEntry;

    await __webpack_init_sharing__('default');
    await loadRemoteEntry(remoteUrl, 'ordersApp');

    const container = (window as any).ordersApp;
    await container.init(__webpack_share_scopes__.default);

    const factory = await container.get('./CartPage');
    const OrdersApp = factory().default;

    const root = ReactDOM.createRoot(document.getElementById('orders-root')!);
    root.render(<OrdersApp />);
  } catch (err) {
    console.error('❌ Failed to load Orders App:', err);
  }
}

// Load Bookstore app (via iframe)
async function loadBookstoreApp() {
  try {
    const manifestRes = await fetch('/manifest.json');
    const manifest = await manifestRes.json();
    const bookstoreUrl = manifest.bookstore.url; // e.g., http://localhost:3000/dashboard

    const iframe = document.createElement('iframe');
    iframe.src = bookstoreUrl;
    iframe.style.width = '80%';
    iframe.style.height = '80vh';
    iframe.style.border = 'none';
    iframe.title = 'Bookstore App';
    iframe.id = 'bookstore-iframe';

    // Append iframe to container
    const container = document.getElementById('bookstore-root');
    if (container) {
      container.innerHTML = ''; 
      container.appendChild(iframe);
    } else {
      console.error('bookstore-root element not found');
      return;
    }

 iframe.onload = (ev: Event) => {
  const payload = {
    source: 'shell',
    payload: { name: 'Surya', role: 'admin' },
  };

  const send = () => {
    console.log('📤 Sending message to Bookstore...');
    iframe.contentWindow?.postMessage(payload, 'http://localhost:3000');
  };

  send();
  setTimeout(send, 300);
  setTimeout(send, 1000);
};

  } catch (err) {
    console.error('Failed to load Bookstore App:', err);
  }
}


// Listen for messages from iframe
window.addEventListener('message', (event) => {
  console.log('eventData',event.data);
  if (event.data?.source === 'bookstore') {
    console.log('📨 Message from Bookstore:', event.data.payload);
  }
});

// Call both loaders
loadOrdersApp();
loadBookstoreApp();

export { loadOrdersApp, loadBookstoreApp };
export { loadRemoteEntry };
