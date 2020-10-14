import { Component, ViewChild } from '@angular/core';
import { ModalDirective }
    from 'your path to modal directive';

@Component({ selector: 'show-and-hide-modal-example', templateUrl: './show-and-hide-modal.component.html', })
export class ShowAndHideModalComponent {
    @ViewChild('demoBasic') demoBasic: ModalDirective;
    showAndHideModal() {
        this.demoBasic.show(); setTimeout(() => {
            this.demoBasic.hide();
        }, 3000);
    }
}