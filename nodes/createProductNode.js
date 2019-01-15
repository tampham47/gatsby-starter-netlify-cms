const axios = require('axios');
const crypto = require('crypto');

const normalize = (m, cyy = {}) => ({
  productType: m.product_type,
  code: m.code,
  name: m.name,
  marketAsk: m.market_ask,
  marketBid: m.market_bid,
  indicator: m.indicator,
  currency: m.currency,
  currencyPairCode: m.currency_pair_code,
  symbol: m.symbol,

  btcMinimumWithdraw: m.btc_minimum_withdraw || 0,
  fiatMinimumWithdraw: m.fiat_minimum_withdraw || 0,

  pusherChannel: m.pusher_channel,
  takerFee: m.taker_fee,
  makerFee: m.maker_fee,

  price: m.last_traded_price,
  lowMarketBid: m.low_market_bid,
  highMarketAsk: m.high_market_ask,
  volume24h: m.volume_24h,
  trend24h: m.last_price_24h
    ? (m.last_traded_price - m.last_price_24h) / m.last_price_24h
    : 0,
  lastTradedPrice: m.last_traded_price,
  lastTradedQuantity: m.last_traded_quantity,

  quote: m.quoted_currency,
  base: m.base_currency,
  disabled: m.disabled,
  marginEnabled: m.margin_enabled,
  cfdEnabled: m.cfd_enablede || false,

  minOrderQty: cyy.minimum_order_quantity ? cyy.minimum_order_quantity : 0,
});

const getGravity = (m, gindex) => {
  const value =
    (m.marginEnabled ? 1 : 0) * 1000 +
    1 / (m.minOrderQty || 1) +
    (m.price ? 1 : -1) * 1000 +
    (!m.disabled ? 1 : -1) * 10000000 +
    (1000 - gindex);

  return Math.floor(value);
};

const createProductNode = async createNode => {
  // fetch raw data from the Product api
  const fetchProduct = () =>
    axios.get(`https://api.liquid.com/products?with_rate=true`);
  const fetchCurrency = () => axios.get(`https://api.liquid.com/currencies`);

  // await for results
  const res = await Promise.all([fetchProduct(), fetchCurrency()]);
  const productList = res[0].data;
  const currencyList = res[1].data;

  // map into these results and create nodes
  productList.map((market, index) => {
    // Create your node object
    const cyy = currencyList.find(i => i.currency === market.base_currency);
    const model = normalize(market, cyy);
    model.gravity = getGravity(model, index);

    const productNode = {
      // Required fields
      id: `${market.id}`,
      parent: `__SOURCE__`,
      internal: {
        type: `Product`, // name of the graphQL query --> allProduct {}
        // contentDigest will be added just after
        // but it is required
      },
      children: [],
      ...model,
    };

    // Get content digest of node. (Required field)
    const contentDigest = crypto
      .createHash(`md5`)
      .update(JSON.stringify(productNode))
      .digest(`hex`);
    // add it to productNode
    productNode.internal.contentDigest = contentDigest;

    // Create node with the gatsby createNode() API
    createNode(productNode);

    return 0;
  });
};

export default createProductNode;
