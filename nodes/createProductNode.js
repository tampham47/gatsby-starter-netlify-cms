const axios = require('axios');
const crypto = require('crypto');

const getGravity = m => {
  const disabledDelta = m.disabled ? 0 : 1;
  const value =
    (m.marginEnabled ? 1 : 0) * 1000 +
    disabledDelta * (m.price ? 1 : -1) * 1000 +
    disabledDelta * m.volume24hInUSD +
    1 / (m.minOrderQty || 1) +
    (m.disabled ? -1 : 0) * 1000000;

  return Math.floor(value || -1000000000);
};

const normalize = (m, cyy = {}) => {
  const model = {
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

    price: parseFloat(m.last_traded_price) || 0,
    last24hPrice: parseFloat(m.last_price_24h),
    lowMarketBid: parseFloat(m.low_market_bid),
    highMarketAsk: parseFloat(m.high_market_ask),
    volume24h: parseFloat(m.volume_24h),
    exchangeRate: parseFloat(m.exchange_rate),
    lastTradedPrice: parseFloat(m.last_traded_price),
    lastTradedQuantity: parseFloat(m.last_traded_quantity),

    quote: m.quoted_currency,
    base: m.base_currency,
    disabled: m.disabled,
    marginEnabled: m.margin_enabled,
    cfdEnabled: m.cfd_enabled || false,

    minOrderQty: cyy.minimum_order_quantity ? cyy.minimum_order_quantity : 0,
  };

  model.volume24hInUSD = model.volume24h * model.price * model.exchangeRate;
  model.trend24h = model.last24hPrice
    ? (model.price - model.last24hPrice) / model.last24hPrice
    : 0;

  model.gravity = getGravity(model);

  return model;
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
  productList.map(market => {
    // Create your node object
    const cyy = currencyList.find(i => i.currency === market.base_currency);
    const model = normalize(market, cyy);

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

    return productNode;
  });

  return 0;
};

module.exports = createProductNode;
