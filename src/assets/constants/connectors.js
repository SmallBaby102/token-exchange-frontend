import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

const POLLING_INTERVAL = 12000;
// const RPC_URL = "https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";
const RPC_URL = "https://bsc-dataseed.binance.org";

export const injected = new InjectedConnector({
    supportedChainIds: [56],
});

export const walletconnect = new WalletConnectConnector({
    rpc: { 1: RPC_URL },
    bridge: "https://bridge.walletconnect.org",
    qrcode: true,
    pollingInterval: POLLING_INTERVAL,
});
