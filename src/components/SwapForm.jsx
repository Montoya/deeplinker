import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Box, FormHelperText } from '@mui/material';

function SwapForm({ setGeneratedUrl }) {
  const { control, handleSubmit, formState: { errors }, setValue } = useForm();

  // Generate default deeplink on component mount
  useEffect(() => {
    generateSwapLink({});
  }, []);

  const generateSwapLink = (data) => {
    const { fromToken, toToken, value, chainId, decimals } = data;

    // Construct the base URL
    const baseUrl = "https://link.metamask.io/swap";

    // No op if no parameters are provided
    if (!fromToken && !toToken && !value && !chainId) {
      setGeneratedUrl(baseUrl);
      return;
    }

    const params = new URLSearchParams();

    // Add parameters to the URL
    if (fromToken) {
      params.append('fromToken', encodeURIComponent(`eip155:1/erc20:${fromToken}`));
    }
    if (toToken) {
      params.append('toToken', encodeURIComponent(`eip155:1/erc20:${toToken}`));
    }
    if (value) {
      params.append('value', value);
    }
    if (chainId) {
      params.append('chainId', chainId);
    }
    if (decimals) {
      params.append('decimals', `2e${decimals}`);
    }

    // Generate the final URL
    const swapLink = baseUrl + '?' + params.toString();
    setGeneratedUrl(swapLink); // Set the generated link
  };

  /* USDC contract on Linea: 0x176211869cA2b568f2A7D4EE941E073a821EE1ff */

  return (
    <Box component="form" onSubmit={handleSubmit(generateSwapLink)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <FormHelperText>None of these fields seem to work. Only the basic <code>/swap</code> link works.</FormHelperText>
      
      <fieldset>
        <legend>Examples</legend>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="outlined" 
            onClick={() => { 
              setValue('fromToken', '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'); 
              setValue('toToken', '0xdAC17F958D2ee523a2206206994597C13D831ec7'); 
              setValue('value', '1');
              setValue('chainId', '');
              setValue('decimals','');
            }} 
          >
            Swap 1 USDC to USDT
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => { 
              setValue('fromToken', '0x176211869cA2b568f2A7D4EE941E073a821EE1ff'); 
              setValue('toToken', '0xA219439258ca9da29E9Cc4cE5596924745e12B93'); 
              setValue('value', '1');
              setValue('chainId', '59144');
              setValue('decimals','');
            }} 
          >
            Swap 1 USDC to USDT on Linea
          </Button>
        </Box>
      </fieldset>
      
      <Controller
        name="fromToken"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            label="From Token (Contract Address, Optional)"
            fullWidth
            {...field}
            error={!!errors.fromToken}
            helperText={errors.fromToken?.message}
          />
        )}
      />
      <Controller
        name="toToken"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            label="To Token (Contract Address, Optional)"
            fullWidth
            {...field}
            error={!!errors.toToken}
            helperText={errors.toToken?.message}
          />
        )}
      />
      <Controller
        name="value"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            label="Value (of From Token, Optional)"
            fullWidth
            {...field}
            error={!!errors.value}
            helperText={errors.value?.message}
          />
        )}
      />
      <Controller
        name="chainId"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            label="Chain ID (Optional)"
            fullWidth
            {...field}
            error={!!errors.chainId}
            helperText={errors.chainId?.message || 'e.g., 1 for Ethereum, 59144 for Linea'}
          />
        )}
      />
      <Controller
        name="decimals"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            label="Decimals (Optional)"
            fullWidth
            {...field}
            error={!!errors.decimals}
            helperText={errors.decimals?.message}
          />
        )}
      />

      <Button type="submit" variant="contained" color="primary">
        Generate Deeplink
      </Button>
    </Box>
  );
}

export default SwapForm;