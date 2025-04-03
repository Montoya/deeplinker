import React from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Box, FormHelperText } from '@mui/material';

function SendNativeForm({ setGeneratedUrl }) {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    const { recipient, chainId, value } = data;
    // Convert value to wei in scientific notation
    const weiValue = value ? (parseFloat(value) * 1e18).toExponential().replace('+', '') : undefined; // Convert to wei in scientific notation
    const url = `https://metamask.app.link/send/${recipient}@${chainId}${weiValue ? `?value=${weiValue}` : ''}`;
    setGeneratedUrl(url);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label="Recipient Address"
        fullWidth
        {...register('recipient', { 
          required: 'Recipient address is required',
          pattern: {
            value: /^0x[a-fA-F0-9]{40}$/,
            message: 'Invalid Ethereum address (e.g., 0x1234...)'
          }
        })}
        error={!!errors.recipient}
        helperText={errors.recipient?.message || 'e.g. 0x1234...'}
      />

      <TextField
        label="Chain ID"
        type="number"
        fullWidth
        {...register('chainId', { 
          required: 'Chain ID is required',
          min: { value: 1, message: 'Chain ID must be a positive number' }
        })}
        error={!!errors.chainId}
        helperText={errors.chainId?.message || 'e.g., 1 for Ethereum, 59144 for Linea'}
      />

      <TextField
        label="Optional Value (Native asset, i.e. ETH)"
        fullWidth
        {...register('value')}
      />
      <FormHelperText>Value will be converted to wei (1 = 1e18, 0.01 = 1e16)</FormHelperText>

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

export default SendNativeForm; 