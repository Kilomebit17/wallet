import { StorageService } from './../storage/storage.service';
import { providers } from 'ethers';
import { ReplaySubject, Subject } from 'rxjs';
import { Injectable, NgZone } from '@angular/core';

import Web3Modal from "web3modal";
import Web3 from 'web3';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { MetamaskChains } from '../../interface/my-wallet.interface';

@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  public metaMaskTrigger$ = new ReplaySubject()
  public trustWalletTrigger$ = new Subject()
  web3Modal: any;
  web3js: any = Web3.givenProvider
  web3WalletconnectProvider:any
  provider: any;

  private _wallet = {
    metaMaskShortAddress:'',
    trustWalletShortAddress:'',
    balanceBNB: 0,
    balanceBUSD: 0,
    chain:'',
    metaMaskWalletAddress: '',
    trustWalletConnectAddress:''
  };


  public get metaMaskWalletAddress(): string  {
    return this._wallet.metaMaskWalletAddress;
  }
  public get trustWalletAddress(): string  {
    return this._wallet.trustWalletConnectAddress;
  }
  public get metaMaskShortAddress(): string  {
    return this._wallet.metaMaskShortAddress;
  }
  public get trustWalletShortAddress(): string  {
    return this._wallet.trustWalletShortAddress;
  }
  public get walletBnbBalance():string | number {
    return this._wallet.balanceBNB
  }
  public get walletChain() : string {
    return this._wallet.chain
  }
  public get isMetaMaskWalletConnected(): boolean {
    return !!this._wallet.metaMaskWalletAddress;
  }
  public get isTrustWalletConnected(): boolean {
    return !!this._wallet.trustWalletConnectAddress;
  }

 

  constructor(
    private _zone:NgZone,
    private _storageService:StorageService
  ) {
    if (typeof window.ethereum !== 'undefined') {
      console.log('MetaMask is installed!');
    }
  }
  
  public checkTrustWalletConnection() { //! on load platform checking trust wallet
    const walletInfo = JSON.parse(this._storageService.get('walletconnect'))
    if(walletInfo?.connected) {
      this._wallet.trustWalletConnectAddress = walletInfo.accounts[0]
      this._wallet.trustWalletShortAddress = `${walletInfo.accounts[0].substr(0,8)}...${walletInfo.accounts[0].substr(walletInfo.accounts[0].length - 8)}`
    }
  }

  public async checkMetamaskConnection(): Promise<any> { //! on load platform checking metamask wallet
    return new Promise(async (resolve, reject) => {
      try {
        this.provider = 'ethereum' in window ? window['ethereum'] : Web3.givenProvider;
        if(this.provider) {
          this.web3js = new Web3(this.provider);
        }
      } catch (error) {
        reject(null)
      }
        this._readMetamaskEvents()
  
        await this.getWalletAddress()
  
        await this.getBalane(this._wallet.metaMaskWalletAddress)
  
        await this.getChainValue()
    })
  }

  async trustWalletConnect() { //! handle trust wallet connect click
    this.web3Modal = new Web3Modal({
      network: "mainnet", // optional
      cacheProvider: true, // optional
      disableInjectedProvider: true,
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider, // required
          options: {
            infuraId: "d92d51662f544f829a9c7c622a311797" // required
          }
        }
      },
    })

    this.provider = await this.web3Modal.connect(); // set provider

    const accounts = (await this.provider.enable()) as string[]
    this._wallet.trustWalletConnectAddress = accounts[0]
    this._wallet.trustWalletShortAddress = `${accounts[0].substr(0,8)}...${accounts[0].substr(accounts[0].length - 8)}`

    this.web3WalletconnectProvider = new providers.Web3Provider(this.provider) //* for use methods trust wallet

    this._readTrustWalletEvents()

    this._zone.run(() => {
      this.checkTrustWalletConnection()
      this.trustWalletTrigger$.next()
    })
  }

  async connectMetamask() { //! handle metamask wallet connect click
    this.web3Modal = new Web3Modal({
      network: "mainnet", // optional
      cacheProvider: true, // optional
      providerOptions:{} 
    });
    this.web3Modal.clearCachedProvider();

    this.provider = await this.web3Modal.connect(); // set provider

    this.web3js = new Web3(this.provider); // create web3 instance

    this._zone.run(async () => { //! for platform update informations
        await this.getWalletAddress()
        await this.getBalane(this._wallet.metaMaskWalletAddress)
        await this.getChainValue()

        this.metaMaskTrigger$.next()
    })

    this._readMetamaskEvents()
  }

  async getWalletAddress(): Promise<any> {
    const [wallet] = await this.web3js.eth.getAccounts() //! getting wallet from metamask

    if (wallet) {
      this._wallet.metaMaskWalletAddress = wallet
      this._wallet.metaMaskShortAddress = `${wallet.substr(0,8)}...${wallet.substr(wallet.length - 8)}`
    }

  }

  async getBalane(address: any):Promise<any> { //! getting balance from metamask
    if (address) {
      const initialvalue = await this.web3js.eth.getBalance(address);
      this._wallet.balanceBNB = this.web3js.utils.fromWei(initialvalue, 'ether'); //* BNB
  
      return this._wallet.balanceBNB;
    }
  }

  public getChainValue():Promise<any> { //! getting chainId from metamask
    return new Promise((resolve,reject) => {
      this.web3js.eth.getChainId().then((chainId:number) => {

      this._zone.run(() => {
        this._setChainId(chainId) //! setting chain id
        this.metaMaskTrigger$.next()
      })

        return resolve(chainId)
      })
    })
  }

  public async metaMaskWalletDisconnect(): Promise<any> { 
    //TODO disconnect from metamask
  }

  public async trustWalletDisconnect():Promise<any> { //! trust wallet disconnect
    this._wallet.trustWalletConnectAddress = ''
    this._wallet.trustWalletShortAddress = ''

    try {
        await this.provider.close()
    } catch (e) {
        console.log(e)
    }
    // Also clear the cacheProvider so it asks for wallet options again, instead of asking the login of previous provider
    try {
        await this.web3Modal.clearCachedProvider();
    } catch (e) {
        console.log(e)
    }
  }

  private _readTrustWalletEvents():void {
    this.web3WalletconnectProvider.on("disconnect", (code: number, reason: string) => {
      console.log(code, reason);
    });
  }
  private _readMetamaskEvents():void {
    this.provider.on("chainChanged", async () => { //! on metamask chain changed 
      await this.getBalane(this._wallet.metaMaskWalletAddress)
      console.log('Chain was changed!');
    });

    this.provider.on("networkChanged", (newtwork:string) => { //! on metamask chain changed but there we getting network id - list (https://chainlist.org/)  
      //* in callback we get chain number. Look at all chain list -- https://chainlist.org/
      //* 1 its eth mainnet 
      //* 97 its binance testnet 
      //* 56 its binance mainnet
      this._zone.run(async () => {
        this._setChainId(newtwork)
        await this.getBalane(this._wallet.metaMaskWalletAddress)
        this.metaMaskTrigger$.next()
      })
    });

    this.provider.on('accountsChanged',  (accounts: any) => { //! on metamask change account 
      console.log('Account was changed!');
      if(accounts.length === 0) {
        this._wallet.metaMaskShortAddress = ''
        this._wallet.metaMaskWalletAddress = ''
        this._wallet.balanceBNB = 0
        this._zone.run(() => {})
      }
    });

    
  }

  private _setChainId(chainId:number | string): void {
    switch (+chainId) {
      case 1:
        this._wallet.chain = MetamaskChains.eth
        break;
      case 97:
        this._wallet.chain = MetamaskChains.binance
        break;
      case 56:
        this._wallet.chain = MetamaskChains.binance
        break;
      default:
        break;
    }
  }
}
