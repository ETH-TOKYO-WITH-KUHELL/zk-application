# ETHTOKYOZKTEAM

## our project showcase
- https://ethglobal.com/showcase/ethtokyozkproject-ghmin

## zk-protocol-semephore
- nft contract repository that using this project
  - https://github.com/ETH-TOKYO-WITH-KUHELL/nft-semaphore

## how to deploy feedback contract on Polygon Mumbai Test Network  
```shell
cp .env.example .env 
yarn
cd apps/contract
yarn
yarn deploy --semaphore 0xc740e00e7cb62c8E2135e71bC34f8836Dddc72a6 --group 3 --network mumbai
```
- `$ cp .env.example .env`
  - copy example env file for deploy Feedback contracts
- first yarn
  - install packages on root directory
- second yarn
  - install packages on contract directory
# change setting ( do this on root directory )
```shell
yarn copy:contract-artifacts
yarn dev
```

# reference 
## our demo site
- https://ethtokyozkprotocoldev.netlify.app/

## deploy Semephore contract transaction history
- https://mumbai.polygonscan.com/address/0xc740e00e7cb62c8E2135e71bC34f8836Dddc72a6
- `0xc740e00e7cb62c8E2135e71bC34f8836Dddc72a6`
## deploy Feedback contract transaction history
- https://mumbai.polygonscan.com/address/0x22fff678d6560c69Fd342A89eC47021C9a5D7A7f
- `0x22fff678d6560c69Fd342A89eC47021C9a5D7A7f`
