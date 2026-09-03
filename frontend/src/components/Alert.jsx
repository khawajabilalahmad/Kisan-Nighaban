import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export default function Alert({ 
  type = 'info', 
  title, 
  message, 
  onClose, 
  autoCloseDelay = 5000 
}) {
  
  useEffect(() => {
    if (autoCloseDelay && onClose) {
      const timer = setTimeout(onClose, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [autoCloseDelay, onClose]);

  const variants = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: <CheckCircle className="text-green-500" size={24} />,
      titleColor: 'text-green-800',
      msgColor: 'text-green-700'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: <XCircle className="text-red-500" size={24} />,
      titleColor: 'text-red-800',
      msgColor: 'text-red-700'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: <AlertTriangle className="text-yellow-500" size={24} />,
      titleColor: 'text-yellow-800',
      msgColor: 'text-yellow-700'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: <Info className="text-blue-500" size={24} />,
      titleColor: 'text-blue-800',
      msgColor: 'text-blue-700'
    }
  };

  const style = variants[type] || variants.info;

  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-[100] animate-in fade-in slide-in-from-top-4 duration-300`}>
      <div className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg ${style.bg} ${style.border} backdrop-blur-md bg-opacity-90`}>
        <div className="flex-shrink-0 mt-0.5">
          {style.icon}
        </div>
        <div className="flex-1">
          {title && <h4 className={`text-sm font-bold mb-1 ${style.titleColor}`}>{title}</h4>}
          <p className={`text-sm ${style.msgColor}`}>{message}</p>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="flex-shrink-0 p-1 rounded-md hover:bg-black/5 transition-colors"
          >
            <X size={16} className={style.titleColor} />
          </button>
        )}
      </div>
    </div>
  );
}
