import React from 'react';
import { Helmet } from 'react-helmet';

const Bootstrap452Helmet = ({ children }) => {
    return (
        <div>
            <Helmet>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" />
            </Helmet>
            {children}
        </div>
    ) ;
}

const Bootstrap530Helmet = ({ children }) => {
    return (
        <div>
            <Helmet>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
            </Helmet>
            {children}
        </div>
    ) ;
}

export { Bootstrap452Helmet, Bootstrap530Helmet };
