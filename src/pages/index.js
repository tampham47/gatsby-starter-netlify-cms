import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import Layout from '../components/Layout';
import MarketItem from '../components/MarketItem';

// const getOrderValue = p => {
//   const value =
//     (p.marginEnabled ? 1 : 0) * 1000 +
//     1 / (p.minOrderQty || 1) +
//     (p.price ? 1 : -1) * 1000 +
//     (!p.disabled ? 1 : -1) * 10000000;

//   return value;
// };
export default class IndexPage extends React.PureComponent {
  render() {
    const { data } = this.props;
    const { allProduct } = data;
    const { edges: tmpList } = allProduct;

    const marketList = tmpList
      // .sort((a, b) => {
      //   const da = getOrderValue(a.node);
      //   const db = getOrderValue(b.node);
      //   return db - da;
      // })
      .map(i => i.node);

    return (
      <Layout>
        <section className="market">
          <div className="container">
            <h3>Markets</h3>
            <div className="market-list">
              <div className="market-item market-item--header">
                <div className="market-item__icon">Pair</div>
                <div className="market-item__name" />
                <div className="market-item__price">Price</div>
                <div className="market-item__24h">24H%</div>
                <div className="market-item__fee">Fee% (taker/maker)</div>
                <div className="market-item__order-qty">Min order qty.</div>
                <div className="market-item__action">-</div>
              </div>

              {marketList.map(market => (
                <MarketItem model={market} key={market.id} />
              ))}
            </div>
          </div>
        </section>
      </Layout>
    );
  }
}

IndexPage.propTypes = {
  data: PropTypes.shape({
    allProduct: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
};

export const pageQuery = graphql`
  query IndexQuery {
    allProduct {
      edges {
        node {
          id
          price
          takerFee
          makerFee
          volume24h
          quote
          base
          disabled
          marginEnabled
          cfdEnabled
          minOrderQty
          trend24h
          currencyPairCode
        }
      }
    }
  }
`;
