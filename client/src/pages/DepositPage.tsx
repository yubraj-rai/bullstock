import React, { useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios';

const DepositPage = () => {
    const [amount, setAmount] = useState<number>(0);

    const handleToken = async (token: any) => {
        try {
            const response = await axios.post("http://localhost:5000/api/stripe/deposit", {
                token,
                amount,
            });
            console.log("Deposit Success:", response.data);
        } catch (error) {
            console.error("Deposit Error:", error);
        }
    };

    return (
        <div>
            <h2>Deposit Money</h2>
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="Enter amount to deposit"
            />
            <StripeCheckout
                stripeKey="pk_test_51QFejRD5fVcCMFTPPfY3M1VyzywDA0fTQfKOgPsaNcAx5L9m7lpxFZs3uAewxthsSs28vDPn2lpXEcb7EFwFqBLb00sKLbu0LO"
                token={handleToken}
                amount={amount * 100} // Amount in cents
                name="Deposit Money"
            />
        </div>
    );
};

export default DepositPage;
