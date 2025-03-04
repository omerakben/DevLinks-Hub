import Image from 'next/image';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

function Toast({ message, type, duration = 3000, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onClose();
      }, 300); // Wait for fade-out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return {
          bgColor: 'bg-green-100 dark:bg-green-900/20',
          textColor: 'text-green-600 dark:text-green-400',
          icon: '/icons/check-circle.svg',
        };
      case 'error':
        return {
          bgColor: 'bg-red-100 dark:bg-red-900/20',
          textColor: 'text-red-600 dark:text-red-400',
          icon: '/icons/alert-circle.svg',
        };
      case 'warning':
        return {
          bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
          textColor: 'text-yellow-600 dark:text-yellow-400',
          icon: '/icons/alert-triangle.svg',
        };
      case 'info':
      default:
        return {
          bgColor: 'bg-blue-100 dark:bg-blue-900/20',
          textColor: 'text-blue-600 dark:text-blue-400',
          icon: '/icons/info.svg',
        };
    }
  };

  const { bgColor, textColor, icon } = getToastStyles();

  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 ${bgColor} ${textColor} p-4 rounded-lg shadow-md transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <Image src={icon} alt={type} width={20} height={20} />
      <p className="paragraph-medium">{message}</p>
      <button
        type="button"
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        className="ml-2 hover:text-dark300_light700 transition-colors"
      >
        <Image src="/icons/x.svg" alt="Close" width={16} height={16} />
      </button>
    </div>
  );
}

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  duration: PropTypes.number,
  onClose: PropTypes.func.isRequired,
};

Toast.defaultProps = {
  type: 'info',
  duration: 3000,
};

export default Toast;
