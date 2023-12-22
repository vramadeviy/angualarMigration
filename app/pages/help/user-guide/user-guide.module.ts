import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { UserGuideComponent } from './user-guide.component';


export const routes = [
    { path: '', component: UserGuideComponent, pathMatch: 'full' }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        PerfectScrollbarModule,
    ],
    declarations: [
        UserGuideComponent
    ]
})

export class UserGuideModule { }
