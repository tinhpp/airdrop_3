/* eslint-disable react/prop-types */
import Player from './Player';
import { StyledItem } from './styled';
import { deleteFromCart } from '@src/api/cart.api';
import { DEFAULT_NO_IMAGE } from '@src/constants';
import { removeFromCart } from '@src/redux/features/cartSlice';
import { parseMetamaskError } from '@src/utils';
import { Button } from 'antd';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  const account = useSelector((state) => state.account);

  const handleRemoveFromCart = async (e, item) => {
    e.preventDefault();
    try {
      await deleteFromCart(item.id);
      dispatch(removeFromCart(item.id));
      toast.success('Remove cart successfully');
    } catch (error) {
      console.log(error);
      const txError = parseMetamaskError(error);
      toast.error(txError.context);
    }
  };

  const isInSaleTime = () => {
    if (item.marketItem.timeSaleStart) {
      const currentTime = new Date().getTime() / 1000;
      return Number(item.marketItem.timeSaleStart) <= currentTime && currentTime <= item.marketItem.timeSaleEnd;
    }
    return false;
  };

  return (
    <StyledItem>
      <Link to={`/marketplace/assets/${item.marketItem.id}`} className="item-wrap">
        <div className="asset">
          <Player src={item.marketItem.metadata?.media?.original_media_url || DEFAULT_NO_IMAGE} />
        </div>

        <div className="info">
          <div className="left">
            <span className="name">{`${item.marketItem.metadata.name} #${item.marketItem.nftId}`}</span>
            <span className="collection">{item.marketItem.metadata.name}</span>
          </div>

          <Button className="remove" onClick={(e) => handleRemoveFromCart(e, item)}>
            Remove
          </Button>
          <div className="price">
            <span className={isInSaleTime() ? 'text-through text-gray' : ''}>
              {item.marketItem.price} {account.currency}
            </span>
            {isInSaleTime() && (
              <span>
                <b>
                  {item.marketItem.salePrice} {account.currency}
                </b>
              </span>
            )}
          </div>
        </div>
      </Link>
    </StyledItem>
  );
};

export default CartItem;
