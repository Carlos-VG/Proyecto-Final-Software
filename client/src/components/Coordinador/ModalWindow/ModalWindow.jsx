import React from 'react';
import './ModalWindow.css';

const ModalWindow = ({ isOpen, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-window">
                <div className="modal-content">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default ModalWindow;