# contract deploy 
```shell
cp .env.example .env 
yarn
cd apps/contract
yarn
npx @semaphore-protocol/cli get-group <group-id>
yarn deploy --semaphore <semaphore-contract-address> --group 50 --network <network>
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
npx @semaphore-protocol/cli get-group <group-id>
```
- `$ npx @semaphore-protocol/cli get-group <group-id>`
  - after made feedback, check results whether feedbacks are created or not
