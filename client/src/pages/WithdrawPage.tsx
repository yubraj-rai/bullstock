import  { useState } from 'react';
import axios from 'axios';

const WithdrawPage = () => {
    const [amount, setAmount] = useState<number>(0);

    const handleWithdraw = async () => {
        try {
            const response = await axios.post("http://localhost:5000/api/stripe/withdraw", {
                amount,
                userId: "yourUserId", // Replace with the actual user ID
            });
            console.log("Withdrawal Success:", response.data);
        } catch (error) {
            console.error("Withdrawal Error:", error);
        }
    };

    return (
        <div>
            <h2>Withdraw Money</h2>
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="Enter amount to withdraw"
            />
            <button onClick={handleWithdraw}>Withdraw</button>
        </div>
    );
};

export default WithdrawPage;
