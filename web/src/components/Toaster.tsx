import { Toaster as ToasterNative } from 'react-hot-toast';


export function Toaster() {
  return (
    <ToasterNative
      toastOptions={{
        style: {
          maxWidth: '1000px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: '600',
          color: 'white',
          backgroundColor: '#2a2634',
        },
        success: {
          iconTheme: {
            primary: '#6d28d9',
            secondary: 'white',
          },
        },
        error: {
          iconTheme: {
            primary: '#e73f5d',
            secondary: 'white',
          },
        },
      }}
    />
  );
}
