"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { addToCart, updateQuantity, removeFromCart } from "../store/cartSlice";
import { Product } from "../services/api";

interface AddToCartButtonProps {
  product: Product;
  styleClass?: string;
}

export default function AddToCartButton({ product, styleClass }: AddToCartButtonProps) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const cartItem = cartItems.find(item => String(item.id) === String(product._id));

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart(product));
  };

  const handleDecrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartItem && cartItem.quantity === 1) {
      dispatch(removeFromCart(product._id));
    } else {
      dispatch(updateQuantity({ id: product._id, change: -1 }));
    }
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(updateQuantity({ id: product._id, change: 1 }));
  };

  if (cartItem) {
    return (
      <div className="cartQuantityControl" style={{
        position: 'absolute',
        right: '1rem',
        bottom: '1rem',
        background: '#C19A6B',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        padding: '6px 12px',
        zIndex: 10,
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
      }}>
        <button 
          onClick={handleDecrease}
          style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '16px', fontWeight: 500, padding: '0 4px' }}
        >
          -
        </button>
        <span style={{ color: 'white', fontSize: '14px', fontWeight: 600, minWidth: '14px', textAlign: 'center' }}>
          {cartItem.quantity}
        </span>
        <button 
          onClick={handleIncrease}
          style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '16px', fontWeight: 500, padding: '0 4px' }}
        >
          +
        </button>
      </div>
    );
  }

  return (
    <button 
      className={styleClass} 
      onClick={handleAdd}
      aria-label="Add to cart"
      style={{
        position: 'absolute',
        right: '1rem',
        bottom: '1rem',
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        background: '#C19A6B',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        cursor: 'pointer',
        zIndex: 10,
        transition: 'transform 0.3s ease, background 0.3s ease'
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" fill="currentColor">
        <path d="M0 0h24v24H0V0z" fill="none"/>
        <path d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-8.9-5h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4l-3.87 7H8.53L4.27 2H1v2h2l3.6 7.59L3.62 17H19v-2H7l1.1-2z"/>
      </svg>   
    </button>
  );
}
