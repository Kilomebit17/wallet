import { Injectable } from '@angular/core';

import Web3Modal from "web3modal";
import { ethers } from 'ethers';
import Web3 from 'web3';
import WalletConnectProvider from '@walletconnect/web3-provider';

@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  web3Modal: any;
  web3js: any = Web3.givenProvider
  provider: any;

  private _wallet = {
    address: '',
    balanceBNB: null,
    balanceBUSD: null,
  };


  public get walletAddress(): string | null {
    return this._wallet.address;
  }

  public get isWalletConnected(): boolean {
    return !!this._wallet.address;
  }

  constructor() {
    if (typeof window.ethereum !== 'undefined') {
      console.log('MetaMask is installed!');
    }
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          infuraId: "INFURA_ID" // required
        }
      }
    };

    this.web3Modal = new Web3Modal({
      network: "mainnet", // optional
      cacheProvider: true, // optional
      providerOptions, // required
      theme: {
        background: "rgb(39, 49, 56)",
        main: "rgb(199, 199, 199)",
        secondary: "rgb(136, 136, 136)",
        border: "rgba(195, 195, 195, 0.14)",
        hover: "rgb(16, 26, 32)"
      }
    });
  }

  public async checkMetamaskConnection(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        this.provider = 'ethereum' in window ? window['ethereum'] : Web3.givenProvider;
        this.web3js = new Web3(this.provider);
      } catch (error) {
        reject(null)
      }
      this._readMetamaskEvents()

      await this.getWalletAddress()

      await this.getBalane(this._wallet.address)

    })


  }
  async connectMetamask() {
    this.web3Modal.clearCachedProvider();

    this.provider = await this.web3Modal.connect(); // set provider
    this.web3js = new Web3(this.provider); // create web3 instance

    this._readMetamaskEvents()
  }

  async getWalletAddress(): Promise<any> {
    const [wallet] = await this.web3js.eth.getAccounts()
    this._wallet.address = wallet
  }

  async getBalane(address: any) {
    const initialvalue = await this.web3js.eth.getBalance(address);
    this._wallet.balanceBNB = this.web3js.utils.fromWei(initialvalue, 'ether');

    return this._wallet.balanceBNB;
  }

  async disconnect(): Promise<any> {
    debugger
    //TODO disconnect from metamask
    // await this.web3js.eth.currentProvider.disconnect()
  }
  private _readMetamaskEvents() {
    this.provider.on("chainChanged", () => {
      console.log('Chain was changed!');

    });
    this.provider.on('accountsChanged', function (accounts: any) {
      console.log('Account was changed!');
    });
  }
}
