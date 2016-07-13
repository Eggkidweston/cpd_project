import { Component, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'recommended-recent',
  template: require('./recommended-recent.component.html'),
  styles: [require('../../../sass/recommended-recent.scss').toString()]
})
export class RecommendedRecentComponent implements OnInit {
    @Output() recommendedSelected = new EventEmitter();
    @Output() recentSelected = new EventEmitter();
 
    private _recommendedRecent: RecommendedRecent;
    
    ngOnInit() {
        this.recommendedRecent = RecommendedRecent.Recommended;
    }
        
    get recommendedRecent(): RecommendedRecent {
        return this._recommendedRecent;
    }     
    
    set recommendedRecent(newRecommendedRecent: RecommendedRecent) {
        this._recommendedRecent = newRecommendedRecent;
        
        if( this._recommendedRecent === RecommendedRecent.Recommended ) {
            this.recommendedSelected.emit("event");    
        } else {
            this.recentSelected.emit("event");
        }
    }

    recommendedClicked() {
        this.recommendedRecent = RecommendedRecent.Recommended;
    }
    
    recentClicked() {
        this.recommendedRecent = RecommendedRecent.Recent;
    }
}

enum RecommendedRecent {
    // this enum isn't available in the view template
    Recommended=0, Recent=1
}