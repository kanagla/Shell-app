// import React, { useEffect, useRef } from 'react';

// export default function BookstoreIframe({ user }: { user: any }) {
//   const iframeRef = useRef<HTMLIFrameElement>(null);

//   useEffect(() => {
//     const sendUser = () => {
//       if (!iframeRef.current) return;

//       // Wait for iframe to load and send the message
//       setTimeout(() => {
//         iframeRef.current?.contentWindow?.postMessage(
//           {
//             type: 'SET_USER',
//             payload: user,
//           },
//           '*' // Temporarily use '*' to avoid origin mismatch issues
//         );
//       }, 1000);
//     };

//     iframeRef.current?.addEventListener('load', sendUser);
//     return () => {
//       iframeRef.current?.removeEventListener('load', sendUser);
//     };
//   }, [user]);

//   return (
//     <iframe
//       ref={iframeRef}
//       id="bookstore-iframe"
//       src="http://localhost:3000/dashboard"
//       width="50%"
//       height="600"
//       style={{ border: '1px solid #ccc' }}
//       title="Bookstore Iframe"
//     />
//   );
// }


import React from 'react';

interface BookstoreIframeProps {
  user: { name: string; role: string };
}

const BookstoreIframe: React.FC<BookstoreIframeProps> = ({ user }) => {
  const handleIframeLoad = () => {
    const iframe = document.getElementById('bookstore-iframe') as HTMLIFrameElement;
    if (!iframe || !iframe.contentWindow) return;

    iframe.contentWindow.postMessage(
      {
        source: 'shell',
        payload: user,
      },
      'http://localhost:3000'
    );
  };

  return (
    <iframe
      id="bookstore-iframe"
      src="http://localhost:3000/dashboard"
      title="Bookstore Iframe"
      width="100%"
      height="600"
      onLoad={handleIframeLoad} // ✅ React-compatible event
    />
  );
};

export default BookstoreIframe;
