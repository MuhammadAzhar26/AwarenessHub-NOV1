
import { DefenseType, PhishingType, Scenario, ScenarioType, SocialTactic } from './types';

export const INITIAL_SCENARIOS: Scenario[] = [
  // ==========================================
  // MODULE 1: EMAIL DEFENSE (Spear, General, BEC)
  // ==========================================
  {
    id: 'e1',
    type: ScenarioType.EMAIL,
    isPhishing: true,
    correctPhishingType: PhishingType.GENERAL,
    correctDefense: DefenseType.DONT_CLICK,
    socialTactic: SocialTactic.FEAR,
    indicator: "Fake sender domain (fbr-gov-pk.org)",
    explanation: "Tax scams are common. The sender domain 'fbr-gov-pk.org' is fake; official is 'fbr.gov.pk'.",
    riskPoints: [
      { location: 'SENDER', text: "Unofficial domain. Look for .gov.pk" },
      { location: 'BODY', text: "Threat of 'freezing account' is a fear tactic." }
    ],
    content: {
      sender: "FBR e-Services",
      senderEmail: "notice@fbr-gov-pk.org",
      subject: "FINAL NOTICE: Tax Return Error",
      body: `<p>Dear Taxpayer,</p><p>Your returns have been rejected. You have an outstanding demand of Rs. 50,000.</p><p><a href="#" class="text-blue-600 underline">Download Notice</a></p>`
    }
  },
  {
    id: 'e2',
    type: ScenarioType.EMAIL,
    isPhishing: true,
    correctPhishingType: PhishingType.WHALING,
    correctDefense: DefenseType.THINK,
    socialTactic: SocialTactic.AUTHORITY,
    indicator: "Urgent wire request from CEO",
    explanation: "Whaling targets specific employees impersonating a CEO. Always verify offline.",
    riskPoints: [
      { location: 'SENDER', text: "Spoofed domain (gul-ahmed-textiles.net)." },
      { location: 'BODY', text: "'I am in a meeting' is used to prevent you from calling." }
    ],
    content: {
      sender: "Ahmed Siddiqui (CEO)",
      senderEmail: "ahmed.siddiqui@gul-ahmed-textiles.net",
      subject: "Urgent: Vendor Payment",
      body: `<p>Salam, process an urgent wire transfer of $8,000 for the new dye shipment. I am in a meeting, so email me the confirmation.</p>`
    }
  },
  {
    id: 'e3',
    type: ScenarioType.EMAIL,
    isPhishing: true,
    correctPhishingType: PhishingType.BEC,
    correctDefense: DefenseType.THINK,
    socialTactic: SocialTactic.URGENCY,
    indicator: "Vendor changing bank account details",
    explanation: "Business Email Compromise (BEC). Attackers compromise a vendor's email and ask you to update bank details for payment.",
    riskPoints: [
      { location: 'BODY', text: "Sudden change of bank account is a huge red flag." },
      { location: 'SENDER', text: "Check if the email matches previous correspondence exactly." }
    ],
    content: {
      sender: "Ali Exports (Vendor)",
      senderEmail: "accounts@ali-exports.com",
      subject: "Invoice #4401 - Account Update",
      body: `<p>Hi Team,</p><p>Please note our HBL account is under audit. Kindly remit the payment for Invoice #4401 to our new Meezan Bank account listed in the attached PDF.</p>`
    }
  },
  {
    id: 'e4',
    type: ScenarioType.EMAIL,
    isPhishing: true,
    correctPhishingType: PhishingType.SPEAR,
    correctDefense: DefenseType.DONT_CLICK,
    socialTactic: SocialTactic.FAMILIARITY,
    indicator: "Reference to specific internal project",
    explanation: "Spear phishing uses specific details (like 'Project Alpha') to gain trust.",
    riskPoints: [
      { location: 'SENDER', text: "External address (gmail) sending internal docs?" },
      { location: 'ATTACHMENT', text: "Reviewing a project via a generic link?" }
    ],
    content: {
      sender: "Project Lead",
      senderEmail: "kamran.project.manager@gmail.com",
      subject: "Project Alpha Timeline Changes",
      body: `<p>I've updated the timeline for Project Alpha. Please review the changes on the drive before the meeting.</p><p><a href="#">View Document</a></p>`
    }
  },
  {
    id: 'e5',
    type: ScenarioType.EMAIL,
    isPhishing: false,
    correctPhishingType: PhishingType.NONE,
    correctDefense: DefenseType.THINK,
    socialTactic: SocialTactic.NONE,
    indicator: "Standard notification, no links",
    explanation: "A standard system notification that doesn't ask for credentials or clicks is usually safe.",
    content: {
      sender: "Google Workspace",
      senderEmail: "no-reply@accounts.google.com",
      subject: "New sign-in on Windows",
      body: `<p>Your Google Account was just signed in to from a new Windows device. You received this message because you are listed as a recovery email.</p>`
    }
  },
  {
    id: 'e6',
    type: ScenarioType.EMAIL,
    isPhishing: true,
    correctPhishingType: PhishingType.GENERAL,
    correctDefense: DefenseType.DONT_CLICK,
    socialTactic: SocialTactic.GREED,
    indicator: "Inheritance / Nigerian Prince style scam",
    explanation: "Classic 419 scam. An unknown lawyer offering millions is always a scam.",
    riskPoints: [
      { location: 'SUBJECT', text: "Generic 'Business Proposal'." },
      { location: 'BODY', text: "Asking for discretion and offering huge sums." }
    ],
    content: {
      sender: "Barrister John Doe",
      senderEmail: "barrister.j.doe@hotmail.com",
      subject: "Private Business Proposal",
      body: `<p>I am the personal attorney to a deceased client who shares your last name. He left $10.5 Million with no heir. I can present you as the kin.</p>`
    }
  },
  {
    id: 'e7',
    type: ScenarioType.EMAIL,
    isPhishing: true,
    correctPhishingType: PhishingType.GENERAL,
    correctDefense: DefenseType.DONT_CLICK,
    socialTactic: SocialTactic.URGENCY,
    indicator: "Fake Storage Full Warning",
    explanation: "Generic 'Mailbox Full' phishing. The link leads to a fake login page to steal email credentials.",
    riskPoints: [
      { location: 'SENDER', text: "Generic sender 'Email Administrator'." },
      { location: 'BODY', text: "Urgency: 'Can not receive new mail'." }
    ],
    content: {
      sender: "Email Administrator",
      senderEmail: "admin@webmail-server-update.com",
      subject: "Mailbox Quota Exceeded",
      body: `<p>Your mailbox is 99% full. You will not be able to send or receive messages.</p><p><a href="#">Click here to add 5GB Free Storage</a></p>`
    }
  },
  {
    id: 'e8',
    type: ScenarioType.EMAIL,
    isPhishing: true,
    correctPhishingType: PhishingType.SPEAR,
    correctDefense: DefenseType.DONT_CLICK,
    socialTactic: SocialTactic.CURIOSITY,
    indicator: "Fake Calendar Invite",
    explanation: "Phishing via Calendar invites. The link in the description is malicious.",
    riskPoints: [
      { location: 'BODY', text: "Unknown meeting topic 'Q3 Performance Review' from external sender." }
    ],
    content: {
      sender: "Calendar Service",
      senderEmail: "invites@meeting-scheduler.net",
      subject: "Invitation: Q3 Performance Review @ 10am",
      body: `<p>You have been invited to the following event.</p><p><b>Agenda:</b> Discuss salary adjustment.</p><p><b>Join Link:</b> <a href="#">Join via Zoom</a></p>`
    }
  },
  {
    id: 'e9',
    type: ScenarioType.EMAIL,
    isPhishing: true,
    correctPhishingType: PhishingType.GENERAL,
    correctDefense: DefenseType.DONT_CLICK,
    socialTactic: SocialTactic.GREED,
    indicator: "Fake Tax Refund",
    explanation: "Govt agencies do not email links to claim refunds.",
    riskPoints: [{ location: 'BODY', text: "Promising money back (Refund) to lure clicks." }],
    content: {
      sender: "Tax Department",
      senderEmail: "refunds@gov-tax-claims.com",
      subject: "You have a pending tax refund",
      body: `<p>Our records show you overpaid Rs. 12,400 in taxes. Click below to claim your refund to your bank account.</p>`
    }
  },
  {
    id: 'e10',
    type: ScenarioType.EMAIL,
    isPhishing: true,
    correctPhishingType: PhishingType.BEC,
    correctDefense: DefenseType.THINK,
    socialTactic: SocialTactic.AUTHORITY,
    indicator: "Gift Card Request",
    explanation: "Executive asking for Gift Cards is a hallmark of BEC. They claim to be busy to avoid voice verification.",
    riskPoints: [{ location: 'BODY', text: "Asking for 'Apple Gift Cards' for clients." }],
    content: {
      sender: "Director Operations",
      senderEmail: "director.ops@corp-email-spoof.com",
      subject: "Urgent Favor",
      body: `<p>Are you near a store? I need to buy 5 Apple Gift cards for a client presentation but I'm stuck in a conference call. Can you pick them up? I will reimburse you.</p>`
    }
  },
  {
    id: 'e11',
    type: ScenarioType.EMAIL,
    isPhishing: true,
    correctPhishingType: PhishingType.SPEAR,
    correctDefense: DefenseType.DONT_CLICK,
    socialTactic: SocialTactic.FAMILIARITY,
    indicator: "Fake LinkedIn Notification",
    explanation: "Spoofed social media notifications. Hovering over 'View Message' would show it goes to a credential harvester.",
    riskPoints: [{ location: 'SENDER', text: "linkedin-messages@notifications-service.com (Fake)" }],
    content: {
      sender: "LinkedIn",
      senderEmail: "messages@linkedin-alert-service.com",
      subject: "You appeared in 5 searches this week",
      body: `<p>People are looking at your profile. A recruiter from <b>TechCorp</b> viewed your profile.</p><p><a href="#">See who viewed you</a></p>`
    }
  },
  {
    id: 'e12',
    type: ScenarioType.EMAIL,
    isPhishing: true,
    correctPhishingType: PhishingType.GENERAL,
    correctDefense: DefenseType.DONT_CLICK,
    socialTactic: SocialTactic.FEAR,
    indicator: "Fake Zoom Update",
    explanation: "Fake software updates via email. Zoom updates happen within the app, not via random email links.",
    riskPoints: [{ location: 'BODY', text: "Missed meeting due to 'outdated version'." }],
    content: {
      sender: "Zoom Video Communications",
      senderEmail: "support@zoom-security-update.com",
      subject: "Missed Meeting: Version Incompatible",
      body: `<p>You missed a meeting invite because your Zoom client is critically outdated.</p><p><a href="#">Update Zoom Now</a></p>`
    }
  },

  // ==========================================
  // MODULE 2: MOBILE & VISHING (SMS, Voice, WhatsApp)
  // ==========================================
  {
    id: 'm1',
    type: ScenarioType.SMS,
    isPhishing: true,
    correctPhishingType: PhishingType.SMISHING,
    correctDefense: DefenseType.THINK,
    socialTactic: SocialTactic.GREED,
    indicator: "BISP scam from mobile number",
    explanation: "Legitimate BISP messages come from '8171'. Standard mobile numbers are scammers.",
    content: {
      phoneNumber: "0302-1234567",
      message: "BISP: Govt of Pakistan ki taraf se apkay 25000 rupay manzoor huay hain. Call: 0302-1234567"
    }
  },
  {
    id: 'm2',
    type: ScenarioType.SMS,
    isPhishing: true,
    correctPhishingType: PhishingType.SMISHING,
    correctDefense: DefenseType.DONT_CLICK,
    socialTactic: SocialTactic.FEAR,
    indicator: "Bank account suspension link",
    explanation: "Banks never send bit.ly links to reactivate accounts via SMS.",
    content: {
      phoneNumber: "HBL-Alert",
      message: "Account Suspended. Visit http://bit.ly/hbl-verify to reactivate."
    }
  },
  {
    id: 'm3',
    type: ScenarioType.SMS,
    isPhishing: true,
    correctPhishingType: PhishingType.SMISHING,
    correctDefense: DefenseType.THINK,
    socialTactic: SocialTactic.TRUST,
    indicator: "Fake EasyPaisa Receipt",
    explanation: "Fake SMS pretending to be a transaction confirmation. Always check your actual app balance.",
    content: {
      phoneNumber: "+92 312 5550000",
      message: "Trx:827191. You have received Rs 10,000 from Ali Khan. New Balance: Rs 10,050."
    }
  },
  {
    id: 'm4',
    type: ScenarioType.VOICE, // VISHING
    isPhishing: true,
    correctPhishingType: PhishingType.VISHING,
    correctDefense: DefenseType.HANG_UP,
    socialTactic: SocialTactic.URGENCY,
    indicator: "Asking for OTP over call",
    explanation: "Vishing (Voice Phishing). A caller claiming to be from the bank asks for the OTP sent to your phone. Banks NEVER ask for OTPs.",
    content: {
      phoneNumber: "021-32428901",
      message: "Transcript: 'Hello sir, this is Standard Chartered fraud department. We blocked a suspicious transaction of Rs 50,000. To cancel it, I have sent a code to your phone. Please read it to me.'"
    }
  },
  {
    id: 'm5',
    type: ScenarioType.SMS,
    isPhishing: true,
    correctPhishingType: PhishingType.SMISHING,
    correctDefense: DefenseType.DONT_CLICK,
    socialTactic: SocialTactic.CURIOSITY,
    indicator: "Missed delivery link",
    explanation: "Smishing using fake delivery (TCS/Leopard/DHL) failure notifications.",
    content: {
      phoneNumber: "TCS-Logistics",
      message: "Shipment #7712 pending. Address incomplete. Update here: tcs-pkg-update.com"
    }
  },
  {
    id: 'm6',
    type: ScenarioType.SMS,
    isPhishing: true,
    correctPhishingType: PhishingType.SMISHING,
    correctDefense: DefenseType.THINK,
    socialTactic: SocialTactic.TRUST,
    indicator: "WhatsApp Code Hijacking",
    explanation: "The scammer tries to trick you into giving them the verification code to steal your WhatsApp account.",
    content: {
      phoneNumber: "Ahmed (School Friend)",
      message: "Yaar ghalti se mera WhatsApp code tumhare pas agya. Plz bata do, emergency hai."
    }
  },
  {
    id: 'm7',
    type: ScenarioType.VOICE,
    isPhishing: true,
    correctPhishingType: PhishingType.VISHING,
    correctDefense: DefenseType.HANG_UP,
    socialTactic: SocialTactic.AUTHORITY,
    indicator: "Fake Army/Police Official",
    explanation: "Callers pretending to be Army or Police (Census/Identity check) asking for CNIC and bank details.",
    content: {
      phoneNumber: "0301-7654321",
      message: "Transcript: 'Main Head Office se Major Aslam baat kar raha hun. Apka CNIC block honay wala hai. Verification k liye apni maa ka naam aur bank account details batayn.'"
    }
  },
  {
    id: 'm8',
    type: ScenarioType.SMS,
    isPhishing: true,
    correctPhishingType: PhishingType.SMISHING,
    correctDefense: DefenseType.DONT_CLICK,
    socialTactic: SocialTactic.GREED,
    indicator: "Free Data/Balance Link",
    explanation: "Links promising free data (Zong/Jazz) usually install malware or subscribe you to paid services.",
    content: {
      phoneNumber: "Jazz-Offer",
      message: "Eid Gift! Get 50GB Free Data. Activate: http://jazz-eid-gift.xyz"
    }
  },
  {
    id: 'm9',
    type: ScenarioType.SMS,
    isPhishing: true,
    correctPhishingType: PhishingType.SMISHING,
    correctDefense: DefenseType.THINK,
    socialTactic: SocialTactic.FAMILIARITY,
    indicator: "Hi Mum/Dad scam",
    explanation: "Scammer pretends to be a child using a 'friend's phone' and asks for money immediately.",
    content: {
      phoneNumber: "0312-9988776",
      message: "Hi Mum, I dropped my phone in water. This is my friend's number. Can you transfer 5000 to this EasyPaisa? Need to take a cab home."
    }
  },
  {
    id: 'm10',
    type: ScenarioType.SMS,
    isPhishing: false,
    correctPhishingType: PhishingType.NONE,
    correctDefense: DefenseType.THINK,
    socialTactic: SocialTactic.NONE,
    indicator: "Legitimate OTP",
    explanation: "A requested OTP for a transaction you initiated is safe. Do not share it.",
    content: {
      phoneNumber: "Google",
      message: "G-481022 is your Google verification code."
    }
  },
  {
    id: 'm11',
    type: ScenarioType.VOICE,
    isPhishing: true,
    correctPhishingType: PhishingType.VISHING,
    correctDefense: DefenseType.HANG_UP,
    socialTactic: SocialTactic.FEAR,
    indicator: "Tech Support Scam",
    explanation: "Caller claims your computer has a virus and they need remote access to fix it.",
    content: {
      phoneNumber: "042-35870012",
      message: "Transcript: 'This is Microsoft Support Centre Lahore. We detected a virus on your Windows PC. Open TeamViewer so we can remove it before you lose your data.'"
    }
  },
  {
    id: 'm12',
    type: ScenarioType.SMS,
    isPhishing: true,
    correctPhishingType: PhishingType.SMISHING,
    correctDefense: DefenseType.DONT_CLICK,
    socialTactic: SocialTactic.URGENCY,
    indicator: "Netflix Payment Failed",
    explanation: "Streaming services do not text from random numbers for payments.",
    content: {
      phoneNumber: "0300-9876543",
      message: "Netflix: Payment failed. Account will be closed. Update: netflix-secure-pay.com"
    }
  },
  {
    id: 'm13',
    type: ScenarioType.SMS,
    isPhishing: true,
    correctPhishingType: PhishingType.SMISHING,
    correctDefense: DefenseType.THINK,
    socialTactic: SocialTactic.FAMILIARITY,
    indicator: "Account Takeover / Code Forwarding",
    explanation: "Scammers claim to be friends or family who 'accidentally' sent a code to your phone. Sharing this code gives them access to your WhatsApp.",
    content: {
      phoneNumber: "+92 300 1234567",
      message: "Salam. Sorry, maine ghalti se apna WhatsApp code apko bhej diya. Please mujhe wo sms forward krden. Mera account lock hogya hai."
    }
  },
  {
    id: 'm14',
    type: ScenarioType.VOICE,
    isPhishing: true,
    correctPhishingType: PhishingType.VISHING,
    correctDefense: DefenseType.HANG_UP,
    socialTactic: SocialTactic.URGENCY,
    indicator: "Fake Bank Verification",
    explanation: "Banks never call to ask for OTPs or passwords to 'stop' a transaction or 'update' the system.",
    content: {
      phoneNumber: "021-111-000-000 (Spoofed)",
      message: "Transcript: 'Sir main HBL Head Office se bol raha hun. Apkay account se abhi 25,000 ki transaction hui hai. Agar ye apne nahi ki, to jo code apke mobile par aya hai wo batayn takay hum isay rok saken.'"
    }
  },
  {
    id: 'm15',
    type: ScenarioType.SMS,
    isPhishing: true,
    correctPhishingType: PhishingType.SMISHING,
    correctDefense: DefenseType.THINK,
    socialTactic: SocialTactic.GREED,
    indicator: "Jeeto Pakistan Lottery",
    explanation: "You cannot win a lottery you never entered. These messages trick you into calling a number where they ask for 'registration fees'.",
    content: {
      phoneNumber: "+92 345 5555555",
      message: "Mubarak Ho! Jeeto Pakistan ki taraf se apka number 10 Lakh rupay k liye select hua hai. Inam hasil krne k liye is number pe call kren: 0345-5555555"
    }
  },
  {
    id: 'm16',
    type: ScenarioType.VOICE,
    isPhishing: true,
    correctPhishingType: PhishingType.VISHING,
    correctDefense: DefenseType.HANG_UP,
    socialTactic: SocialTactic.FEAR,
    indicator: "Automated Order Confirmation",
    explanation: "Robocalls claiming a large purchase (like an iPhone) was made. They want you to press a button to talk to a fake agent who steals your card info.",
    content: {
      phoneNumber: "Unknown Number",
      message: "Transcript: (Robotic Voice) 'This is Daraz. An order for iPhone 14 Pro Max worth Rs 450,000 has been placed. If this was not you, press 1 to speak with a representative immediately.'"
    }
  },
  {
    id: 'm17',
    type: ScenarioType.SMS,
    isPhishing: true,
    correctPhishingType: PhishingType.SMISHING,
    correctDefense: DefenseType.DONT_CLICK,
    socialTactic: SocialTactic.GREED,
    indicator: "Part-time Job Offer",
    explanation: "Job offers sent via SMS/WhatsApp promising high daily income for simple tasks (liking videos) are scams to steal money or launder funds.",
    content: {
      phoneNumber: "+1 (202) 555-0199",
      message: "Assalam-o-Alaikum. Are you looking for a part-time job? Earn Rs 5,000-10,000 daily by just liking YouTube videos. Contact our manager on WhatsApp: wa.me/92300000000"
    }
  },

  // ==========================================
  // MODULE 3: WEB & MALWARE (Ransomware, SEO, Downloads)
  // ==========================================
  {
    id: 'w1',
    type: ScenarioType.EMAIL,
    isPhishing: true,
    correctPhishingType: PhishingType.RANSOMWARE,
    correctDefense: DefenseType.BACKUP,
    socialTactic: SocialTactic.FEAR,
    indicator: "Double extension (.pdf.exe)",
    explanation: "Executable file masquerading as a PDF. Opening it installs ransomware.",
    riskPoints: [{ location: 'ATTACHMENT', text: ".pdf.exe is always a virus." }],
    content: {
      sender: "KE Billing",
      senderEmail: "bill@ke-support.com",
      subject: "Overdue Bill",
      body: "View attached bill.",
      attachment: { name: "Bill.pdf.exe", size: "400KB", type: "EXE" }
    }
  },
  {
    id: 'w2',
    type: ScenarioType.EMAIL,
    isPhishing: true,
    correctPhishingType: PhishingType.RANSOMWARE,
    correctDefense: DefenseType.ANTIVIRUS,
    socialTactic: SocialTactic.CURIOSITY,
    indicator: "Macro-enabled Word Doc",
    explanation: ".docm files contain macros that can download malware.",
    riskPoints: [{ location: 'ATTACHMENT', text: ".docm extension." }],
    content: {
      sender: "HR Applicant",
      senderEmail: "sara@gmail.com",
      subject: "Resume",
      body: "Please enable editing to view my CV.",
      attachment: { name: "CV.docm", size: "1MB", type: "DOC" }
    }
  },
  {
    id: 'w3',
    type: ScenarioType.EMAIL,
    isPhishing: true,
    correctPhishingType: PhishingType.RANSOMWARE,
    correctDefense: DefenseType.ANTIVIRUS,
    socialTactic: SocialTactic.URGENCY,
    indicator: "ZIP file for Invoice",
    explanation: "Invoices shouldn't be ZIP files. Usually contain JS/VBS scripts.",
    riskPoints: [{ location: 'ATTACHMENT', text: "ZIP file hiding scripts." }],
    content: {
      sender: "Supplier",
      senderEmail: "accounts@supply.com",
      subject: "Invoice 991",
      body: "Pay attached invoice.",
      attachment: { name: "Invoice.zip", size: "10KB", type: "ZIP" }
    }
  },
  {
    id: 'w4',
    type: ScenarioType.SEARCH,
    isPhishing: true,
    correctPhishingType: PhishingType.SEO,
    correctDefense: DefenseType.SECURE_DNS,
    socialTactic: SocialTactic.URGENCY,
    indicator: "Fake Government Site (Passport/NADRA)",
    explanation: "SEO Poisoning. Fake site 'online-passport-pk.com' steals data.",
    content: {
      searchQuery: "renew pakistan passport online",
      results: [
        { title: "Fast Passport Renewal - 24 Hrs", url: "www.online-passport-pk.com", snippet: "Urgent renewal service.", isMalicious: true },
        { title: "Directorate General of Immigration", url: "onlinemrp.dgip.gov.pk", snippet: "Official portal.", isMalicious: false }
      ]
    }
  },
  {
    id: 'w5',
    type: ScenarioType.SEARCH,
    isPhishing: true,
    correctPhishingType: PhishingType.RANSOMWARE,
    correctDefense: DefenseType.ANTIVIRUS,
    socialTactic: SocialTactic.GREED,
    indicator: "Cracked Software / Keygen",
    explanation: "Crack sites are the main source of ransomware infection for home users.",
    content: {
      searchQuery: "adobe photoshop free crack",
      results: [
        { title: "Photoshop 2024 Crack + Keygen", url: "www.cracked-softwares.net", snippet: "Download full version free. No virus.", isMalicious: true },
        { title: "Adobe Photoshop", url: "www.adobe.com", snippet: "Official site.", isMalicious: false }
      ]
    }
  },
  {
    id: 'w6',
    type: ScenarioType.SEARCH,
    isPhishing: true,
    correctPhishingType: PhishingType.SEO,
    correctDefense: DefenseType.DONT_CLICK,
    socialTactic: SocialTactic.URGENCY,
    indicator: "Fake Helpline Number",
    explanation: "Scammers manipulate results to show fake airline/bank numbers.",
    content: {
      searchQuery: "emirates airlines pakistan contact",
      results: [
        { title: "Emirates Helpline Pakistan", url: "www.flights-help-desk.com", snippet: "Call +92 300 5550123 for refunds.", isMalicious: true },
        { title: "Emirates Official", url: "www.emirates.com/pk", snippet: "Book flights.", isMalicious: false }
      ]
    }
  },
  {
    id: 'w7',
    type: ScenarioType.SEARCH,
    isPhishing: true,
    correctPhishingType: PhishingType.RANSOMWARE,
    correctDefense: DefenseType.ANTIVIRUS,
    socialTactic: SocialTactic.FEAR,
    indicator: "Fake Driver/Browser Update",
    explanation: "Popups claiming 'Drivers Outdated' often install malware.",
    content: {
      searchQuery: "update graphics driver",
      results: [
        { title: "Critical Driver Update Required", url: "www.driver-updater-pro.com", snippet: "Your PC is at risk. Update now.", isMalicious: true },
        { title: "NVIDIA Drivers", url: "www.nvidia.com/drivers", snippet: "Official drivers.", isMalicious: false }
      ]
    }
  },
  {
    id: 'w8',
    type: ScenarioType.SEARCH,
    isPhishing: true,
    correctPhishingType: PhishingType.SEO,
    correctDefense: DefenseType.DONT_CLICK,
    socialTactic: SocialTactic.GREED,
    indicator: "Crypto Doubling Scam",
    explanation: "Any site promising to double bitcoin or offering 100% returns is a scam.",
    content: {
      searchQuery: "invest bitcoin pakistan",
      results: [
        { title: "Double Your BTC in 24H", url: "www.bitcoin-doubler.com", snippet: "Guaranteed returns.", isMalicious: true },
        { title: "Binance", url: "www.binance.com", snippet: "Exchange.", isMalicious: false }
      ]
    }
  },
  {
    id: 'w9',
    type: ScenarioType.SEARCH,
    isPhishing: false,
    correctPhishingType: PhishingType.NONE,
    correctDefense: DefenseType.THINK,
    socialTactic: SocialTactic.NONE,
    indicator: "Official Banking URL",
    explanation: "Standard bank login page with correct URL.",
    content: {
      searchQuery: "meezan bank login",
      results: [
        { title: "Meezan Bank Internet Banking", url: "www.meezanbank.com", snippet: "Secure login.", isMalicious: false }
      ]
    }
  },
  {
    id: 'w10',
    type: ScenarioType.SEARCH,
    isPhishing: true,
    correctPhishingType: PhishingType.SEO,
    correctDefense: DefenseType.DONT_CLICK,
    socialTactic: SocialTactic.CURIOSITY,
    indicator: "Typosquatting (faceboook.com)",
    explanation: "Notice the extra 'o' in the URL. This leads to a clone site.",
    content: {
      searchQuery: "facebook login",
      results: [
        { title: "Log in to Facebook", url: "www.faceboook.com", snippet: "Connect with friends.", isMalicious: true }
      ]
    }
  },

  // ==========================================
  // MODULE 4: IDENTITY & AUTH (Passwords, MFA, QR)
  // ==========================================
  {
    id: 'a1',
    type: ScenarioType.AUTH,
    isPhishing: true,
    correctPhishingType: PhishingType.QUISHING,
    correctDefense: DefenseType.DONT_CLICK,
    socialTactic: SocialTactic.CURIOSITY,
    indicator: "Random QR Code on table/meter",
    explanation: "Quishing (QR Phishing). Criminals paste fake QR codes over real parking meters or restaurant menus to steal payment info.",
    content: {
      searchQuery: "QR Code Scan Result",
      results: [
        { title: "Pay Parking Fee", url: "www.quick-pay-parking-secure.com", snippet: "Enter credit card to pay parking.", isMalicious: true }
      ]
    }
  },
  {
    id: 'a2',
    type: ScenarioType.SMS, // Changed from AUTH to SMS to match content structure
    isPhishing: true,
    correctPhishingType: PhishingType.MFA_FATIGUE,
    correctDefense: DefenseType.VERIFY_MFA,
    socialTactic: SocialTactic.URGENCY,
    indicator: "Barrage of MFA push notifications",
    explanation: "MFA Fatigue/Bombing. Attackers have your password and spam you with 'Approve Login' requests hoping you click 'Approve' just to stop the noise.",
    content: {
      phoneNumber: "Authenticator App",
      message: "Login Request: New York, USA. Approve? \n[1 min later] Login Request: New York. Approve? \n[1 min later] Login Request: New York. Approve?"
    }
  },
  {
    id: 'a3',
    type: ScenarioType.EMAIL,
    isPhishing: true,
    correctPhishingType: PhishingType.GENERAL,
    correctDefense: DefenseType.DONT_CLICK,
    socialTactic: SocialTactic.FEAR,
    indicator: "Fake Password Reset",
    explanation: "Unsolicited password reset emails are attempts to hijack accounts.",
    riskPoints: [{ location: 'BODY', text: "Did you request this reset? If not, don't click." }],
    content: {
      sender: "Security Team",
      senderEmail: "security@instagram-support-team.com",
      subject: "Reset Your Password",
      body: `<p>We received a request to reset your password.</p><p><a href="#">Reset Password</a></p>`
    }
  },
  {
    id: 'a4',
    type: ScenarioType.SEARCH,
    isPhishing: true,
    correctPhishingType: PhishingType.SEO,
    correctDefense: DefenseType.DONT_CLICK,
    socialTactic: SocialTactic.FEAR,
    indicator: "Fake 'Your PC is Infected' Popup",
    explanation: "Browser popups claiming you have a virus and asking you to call a number or login.",
    content: {
      searchQuery: "Popup Alert",
      results: [
        { title: "SYSTEM CRITICAL ERROR", url: "www.windows-defender-alert.com", snippet: "Your passwords are stolen. Call Microsoft immediately.", isMalicious: true }
      ]
    }
  },
  {
    id: 'a5',
    type: ScenarioType.SMS,
    isPhishing: true,
    correctPhishingType: PhishingType.SMISHING,
    correctDefense: DefenseType.DONT_CLICK,
    socialTactic: SocialTactic.URGENCY,
    indicator: "Fake 2FA Code request",
    explanation: "Smishing pretending to be a 2FA provider asking you to click to 'Verify Identity'.",
    content: {
      phoneNumber: "Auth-Msg",
      message: "Someone tried to login to your account. If this wasn't you, click here to block: http://secure-block.com/verify"
    }
  },
  {
    id: 'a6',
    type: ScenarioType.AUTH, // Represented via Email for trigger
    isPhishing: true,
    correctPhishingType: PhishingType.GENERAL,
    correctDefense: DefenseType.THINK,
    socialTactic: SocialTactic.GREED,
    indicator: "Wi-Fi Login page asking for Social Login",
    explanation: "Fake Public Wi-Fi portals asking you to 'Login with Facebook' to steal credentials.",
    content: {
      searchQuery: "Free Airport Wi-Fi",
      results: [
        { title: "Connect to Free Wi-Fi", url: "www.airport-free-wifi-login.com", snippet: "Login with Facebook/Google to access internet.", isMalicious: true }
      ]
    }
  },
  {
    id: 'a7',
    type: ScenarioType.EMAIL,
    isPhishing: true,
    correctPhishingType: PhishingType.SPEAR,
    correctDefense: DefenseType.DONT_CLICK,
    socialTactic: SocialTactic.FAMILIARITY,
    indicator: "DocuSign request from unknown source",
    explanation: "Fake DocuSign/E-signature requests leading to credential harvesting.",
    riskPoints: [{ location: 'SENDER', text: "Generic 'docusign-docs.com' domain." }],
    content: {
      sender: "DocuSign",
      senderEmail: "docs@docusign-mail.com",
      subject: "Complete with DocuSign: Invoice.pdf",
      body: `<p>Please review and sign the attached document.</p><p><a href="#">Review Document</a></p>`
    }
  },
  {
    id: 'a8',
    type: ScenarioType.EMAIL,
    isPhishing: true,
    correctPhishingType: PhishingType.GENERAL,
    correctDefense: DefenseType.DONT_CLICK,
    socialTactic: SocialTactic.URGENCY,
    indicator: "Fake iCloud / Google Photos Storage",
    explanation: "Claims your photos will be deleted unless you pay/login.",
    riskPoints: [{ location: 'BODY', text: "Threat of data deletion." }],
    content: {
      sender: "iCloud Storage",
      senderEmail: "cloud@apple-id-support.com",
      subject: "Your photos will be deleted",
      body: `<p>Payment failed. Your 50GB of photos will be removed tonight.</p><p><a href="#">Update Payment</a></p>`
    }
  },

  // ==========================================
  // MODULE 5: SOCIAL ENGINEERING (Pretexting, Insider)
  // ==========================================
  {
    id: 's1',
    type: ScenarioType.SMS,
    isPhishing: true,
    correctPhishingType: PhishingType.SMISHING,
    correctDefense: DefenseType.THINK,
    socialTactic: SocialTactic.FAMILIARITY,
    indicator: "Wrong Number Scam / Pig Butchering",
    explanation: "Scammers start with 'Hi, is this Sara?' to build a relationship (Pig Butchering) before asking for investment.",
    content: {
      phoneNumber: "+44 7400 123456",
      message: "Hi Sara, are we still meeting for coffee today? - (Wait, sorry, wrong number? You seem nice though...)"
    }
  },
  {
    id: 's2',
    type: ScenarioType.VOICE,
    isPhishing: true,
    correctPhishingType: PhishingType.VISHING,
    correctDefense: DefenseType.HANG_UP,
    socialTactic: SocialTactic.AUTHORITY,
    indicator: "Fake Company IT Support",
    explanation: "Vishing. Caller claims to be 'IT Support' asking for your password to 'migrate the server'. Real IT never asks for passwords.",
    content: {
      phoneNumber: "Internal Ext 1234",
      message: "Transcript: 'Hi, this is IT. We are migrating the server. I need your password to sync your files, otherwise you will lose them.'"
    }
  },
  {
    id: 's3',
    type: ScenarioType.EMAIL,
    isPhishing: true,
    correctPhishingType: PhishingType.BEC,
    correctDefense: DefenseType.THINK,
    socialTactic: SocialTactic.TRUST,
    indicator: "Vendor asking to switch to WhatsApp",
    explanation: "Attempts to move conversation to an unmonitored channel (WhatsApp) to conduct fraud.",
    riskPoints: [{ location: 'BODY', text: "Moving official comms to WhatsApp." }],
    content: {
      sender: "Vendor John",
      senderEmail: "john@supplier.com",
      subject: "Quick question",
      body: `<p>Can you message me on my personal WhatsApp? I have a confidential deal for you. +92 300 5551234 </p>`
    }
  },
  {
    id: 's4',
    type: ScenarioType.SEARCH,
    isPhishing: true,
    correctPhishingType: PhishingType.SEO,
    correctDefense: DefenseType.THINK,
    socialTactic: SocialTactic.GREED,
    indicator: "Fake Charity / Disaster Relief",
    explanation: "Scams popping up after floods/earthquakes. Unregistered charities stealing donations.",
    content: {
      searchQuery: "flood relief donation pakistan",
      results: [
        { title: "Official Flood Relief Fund", url: "www.pm-fund-relief-pk.org", snippet: "Donate via Credit Card immediately.", isMalicious: true }
      ]
    }
  },
  {
    id: 's5',
    type: ScenarioType.EMAIL,
    isPhishing: true,
    correctPhishingType: PhishingType.SPEAR,
    correctDefense: DefenseType.DONT_CLICK,
    socialTactic: SocialTactic.CURIOSITY,
    indicator: "Fake 'Scandal' Video",
    explanation: "Links claiming to show a video of you or a scandal are clickbait for malware.",
    riskPoints: [{ location: 'BODY', text: "Is this you in the video?" }],
    content: {
      sender: "Facebook Notification",
      senderEmail: "noreply@fb-alerts.com",
      subject: "You have been tagged in a video",
      body: `<p>Ali tagged you in a video. 'OMG is this you??'</p><p><a href="#">Watch Video</a></p>`
    }
  },
  {
    id: 's6',
    type: ScenarioType.SMS,
    isPhishing: true,
    correctPhishingType: PhishingType.SMISHING,
    correctDefense: DefenseType.THINK,
    socialTactic: SocialTactic.FEAR,
    indicator: "Fake FIR / Police Case",
    explanation: "SMS claiming a case has been registered against you. Fear tactic to extort money.",
    content: {
      phoneNumber: "8877 (Spoofed)",
      message: "FIR #991 registered against your CNIC. Contact SI Aslam 0300-1234567 immediately to avoid arrest."
    }
  },
  {
    id: 's7',
    type: ScenarioType.EMAIL,
    isPhishing: true,
    correctPhishingType: PhishingType.GENERAL,
    correctDefense: DefenseType.DONT_CLICK,
    socialTactic: SocialTactic.GREED,
    indicator: "Gift Card Survey",
    explanation: "Surveys offering $100 for 2 minutes of work usually steal personal data.",
    riskPoints: [{ location: 'SUBJECT', text: "You've won a $100 gift card!" }],
    content: {
      sender: "Customer Rewards",
      senderEmail: "rewards@survey-monkey-prizes.com",
      subject: "Shopper Survey: Claim your $100",
      body: `<p>Take this 1 minute survey and get a free Daraz Voucher.</p><p><a href="#">Start Survey</a></p>`
    }
  },
  {
    id: 's8',
    type: ScenarioType.VOICE,
    isPhishing: true,
    correctPhishingType: PhishingType.VISHING,
    correctDefense: DefenseType.THINK,
    socialTactic: SocialTactic.CURIOSITY,
    indicator: "One Ring Scam (Wangiri)",
    explanation: "Missed call from an international number. If you call back, you are charged premium rates.",
    content: {
      phoneNumber: "+247 123456",
      message: "Missed Call from Ascension Island. (Rings once and stops). Aim is to make you call back."
    }
  },

  // ==========================================
  // MODULE 6: RANSOMWARE DEFENSE (New Module)
  // ==========================================
  {
    id: 'r1',
    type: ScenarioType.EMAIL,
    isPhishing: true,
    correctPhishingType: PhishingType.RANSOMWARE,
    correctDefense: DefenseType.ANTIVIRUS,
    socialTactic: SocialTactic.TRUST,
    indicator: "'Scanned Document' with executable",
    explanation: "Printers send PDFs, not JavaScript (.js) files. Opening this script will download ransomware.",
    riskPoints: [
        { location: 'ATTACHMENT', text: "File type 'scan_doc.js' is a malicious script, not a document." },
        { location: 'SENDER', text: "Generic 'printer@' alias." }
    ],
    content: {
      sender: "Office Printer",
      senderEmail: "printer@office-network-local.com",
      subject: "Scanned Document: Contract_Final",
      body: "Please find the attached scan from the 2nd Floor Printer.",
      attachment: { name: "scan_contract.js", size: "4KB", type: "DOC" }
    }
  },
  {
    id: 'r2',
    type: ScenarioType.EMAIL,
    isPhishing: true,
    correctPhishingType: PhishingType.RANSOMWARE,
    correctDefense: DefenseType.DONT_CLICK,
    socialTactic: SocialTactic.FEAR,
    indicator: "Copyright Infringement Threat",
    explanation: "Attackers claim you used copyrighted images and provide a link to 'evidence' which is actually ransomware.",
    riskPoints: [
        { location: 'BODY', text: "Threatening legal action to force a click." },
        { location: 'SENDER', text: "Free email (gmail/hotmail) for a 'Legal Dept'." }
    ],
    content: {
      sender: "Legal Department",
      senderEmail: "copyright.protection.lawyer@gmail.com",
      subject: "Final Warning: Copyright Violation on your website",
      body: `<p>You are using our copyrighted images on your website. This is a legal demand to remove them.</p><p><a href="#">Download Evidence Portfolio</a></p>`
    }
  },
  {
    id: 'r3',
    type: ScenarioType.SEARCH,
    isPhishing: true,
    correctPhishingType: PhishingType.RANSOMWARE,
    correctDefense: DefenseType.BACKUP,
    socialTactic: SocialTactic.GREED,
    indicator: "Fake Ransomware Decryptor",
    explanation: "Desperate victims often search for free tools to unlock files. Scammers fake these tools to re-encrypt or steal more data.",
    content: {
      searchQuery: "recover encrypted .locked files free tool",
      results: [
        { title: "Free Ransomware Decryptor Tool 2024", url: "www.decrypt-my-files-free.com", snippet: "Unlock all ransomware extensions instantly. Download now.", isMalicious: true },
        { title: "No More Ransom Project", url: "www.nomoreransom.org", snippet: "Official global initiative.", isMalicious: false }
      ]
    }
  },
  {
    id: 'r4',
    type: ScenarioType.EMAIL,
    isPhishing: true,
    correctPhishingType: PhishingType.RANSOMWARE,
    correctDefense: DefenseType.DONT_CLICK,
    socialTactic: SocialTactic.AUTHORITY,
    indicator: "Fake VPN Configuration",
    explanation: "Attackers impersonate IT to send malicious configuration files (.exe or .msi) that install backdoor access.",
    riskPoints: [
        { location: 'ATTACHMENT', text: "IT usually pushes updates automatically, they don't email .exe files." }
    ],
    content: {
      sender: "IT Support",
      senderEmail: "support@company-helpdesk-portal.com",
      subject: "Critical: VPN Security Update Required",
      body: "Your VPN certificate has expired. Please run the attached configuration tool to reconnect to the network.",
      attachment: { name: "vpn-connect-setup.exe", size: "4.5MB", type: "EXE" }
    }
  },
  {
    id: 'r5',
    type: ScenarioType.EMAIL,
    isPhishing: true,
    correctPhishingType: PhishingType.RANSOMWARE,
    correctDefense: DefenseType.ANTIVIRUS,
    socialTactic: SocialTactic.URGENCY,
    indicator: "Password Protected ZIP",
    explanation: "Attackers password-protect ZIP files to hide the malware inside from email scanners. They provide the password in the body.",
    riskPoints: [
        { location: 'BODY', text: "Providing the password '1234' allows the virus to bypass antivirus scanners." }
    ],
    content: {
      sender: "Shipping Agent",
      senderEmail: "delivery@logistics-express-mail.com",
      subject: "Urgent: Shipping Docs (Inv #9920)",
      body: "Attached are the shipping documents. The file is password protected for security. <br><b>Password: 1234</b>",
      attachment: { name: "Shipping_Docs.zip", size: "120KB", type: "ZIP" }
    }
  }
];
