// Issues are marked with ❌ (problem) and ✅ (how to fix).

interface WalletBalance {
  currency: string;
  amount: number;
  // ❌ Major Issue #1: Missing `blockchain` field
  //    Code below uses balance.blockchain but interface does not define it.
  // ✅ Add: blockchain: Blockchain
}

interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
  // ❌ Minor Issue: Should extend WalletBalance instead of duplicating fields
}

interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  // ❌ Minor Issue: children is never used → unnecessary destructure

  const balances = useWalletBalances();
  const prices = usePrices();

  // ❌ Major Issue #2: Using `any` → removes TypeScript safety
  // ✅ Use a strict `Blockchain` union type instead
  const getPriority = (blockchain: any): number => {
    switch (blockchain) {
      case "Osmosis":
        return 100;
      case "Ethereum":
        return 50;
      case "Arbitrum":
        return 30;
      case "Zilliqa":
        return 20;
      case "Neo":
        return 20;
      default:
        return -99;
    }
  };

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);

        // ❌ Major Issue #3: `lhsPriority` is NOT defined anywhere
        //    This causes an immediate ReferenceError.
        // ✅ Should be: if (balancePriority > -99)
        if (lhsPriority > -99) {
          // ❌ Major Issue #4: Wrong business logic
          //    Keeps balances with amount <= 0
          //    A wallet should show only positive balances.
          // ✅ Should: if (balance.amount > 0)
          if (balance.amount <= 0) return true;
        }

        return false;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);

        if (leftPriority > rightPriority) return -1;
        if (rightPriority > leftPriority) return 1;

        // ❌ Major Issue #5: Comparator missing equality return
        //    MUST return 0 when equal.
        //    Otherwise sorting becomes unstable.
        // ✅ Add: return 0
      });

    // ❌ Minor Issue: useMemo includes `prices` even though memo logic does not use it
    //    Causes unnecessary recomputation.
    // ✅ Should depend only on [balances]
  }, [balances, prices]);

  // ❌ Minor Issue: formattedBalances is computed but never used
  const formattedBalances = sortedBalances.map((balance: WalletBalance) => ({
    ...balance,
    formatted: balance.amount.toFixed(),
  }));

  const rows = sortedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      // ❌ Minor Issue: prices[currency] may be undefined → NaN
      //    Should use: prices[b.currency] ?? 0
      const usdValue = prices[balance.currency] * balance.amount;

      return (
        <WalletRow
          className={classes.row}
          // ❌ Major React Anti-pattern: Using index as key
          //    Causes incorrect re-renders when list order changes
          // ✅ Use: key={`${balance.blockchain}-${balance.currency}`}
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted} // may be undefined because type mismatch
        />
      );
    }
  );

  return <div {...rest}>{rows}</div>;
};
