import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { navMenu } from './mock/nav-menu.mock';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent implements OnInit {
  public navList = navMenu
  public selectedNav = navMenu[0].menu

  private routeSub:Subscription = new Subscription()

  constructor(
    private _router:Router
    ) { 
      this.routeSub && this.routeSub.unsubscribe()
      this.routeSub = this._router.events.subscribe(({url}:any) => {
        if (url) {
          this.selectedNav = url.replace('/','')
        }
      })
    }

  ngOnInit(): void { }

  public selectRouterLink(menuLink:string):void {
    this.selectedNav = menuLink
    this._router.navigate([menuLink])
  }

}
