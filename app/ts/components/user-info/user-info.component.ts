import { Component } from 'angular2/core';

@Component({
    selector: 'user-info',
    template: require('./user-info.component.html'),
    styles: [require('../../../sass/user-info.scss').toString()]
})
export class UserInfoComponent {
}   