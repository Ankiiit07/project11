import React from 'react';
import { Link } from 'react-router-dom';

const ThankYouPage = () => {
    return (
        <div>
            <h1>Thank You!</h1>
            <p>Your submission has been received.</p>
            <Link to='/'>Go back to Home</Link>
        </div>
    );
};

export default ThankYouPage;