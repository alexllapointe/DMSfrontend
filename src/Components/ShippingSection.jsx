// ShippingSection.jsx
import React, { useState } from 'react';
import '../Styles/ShippingSection.css';
import Shipping from './Shipping';

const ShippingSection = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedOption, setSelectedOption] = useState(null);

    return (
        <div className="shipping-section">
            {/* Step Indicator */}
            <div className="step-indicator">
                <div className={`step ${currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : ''}`}>1</div>
                <div className="step-line">→</div>
                <div className={`step ${currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : ''}`}>2</div>
                <div className="step-line">→</div>
                <div className={`step ${currentStep === 3 ? 'active' : currentStep > 3 ? 'completed' : ''}`}>3</div>
                <div className="step-line">→</div>
                <div className={`step ${currentStep === 4 ? 'active' : ''}`}>4</div>
            </div>

            {/* Step 1 - Shipping (Search & Select) */}
            {currentStep === 1 && (
                <Shipping
                    onOptionSelect={(option) => {
                        setSelectedOption(option);
                        setCurrentStep(2);
                    }}
                />
            )}

            {/* Step 2 - Shipping Details */}
            {currentStep === 2 && selectedOption && (
                <div className="form-section">
                    <h3>Shipping Details</h3>
                    <input type="text" placeholder="From: Country or Territory" defaultValue={selectedOption.from} />
                    <input type="text" placeholder="From: Contact Name" />
                    <input type="email" placeholder="From: Email*" />
                    <input type="text" placeholder="From: Phone" />
                    <input type="text" placeholder="From: Street Address*" />

                    <input type="text" placeholder="To: Country or Territory" defaultValue={selectedOption.to} />
                    <input type="text" placeholder="To: Contact Name" />
                    <input type="email" placeholder="To: Email" />
                    <input type="text" placeholder="To: Phone" />
                    <input type="text" placeholder="To: Street Address*" />
                    <div className="button-row">
                        <button onClick={() => setCurrentStep(1)}>Back</button>
                        <button onClick={() => setCurrentStep(3)}>Next</button>
                    </div>
                </div>
            )}

            {/* Step 3 - Package Details */}
            {currentStep === 3 && selectedOption && (
                <div className="form-section">
                    <h3>Package Details</h3>
                    <input type="text" placeholder="Package Weight (lbs)" defaultValue={selectedOption.weight} />
                    <input type="text" placeholder="Dimensions (L x W x H)" />
                    <input type="text" placeholder="Contents Description" />
                    <div className="button-row">
                        <button onClick={() => setCurrentStep(2)}>Back</button>
                        <button onClick={() => setCurrentStep(4)}>Next</button>
                    </div>
                </div>
            )}

            {/* Step 4 - Payment */}
            {currentStep === 4 && selectedOption && (
                <div className="form-section">
                    <h3>Payment</h3>
                    <input type="text" placeholder="Cardholder Name" />
                    <input type="text" placeholder="Card Number" />
                    <input type="text" placeholder="Expiration Date (MM/YY)" />
                    <input type="text" placeholder="CVV" />
                    <div className="button-row">
                        <button onClick={() => setCurrentStep(3)}>Back</button>
                        <button onClick={() => alert('Submitted!')}>Submit</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShippingSection;
