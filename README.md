## Decentralized Components for BOS NEAR

Made for Blockchain Operating System (BOS) NEAR. For more information, see [BOS NEAR](https://docs.near.org/bos/api/home)

## Overview
### Fungible Tokens Balance
Show fungible token assets balance (NEP-148) on Near Protocol by given account id

*Props required*
```js
accountId: string
```


### Digital Social Card Component
Add your personal information and contact details for your Social Card


*Props  required*
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