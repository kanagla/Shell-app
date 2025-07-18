import { act } from "react";
import { loadBookstoreApp, loadOrdersApp } from "./bootstrap";

global.fetch = jest.fn().mockResolvedValue({
  json: () => Promise.resolve({
    orders: { remoteEntry: 'http://localhost:3002/remoteEntry.js' },
    bookstore: { url: 'http://localhost:3000/dashboard' },
  }),
});


describe('Shell App Bootstrap', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = `
      <div id="orders-root"></div>
      <div id="bookstore-root"></div>
    `;
  });

  it('loads remote entry script for Orders app', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    json: () => Promise.resolve({
      orders: { remoteEntry: 'http://localhost:3002/remoteEntry.js' },
    }),
  });

  (global as any).__webpack_init_sharing__ = jest.fn(() => Promise.resolve());
  (global as any).__webpack_share_scopes__ = { default: {} };

  const mockGet = jest.fn(() => Promise.resolve(() => ({ default: () => <div>OrdersApp</div> })));
  (window as any).ordersApp = {
    init: jest.fn(() => Promise.resolve()),
    get: mockGet,
  };

  const appendChildSpy = jest.spyOn(document.head, 'appendChild').mockImplementation((el) => {
  const script = el as HTMLScriptElement;
  setTimeout(() => script.onload?.(new Event('load')), 0);
  return script;
});


  const rootDiv = document.createElement('div');
  rootDiv.id = 'orders-root';
  document.body.appendChild(rootDiv);

  const { loadOrdersApp } = await import('./bootstrap');
  await loadOrdersApp();

  expect(global.fetch).toHaveBeenCalledWith('/manifest.json');
  expect(mockGet).toHaveBeenCalledWith('./CartPage');

  appendChildSpy.mockRestore();
}, 10000); // Increase timeout if needed


  it('loads Bookstore app via iframe and sends message', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({
        bookstore: { url: 'http://localhost:3000/dashboard' },
      }),
    });

    await loadBookstoreApp();

    const iframe = document.getElementById('bookstore-iframe') as HTMLIFrameElement;
    expect(iframe).toBeInTheDocument();
    expect(iframe.src).toBe('http://localhost:3000/dashboard');
  });

  it('logs message from Bookstore', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const payload = { source: 'bookstore', payload: 'Hello from Bookstore' };

    window.dispatchEvent(new MessageEvent('message', { data: payload }));
    expect(consoleSpy).toHaveBeenCalledWith('📨 Message from Bookstore:', payload.payload);
    consoleSpy.mockRestore();
  });

  it('handles remote entry script load failure', async () => {
  const remoteUrl = 'http://localhost:3002/remoteEntry.js';

  const appendChildSpy = jest.spyOn(document.head, 'appendChild').mockImplementation((el) => {
  const script = el as HTMLScriptElement;
  setTimeout(() => script.onerror?.(new Event('error')), 0);
  return script;
});


  const { loadRemoteEntry } = await import('./bootstrap');

  await expect(loadRemoteEntry(remoteUrl, 'ordersApp')).rejects.toThrow(
    `Failed to load remote entry: ${remoteUrl}`
  );

  appendChildSpy.mockRestore();
});

it('logs error if bookstore-root element is missing', async () => {
  document.body.innerHTML = ''; // no bookstore-root

  const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  const { loadBookstoreApp } = await import('./bootstrap');

  await loadBookstoreApp();

  expect(consoleSpy).toHaveBeenCalledWith('bookstore-root element not found');
  consoleSpy.mockRestore();
});
});
