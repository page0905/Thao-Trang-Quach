// Clean, typed, optimized refactor version of the original code.

type Blockchain = "Osmosis" | "Ethereum" | "Arbitrum" | "Zilliqa" | "Neo";

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: Blockchain;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

interface Props extends BoxProps {}

const PRIORITY: Record<Blockchain, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

const getPriority = (chain: Blockchain) => PRIORITY[chain] ?? -99;

const WalletPage: React.FC<Props> = (props) => {
  const { ...rest } = props;

  const balances = useWalletBalances();
  const prices = usePrices();

  const sortedBalances = useMemo(() => {
    return balances
      .filter((b) => getPriority(b.blockchain) > -99 && b.amount > 0)
      .sort((a, b) => getPriority(b.blockchain) - getPriority(a.blockchain));
  }, [balances]);

  const formattedBalances: FormattedWalletBalance[] = useMemo(() => {
    return sortedBalances.map((b) => ({
      ...b,
      formatted: b.amount.toFixed(2),
    }));
  }, [sortedBalances]);

  return (
    <div {...rest}>
      {formattedBalances.map((b) => {
        const price = prices[b.currency] ?? 0;
        const usdValue = price * b.amount;

        return (
          <WalletRow
            key={`${b.blockchain}-${b.currency}`}
            className={classes.row}
            amount={b.amount}
            usdValue={usdValue}
            formattedAmount={b.formatted}
          />
        );
      })}
    </div>
  );
};

export default WalletPage;
