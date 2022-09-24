import { Web3Service } from 'src/app/shared/service/web3/web3.service';
import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  constructor(private _web3Service:Web3Service) {
    
  }
  async ngOnInit() {
    this._web3Service.checkMetamaskConnection()
  }
  ngAfterViewInit(): void {
  }
}
