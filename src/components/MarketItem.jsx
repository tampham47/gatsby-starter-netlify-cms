import React from 'react';

const MarketItem = ({ model }) => {
  return (
    <div className="market-item">
      <div className="market-item__icon">
        <img className="img" src={`https://assets.liquid.com/currencies/${model.base}.svg`} alt="" />
      </div>
      <div className="market-item__name">{model.base}/{model.quote}</div>
      <div className="market-item__price">{model.price}</div>
      <div className="market-item__24h">{model.trend24h}</div>
      <div className="market-item__fee">{model.takerFee}/{model.makerFee}</div>
      <div className="market-item__order-qty">{model.minOrderQty}</div>
      <div className="market-item__action">
        <a href="#">Spot</a>
        <span>•</span>
        <a href="#">Margin</a>
      </div>
    </div>
  );
};

export default MarketItem;
