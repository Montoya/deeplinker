import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Box, Tab, Tabs, IconButton } from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';
import BrowserForm from './components/BrowserForm';
import SendNativeForm from './components/SendNativeForm';
import BuyForm from './components/BuyForm'; 
import SellForm from './components/SellForm';
import SwapForm from './components/SwapForm'; 
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Tab configuration with URL paths (accounting for GitHub Pages base path)
const basePath = '/deeplinker';
const tabs = [
  { label: 'Open Browser', path: `${basePath}/browser`, component: BrowserForm },
  { label: 'Buy', path: `${basePath}/buy`, component: BuyForm },
  { label: 'Sell', path: `${basePath}/sell`, component: SellForm },
  { label: 'Swap', path: `${basePath}/swap`, component: SwapForm },
  { label: 'Send Native', path: `${basePath}/send`, component: SendNativeForm },
];

function App() {
  const [currentTab, setCurrentTab] = useState(0);
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  // Initialize tab from URL on component mount
  useEffect(() => {
    const path = window.location.pathname;
    const tabIndex = tabs.findIndex(tab => tab.path === path);
    if (tabIndex !== -1) {
      setCurrentTab(tabIndex);
    } else if (path === basePath || path === `${basePath}/` || path === '/') {
      // Default to browser tab for root path
      setCurrentTab(0);
      window.history.replaceState({}, '', `${basePath}/browser`);
    }
  }, []);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const tabIndex = tabs.findIndex(tab => tab.path === path);
      if (tabIndex !== -1) {
        setCurrentTab(tabIndex);
      } else if (path === basePath || path === `${basePath}/` || path === '/') {
        setCurrentTab(0);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    setGeneratedUrl('');
    setCopySuccess(false);
    
    // Update URL without page reload
    const newPath = tabs[newValue].path;
    window.history.pushState({}, '', newPath);
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
            
            {(() => {
              const CurrentComponent = tabs[currentTab].component;
              return <CurrentComponent setGeneratedUrl={setGeneratedUrl} />;
            })()}
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