const _ = require('lodash')
const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')
const { fmImagesToRelative } = require('gatsby-remark-relative-images')
const axios = require('axios');
const crypto = require('crypto');

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions

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
      result.errors.forEach(e => console.error(e.toString()))
      return Promise.reject(result.errors)
    }

    const posts = result.data.allMarkdownRemark.edges

    posts.forEach(edge => {
      const id = edge.node.id
      createPage({
        path: edge.node.fields.slug,
        tags: edge.node.frontmatter.tags,
        component: path.resolve(
          `src/templates/${String(edge.node.frontmatter.templateKey)}.js`
        ),
        // additional data can be passed via context
        context: {
          id,
        },
      })
    })

    // Tag pages:
    let tags = []
    // Iterate through each post, putting all found tags into `tags`
    posts.forEach(edge => {
      if (_.get(edge, `node.frontmatter.tags`)) {
        tags = tags.concat(edge.node.frontmatter.tags)
      }
    })
    // Eliminate duplicate tags
    tags = _.uniq(tags)

    // Make tag pages
    tags.forEach(tag => {
      const tagPath = `/tags/${_.kebabCase(tag)}/`

      createPage({
        path: tagPath,
        component: path.resolve(`src/templates/tags.js`),
        context: {
          tag,
        },
      })
    })
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions
  fmImagesToRelative(node) // convert image paths for gatsby images

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}

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
  productList.map((market) => {
    // Create your node object
    const cyy = currencyList.find(i => i.currency === market.base_currency);
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

      productType: market.product_type,
      code: market.code,
      name: market.name,
      marketAsk: market.market_ask,
      marketBid: market.market_bid,
      indicator: market.indicator,
      currency: market.currency,
      currencyPairCode: market.currency_pair_code,
      symbol: market.symbol,

      btcMinimumWithdraw: market.btc_minimum_withdraw || 0,
      fiatMinimumWithdraw: market.fiat_minimum_withdraw || 0,

      pusherChannel: market.pusher_channel,
      takerFee: market.taker_fee,
      makerFee: market.maker_fee,

      price: market.last_traded_price,
      lowMarketBid: market.low_market_bid,
      highMarketAsk: market.high_market_ask,
      volume24h: market.volume_24h,
      trend24h: market.last_price_24h ? ((market.last_traded_price - market.last_price_24h) / market.last_price_24h) : 0,
      lastTradedPrice: market.last_traded_price,
      lastTradedQuantity: market.last_traded_quantity,

      quote: market.quoted_currency,
      base: market.base_currency,
      disabled: market.disabled,
      marginEnabled: market.margin_enabled,
      cfdEnabled: market.cfd_enablede || false,

      minOrderQty: (cyy && cyy.minimum_order_quantity) ? cyy.minimum_order_quantity : 0,
    }

    // Get content digest of node. (Required field)
    const contentDigest = crypto
      .createHash(`md5`)
      .update(JSON.stringify(productNode))
      .digest(`hex`);
    // add it to productNode
    productNode.internal.contentDigest = contentDigest;

    // Create node with the gatsby createNode() API
    createNode(productNode);
  });

  return;
}