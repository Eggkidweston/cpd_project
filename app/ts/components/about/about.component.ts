import { Component } from '@angular/core';
import { AppsService } from "../../services/apps.service";
import { ReleaseNote } from "../../models";
import { AppComponent } from "../../app.component";

    @Component({
        selector: 'about',
        template: require('./about.component.html'),
        styles: [require('./about.component.scss').toString()]
    })

    export class AboutComponent {

        public releaseNotes: Array<ReleaseNote>;

        constructor(private appService: AppsService) {

            this.getReleaseNotes();
        }

        private getReleaseNotes() {
            this.appService.getReleaseNotes()
                .subscribe(
                    releaseNotes => {
                        this.releaseNotes = releaseNotes;
                    },
                    (error: any) => AppComponent.generalError(error.status)
                )
        }

    }   