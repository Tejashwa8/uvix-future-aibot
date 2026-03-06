import { useEffect } from 'react';

interface UvixToastProps {
  message: string;
  onDone: () => void;
}

const UvixToast = ({ message, onDone }: UvixToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onDone, 2400);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div
      className="fixed z-[200]"
      style={{
        bottom: 20,
        right: 20,
        background: '#1e1230',
        border: '1px solid #a855f7',
        borderRadius: 10,
        padding: '10px 16px',
        fontSize: 13,
        color: '#d8b4fe',
        animation: 'toastIn .3s ease',
        boxShadow: '0 4px 18px rgba(168,85,247,.25)',
      }}
    >
      {message}
    </div>
  );
};

export default UvixToast;
