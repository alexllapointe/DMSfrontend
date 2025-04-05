import SupportChatWidget from "../Components/SupportChatWidget";

const CustomerDashboard = () => {
    const customerId = "64abc..."; // Dynamically set
    const managerId = "64def...";  // Dynamically set

    return (
        <div>
            {/* dashboard layout... */}
            <SupportChatWidget customerId={customerId} managerId={managerId} />
        </div>
    );
};
