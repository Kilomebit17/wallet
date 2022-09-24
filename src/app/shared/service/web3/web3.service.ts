import { Subject } from 'rxjs';
import { Injectable, NgZone } from '@angular/core';

import Web3Modal from "web3modal";
import { ethers } from 'ethers';
import Web3 from 'web3';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { resolve } from 'dns';

@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  public walletChainChanged$ = new Subject()
  web3Modal: any;
  web3js: any = Web3.givenProvider
  provider: any;
  private _wallet = {
    address: '',
    shortAddress:'',
    balanceBNB: 0,
    balanceBUSD: 0,
    chain:''
  };


  public get walletAddress(): string  {
    return this._wallet.address;
  }
  public get walletShortAddress(): string  {
    return this._wallet.shortAddress;
  }
  public get walletBnbBalance():string | number {
    return this._wallet.balanceBNB
  }
  
  public get walletChain() : string {
    return this._wallet.chain
  }
  
  public get isWalletConnected(): boolean {
    return !!this._wallet.address;
  }

 

  constructor(
    private _zone:NgZone
  ) {
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

      await this.getChainValue()
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
    this._wallet.shortAddress = `${wallet.substr(0,10)}...${wallet.substr(wallet.length - 10)}`
  }

  async getBalane(address: any) {
    const initialvalue = await this.web3js.eth.getBalance(address);
    this._wallet.balanceBNB = this.web3js.utils.fromWei(initialvalue, 'ether');

    return this._wallet.balanceBNB;
  }
  public getChainValue():Promise<any> {
    return new Promise((resolve,reject) => {
      this.web3js.eth.getChainId().then((chainId:number) => {

        this._setChainId(chainId)
        this.walletChainChanged$.next()

        return resolve(chainId)
      })
    })
  }
  async disconnect(): Promise<any> {
    //TODO disconnect from metamask
    // await this.web3js.eth.currentProvider.disconnect()
  }
  private _readMetamaskEvents():void {

    this.web3js.eth.getChainId().then((chainId:number) => {
      this._setChainId(chainId)
    })
    
    this.provider.on("chainChanged", async () => {
      await this.getBalane(this._wallet.address)
      console.log('Chain was changed!');
    });

    this.provider.on("networkChanged", (newtwork:string) => { 
      //* in callback we get chain number. Look at all chain list -- https://chainlist.org/
      //* 1 its eth mainnet 
      //* 97 its binance testnet 
      //* 56 its binance mainnet
      this._zone.run(async () => {
        this._setChainId(newtwork)
        await this.getBalane(this._wallet.address)
        this.walletChainChanged$.next()
      })
    });

    this.provider.on('accountsChanged', function (accounts: any) {
      console.log('Account was changed!');
    });
  }

  private _setChainId(chainId:number | string): void {
    switch (+chainId) {
      case 1:
        this._wallet.chain = 'ethereum'
        break;
      case 97:
        this._wallet.chain = 'binance'
        break;
      case 56:
        this._wallet.chain = 'binance'
        break;
      default:
        break;
    }
  }
}
