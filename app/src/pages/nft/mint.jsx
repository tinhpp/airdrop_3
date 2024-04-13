import React, { useState } from 'react';
import { mintERC721 } from '@src/utils';
import { useSelector } from 'react-redux';

export default function MintNftPage() {
  const account = useSelector((state) => state.account.address);
  const [amount, setAmount] = useState(0);

  const handleMint = async () => {
    await mintERC721('0xfab7c871d4f13385a5c806f00d1b8caf3e0380f7', account, amount);
  };

  return (
    <div style={{ marginTop: '100px', display: 'flex', alignItems: 'center' }}>
      <div>
        <span style={{ marginRight: '12px' }}>Amount</span>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="black-color" />
      </div>
      <button onClick={handleMint} style={{ color: '#000', marginLeft: '12px', cursor: 'pointer' }}>
        Mint
      </button>
    </div>
  );
}
