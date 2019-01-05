const _ = require('lodash');
const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');
const { fmImagesToRelative } = require('gatsby-remark-relative-images');
const axios = require('axios');
const crypto = require('crypto');

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions;

  return graphql(`
    {
      allMarkdownRemark(limit: 1000) {
        edges {
          node {
            id
            fields {
              slug
            }
            frontmatter {
              tags
              templateKey
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      result.errors.forEach(e => console.error(e.toString()));
      return Promise.reject(result.errors);
    }

    const posts = result.data.allMarkdownRemark.edges;

    posts.forEach(edge => {
      const { id } = edge.node;
      createPage({
        path: edge.node.fields.slug,
        tags: edge.node.frontmatter.tags,
        component: path.resolve(
          `src/templates/${String(edge.node.frontmatter.templateKey)}.js`,
        ),
        // additional data can be passed via context
        context: {
          id,
        },
      });
    });

    // Tag pages:
    let tags = [];
    // Iterate through each post, putting all found tags into `tags`
    posts.forEach(edge => {
      if (_.get(edge, `node.frontmatter.tags`)) {
        tags = tags.concat(edge.node.frontmatter.tags);
      }
    });
    // Eliminate duplicate tags
    tags = _.uniq(tags);

    // Make tag pages
    tags.forEach(tag => {
      const tagPath = `/tags/${_.kebabCase(tag)}/`;

      createPage({
        path: tagPath,
        component: path.resolve(`src/templates/tags.js`),
        context: {
          tag,
        },
      });
    });

    return 0;
  });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;
  fmImagesToRelative(node); // convert image paths for gatsby images

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode });
    createNodeField({
      name: `slug`,
      node,
      value,
    });
  }
};

exports.sourceNodes = async ({ actions }) => {
  const { createNode } = actions;

  // fetch raw data from the Product api
  const fetchProduct = () => axios.get(`https://api.liquid.com/products`);
  const fetchCurrency = () => axios.get(`https://api.liquid.com/currencies`);

  // await for results
  const res = await Promise.all([fetchProduct(), fetchCurrency()]);
  const productList = res[0].data;
  const currencyList = res[1].data;

  // map into these results and create nodes
  productList.map((market, index) => {
    // Create your node object
    const cyy = currencyList.find(i => i.currency === market.base_currency);
    const getGravity = (m, gindex) => {
      const value =
        (m.marginEnabled ? 1 : 0) * 1000 +
        1 / (m.minOrderQty || 1) +
        (m.price ? 1 : -1) * 1000 +
        (!m.disabled ? 1 : -1) * 10000000 +
        (1000 - gindex);

      return Math.floor(value);
    };

    const normalize = m => ({
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

      minOrderQty:
        cyy && cyy.minimum_order_quantity ? cyy.minimum_order_quantity : 0,
    });
    const model = normalize(market);
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
