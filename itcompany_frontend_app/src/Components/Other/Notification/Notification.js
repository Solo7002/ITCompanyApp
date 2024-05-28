import React, { useEffect } from 'react';

import './Notification.css'

const Notification = (props) => {
  useEffect(() => {
    if (props.show) {
      const timer = setTimeout(() => props.setShow(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [props.show, props.setShow]);

  return (
    <div
      className={`toast position-fixed m-3 ${props.show ? 'show' : 'hide'}`}
      style={{ transition: 'opacity 0.5s', zIndex: "100"}}
      id={`corner${props.corner||"4"}`}
    >
      <div className={`toast-header text-white bg-${props.color}`} style={{display: 'flex', justifyContent: 'space-between'}}>
        <div>
          <i className={`me-2 ${props.icon} mr-3`}></i>
          <strong className="me-auto">Notification</strong>
        </div>
        <button type="button" className={`ml-2 mb-1 close bg-${props.color} text-white`}onClick={() => props.setShow(false)} style={{border: "none", textAlign: "right"}}>
          <span>&times;</span>
        </button>
      </div>
      <div className="toast-body">{props.text}</div>
    </div>
  );
};

export default Notification;