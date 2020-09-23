import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Email, emailBody } from '../../../assets/js/smtp.js'
import { ImgurService } from "../../services/imgur.service"
import * as firebase from 'firebase'
import * as firebaseui from 'firebaseui'
import { ModalDirective } from 'angular-bootstrap-md'
import { environment } from "../../../environments/environment"
import * as $ from "jquery"
import { FormBuilder } from '@angular/forms';

@Component({
    selector: 'app-custom',
    templateUrl: './custom.component.html',
    styleUrls: ['./custom.component.scss']
})
export class CustomComponent implements OnInit, AfterViewInit {
    @ViewChild('loginModal', { static: false }) loginModal: ModalDirective
    @ViewChild('confirmModal', { static: false }) confirmModal: ModalDirective
    @ViewChild('errorModal', { static: false }) errorModal: ModalDirective
    @ViewChild('loadingModal', { static: false }) loadingModal: ModalDirective

    attachments = [];
    imgsHTML = '';
    uploadedNum = 0;
    numToUpload = 0;
    selectedService = ""
    printOption = "No Print"
    name = ''
    email = ''
    phone = ''
    selectedSize = ""
    customForm;
    constructor(private imgur: ImgurService, private formBuilder: FormBuilder,) {
        this.customForm = this.formBuilder.group({
            name: "",
            email: "",
            phone: "",
            service: "",
            printOpt: "",
            desc: "",
            size: "",
            otherService: "",
            otherSize: "",
            imgs: ""
        })
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        let self = this
        firebase.auth().onAuthStateChanged(function (user) {
            if (!user) {
                self.askLogin()
            } else {
                if (user.displayName) {
                    let nameForm = <HTMLInputElement>document.getElementById("defaultContactFormName")
                    nameForm.value = user.displayName
                    self.name = user.displayName
                }
                if (user.email) {
                    let emailForm = <HTMLInputElement>document.getElementById("defaultContactFormEmail")
                    emailForm.value = user.email
                    self.email = user.email
                }
                if (user.phoneNumber) {
                    let phoneForm = <HTMLInputElement>document.getElementById("defaultContactFormNum")
                    phoneForm.value = user.phoneNumber
                    self.phone = user.phoneNumber
                }

            }
        })
    }

    askLogin() {
        try {
            this.loginModal.show()
        } catch (e) {
            this.loginModal.show()
        }

        var uiConfig = {
            signInSuccessUrl: `/custom`,
            'signInFlow': 'popup',
            signInOptions: [
                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                firebase.auth.FacebookAuthProvider.PROVIDER_ID,
                firebase.auth.EmailAuthProvider.PROVIDER_ID,
            ],
            tosUrl: '/terms',
            privacyPolicyUrl: function () {
                window.location.assign('/privacy');
            }
        };
        try {
            var ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth());
            ui.start('#firebaseui-auth-container', uiConfig);
        } catch (e) {
        }
    }

    sendEmail(data) {
        let self = this

        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                if ((self.attachments.length === self.numToUpload) && (self.numToUpload === self.imgur.uploadedImgs.length)) {
                    self.loadingModal.show()
                    let subject = "OVVisuals Request #435"

                    const body = emailBody(self.imgur.imgsHTML, subject, data)
                    Email.send({
                        SecureToken: environment.smtp.secure, // move to envir
                        To: `${data.email}`,
                        From: `${environment.smtp.from}`,
                        Subject: subject,
                        Body: body,
                        Attachments: self.attachments
                    }).then(
                        message => {
                            if (message === "OK") {
                                self.imgsHTML = ''
                                self.uploadedNum = 0
                                self.numToUpload = 0
                                self.attachments = []
                            } else {
                                self.errorModal.show()
                            }
                            self.loadingModal.hide()
                        }
                    );
                } else {
                    console.log("Wait fam")
                }
            } else {
                self.askLogin();
            }
        })
    }


    async handleFileInput(event) {
        document.getElementById("sendEmailBtn").classList.add("disabled")
        let events = [];
        events = Object.values(event)
        if (events) {
            if (events.length > 1) {
                $("#inputGroupFile01").next('.custom-file-label').html(`${events.length} files`)
            } else {
                $("#inputGroupFile01").next('.custom-file-label').html(`${events[0].name}`)
            }
        }
        console.log(events)
        await this.imgur.auth(Object.values(event))
        this.numToUpload = events.length
        this.recurseEvents(this, events)
    }

    recurseEvents(self, events) {
        if (events.length === 0) {
            document.getElementById("sendEmailBtn").classList.remove("disabled")
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

    getDesiredService(event) {
        this.selectedService = (<HTMLInputElement>document.getElementById("serviceSelect")).value
    }

    printChange(event) {
        this.printOption = event
    }
    nameChange(event) {
        console.log(document.getElementById("defaultContactFormName").innerHTML)
    }

    onSubmit(event) {
        if (event.name === "") {
            event.name = this.name
        }
        if (event.email === "") {
            event.email = this.email
        }
        if (event.phone === "") {
            event.phone = this.phone
        }
        event.printOpt = this.printOption
        event.imgs = this.imgur.uploadedImgs
        if (event.otherService != "") {
            event.service = event.otherService
        }
        if (event.otherSize != "") {
            event.size = event.otherSize
        }
        this.sendEmail(event)
        console.log(event)
    }

    getDesiredSize(event) {
        this.selectedSize = (<HTMLInputElement>document.getElementById("sizeSelect")).value
    }

}




