import React from 'react';
import classnames from 'classnames';
import formatPrice from '../utils/formatPrice';
import formatPercent from '../utils/formatPercent';

const MarketItem = ({ model }) => {
  return (
    <div className="market-item">
      <div className="market-item__icon">
        <img className="img" src={`https://assets.liquid.com/currencies/${model.base}.svg`} alt="" />
      </div>
      <div className="market-item__name">
        {model.base}/{model.quote}
      </div>
      <div className="market-item__price">
        {formatPrice(model.price)}
      </div>
      <div className="market-item__24h">
        {formatPercent(model.trend24h)}
      </div>
      <div className="market-item__fee">
        {formatPercent(model.takerFee)}
        /
        {formatPercent(model.makerFee)}
      </div>
      <div className="market-item__order-qty">{model.minOrderQty}</div>
      <div className="market-item__action">
        <a href={`https://app.liquid.com/exchange/${model.currencyPairCode}`} target="_blank">Spot</a>
        <span>・</span>
        <a className={classnames({ linkDisabled: !model.marginEnabled })}
          href={`https://app.liquid.com/margin/${model.currencyPairCode}`}
          target="_blank">Margin</a>
      </div>
    </div>
  );
};

export default MarketItem;
