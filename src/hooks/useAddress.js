// src/hooks/useAddress.js
import { useState, useEffect } from 'react';
import { localStorageHelper } from '../utils/localStorage';

export const useAddress = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    // Load addresses from localStorage
    const savedAddresses = localStorageHelper.get('userAddresses') || [];
    const savedSelected = localStorageHelper.get('selectedAddress');
    
    setAddresses(savedAddresses);
    if (savedSelected) {
      setSelectedAddress(savedSelected);
    }
  }, []);

  const saveAddress = (address) => {
    const newAddress = {
      ...address,
      id: Date.now().toString(),
      isDefault: addresses.length === 0
    };
    
    const updatedAddresses = [...addresses, newAddress];
    setAddresses(updatedAddresses);
    localStorageHelper.set('userAddresses', updatedAddresses);
    
    if (addresses.length === 0) {
      setSelectedAddress(newAddress);
      localStorageHelper.set('selectedAddress', newAddress);
    }
  };

  const updateAddress = (id, updatedAddress) => {
    const updatedAddresses = addresses.map(addr =>
      addr.id === id ? { ...addr, ...updatedAddress } : addr
    );
    setAddresses(updatedAddresses);
    localStorageHelper.set('userAddresses', updatedAddresses);
    
    if (selectedAddress && selectedAddress.id === id) {
      const newSelected = { ...selectedAddress, ...updatedAddress };
      setSelectedAddress(newSelected);
      localStorageHelper.set('selectedAddress', newSelected);
    }
  };

  const deleteAddress = (id) => {
    const updatedAddresses = addresses.filter(addr => addr.id !== id);
    setAddresses(updatedAddresses);
    localStorageHelper.set('userAddresses', updatedAddresses);
    
    if (selectedAddress && selectedAddress.id === id) {
      const newSelected = updatedAddresses.find(addr => addr.isDefault) || updatedAddresses[0] || null;
      setSelectedAddress(newSelected);
      localStorageHelper.set('selectedAddress', newSelected);
    }
  };

  const setDefaultAddress = (id) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    }));
    setAddresses(updatedAddresses);
    localStorageHelper.set('userAddresses', updatedAddresses);
    
    const newDefault = updatedAddresses.find(addr => addr.id === id);
    setSelectedAddress(newDefault);
    localStorageHelper.set('selectedAddress', newDefault);
  };

  return {
    addresses,
    selectedAddress,
    saveAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    setSelectedAddress
  };
};