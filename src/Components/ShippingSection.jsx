import React, { useState } from 'react';
import '../Styles/ShippingSection.css';
import Shipping from './Shipping';
import PaymentPage from './PaymentPage';

const ShippingSection = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedOption, setSelectedOption] = useState(null);
    const [shippingDetails, setShippingDetails] = useState({
        pickupAddress: '',
        destinationAddress: ''
    });

    const deliveryTypeMap = {
        "fedex_ground": "fedex_standard",
        "fedex_express": "fedex_rapid",
        "fedex_overnight": "fedex_sdd",
        "ups_ground": "fedex_standard",
        "ups_2nd_day_air": "fedex_rapid",
        "ups_next_day_air": "fedex_sdd",
        "usps_ground": "usps_standard",
        "usps_2nd_day_air": "usps_express",
        "usps_next_day_air": "usps_express"
    };

    return (
        <div className="shipping-section">
            {/* Step Indicator */}
            <div className="step-indicator">
                <div className={`step ${currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : ''}`}>1</div>
                <div className="step-line">→</div>
                <div className={`step ${currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : ''}`}>2</div>
                <div className="step-line">→</div>
                <div className={`step ${currentStep === 3 ? 'active' : currentStep > 3 ? 'completed' : ''}`}>3</div>
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

                    <input
                        type="text"
                        placeholder="From: Street Address*"
                        onChange={(e) => setShippingDetails(prev => ({ ...prev, pickupAddress: e.target.value }))}
                    />
                    <input
                        type="text"
                        placeholder="To: Street Address*"
                        onChange={(e) => setShippingDetails(prev => ({ ...prev, destinationAddress: e.target.value }))}
                    />

                    <div className="button-row">
                        <button onClick={() => setCurrentStep(1)}>Back</button>
                        <button onClick={() => setCurrentStep(3)}>Next</button>
                    </div>
                </div>
            )}

            {/* Step 3 - PaymentPage */}
            {currentStep === 3 && selectedOption && (
                <PaymentPage order={{
                    customerid: 2, // hardcoded
                    pickupaddress: shippingDetails.pickupAddress || selectedOption.from,
                    destinationaddress: shippingDetails.destinationAddress || selectedOption.to,
                    itemsize: selectedOption.packages.toString(),
                    weight: parseFloat(selectedOption.weight),
                    totalPrice: parseFloat(selectedOption.price),
                    deliverytype: deliveryTypeMap[
                        `${selectedOption.provider.toLowerCase()}_${selectedOption.serviceType.toLowerCase().replace(/\s/g, '_')}`
                    ]
                }} />
            )}
        </div>
    );
};

export default ShippingSection;