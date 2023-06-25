State.init({
  activeTokens: null,
  inputAmount: "",
  inputReceiver: "",
  root: null,
  errorTransfer: null,
});

// Start of Style component
const cssFont = fetch(
  "https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700;800"
).body;

const _root = styled.div`
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

if (!state.root) {
  State.update({ root: _root });
}

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
  cursor: pointer;

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

const SendToken = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: auto;
  padding: 8px;
  position: relative;

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"] {
    -moz-appearance: textfield; /* Firefox */
  }

  .title-send-token {
    font-size: 20px;
    font-weight: 600;
  }

  .token-icon {
    width: 80px;
    height: 80px;
    margin-bottom: 12px;
  }

  .back-icon {
    position: absolute;
    top: 0px;
    left: 0px;
    cursor: pointer;
  }

  .input-amount {
    width: 100%;
    border: none;
    outline: none;
    font-size: 30px;
    font-weight: 600;
    margin: auto;
    text-align: center;
    margin: 12px 0;
  }

  .input-amount:focus {
    outline: none;
    border: none;
  }

  .asset-available-wrapper {
    display: flex;
    justify-content: end;
    width: 100%;
    color: #585858;
  }

  .asset-available-wrapper p {
    font-size: 12px;
  }

  .send-to-wrapper {
    margin: 12px 0;
    margin-top: 8px;
    width: 100%;
  }

  .send-to-label-text {
    color: #585858;
    font-size: 12px;
    text-align: left;
  }

  .send-to-button {
    width: 100%;
    border: none;
    outline: none;
    background: #5a58e5;
    color: white;
    border-radius: 12px;
    margin-top: 8px;
    padding: 12px;
    font-size: 14px;
  }

  .error-message {
    color: #ff0033;
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
      contract,
      balanceInUsd: balanceInUsd ? balanceInUsd.toFixed(2) : null,
    };
  })
  .filter((item) => item);

const onClickSendToken = () => {
  // TODO:
  // - check if account has enough balance
  // - check if balance is valid (not negative, not zero, not more than balance)
  // - check if account id is valid
  // - check if account id is not the same as current account

  if (!state.inputAmount || !state.inputReceiver)
    return State.update({ errorTransfer: "Please fill all fields" });

  Near.call(
    state.activeTokens.contract,
    "ft_transfer",
    {
      amount: Big(state.inputAmount).times(
        Big(10).pow(state.activeTokens.decimals)
      ),
      receiver_id: state.inputReceiver,
    },
    undefined,
    1
  );
};

const Root = state.root;

return (
  <Root>
    {state.activeTokens ? (
      <SendToken>
        <div
          class="back-icon"
          onClick={() =>
            State.update({
              activeTokens: null,
              inputAmount: "",
              inputReceiver: "",
            })
          }
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.41 16.59L10.83 12L15.41 7.41L14 6L8 12L14 18L15.41 16.59Z"
              fill="black"
            />
          </svg>
        </div>
        {state.activeTokens.icon && (
          <img class="token-icon" src={state.activeTokens.icon} />
        )}
        <p class="title-send-token">Send {state.activeTokens.name}</p>
        <input
          required
          type="number"
          class="input-amount"
          min="0.1"
          placeholder="10"
          autofocus
          value={state.inputAmount}
          onChange={(e) =>
            State.update({ inputAmount: e.target.value, errorTransfer: null })
          }
        />
        <div class="asset-available-wrapper">
          <p>
            Available: {state.activeTokens.balance} {state.activeTokens.symbol}
          </p>
        </div>
        <div class="send-to-wrapper">
          <p class="send-to-label-text">Send to</p>
          <input
            required
            value={state.inputReceiver}
            onChange={(e) =>
              State.update({
                inputReceiver: e.target.value,
                errorTransfer: null,
              })
            }
            placeholder="account id"
            style={{ fontSize: "14px", padding: "10px 8px" }}
          />
        </div>
        {state.errorTransfer && (
          <p class="error-message">{state.errorTransfer}</p>
        )}
        <button type="submit" class="send-to-button" onClick={onClickSendToken}>
          Continue
        </button>
      </SendToken>
    ) : (
      <>
        <Account>
          <p class="account-address">{accountId}</p>
          <div class="token-info-wrapper">
            <p>My Assets</p>
            <p>Token balance</p>
          </div>
        </Account>
        {contractData?.map((item) => (
          <FungibleToken onClick={() => State.update({ activeTokens: item })}>
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
      </>
    )}
  </Root>
);
