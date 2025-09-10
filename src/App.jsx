import React, { useState } from 'react';
import { Container, Grid, Paper, Box, Tab, Tabs, IconButton } from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';
import BrowserForm from './components/BrowserForm';
import SendNativeForm from './components/SendNativeForm';
import BuyForm from './components/BuyForm'; 
import SellForm from './components/SellForm';
import SwapForm from './components/SwapForm'; 
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function App() {
  const [currentTab, setCurrentTab] = useState(0);
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    setGeneratedUrl('');
    setCopySuccess(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedUrl).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); // Reset after 2 seconds
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <h1>MetaMask Deeplink Generator</h1>
      </Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2, width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs value={currentTab} onChange={handleTabChange}>
                <Tab label="Open Browser" />
                <Tab label="Buy" />
                <Tab label="Sell" />
                <Tab label="Swap" />
                <Tab label="Send Native" />
              </Tabs>
            </Box>
            
            {currentTab === 0 && <BrowserForm setGeneratedUrl={setGeneratedUrl} />}
            {currentTab === 1 && <BuyForm setGeneratedUrl={setGeneratedUrl} />}
            {currentTab === 2 && <SellForm setGeneratedUrl={setGeneratedUrl} />}
            {currentTab === 3 && <SwapForm setGeneratedUrl={setGeneratedUrl} />}
            {currentTab === 4 && <SendNativeForm setGeneratedUrl={setGeneratedUrl} />}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2, width: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <h3>Generated Deeplink</h3>
              {generatedUrl && <QRCodeSVG value={generatedUrl} size={200} sx={{ mt: 2 }} />}
              {generatedUrl && (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginTop: '1em' }}>
                  <Box 
                    component="a" 
                    href={generatedUrl}
                    sx={{ 
                      wordBreak: 'break-all',
                      textAlign: 'left',
                      flexGrow: 1,
                      color: 'primary.main'
                    }}
                  >
                    {generatedUrl}
                  </Box>
                  <IconButton onClick={handleCopy}>
                    {copySuccess ? <CheckCircleIcon color="success" /> : <ContentCopyIcon />}
                  </IconButton>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App; 