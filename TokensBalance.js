// Start of Style component
const cssFont = fetch(
  "https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700;800"
).body;

const Root = styled.div`
  ${cssFont}
  padding: 16px;
  width: 420px;
  height: 100%;
  font-family: Poppins, sans-serif;
  border-radius: 12px;
  border: 1.5px solid #e6e6e6;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.25);
  margin: 16px auto;

  p {
    font-size: 14px;
    margin: 0;
  }
`;

const Account = styled.div`
  .account-address {
    font-size: 24px;
    font-weight: 800;
    margin-bottom: 16px;
  }

  .token-info-wrapper {
    font-size: 16px;
    margin-bottom: 12px;
    display: flex;
    justify-content: space-between;
    color: #585858;
  }
`;

const FungibleToken = styled.div`
  display: flex;
  padding: 12px 8px;
  border-top: 1px solid #e6e6e6;
  align-items: center;
  cursor: default;

  &:hover {
    background: #f5f5f5;
  }

  .token-icon {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    margin-right: 12px;
  }

  .token-info {
    flex: 1;
  }

  .token-info-name {
    font-weight: 600;
  }

  .token-info-usd-price {
    color: #585858;
  }

  .token-balance {
    text-align: right;
  }

  .token-balance-usd {
    color: #585858;
  }
`;
// End of style

const accountId = props.accountId || context.accountId;

if (!accountId) return <p>Please provide account id as props</p>;

const data = fetch(
  `https://api.kitwallet.app/account/${accountId}/likelyTokensFromBlock?fromBlockTimestamp=0`
).body;
const tokenPrice = fetch("https://indexer.ref.finance/list-token-price").body;

const contractData = data.list
  .map((contract) => {
    const ftMetadata = Near.view(contract, "ft_metadata", `{}`);
    const ftBalance = Near.view(contract, "ft_balance_of", {
      account_id: accountId,
    });

    if (!ftMetadata || !ftBalance) return null;

    if (ftBalance === "0") return null;

    const parsedBalance = Big(ftBalance)
      .div(Big(10).pow(ftMetadata.decimals))
      .toFixed(5);

    const usdPrice = JSON.parse(tokenPrice)[contract].price;
    const balanceInUsd = parseFloat(parsedBalance) * parseFloat(usdPrice);

    return {
      ...ftMetadata,
      balance: parsedBalance,
      usdPrice,
      balanceInUsd: balanceInUsd ? balanceInUsd.toFixed(2) : null,
    };
  })
  .filter((item) => item);

return (
  <Root>
    <Account>
      <p class="account-address">{accountId}</p>
      <div class="token-info-wrapper">
        <p>My Assets</p>
        <p>Token balance</p>
      </div>
    </Account>
    {contractData?.map((item) => (
      <FungibleToken>
        <div class="token-icon">
          {item.icon && <img class="token-icon" src={item.icon} />}
        </div>
        <div class="token-info">
          <p class="token-info-name">{item.name}</p>
          <p class="token-info-usd-price">
            {item.usdPrice ? `$${item.usdPrice}` : "Price unavailable"}
          </p>
        </div>
        <div class="token-balance">
          <p>
            {item.balance} {item.symbol}
          </p>
          <p class="token-balance-usd">
            {item.balanceInUsd ? `≈ ${item.balanceInUsd} USD` : "-"}
          </p>
        </div>
      </FungibleToken>
    ))}
  </Root>
);
