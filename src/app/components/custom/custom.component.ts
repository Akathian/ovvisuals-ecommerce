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
    earliestDate = {
        year: 0,
        month: 0,
        day: 0
    }
    maxDate = {
        year: 0,
        month: 0,
        day: 0
    }
    nameErr = false;
    emailErr = false;
    serviceErr = false;
    dateErr = false;
    descErr = false;
    sizeErr = false;
    constructor(private imgur: ImgurService, private formBuilder: FormBuilder,) {
        this.customForm = this.formBuilder.group({
            name: "",
            email: "",
            phone: "",
            service: "",
            printOpt: "No Print",
            desc: "",
            size: "",
            otherService: "",
            otherSize: "",
            imgs: "",
            date: ""
        })
    }

    ngOnInit() {
        let now = new Date()
        let earliest = new Date()
        earliest.setDate(now.getDate() + 7)
        this.earliestDate.year = earliest.getFullYear()
        this.earliestDate.month = earliest.getMonth() + 1
        this.earliestDate.day = earliest.getDate()
        this.maxDate.year = this.earliestDate.year + 1
        this.maxDate.month = this.earliestDate.month
        this.maxDate.day = this.earliestDate.day
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
                    let subject = "Your OVVisuals Request"

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
                                self.addCustomToDB(data);
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
        if (!event.name) {
            if (this.name) {
                event.name = this.name
                this.nameErr = false
            } else {
                this.nameErr = true;
            }
        }
        if (!event.email) {
            if (this.email) {
                event.email = this.email
                this.emailErr = false
            } else {
                this.emailErr = true;
            }
        }
        if (!event.phone) {
            event.phone = this.phone
        }
        if (!event.date) {
            this.dateErr = true;
        } else {
            this.dateErr = false;
        }
        if (event.printOpt != "No Print" && (!event.size || (event.size === "Other" && !event.otherSize))) {
            this.sizeErr = true
        } else {
            this.sizeErr = false;
        }
        if (!event.service || (event.service === "Other" && !event.otherService)) {
            this.serviceErr = true
        } else {
            this.serviceErr = false;
        }
        if (!event.desc) {
            this.descErr = true
        } else {
            this.descErr = false;
        }
        event.printOpt = this.printOption
        event.imgs = this.imgur.uploadedImgs
        if (event.otherService != "") {
            event.service = event.otherService
        }
        if (event.otherSize != "") {
            event.size = event.otherSize
        }

        console.log(event.date)
        console.log(this.nameErr, this.emailErr, this.dateErr, this.descErr, this.serviceErr, this.sizeErr)
        if (!this.nameErr && !this.emailErr && !this.dateErr && !this.descErr && !this.serviceErr && !this.sizeErr) {
            this.sendEmail(event)
        }
    }

    getDesiredSize(event) {
        this.selectedSize = (<HTMLInputElement>document.getElementById("sizeSelect")).value
    }

    addCustomToDB(data) {
        let date = new Date()
        let self = this
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                let updates = {}
                updates["Users/" + user.uid + "/Custom-requests/" + date.getTime()] = data
                firebase.database().ref().update(updates)
            }
        })
    }

}




