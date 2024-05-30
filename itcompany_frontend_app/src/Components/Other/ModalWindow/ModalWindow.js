import React from 'react';
import './ModalWindow.css';

const ConfirmationModal = (props) => {
    return (
        <div>
            <div className={`modal ${props.show ? 'show' : ''}`} style={{ display: props.show ? 'block' : 'none' }}>
            <div className="modal-dialog modal-dialog-centered" style={{opacity: props.show ? '1' : '0'}}>
                <div className="modal-content">
                    <div className="modal-header" style={{backgroundColor: `${props.headerBackgroundColor?props.headerBackgroundColor:"white"}`}}>
                        <h5 className="modal-title">{props.title}</h5>
                        <button type="button" className="close" onClick={props.handleClose}>
                            <span>&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <p>{props.children}</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={props.handleClose}>
                            {props.cancelText}
                        </button>
                        {console.log("props.confirmBtnColor: ", props.confirmBtnColor)}
                        <button type="button" className={`btn btn-${props.confirmBtnColor?props.confirmBtnColor:"primary"}`} onClick={props.handleConfirm}>
                            {props.confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div className={`modal-backdrop ${props.show ? 'show' : ''}`}></div>
        </div>
    );
};

export default ConfirmationModal;