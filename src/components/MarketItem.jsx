import React from 'react';
import Types from 'prop-types';
import clname from 'classnames';

import { TiArrowDown, TiArrowUp } from 'react-icons/ti';
import formatPrice from '../utils/formatPrice';
import formatPercent from '../utils/formatPercent';

const MarketItem = ({ model }) => {
  const isBull = model.trend24h > 0;
  return (
    <div className={clname({ 'market-item': true, disabled: model.disabled })}>
      <div className="market-item__icon">
        <img
          className="img"
          src={`https://assets.liquid.com/currencies/${model.base}.svg`}
          alt=""
        />
      </div>
      <div className="market-item__name">
        {model.base}/{model.quote}
      </div>
      <div className="market-item__price">{formatPrice(model.price)}</div>
      <div className="market-item__24h">
        <div className={`market-item__24h__pill ${isBull ? 'up' : 'down'}`}>
          {isBull ? <TiArrowUp /> : <TiArrowDown />}
          {formatPercent(model.trend24h)}
        </div>
      </div>
      <div className="market-item__fee">
        {formatPercent(model.takerFee)}/{formatPercent(model.makerFee)}
      </div>
      <div className="market-item__order-qty">{model.minOrderQty}</div>
      <div className="market-item__action">
        <a
          href={`https://app.liquid.com/exchange/${model.currencyPairCode}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Spot
        </a>
        <span>・</span>
        <a
          className={clname({ disabled: !model.marginEnabled })}
          href={`https://app.liquid.com/margin/${model.currencyPairCode}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Margin
        </a>
      </div>
    </div>
  );
};

MarketItem.propTypes = {
  model: Types.shape({}).isRequired,
};

export default MarketItem;
