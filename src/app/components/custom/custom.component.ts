/* eslint-disable max-len */
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Email, emailBody } from '../../../assets/js/smtp.js';
import { ImgurService } from '../../services/imgur.service';
import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import * as firebaseui from 'firebaseui';
import { ModalDirective } from 'angular-bootstrap-md';
import { environment } from '../../../environments/environment';
import { ImageTools } from '../../../assets/js/imgTools';

import * as $ from 'jquery';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

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
    @ViewChild('loginModal', { static: false }) loginModal: ModalDirective;
    @ViewChild('confirmModal', { static: false }) confirmModal: ModalDirective;
    @ViewChild('errorModal', { static: false }) errorModal: ModalDirective;
    @ViewChild('loadingModal', { static: false }) loadingModal: ModalDirective;
    attachments = [];
    smallAttach = [];

    imgsHTML = '';
    uploadedNum = 0;
    numToUpload = 0;
    selectedService = '';
    printOption = 'No Print';
    name = '';
    email = '';
    phone = '';
    igHandle = '';
    prices;
    selectedSize = '';
    customForm;
    earliestDate = {
        year: 0,
        month: 0,
        day: 0
    };
    maxDate = {
        year: 0,
        month: 0,
        day: 0
    };
    nameErr = false;
    emailErr = false;
    serviceErr = false;
    dateErr = false;
    descErr = false;
    sizeErr = false;
    // eslint-disable-next-line prettier/prettier
    constructor(private imgur: ImgurService, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private titleService: Title) {
        this.titleService.setTitle('Custom Request | OVVisuals');
        this.customForm = this.formBuilder.group({
            name: '',
            email: '',
            phone: '',
            service: '',
            printOpt: 'No Print',
            desc: '',
            size: '',
            otherService: '',
            otherSize: '',
            imgs: '',
            date: '',
            servicePrice: '',
            ig: ''
        });
    }

    ngOnInit() {
        this.getPrices();
        const now = new Date();
        const earliest = new Date();
        earliest.setDate(now.getDate() + 7);
        this.earliestDate.year = earliest.getFullYear();
        this.earliestDate.month = earliest.getMonth() + 1;
        this.earliestDate.day = earliest.getDate();
        this.maxDate.year = this.earliestDate.year + 1;
        this.maxDate.month = this.earliestDate.month;
        this.maxDate.day = this.earliestDate.day;
    }

    ngAfterViewInit() {
        const self = this;
        firebase.auth().onAuthStateChanged(function (user) {
            if (!user) {
                self.askLogin();
            } else {
                if (user.displayName) {
                    const nameForm = document.getElementById('defaultContactFormName') as HTMLInputElement;
                    nameForm.value = user.displayName;
                    self.name = user.displayName;
                }
                if (user.email) {
                    const emailForm = document.getElementById('defaultContactFormEmail') as HTMLInputElement;
                    emailForm.value = user.email;
                    self.email = user.email;
                }
                if (user.phoneNumber) {
                    const phoneForm = document.getElementById('defaultContactFormNum') as HTMLInputElement;
                    phoneForm.value = user.phoneNumber;
                    self.phone = user.phoneNumber;
                }
                firebase.database().ref('Users/' + user.uid + '/phone').on('value', function (phoneData) {
                    if (phoneData.val() || user.phoneNumber) {
                        const phoneForm = document.getElementById('defaultContactFormNum') as HTMLInputElement;
                        phoneForm.value = phoneData.val() || user.phoneNumber;
                        self.phone = phoneData.val() || user.phoneNumber;
                    }
                });
                firebase.database().ref('Users/' + user.uid + '/ig').on('value', function (igData) {
                    if (igData.val()) {
                        const igForm = document.getElementById('defaultContactFormig') as HTMLInputElement;
                        igForm.value = igData.val();
                        self.igHandle = igData.val();
                    }
                });
            }
        });
    }

    askLogin() {
        try {
            this.loginModal.show();
        } catch (e) {
            this.loginModal.show();
        }

        const uiConfig = {
            signInSuccessUrl: `/custom`,
            signInFlow: 'popup',
            signInOptions: [
                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                firebase.auth.FacebookAuthProvider.PROVIDER_ID,
                firebase.auth.EmailAuthProvider.PROVIDER_ID,
            ],
            tosUrl: '/terms',
            privacyPolicyUrl() {
                window.location.assign('/privacy');
            }
        };
        try {
            const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth());
            ui.start('#firebaseui-auth-container', uiConfig);
        } catch (e) {
        }
    }

    sendEmail(data) {
        const self = this;

        firebase.auth().onAuthStateChanged(async function (user) {
            if (user) {
                console.log(self.attachments.length)
                console.log(self.numToUpload)
                console.log(self.imgur.uploadedImgs)
                console.log(self.imgur.uploadedImgs.length)
                if ((self.attachments.length === self.numToUpload) && (self.numToUpload === self.imgur.uploadedImgs.length)) {
                    self.loadingModal.show();
                    const subject = 'OVVisuals Request Received';
                    const title = `Thank You, ${data.name}`;
                    const subHead = `I've received your request, and I will get back to you soon! Feel free to reply to this email if you want to add anything. Here's a summary of what I got from your request:`;
                    
                    const body = emailBody(self.imgur.imgsHTML, subject, title, subHead, data);
                    const sendEmail = firebase.functions().httpsCallable('sendEmail')
                    sendEmail().then((res) => {
                        Email.send({
                            SecureToken: res.data, 
                            To: `${data.email}`,
                            From: 'oviya@ovvisuals.com',
                            Subject: subject,
                            Body: body,
                            Attachments: self.attachments
                        }).then(
                            message => {
                                if (message === 'OK') {
                                    self.imgsHTML = '';
                                    self.uploadedNum = 0;
                                    self.numToUpload = 0;
                                    self.attachments = [];
                                    self.ig(data);
                                    self.addCustomToDB(user, data);
                                    self.loadingModal.hide();
                                    self.router.navigate(['/login/open-orders'], { relativeTo: self.route });
                                } else {
                                    self.errorModal.show();
                                }
                                self.loadingModal.hide();
                            }
                        );
                    })

                } else {
                    alert('Try again in a few seconds as the files upload. If this still does not work, refresh the page')
                }
            } else {
                self.askLogin();
            }
        });
    }

    async handleFileInput(event) {
        // document.getElementById('sendEmailBtn').classList.add('disabled');
        let events = [];
        events = Object.values(event);
        console.log(events)
        let totalSize = 0;
        let typesCorrect = true;
        for(const file of events) {
            totalSize += file.size
            if(file.type.indexOf('image') !== 0){
                typesCorrect = false
            }
        }
        if(typesCorrect && totalSize < (5 * 1024 * 1024)) {
            if (events) {
                if (events.length > 1) {
                    $('#inputGroupFile01').next('.custom-file-label').html(`${events.length} files`);
                } else {
                    $('#inputGroupFile01').next('.custom-file-label').html(`${events[0].name}`);
                }
            }
            this.numToUpload = events.length;
            this.recurseEvents(this, Object.values(event));
            this.createSmallAttach(this, Object.values(event));
            console.log(this.smallAttach)


        } else {
            alert('Please only upload images that total to less than 5mb')
        }
    }

    recurseEvents(self, events) {
        if (events.length === 0) {
            return;
        }
        const image = events[0];
        const reader = new FileReader();
        reader.readAsBinaryString(image);

        reader.onload = function () {
            const dataUri = 'data:' + image.type + ';base64,' + btoa(reader.result as string);
            const fileData = {
                name: image.name,
                data: dataUri
            };
            self.attachments.push(fileData);
            events.shift();
            self.recurseEvents(self, events);
            return;
        };
    }

    createSmallAttach(self, events){
        if(events.length===0) {
            return
        }
        const image = events[0];
        let resizeFile: File;
        ImageTools.resize(image, {
            width: 320, // maximum width
            height: 1000 // maximum height
          }, async function(blob) {
            // didItResize will be true if it managed to resize it, otherwise false (and will return the original file as 'blob')
            const b: any = blob;
            b.lastModifiedDate = new Date();
            resizeFile = new File([blob], image.name, { type: 'image/jpeg', lastModified: Date.now() });
            const reader = new FileReader();
            reader.readAsBinaryString(resizeFile);
            reader.onload = async function () {
                const dataUri = 'data:' + image.type + ';base64,' + btoa(reader.result as string);
                const fileData = {
                    name: image.name,
                    data: dataUri
                };
                self.smallAttach.push(fileData);
                events.shift();
                self.createSmallAttach(self, events);
                await self.imgur.auth(self.smallAttach);
                document.getElementById('sendEmailBtn').classList.remove('disabled');
                return
            };
          })
    }

    getDesiredService(event) {
        this.selectedService = (document.getElementById('serviceSelect') as HTMLInputElement).value;
    }

    printChange(event) {
        this.printOption = event;
    }

    onSubmit(event) {
        if (!event.name) {
            if (this.name) {
                event.name = this.name;
                this.nameErr = false;
            } else {
                this.nameErr = true;
            }
        }
        if (!event.email) {
            if (this.email) {
                event.email = this.email;
                this.emailErr = false;
            } else {
                this.emailErr = true;
            }
        }
        if (!event.phone) {
            event.phone = this.phone;
        }
        if (!event.date) {
            this.dateErr = true;
        } else {
            this.dateErr = false;
        }
        if (event.printOpt != 'No Print' && (!event.size || (event.size === 'Other' && !event.otherSize))) {
            this.sizeErr = true;
        } else {
            this.sizeErr = false;
        }
        if (!event.service || (event.service === 'Other' && !event.otherService)) {
            this.serviceErr = true;
        } else {
            this.serviceErr = false;
        }
        if (!event.desc) {
            this.descErr = true;
        } else {
            this.descErr = false;
        }
        if(this.igHandle) {
            event.ig = this.igHandle
        }
        event.printOpt = this.printOption;
        event.imgs = this.imgur.uploadedImgs;
        if (!this.nameErr && !this.emailErr && !this.dateErr && !this.descErr && !this.serviceErr && !this.sizeErr) {
            event.servicePrice = this.prices.Services[event.service];
            try {
                if (event.printOpt === 'No Print') {
                    event.printPrice = 0;
                    event.framePrice = 0;
                } else if (event.printOpt === 'Print, no frame') {
                    event.printPrice = this.prices.Size[event.size].print;
                    event.framePrice = 0;
                } else if (event.printOpt === 'Print and frame') {
                    event.printPrice = this.prices.Size[event.size].print;
                    event.framePrice = this.prices.Size[event.size].frame;
                }
            } catch (e) { }
            if (event.otherService != '') {
                event.service = event.otherService;
                event.servicePrice = 'Quote Pending';

            }
            if (event.otherSize != '') {
                event.size = event.otherSize;
                event.printPrice = 'Quote Pending';
                event.framePrice = 'Quote Pending';
            }
            event.complexity = 'Quote Pending';
            const self = this;
            console.log(event)
            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    const updates = {};
                    updates['Users/' + user.uid + '/ig'] = event.ig;
                    updates['Users/' + user.uid + '/phone'] = event.phone;
                    firebase.database().ref().update(updates);
                    self.sendEmail(event);
                }
            });
        }
    }

    getDesiredSize(event) {
        this.selectedSize = (document.getElementById('sizeSelect') as HTMLInputElement).value;
    }

    addCustomToDB(user, data) {
        const date = new Date();
        const self = this;
        const time = date.getTime();
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                const updates = {};
                data.uid = user.uid
                updates['Users/' + user.uid + '/Open-orders-custom/' + `${time}`] = data;
                updates['Admin/' + 'Open-orders-custom/' + user.uid + '/' + `${time}`] = data;
                firebase.database().ref().update(updates);
            }
        });
        const updates = {};
        let total = 0;
        if (data.framePrice != 'Quote Pending') {
            total += +(data.framePrice);
        }
        if (data.printPrice != 'Quote Pending') {
            total += +(data.printPrice);
        }
        if (data.servicePrice != 'Quote Pending') {
            total += +(data.servicePrice);
        }
        if (data.complexity != 'Quote Pending') {
            total += +(data.complexity);
        }
        const acc = {
            name: user.displayName,
            order: data.service + ' ' + data.size + ' ' + data.printOpt,
            total
        };
        updates['Admin/Accounting/' + user.uid + `/${time}`] = acc;
        firebase.database().ref().update(updates);
    }

    getPrices() {
        const self = this;
        firebase.database().ref('Products/Custom/').on('value', function (customPrices) {
            self.prices = customPrices.val();
        });
    }

    ig(event) {
        let totalPrint = event.printPrice + event.framePrice;
        if (totalPrint === 'Quote PendingQuote Pending') {
            totalPrint = 'Quote Pending';
        }
        let msg =
            `Hey! Just got your order from my website! Please reply to this message so that I can get to your order in a timely manner! Here's a quick summary: You requested a ${event.service} which starts at CAD$${event.servicePrice} and can go up depending on the complexity of the piece (it usually doesn't). You asked for ${event.printOpt} which will be CAD$${totalPrint} for ${event.size}. You've provided me with the following description: "${event.desc}". Finally, you've provided me with following images: `;
        for (const img of this.imgur.uploadedImgs) {
            msg += `${img} `;
        }
        msg += 'Thank you!';
        if (event.ig != '') {
            const helloWorld = firebase.functions().httpsCallable('helloWorld');
            const data = {
                recipient: event.ig,
                // sender: environment.ig.user,
                code: '245783',
                // code: "",
                // pw: environment.ig.pass,
                msg,
                valid_code: true
            };
            helloWorld(data).then(res => {
                console.log(res.data);
            });
        }
    }
}
