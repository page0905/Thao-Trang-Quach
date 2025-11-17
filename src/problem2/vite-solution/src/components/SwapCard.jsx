import { useState, useEffect } from "react";
import axios from "axios";
import TokenSelect from "./TokenSelect";
import AmountInput from "./AmountInput";
import LoadingButton from "./LoadingButton";
import ThemeToggle from "./ThemeToggle";

export default function SwapCard() {
  const [prices, setPrices] = useState({});
  const [from, setFrom] = useState("ETH");
  const [to, setTo] = useState("USDC");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const PRICE_API = "https://interview.switcheo.com/prices.json";

  useEffect(() => {
    axios.get(PRICE_API).then((res) => {
      const dict = {};
      res.data.forEach((i) => {
        dict[i.currency] = i.price;
      });
      setPrices(dict);
    });
  }, []);

  const tokens = Object.keys(prices);

  const handleSwap = async (e) => {
    e.preventDefault();

    if (!amount || Number(amount) <= 0) return alert("Amount must be > 0");
    if (from === to) return alert("Tokens must be different");

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));

    const output = (amount * prices[from]) / prices[to];
    setResult(output.toFixed(6));
    setLoading(false);
  };

  const swapTokens = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  return (
    <div className="swap-card">
      <div className="switch-wrapper">
        <ThemeToggle />
      </div>

      <h2 className="swap-title">Currency Swap</h2>

      <form onSubmit={handleSwap}>
        <TokenSelect
          label="From"
          token={from}
          onChange={setFrom}
          tokens={tokens}
        />

        <div className="swap-divider" onClick={swapTokens}>
          <span className="swap-icon">⇅</span>
        </div>

        <TokenSelect label="To" token={to} onChange={setTo} tokens={tokens} />

        <AmountInput value={amount} onChange={setAmount} />

        <LoadingButton loading={loading} text="Confirm Swap" />
      </form>

      {result && (
        <p className="swap-result">
          You will receive:{" "}
          <strong>
            {result} {to}
          </strong>
        </p>
      )}
    </div>
  );
}
