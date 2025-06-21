interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string; // Added missing property
}

interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
  blockchain: string;
  usdValue: number;
}

interface Props extends BoxProps {
  children?: React.ReactNode;
}

// Move priority logic outside component to avoid recreation
const BLOCKCHAIN_PRIORITIES: Record<string, number> = {
  'Osmosis': 100,
  'Ethereum': 50,
  'Arbitrum': 30,
  'Zilliqa': 20,
  'Neo': 20,
} as const;

const getPriority = (blockchain: string): number => {
  return BLOCKCHAIN_PRIORITIES[blockchain] ?? -99;
};

const WalletPage: React.FC<Props> = ({ children, ...rest }) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  // Memoized priority calculation to avoid repeated function calls
  const balancesWithPriority = useMemo(() => {
    return balances.map(balance => ({
      ...balance,
      priority: getPriority(balance.blockchain)
    }));
  }, [balances]);

  // Fixed filter and sort logic
  const sortedBalances = useMemo(() => {
    return balancesWithPriority
      .filter(balance => {
        // Only include balances with positive amounts and valid priority
        return balance.priority > -99 && balance.amount > 0;
      })
      .sort((lhs, rhs) => {
        // Sort by priority (descending), then by amount (descending)
        if (lhs.priority !== rhs.priority) {
          return rhs.priority - lhs.priority;
        }
        return rhs.amount - lhs.amount;
      });
  }, [balancesWithPriority]);

  // Memoized formatted balances with USD values
  const formattedBalances = useMemo(() => {
    return sortedBalances.map(balance => ({
      ...balance,
      formatted: balance.amount.toFixed(2),
      usdValue: (prices[balance.currency] || 0) * balance.amount
    }));
  }, [sortedBalances, prices]);

  // Memoized rows to prevent unnecessary re-renders
  const rows = useMemo(() => {
    return formattedBalances.map((balance) => (
      <WalletRow 
        className={classes.row}
        key={`${balance.blockchain}-${balance.currency}`} // Better key
        amount={balance.amount}
        usdValue={balance.usdValue}
        formattedAmount={balance.formatted}
      />
    ));
  }, [formattedBalances]);

  return (
    <div {...rest}>
      {rows}
    </div>
  );
};