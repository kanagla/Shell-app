// src/App.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

// Mock React.lazy imported component
jest.mock('ordersApp/CartPage', () => () => <div>Served from orders-app via Module Federation.</div>);

describe('App.tsx', () => {
  beforeEach(() => {
    document.body.innerHTML = '<iframe id="bookstore-iframe"></iframe>';
    jest.clearAllMocks();
  });

  it('renders Shell App header and lazy CartPage', async () => {
    render(<App />);

    expect(screen.getByText('Shell App')).toBeInTheDocument();
    expect(screen.getByText('📦 Loaded from Bookstore App (via iframe)')).toBeInTheDocument();

    // Wait for lazy loaded component
    await waitFor(() => expect(screen.getByText('Served from orders-app via Module Federation.')).toBeInTheDocument());
  });

  it('sends postMessage to iframe on load', async () => {
    const postMessageMock = jest.fn();
    const iframe = document.getElementById('bookstore-iframe') as HTMLIFrameElement;

    Object.defineProperty(iframe, 'contentWindow', {
      value: { postMessage: postMessageMock },
    });

    render(<App />);

    // Dispatch load event on iframe manually
    iframe.dispatchEvent(new Event('load'));

    await new Promise((res) => setTimeout(res, 600)); // wait for message

    expect(postMessageMock).toHaveBeenCalledWith(
      {
        type: 'SET_USER',
        payload: {
          name: 'Surya',
          role: 'admin',
        },
      },
      'http://localhost:3000'
    );
  });
});
