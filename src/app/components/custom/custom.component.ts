import { Component, OnInit, ViewChild } from '@angular/core';
import { Email, emailBody } from '../../../assets/js/smtp.js'
import { ImgurService } from "../../services/imgur.service"
import * as firebase from 'firebase'
import * as firebaseui from 'firebaseui'
import { ModalDirective } from 'angular-bootstrap-md'

@Component({
    selector: 'app-custom',
    templateUrl: './custom.component.html',
    styleUrls: ['./custom.component.scss']
})
export class CustomComponent implements OnInit {
    @ViewChild('loginModal', { static: false }) loginModal: ModalDirective
    @ViewChild('confirmModal', { static: false }) confirmModal: ModalDirective
    @ViewChild('loadingModal', { static: false }) loadingModal: ModalDirective

    attachments = [];
    imgsHTML = '';
    uploadedNum = 0;
    numToUpload = 0;

    constructor(private imgur: ImgurService) { }

    ngOnInit() {
    }
    sendEmail() {
        if ((this.attachments.length === this.numToUpload) && (this.numToUpload === this.imgur.uploadedImgs.length)) {
            this.loadingModal.show()
            let name = "Akathian"
            let subject = "OVVisuals Request #435"
            let self = this
            // this.imgsHTML = this.imgur.imgsHTML

            const body = emailBody(this.imgur.imgsHTML, subject, name)
            Email.send({
                SecureToken: "b7aea72c-63e1-40fc-986c-e4623320d929",
                To: 'akathian05@gmail.com',
                From: "support@ovvisuals.com",
                Subject: subject ,
                Body: body,
                Attachments: self.attachments
            }).then(

                message => {
                    self.imgsHTML = ''
                    self.uploadedNum = 0
                    self.numToUpload = 0
                    self.attachments = []
                    self.loadingModal.hide()
                }
            );
        } else {
            console.log("Wait fam")
        }

    }


    async handleFileInput(self, event) {
        document.getElementById("sendEmailBtn").classList.add("disabled")
        let events = [];
        events = Object.values(event)
        console.log(events)
        await this.imgur.auth(Object.values(event))
        this.numToUpload = events.length
        this.recurseEvents(this, events)
        document.getElementById("sendEmailBtn").classList.remove("disabled")
    }

    recurseEvents(self, events) {
        if (events.length === 0) {
            return
        }
        let image = events[0]
        var reader = new FileReader();
        reader.readAsBinaryString(image);

        reader.onload = function () {
            let dataUri = "data:" + image.type + ";base64," + btoa(<string>reader.result);
            let fileData = {
                name: image.name,
                data: dataUri
            }
            self.attachments.push(fileData)
            events.shift()
            self.recurseEvents(self, events)
            return
        };
    }

}




