import { CommonModule } from '@angular/common';
import { NgModule } from "@angular/core";

import { HeaderComponent } from './components/header/header.component';
import { UserInfoComponent } from './components/header/components/user-info/user-info.component';
import { SearchComponent } from './components/search/search.component';
import { UserAvatarComponent } from './components/user-avatar/user-avatar.component';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { MyCardsComponent } from './components/my-cards/my-cards.component';
import { UserCoinCardComponent } from './components/user-coin-card/user-coin-card.component';

@NgModule({
    imports:[CommonModule],
    exports:[
      HeaderComponent,
      SearchComponent,
      UserInfoComponent,
      UserAvatarComponent,
      NavMenuComponent,
      MyCardsComponent,
      UserCoinCardComponent
    ],
    declarations:[
      HeaderComponent,
      SearchComponent,
      UserInfoComponent,
      UserAvatarComponent,
      NavMenuComponent,
      MyCardsComponent,
      UserCoinCardComponent
    ],
    entryComponents:[]
})
export class SharedModule {}