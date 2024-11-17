import { useEffect } from "react";
import { OwnedStock } from "../_generated_/graphql";
import { useSocket } from "../contexts/useSocket";
import PriceChange from "../components/PriceChange";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { useReactiveVar } from "@apollo/client";
import { currentPricesVar, userPortfolioVar } from "../cache/cacheConfig";

interface PortfolioTableRowProps {
  stock: OwnedStock;
  navigate: NavigateFunction;
}

const PortfolioTableRow = ({
  stock,
  navigate,
  ...rest
}: PortfolioTableRowProps) => {
  const socket = useSocket();
  const currentPrices = useReactiveVar(currentPricesVar);

  const currentPrice = currentPrices[stock.ticker] ?? stock.price;

  useEffect(() => {
    if (socket) {
      socket.on(stock.ticker, (priceData: { price: number }) => {
        currentPricesVar({
          ...currentPricesVar(),
          [stock.ticker]: priceData.price,
        });
      });

      return () => {
        socket.off(stock.ticker);
      };
    }
  }, [socket, stock.ticker]);

  return (
    <tr
      {...rest}
      className="bg-white dark:bg-darkCard hover:bg-gray-100 dark:hover:bg-zinc-700 cursor-pointer"
      onClick={() => navigate("/stock/" + stock.ticker)}
    >
      <td className="px-5 py-3 border-b border-gray-200 dark:border-darkField text-sm font-medium text-center">
        <img
          className="w-16 h-12 object-contain mx-auto"
          src={stock.logo}
          alt={`${stock.name} logo`}
        />
      </td>
      <td className="px-5 py-3 border-b border-gray-200 dark:border-darkField text-sm font-medium text-center">
        <p className="text-gray-700 dark:text-white whitespace-no-wrap h-fit font-light">
          {stock.name}
        </p>
        <p className="text-gray-900 dark:text-white whitespace-no-wrap mt-1 font-semibold">
          {stock.ticker}
        </p>
      </td>
      <td className="px-5 py-3 border-b border-gray-200 dark:border-darkField text-sm font-medium text-center">
        <p className="text-gray-900 dark:text-white whitespace-no-wrap">
          {stock.shares}
        </p>
      </td>
      <td className="px-5 py-3 border-b border-gray-200 dark:border-darkField text-sm font-medium text-center">
        <PriceChange
          id={`${stock.ticker}-currentPrice`}
          currentPrice={currentPrice}
          prevPrice={stock.price}
          currency={stock.currency}
          ticker={stock.ticker}
          className="text-center px-4 mx-auto w-fit"
        />
      </td>
      <td className="px-5 py-3 border-b border-gray-200 dark:border-darkField text-sm font-medium text-center">
        <p className="text-gray-900 dark:text-white whitespace-no-wrap">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          }).format(stock.initialInvestment)}
        </p>
      </td>
      <td className="px-5 py-3 border-b border-gray-200 dark:border-darkField text-sm font-medium text-center">
        <PriceChange
          id={`${stock.ticker}-investmentValue`}
          currentPrice={currentPrice * stock.shares}
          prevPrice={stock.initialInvestment}
          currency={stock.currency}
          ticker={stock.ticker}
          className="text-center px-4 mx-auto w-fit"
        />
      </td>
    </tr>
  );
};

const PortfolioPage = () => {
  const navigate = useNavigate();
  const ownedStocks = useReactiveVar(userPortfolioVar); // Access portfolio from reactive variable

  useEffect(() => {
    document.title = "Portfolio | Bullstock";
  }, []);

  return (
    <div className="dark:bg-darkBg pb-10 min-h-screen w-full h-full flex flex-col items-center text-center">
      <div className="mt-32 text-3xl font-medium dark:text-white">
        My Portfolio
      </div>
      <div className="mt-10 w-full flex justify-center">
        <div className="container overflow-x-auto">
          <div className="shadow dark:bg-darkField bg-gray-100 rounded-2xl p-3">
            <table className="leading-normal w-full h-full">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="px-5 py-3 border-b border-gray-200 dark:border-darkField text-gray-800 dark:text-white text-center text-sm uppercase font-normal"
                  >
                    Logo
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 border-b border-gray-200 dark:border-darkField text-gray-800 dark:text-white text-center text-sm uppercase font-normal"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 border-b border-gray-200 dark:border-darkField text-gray-800 dark:text-white text-center text-sm uppercase font-normal"
                  >
                    Shares
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 border-b border-gray-200 dark:border-gray-800 text-gray-800 dark:text-white text-center text-sm uppercase font-normal"
                  >
                    Current Price
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 border-b border-gray-200 dark:border-darkField text-gray-800 dark:text-white text-center text-sm uppercase font-normal"
                  >
                    Invested
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 border-b border-gray-200 dark:border-gray-800 text-gray-800 dark:text-white text-center text-sm uppercase font-normal"
                  >
                    Current Investment Value
                  </th>
                </tr>
              </thead>
              <tbody>
                {ownedStocks.map((stock) => (
                  <PortfolioTableRow
                    stock={stock}
                    navigate={navigate}
                    key={stock.ticker}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;
