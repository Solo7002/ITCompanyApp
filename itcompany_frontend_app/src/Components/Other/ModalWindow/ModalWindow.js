import React from 'react';
import './ModalWindow.css';

const ConfirmationModal = ({ 
    show, 
    handleClose, 
    handleConfirm, 
    question, 
    confirmText, 
    cancelText 
}) => {
    return (
        <div>
            <div className={`modal ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Confirm</h5>
                        <button type="button" className="close" onClick={handleClose}>
                            <span>&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <p>{question}</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleClose}>
                            {cancelText}
                        </button>
                        <button type="button" className="btn btn-primary" onClick={handleConfirm}>
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
            <div className="modal-backdrop show" style={{ display: show ? 'block' : 'none' }}></div>
        </div>
    );
};

export default ConfirmationModal;
