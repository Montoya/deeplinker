import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Box, FormHelperText, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

function SwapForm({ setGeneratedUrl }) {
  const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm();
  const fromTokenType = watch('fromTokenType');
  const toTokenType = watch('toTokenType');

  // Generate default deeplink on component mount
  useEffect(() => {
    generateSwapLink({});
  }, []);

  // Clear chain ID fields when switching away from EVM types
  useEffect(() => {
    if (fromTokenType === 'solana' || fromTokenType === 'spl') {
      setValue('fromChainId', '');
    }
  }, [fromTokenType, setValue]);

  useEffect(() => {
    if (toTokenType === 'solana' || toTokenType === 'spl') {
      setValue('toChainId', '');
    }
  }, [toTokenType, setValue]);

  // Clear address fields when switching to native types
  useEffect(() => {
    if (fromTokenType === 'evm-native' || fromTokenType === 'solana') {
      setValue('fromTokenAddress', '');
    }
  }, [fromTokenType, setValue]);

  useEffect(() => {
    if (toTokenType === 'evm-native' || toTokenType === 'solana') {
      setValue('toTokenAddress', '');
    }
  }, [toTokenType, setValue]);

  const generateSwapLink = (data) => {
    const { fromChainId, toChainId, fromTokenAddress, toTokenAddress, fromTokenType, toTokenType, amount, decimals } = data;

    // Construct the base URL
    const baseUrl = "https://link.metamask.io/swap";

    // No op if no parameters are provided
    if (!fromChainId && !toChainId && !amount) {
      setGeneratedUrl(baseUrl);
      return;
    }

    const params = new URLSearchParams();

    // Add amount parameter (calculated from amount and decimals)
    if (amount && decimals) {
      const calculatedAmount = (parseFloat(amount) * Math.pow(10, parseInt(decimals))).toString();
      params.append('amount', calculatedAmount);
    }

    // Helper function to get the correct slip44 asset ID for EVM chains
    const getEVMNativeAssetId = (chainId) => {
      const chainIdNum = parseInt(chainId);
      switch (chainIdNum) {
        case 137: // Polygon
          return 'slip44:966'; // POL
        case 56: // BSC
          return 'slip44:714'; // BNB
        case 43114: // Avalanche
          return 'slip44:9000'; // AVAX
        case 1328: // Sei
          return 'slip44:19000118'; // SEI
        default:
          return 'slip44:60'; // ETH (default for all other EVM chains)
      }
    };

    // Add from token parameter
    if (fromTokenType) {
      let fromTokenCAIP;
      if (fromTokenType === 'evm-native' && fromChainId) {
        const assetId = getEVMNativeAssetId(fromChainId);
        fromTokenCAIP = `eip155:${fromChainId}/${assetId}`;
      } else if (fromTokenType === 'erc20' && fromChainId && fromTokenAddress) {
        fromTokenCAIP = `eip155:${fromChainId}/erc20:${fromTokenAddress}`;
      } else if (fromTokenType === 'solana') {
        fromTokenCAIP = `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp/slip44:501`;
      } else if (fromTokenType === 'spl' && fromTokenAddress) {
        fromTokenCAIP = `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp/token:${fromTokenAddress}`;
      }
      if (fromTokenCAIP) {
        params.append('from', fromTokenCAIP);
      }
    }

    // Add to token parameter
    if (toTokenType) {
      let toTokenCAIP;
      if (toTokenType === 'evm-native' && toChainId) {
        const assetId = getEVMNativeAssetId(toChainId);
        toTokenCAIP = `eip155:${toChainId}/${assetId}`;
      } else if (toTokenType === 'erc20' && toChainId && toTokenAddress) {
        toTokenCAIP = `eip155:${toChainId}/erc20:${toTokenAddress}`;
      } else if (toTokenType === 'solana') {
        toTokenCAIP = `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp/slip44:501`;
      } else if (toTokenType === 'spl' && toTokenAddress) {
        toTokenCAIP = `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp/token:${toTokenAddress}`;
      }
      if (toTokenCAIP) {
        params.append('to', toTokenCAIP);
      }
    }

    // Generate the final URL
    const swapLink = baseUrl + '?' + params.toString();
    setGeneratedUrl(swapLink); // Set the generated link
  };

  /* USDC contract on Linea: 0x176211869cA2b568f2A7D4EE941E073a821EE1ff */

  return (
    <Box component="form" onSubmit={handleSubmit(generateSwapLink)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <FormHelperText>
        Generate swap deeplinks using CAIP-10 format. Enter the amount and decimals separately - the form will calculate the smallest unit automatically.
      </FormHelperText>
      
      <fieldset>
        <legend>Examples</legend>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button 
            variant="outlined" 
            onClick={() => { 
              setValue('fromChainId', '59144');
              setValue('fromTokenAddress', '0x176211869cA2b568f2A7D4EE941E073a821EE1ff');
              setValue('fromTokenType', 'erc20');
              setValue('toChainId', '59144');
              setValue('toTokenAddress', '0xA219439258ca9da29E9Cc4cE5596924745e12B93');
              setValue('toTokenType', 'erc20');
              setValue('amount', '10'); // 10 USDC
              setValue('decimals', '6'); // USDC has 6 decimals
            }} 
          >
            Swap 10 USDC to USDT on Linea
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => { 
              setValue('fromChainId', '1');
              setValue('fromTokenAddress', '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48');
              setValue('fromTokenType', 'erc20');
              setValue('toChainId', '');
              setValue('toTokenAddress', 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN');
              setValue('toTokenType', 'spl');
              setValue('amount', '10'); // 10 USDC
              setValue('decimals', '6'); // USDC has 6 decimals
            }} 
          >
            Swap 10 USDC to JUP (Ethereum to Solana)
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => { 
              setValue('fromChainId', '1');
              setValue('fromTokenAddress', ''); // Native ETH
              setValue('fromTokenType', 'evm-native');
              setValue('toChainId', '');
              setValue('toTokenAddress', '');
              setValue('toTokenType', 'solana');
              setValue('amount', '0.1'); // 0.1 ETH
              setValue('decimals', '18'); // ETH has 18 decimals
            }} 
          >
            Swap 0.1 ETH to SOL
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => { 
              setValue('fromChainId', '');
              setValue('fromTokenAddress', '');
              setValue('fromTokenType', 'solana');
              setValue('toChainId', '1');
              setValue('toTokenAddress', '');
              setValue('toTokenType', 'evm-native');
              setValue('amount', '0.5'); // 0.5 SOL
              setValue('decimals', '9'); // SOL has 9 decimals
            }} 
          >
            Swap 0.5 SOL to ETH
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => { 
              setValue('fromChainId', '137');
              setValue('fromTokenAddress', '');
              setValue('fromTokenType', 'evm-native');
              setValue('toChainId', '56');
              setValue('toTokenAddress', '');
              setValue('toTokenType', 'evm-native');
              setValue('amount', '10'); // 10 MATIC
              setValue('decimals', '18'); // MATIC has 18 decimals
            }} 
          >
            Swap 10 MATIC to BNB
          </Button>
        </Box>
      </fieldset>
      
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Controller
          name="fromTokenType"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.fromTokenType}>
              <InputLabel>From Token Type</InputLabel>
              <Select
                {...field}
                label="From Token Type"
              >
                <MenuItem value="evm-native">EVM Native Asset</MenuItem>
                <MenuItem value="erc20">ERC20</MenuItem>
                <MenuItem value="solana">Solana</MenuItem>
                <MenuItem value="spl">SPL</MenuItem>
              </Select>
              {errors.fromTokenType && (
                <FormHelperText>{errors.fromTokenType.message}</FormHelperText>
              )}
            </FormControl>
          )}
        />
        {(fromTokenType === 'evm-native' || fromTokenType === 'erc20') && (
          <Controller
            name="fromChainId"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                label="From Chain ID"
                fullWidth
                {...field}
                error={!!errors.fromChainId}
                helperText={errors.fromChainId?.message || 'e.g., 1 for Ethereum, 59144 for Linea'}
              />
            )}
          />
        )}
        {(fromTokenType === 'erc20' || fromTokenType === 'spl') && (
          <Controller
            name="fromTokenAddress"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                label="From Token Address"
                fullWidth
                {...field}
                error={!!errors.fromTokenAddress}
                helperText={errors.fromTokenAddress?.message || 'Contract address or token mint'}
              />
            )}
          />
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Controller
          name="amount"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              label="Amount"
              fullWidth
              {...field}
              error={!!errors.amount}
              helperText={errors.amount?.message || 'e.g., 10 for 10 USDC'}
            />
          )}
        />
        <Controller
          name="decimals"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              label="Decimals"
              type="number"
              fullWidth
              {...field}
              error={!!errors.decimals}
              helperText={errors.decimals?.message || 'e.g., 6 for USDC, 9 for SOL, 18 for ETH'}
            />
          )}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Controller
          name="toTokenType"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.toTokenType}>
              <InputLabel>To Token Type</InputLabel>
              <Select
                {...field}
                label="To Token Type"
              >
                <MenuItem value="evm-native">EVM Native Asset</MenuItem>
                <MenuItem value="erc20">ERC20</MenuItem>
                <MenuItem value="solana">Solana</MenuItem>
                <MenuItem value="spl">SPL</MenuItem>
              </Select>
              {errors.toTokenType && (
                <FormHelperText>{errors.toTokenType.message}</FormHelperText>
              )}
            </FormControl>
          )}
        />
        {(toTokenType === 'evm-native' || toTokenType === 'erc20') && (
          <Controller
            name="toChainId"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                label="To Chain ID"
                fullWidth
                {...field}
                error={!!errors.toChainId}
                helperText={errors.toChainId?.message || 'e.g., 1 for Ethereum, 59144 for Linea'}
              />
            )}
          />
        )}
        {(toTokenType === 'erc20' || toTokenType === 'spl') && (
          <Controller
            name="toTokenAddress"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                label="To Token Address"
                fullWidth
                {...field}
                error={!!errors.toTokenAddress}
                helperText={errors.toTokenAddress?.message || 'Contract address or token mint'}
              />
            )}
          />
        )}
      </Box>

      <Button type="submit" variant="contained" color="primary">
        Generate Deeplink
      </Button>
    </Box>
  );
}

export default SwapForm;