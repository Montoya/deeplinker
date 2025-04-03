// src/components/BuyForm.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Box, FormHelperText } from '@mui/material';

function BuyForm({ setGeneratedUrl }) {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    const { chainId, address, amount } = data;
    const params = new URLSearchParams();

    if (chainId) params.append('chainId', chainId);
    if (address) params.append('address', address);
    if (amount) params.append('amount', amount);

    const url = `https://metamask.app.link/buy${params.toString() ? `?${params.toString()}` : ''}`;
    setGeneratedUrl(url);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label="Chain ID (optional)"
        type="number"
        fullWidth
        {...register('chainId')}
      />
      <FormHelperText>e.g., 1 for Ethereum, 59144 for Linea</FormHelperText>

      <TextField
        label="Token Contract Address (optional)"
        fullWidth
        {...register('address', { 
          pattern: {
            value: /^0x[a-fA-F0-9]{40}$/,
            message: 'Invalid Ethereum address (e.g., 0x1234...)'
          }
        })}
      />
      <FormHelperText>If omitted, the native asset will be used.</FormHelperText>

      <TextField
        label="Amount (optional)"
        type="text"
        fullWidth
        {...register('amount')}
      />
      <FormHelperText>Can be a whole number or decimal.</FormHelperText>

      <Button 
        type="submit" 
        variant="contained" 
        color="primary"
        sx={{ mt: 2 }}
      >
        Generate Deeplink
      </Button>
    </Box>
  );
}

export default BuyForm;