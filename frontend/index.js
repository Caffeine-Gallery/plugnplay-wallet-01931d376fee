import { backend } from "declarations/backend";

const plugWhitelist = [
    process.env.CANISTER_ID_BACKEND
];

const PLUG_CONNECT_OPTS = {
    whitelist: plugWhitelist,
    host: "https://mainnet.dfinity.network",
    timeout: 60000,
};

class WalletManager {
    constructor() {
        this.connectButton = document.getElementById('connect-button');
        this.connectionStatus = document.getElementById('connection-status');
        this.walletInfo = document.getElementById('wallet-info');
        this.principalId = document.getElementById('principal-id');
        this.accountBalance = document.getElementById('account-balance');
        this.loading = document.getElementById('loading');
        
        this.init();
    }

    init() {
        this.connectButton.addEventListener('click', () => this.connectWallet());
        this.checkConnection();
    }

    showLoading(show) {
        this.loading.classList.toggle('d-none', !show);
    }

    async checkConnection() {
        const connected = await window.ic?.plug?.isConnected();
        if (connected) {
            this.onConnected();
        }
    }

    async connectWallet() {
        this.showLoading(true);
        try {
            const result = await window.ic?.plug?.requestConnect(PLUG_CONNECT_OPTS);
            if (result) {
                await this.onConnected();
            }
        } catch (e) {
            console.error("Failed to connect to Plug wallet:", e);
            this.connectionStatus.textContent = "Connection Failed";
        }
        this.showLoading(false);
    }

    async onConnected() {
        this.connectionStatus.textContent = "Connected";
        this.connectButton.disabled = true;
        this.walletInfo.classList.remove('d-none');

        try {
            // Get principal ID
            const principal = await window.ic.plug.agent.getPrincipal();
            this.principalId.textContent = principal.toString();

            // Get account balance
            const balance = await window.ic.plug.requestBalance();
            if (balance && balance.length > 0) {
                this.accountBalance.textContent = `${balance[0].amount} ${balance[0].symbol}`;
            }

            // Verify authentication with backend
            const isAuth = await backend.isAuthenticated(principal);
            console.log("Is authenticated:", isAuth);

        } catch (e) {
            console.error("Error fetching wallet details:", e);
        }
    }
}

// Check if Plug wallet is available
window.onload = async () => {
    if (window.ic?.plug === undefined) {
        document.getElementById('connect-button').textContent = "Plug Wallet Not Found";
        document.getElementById('connect-button').disabled = true;
        document.getElementById('connection-status').textContent = "Plug Wallet Not Installed";
    } else {
        new WalletManager();
    }
};
