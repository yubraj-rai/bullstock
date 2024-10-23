import { useEffect } from "react";

const HomePage = () => {
    useEffect(() => {
        document.title = 'Home | BullStocks';
    }, []);

    return (
        <h1>Home Page</h1>
    );
};

export default HomePage;
