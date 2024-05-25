import React, { useEffect } from 'react';

const Notification = ({ show, setShow, text, color, icon }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => setShow(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [show, setShow]);

  return (
    <div
      className={`toast position-fixed bottom-0 end-0 m-3 ${show ? 'show' : 'hide'}`}
      style={{ transition: 'opacity 0.5s' }}
    >
      <div className={`toast-header text-white bg-${color}`}>
        <i className={`me-2 ${icon}`}></i>
        <strong className="me-auto">Notification</strong>
        <button type="button" className={`ml-2 mb-1 close bg-${color} text-white`} onClick={() => setShow(false)} style={{border: "none"}}>
          <span>&times;</span>
        </button>
      </div>
      <div className="toast-body">{text}</div>
    </div>
  );
};

export default Notification;