import { loadBookstoreApp } from './bootstrap';
import { act } from '@testing-library/react';

describe('bootstrap.tsx > iframe messaging (lines 74–86)', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    document.body.innerHTML = '<div id="bookstore-root"></div>';
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('sends postMessage to iframe on load and after delays', async () => {
    // Mock fetch to return manifest
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({
        bookstore: { url: 'http://localhost:3000/dashboard' },
      }),
    });

    const postMessageMock = jest.fn();
    let capturedIframe: HTMLIFrameElement | null = null;

    // Spy on document.createElement BEFORE loadBookstoreApp runs
    const originalCreateElement = document.createElement.bind(document);
    jest.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      const el = originalCreateElement(tagName);
      if (tagName === 'iframe') {
        capturedIframe = el as HTMLIFrameElement;
        Object.defineProperty(capturedIframe, 'contentWindow', {
          value: { postMessage: postMessageMock } as unknown as Window,
          writable: true,
        });
      }
      return el;
    });

    await loadBookstoreApp();

    // ✅ Ensure iframe was created
    expect(capturedIframe).not.toBeNull();

    // ✅ Simulate iframe load
    act(() => {
      capturedIframe!.onload?.(new Event('load'));
      jest.advanceTimersByTime(1000);
    });

    // ✅ Assert postMessage was called 3 times
    expect(postMessageMock).toHaveBeenCalledTimes(3);
    expect(postMessageMock).toHaveBeenCalledWith(
      { source: 'shell', payload: { name: 'Surya', role: 'admin' } },
      'http://localhost:3000'
    );
  });
});
