import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ControlGroup, FormBuilder, AbstractControl, Validators } from '@angular/common';
import { RatingComponent } from '../../../shared/rating/rating.component';
import { AppsService } from '../../../../services/services';
import { Review } from '../../../../models';

@Component({
    selector: 'submit-review',
    template: require('./submit-review.component.html'),
    styles: [require('./submit-review.scss').toString()]
    directives: [RatingComponent]
})
export class SubmitReviewComponent {
    @Input() resourceId: number;
    @Output() reviewAdded: EventEmitter<Review> = new EventEmitter<Review>();
    
    reviewForm: ControlGroup;
    reviewTitle: AbstractControl;
    reviewDescription: AbstractControl;
    reviewRating: number;
    
    busy: boolean = false;
    reviewing: boolean = false;
    
    constructor(private appsService: AppsService, fb: FormBuilder) {
        this.reviewForm = fb.group({
            "reviewTitle": ["", Validators.required],
            "reviewDescription": ["", Validators.required]
        });
        
        this.reviewTitle = this.reviewForm.controls['reviewTitle'];
        this.reviewDescription = this.reviewForm.controls['reviewDescription'];
    }
     
    submitReview() {
        this.reviewing = true;
    }
    
    onSubmit(formVaules: any) {
        if( this.reviewForm.valid ) {
            this.busy = true;
            
            let review = new Review(this.resourceId, this.reviewTitle.value, this.reviewDescription.value, this.reviewRating);
                
            this.appsService.submitReview(review,
                (review) => {
                    this.busy = false;
                    this.reviewing = false;
                    this.reviewAdded.emit(review);
                },
                (err) => {
                    console.log(err);
                    this.busy = false;
                    this.reviewing = false;
                }
            );
        }
    }
    
    ratingChanged(newRating: number) {
        this.reviewRating = newRating;
    }
    
    cancelClicked() {
        this.reviewing = false;
    }
}