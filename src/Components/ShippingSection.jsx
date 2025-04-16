import React, { useState } from 'react';
import '../Styles/ShippingSection.css';

const ShippingSection = () => {
    const [currentStep, setCurrentStep] = useState(1);

    return (
        <div className="shipping-section">
            {/* Step Indicator */}
            <div className="step-indicator">
                <div className={`step ${currentStep === 1 ? 'active' : ''}`}>1</div>
                <div className="step-line">→</div>
                <div className={`step ${currentStep === 2 ? 'active' : ''}`}>2</div>
                <div className="step-line">→</div>
                <div className={`step ${currentStep === 3 ? 'active' : ''}`}>3</div>
            </div>

            {/* Step 1 - Shipping Details */}
            {currentStep === 1 && (
                <div className="form-section">
                    <h3>Ship From</h3>
                    <input type="text" placeholder="Country or Territory" />
                    <input type="text" placeholder="Full Name or Company Name*" />
                    <input type="text" placeholder="Contact Name" />
                    <input type="email" placeholder="Email*" />
                    <input type="text" placeholder="Phone" />
                    <input type="text" placeholder="Street Address*" />

                    <h3>Ship To</h3>
                    <input type="text" placeholder="Country or Territory" />
                    <input type="text" placeholder="Full Name or Company Name*" />
                    <input type="text" placeholder="Contact Name" />
                    <input type="email" placeholder="Email" />
                    <input type="text" placeholder="Phone" />
                    <input type="text" placeholder="Street Address*" />
                    <div className="button-row">
                        <div /> {/* Empty div to offset Back */}
                        <button onClick={() => setCurrentStep(2)}>Next</button>
                    </div>
                </div>
            )}

            {/* Step 2 - Package Details */}
            {currentStep === 2 && (
                <div className="form-section">
                    <h3>Package Details</h3>
                    <input type="text" placeholder="Package Weight (lbs)" />
                    <input type="text" placeholder="Dimensions (L x W x H)" />
                    <input type="text" placeholder="Contents Description" />

                    <div className="button-row">
                        <button onClick={() => setCurrentStep(1)}>Back</button>
                        <button onClick={() => setCurrentStep(3)}>Next</button>
                    </div>
                </div>
            )}

            {/* Step 3 - Payment */}
            {currentStep === 3 && (
                <div className="form-section">
                    <h3>Payment</h3>
                    <input type="text" placeholder="Cardholder Name" />
                    <input type="text" placeholder="Card Number" />
                    <input type="text" placeholder="Expiration Date (MM/YY)" />
                    <input type="text" placeholder="CVV" />

                    <div className="button-row">
                        <button onClick={() => setCurrentStep(2)}>Back</button>
                        <button onClick={() => alert('Submitted!')}>Submit</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShippingSection;