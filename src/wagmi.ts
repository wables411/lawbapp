import { createConfig, http } from 'wagmi';
import { base } from 'wagmi/chains';
import { farcasterMiniApp } from '@farcaster/miniapp-wagmi-connector';

// Get RPC URL from environment variable or use public endpoint
const getBaseRpcUrl = (): string => {
  const envUrl = import.meta.env.VITE_BASE_RPC_URL;
  if (envUrl) return envUrl;
  return 'https://mainnet.base.org';
};

// Base miniapp always uses Farcaster connector
const connectors = [farcasterMiniApp()];

export const config = createConfig({
  chains: [base], // Only Base chain
  connectors,
  // Farcaster connector doesn't support EIP-6963 wallet discovery
  multiInjectedProviderDiscovery: false,
  transports: {
    [base.id]: http(getBaseRpcUrl()),
  },
  // Auto-connect when in Base/Farcaster miniapp
  // The Farcaster connector will automatically connect if available
  ssr: false,
});

// Export all chains for compatibility (only Base)
export const allChains = [base];
