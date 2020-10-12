import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Email, emailBody } from '../../../assets/js/smtp.js'
import { ImgurService } from "../../services/imgur.service"
import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import * as firebaseui from 'firebaseui'
import { ModalDirective } from 'angular-bootstrap-md'
import { environment } from "../../../environments/environment"
import * as $ from "jquery"
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from "@angular/platform-browser"

import { HttpClient } from '@angular/common/http';
import { trigger, transition, style, animate, query, stagger, keyframes } from '@angular/animations';

@Component({
    selector: 'app-custom',
    templateUrl: './custom.component.html',
    styleUrls: ['./custom.component.scss'],
    animations: [
        trigger('explainerAnim', [
            transition('* => *', [
                query('.anim', style({ opacity: 0, transform: 'translateX(-40px)' })),
                query('.anim', stagger('500ms', [
                    animate('800ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
                ]))
            ])
        ])
    ]
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
    igHandle = ''
    prices;
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
    constructor(private imgur: ImgurService, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private titleService: Title) {
        this.titleService.setTitle("Custom Request | OVVisuals")
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
            date: "",
            servicePrice: "",
            ig: ""
        })
    }

    ngOnInit() {
        this.getPrices()
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
                firebase.database().ref("Users/" + user.uid + '/phone').on('value', function (phoneData) {
                    if (phoneData.val() || user.phoneNumber) {
                        let phoneForm = <HTMLInputElement>document.getElementById("defaultContactFormNum")
                        phoneForm.value = phoneData.val() || user.phoneNumber
                        self.phone = phoneData.val() || user.phoneNumber
                    }
                })
                firebase.database().ref("Users/" + user.uid + '/ig').on('value', function (igData) {
                    if (igData.val()) {
                        let igForm = <HTMLInputElement>document.getElementById("defaultContactFormig")
                        igForm.value = igData.val()
                        self.igHandle = igData.val()
                    }
                })
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
                    let subject = "OVVisuals Request Received"
                    let title = `Thank You, ${data.name}`
                    let subHead = `I've received your request, and I will get back to you soon! Feel free to reply to this email if you want to add anything. Here's a summary of what I got from your request:`

                    const body = emailBody(self.imgur.imgsHTML, subject, title, subHead, data)
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
                                self.ig(data)
                                self.addCustomToDB(user, data);
                                self.loadingModal.hide()
                                self.router.navigate(['/login/open-orders'], { relativeTo: self.route });
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
        event.ig = this.igHandle
        event.printOpt = this.printOption
        event.imgs = this.imgur.uploadedImgs
        if (!this.nameErr && !this.emailErr && !this.dateErr && !this.descErr && !this.serviceErr && !this.sizeErr) {
            event.servicePrice = this.prices.Services[event.service]
            console.log(event)
            try {
                if (event.printOpt === "No Print") {
                    event.printPrice = 0
                    event.framePrice = 0
                } else if (event.printOpt === "Print, no frame") {
                    event.printPrice = this.prices.Size[event.size].print
                    event.framePrice = 0
                } else if (event.printOpt === "Print and frame") {
                    event.printPrice = this.prices.Size[event.size].print
                    event.framePrice = this.prices.Size[event.size].frame
                }
            } catch (e) { }
            if (event.otherService != "") {
                event.service = event.otherService
                event.servicePrice = "Quote Pending"

            }
            if (event.otherSize != "") {
                event.size = event.otherSize
                event.printPrice = "Quote Pending"
                event.framePrice = "Quote Pending"
            }
            event.complexity = "Quote Pending"
            let self = this
            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    let updates = {}
                    updates['Users/' + user.uid + '/ig'] = event.ig
                    updates['Users/' + user.uid + '/phone'] = event.phone
                    firebase.database().ref().update(updates)
                    self.sendEmail(event)
                }
            })
        }
    }

    getDesiredSize(event) {
        this.selectedSize = (<HTMLInputElement>document.getElementById("sizeSelect")).value
    }

    addCustomToDB(user, data) {
        let date = new Date()
        let self = this
        let time = date.getTime()
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                let updates = {}
                updates["Users/" + user.uid + "/Open-orders-custom/" + `${time}`] = data
                updates["Admin/" + "Open-orders-custom/" + user.uid + "/" + `${time}`] = data
                firebase.database().ref().update(updates)
            }
        })
        let updates = {}
        let total = 0
        if (data.framePrice != "Quote Pending") {
            total += +(data.framePrice)
        }
        if (data.printPrice != "Quote Pending") {
            total += +(data.printPrice)
        }
        if (data.servicePrice != "Quote Pending") {
            total += +(data.servicePrice)
        }
        if (data.complexity != "Quote Pending") {
            total += +(data.complexity)
        }
        let acc = {
            name: user.displayName,
            order: data.service + " " + data.size + " " + data.printOpt,
            total
        }
        updates['Admin/Accounting/' + user.uid + `/${time}`] = acc
        firebase.database().ref().update(updates)
    }

    getPrices() {
        let self = this
        firebase.database().ref("Products/Custom/").on('value', function (customPrices) {
            self.prices = customPrices.val()
        })
    }

    ig(event) {
        let totalPrint = event.printPrice + event.framePrice
        if (totalPrint === "Quote PendingQuote Pending") {
            totalPrint = "Quote Pending"
        }
        let msg =
            `Hey! Just got your order from my website! Please reply to this message so that I can get to your order in a timely manner! Here's a quick summary: You requested a ${event.service} which starts at CAD$${event.servicePrice} and can go up depending on the complexity of the piece (it usually doesn't). You asked for ${event.printOpt} which will be CAD$${totalPrint} for ${event.size}. You've provided me with the following description: "${event.desc}". Finally, you've provided me with following images: `
        for (let img of this.imgur.uploadedImgs) {
            msg += `${img} `
        }
        msg += "Thank you!"
        console.log(event.ig)
        if (event.ig != "") {
            const helloWorld = firebase.functions().httpsCallable('helloWorld');
            let data = {
                user: event.ig,
                sender: environment.ig.user,
                code: "245783",
                // code: "",
                pw: environment.ig.pass,
                msg,
                valid_code: true
            }
            helloWorld(data).then(res => {
                console.log(res.data)
            })
        }
    }
}