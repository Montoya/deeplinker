// src/components/SellForm.jsx
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Box, FormHelperText } from '@mui/material';

function SellForm({ setGeneratedUrl }) {
  const { control, handleSubmit, formState: { errors }, setValue } = useForm();

  const onSubmit = (data) => {
    const { chainId, address, amount } = data;
    const params = new URLSearchParams();

    if (chainId) params.append('chainId', chainId);
    if (address) params.append('address', address);
    if (amount) params.append('amount', amount);

    const url = `https://link.metamask.io/sell${params.toString() ? `?${params.toString()}` : ''}`;
    setGeneratedUrl(url);
  };

  /* USDC contract on Linea: 0x176211869cA2b568f2A7D4EE941E073a821EE1ff */

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <fieldset>
        <legend>Examples</legend>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button 
            variant="outlined" 
            onClick={() => { 
              setValue('chainId', '1'); 
              setValue('address', ''); 
              setValue('amount', '0.1');
            }} 
          >
            Sell 0.1 ETH on Ethereum
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => { 
              setValue('chainId', 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d'); 
              setValue('address', ''); 
              setValue('amount', '0.5');
            }} 
            sx={{ display: 'none' }}
          >
            Sell 0.5 SOL on Solana
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => { 
              setValue('chainId', '59144'); 
              setValue('address', '0x176211869cA2b568f2A7D4EE941E073a821EE1ff'); 
              setValue('amount', '25');
            }} 
          >
            Sell 25 USDC on Linea
          </Button>
        </Box>
      </fieldset>

      <Controller
        name="chainId"
        control={control}
        defaultValue="" // Set default value
        render={({ field }) => (
          <TextField
            //inputRef={urlInputRef} // Attach the ref to the TextField
            label="Chain ID (optional)"
            fullWidth
            {...field} // Spread the field props
            helperText={'e.g., 1 for Ethereum, 59144 for Linea, solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d for Solana'}
          />
        )}
      />

      <Controller
        name="address"
        control={control}
        defaultValue="" // Set default value
        rules={{
          pattern: {
            value: /^0x[a-fA-F0-9]{40}$/,
            message: 'Invalid Ethereum address (e.g., 0x1234...)'
          }
        }}
        render={({ field }) => (
          <TextField
            //inputRef={urlInputRef} // Attach the ref to the TextField
            label="Token Contract Address (optional)"
            fullWidth
            {...field} // Spread the field props
            error={!!errors.address}
            helperText={'If omitted, the native asset will be used.'}
          />
        )}
      />

      <Controller
        name="amount"
        control={control}
        defaultValue="" // Set default value
        render={({ field }) => (
          <TextField
            //inputRef={urlInputRef} // Attach the ref to the TextField
            label="Amount (optional)"
            fullWidth
            {...field} // Spread the field props
            helperText={'e.g. 1, 0.1, etc.'}
          />
        )}
      />

      <FormHelperText>The corresponding fiat amount will be based on the user's preferred fiat currency.</FormHelperText>

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

export default SellForm;
