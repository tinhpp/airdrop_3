import { deleteAllOfMarketItem, deleteAllOfOwner } from '@src/api/cart.api';
import { clearAllCart, selectTotalPrice } from '@src/redux/features/cartSlice';
import { parseMetamaskError } from '@src/utils';
import { write as marketplaceContractWrite } from '@src/utils/contracts/marketplace';
import { Button } from 'antd';
import { ethers } from 'ethers';
import { useState } from 'react';
import toast from 'react-hot-toast';
import ReactLoading from 'react-loading';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CartItem from './CartItem';
import { StyledCart } from './styled';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const totalPrice = useSelector(selectTotalPrice);
  const cartItems = useSelector((state) => state.cart.items);
  const account = useSelector((state) => state.account);

  const [commitLoading, setCommitLoading] = useState(false);

  const handleBuyInCart = async () => {
    try {
      if (Object.values(cartItems).length === 0) {
        navigate('/marketplace/nfts');
        return;
      }
      setCommitLoading(true);
      const onChainIds = Object.values(cartItems).map((cart) => cart.marketItem.onChainId);
      const marketItemIds = Object.values(cartItems).map((cart) => cart.marketItem.id);
      const tx = await marketplaceContractWrite('purchaseItems', [onChainIds], ethers.utils.parseEther(`${totalPrice}`));

      await tx.wait();
      await deleteAllOfOwner(account.address);
      await deleteAllOfMarketItem(marketItemIds.join(','));

      dispatch(clearAllCart());
      setCommitLoading(false);
      toast.success('Buy all items in cart successfully');
    } catch (error) {
      console.log(error);
      const txError = parseMetamaskError(error);
      toast.error(txError.context);
      setCommitLoading(false);
    }
  };

  const handleClearAll = async () => {
    try {
      setCommitLoading(true);
      await deleteAllOfOwner(account.address);
      dispatch(clearAllCart());
      setCommitLoading(false);
      toast.success('Clear all items in cart successfully');
    } catch (error) {
      console.log(error);
      const txError = parseMetamaskError(error);
      toast.error(txError.context);
      setCommitLoading(false);
    }
  };

  return (
    <>
      {commitLoading && (
        <div className="screen-loading-overlay">
          <ReactLoading type="spinningBubbles" color="#ffffff" height={60} width={60} />
        </div>
      )}
      <StyledCart>
        <div className="header">
          <span className="title">You cart</span>

          <div className="action">
            <button className="clear" onClick={handleClearAll}>
              Clear all
            </button>
          </div>
        </div>
        <div className="list">
          {Object.values(cartItems).length > 0 ? (
            Object.values(cartItems).map((item) => <CartItem key={item.id} item={item} />)
          ) : (
            <div className="no-data">Add items to get started</div>
          )}
        </div>
        <Button className="bought" onClick={handleBuyInCart}>
          {Object.values(cartItems).length > 0
            ? `Buy now for ${totalPrice} ${account.currency}`
            : 'Explore the marketplace'}
        </Button>
      </StyledCart>
    </>
  );
};

export default Cart;
