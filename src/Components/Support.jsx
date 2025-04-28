import React from 'react';
import '../Styles/Support.css';

const Support = () => {
    return (
        <div className="support-container">
            <div className="support-box">
                <h2>Contact Support</h2>
                <p>
                    For any support inquiries, please reach out to us at:
                </p>
                <p className="support-email">
                    <a href="mailto:dms@support.com">dms@support.com</a>
                </p>
            </div>
        </div>
    );
};

export default Support;