import React from 'react'

const ErrorBanner = ({ message, onClose }) => {
    if (!message) return null;

    return (
        <div
            style={{
                backgroundColor: '#f8d7da',
                color: '#721c24',
                padding: '10px 15px',
                border: '1px solidrgb(252, 3, 28)',
                borderRadius: '3px',
                position: 'relative',
                marginBottom: '15px',
            }}
        >
            <span>{message}</span>
            <button
                onClick={onClose}
                style={{
                    position: 'absolute',
                    top: '8px',
                    right: '10px',
                    background: 'none',
                    border: 'none',
                    fontWeight: 'bold',
                    color: '#721c24',
                    cursor: 'pointer',
                }}
            >
                ×
            </button>
        </div>
    );
};
export default ErrorBanner