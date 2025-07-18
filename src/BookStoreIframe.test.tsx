import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BookstoreIframe from './components/BookStoreIframe';

describe('BookstoreIframe', () => {
  const mockUser = {
    name: 'Surya',
    role: 'admin',
  };

  beforeEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  it('renders the iframe with correct attributes', () => {
    render(<BookstoreIframe user={mockUser} />);
    const iframe = screen.getByTitle('Bookstore Iframe');

    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', 'http://localhost:3000/dashboard');
    expect(iframe).toHaveAttribute('id', 'bookstore-iframe');
  });

  it('sends postMessage with user data after iframe loads', async () => {
    render(<BookstoreIframe user={mockUser} />);
    const iframe = screen.getByTitle('Bookstore Iframe') as HTMLIFrameElement;

    const postMessageMock = jest.fn();

    // Simulate iframe.contentWindow
    Object.defineProperty(iframe, 'contentWindow', {
      value: { postMessage: postMessageMock },
      writable: true,
    });

    fireEvent.load(iframe); // 👈 triggers onLoad

    await waitFor(() => {
      expect(postMessageMock).toHaveBeenCalledWith(
        {
          source: 'shell',
          payload: mockUser,
        },
        'http://localhost:3000'
      );
    });
  });
});
