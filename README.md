<p align="center">
  <a href="https://decent.land">
    <img src="./img/logo25.png" height="124">
  </a>
  <h3 align="center"><code>@decentdotland/ans-stats</code></h3>
  <p align="center">statistics cache node & API for Arweave Name Service (ANS)</p>
</p>

## API Endpoint
This API is hosted on [ans-stats.decent.land](https://ans-stats.decent.land)
## API Methods

### 1- Cached ANS State 

```sh
GET /users
```
return a cached state of the ANS smart contract.

### 2- ANS Statistics

```sh
GET /stats
```

return statistics and data related to the ANS smart contract.

### 3- Profile lookup

```sh
GET /profile/label_addr
```

return a user's profile using the Arweave address or the `currentLabel`

### Attention
These API endpoints' purpose is only to fetch network statistics of the ANS protocol. The cached contract state does not reflect the latest contract state (real execution time), therefore it cannot be used as ANS state equivalent.

## License
This project is licensed under the [MIT License](./LICENSE).
