## Decentralized Components for BOS NEAR

Made for Blockchain Operating System (BOS) NEAR. For more information, see [BOS NEAR](https://docs.near.org/bos/api/home)

## Fungible Token Balance

Show fungible token assets balance (NEP-148) on Near Protocol by given account id

_Props required_

```js
accountId: string;
```

Live example: https://near.org/near/widget/ComponentDetailsPage?src=ahnff.near/widget/FungibleTokenBalance

## Digital Social Card Component

Add your personal information and contact details for your Social Card

_Props required_

```js
name: string
role: string
nftImage: {
  contractId: string
  tokenId: string
},
email: string
social: {
  linkedin: string
  twitter: string
  instagram: string
  phone: string | number
}
```

Live example: https://near.org/near/widget/ComponentDetailsPage?src=ahnff.near/widget/ProfilePage
