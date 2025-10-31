import { Routes } from '@angular/router';
import { AboutPageComponent } from './components/Pages/clieant-feeds/about-page/about-page.component';
import { DashboardComponent } from './components/Pages/Admin-feeds/dashboard/dashboard.component';
import { LoginComponent } from './components/Auth/login/login.component';
import { SignupComponent } from './components/Auth/signup/signup.component';
import { ForgotPasswordComponent } from './components/Auth/forgot-password/forgot-password.component';
import { AdminLayoutComponent } from './components/Layout/admin-layout/admin-layout.component';
import { PublicLayoutComponent } from './components/Layout/public-layout/public-layout.component';
import { FeedsComponent } from './components/Pages/Admin-feeds/feeds/feeds.component';
import { FeedDetailsComponent } from './components/Pages/Admin-feeds/feed-details/feed-details.component';
import { FeedSourcesComponent } from './components/Pages/Sources/feed-sources/feed-sources.component';
import { EditFeedSourceComponent } from './components/Pages/Sources/edit-feed-source/edit-feed-source.component';
import { AddFeedSourceComponent } from './components/Pages/Sources/add-feed-source/add-feed-source.component';
import { HomePageComponent } from './components/Pages/clieant-feeds/home-page/home-page.component';
import { AmericasComponent } from './components/Pages/clieant-feeds/americas/americas.component';
import { RoleGuard } from './guards/RoleGuard';
import { AllUserComponent } from './components/Pages/Admin-feeds/all-user/all-user.component';
import { AsiaComponent } from './components/Pages/clieant-feeds/asia/asia.component';
import { MiddleEastComponent } from './components/Pages/clieant-feeds/middleeast/middleeast.component';
import { EuropeComponent } from './components/Pages/clieant-feeds/europe/europe.component';
import { AfricaComponent } from './components/Pages/clieant-feeds/africa/africa.component';
import { MyProfileComponent } from './components/Pages/Admin-feeds/myprofile/myprofile.component';
import { OceaniaComponent } from './components/Pages/clieant-feeds/oceania/oceania.component';
import { MyProfileUserComponent } from './components/Pages/clieant-feeds/my-profile-user/my-profile-user.component';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: 'home', component: HomePageComponent },
      { path: 'about', component: AboutPageComponent },
      { path: 'ForgotPassword', component: ForgotPasswordComponent },
      { path: 'americas', component: AmericasComponent },
      { path: 'Asia', component: AsiaComponent },
      { path: 'middleeast', component: MiddleEastComponent },
      { path: 'europe', component: EuropeComponent},
      { path: 'africa', component: AfricaComponent},
      { path: 'Oceania', component: OceaniaComponent},
      { path: 'About-US', component: AboutPageComponent },

      { path: 'MyProfileUser', component: MyProfileUserComponent },


      { path: 'Login', component: LoginComponent },
      { path: 'SignUp', component: SignupComponent },


      { path: '', redirectTo: '/home', pathMatch: 'full' },
    ]
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [RoleGuard],
    data: { role: 'Admin' },
    children: [
      { path: 'myprofile', component: MyProfileComponent },
      { path: 'All-User', component: AllUserComponent },
      { path: 'DashBoard', component: DashboardComponent },
      { path: 'feeds', component: FeedsComponent },
      { path: 'feeds/:id', component: FeedDetailsComponent },
      { path: 'AllSources', component: FeedSourcesComponent },
      { path: 'feed-sources/edit/:id', component: EditFeedSourceComponent },
      { path: 'feed-sources/add', component: AddFeedSourceComponent },
    ]
  },
];

