import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navigation from '@/components/Navigation'
import { 
  Shield, Lock, Globe, Mail, MessageSquare, Users, 
  Wifi, Smartphone, Monitor, Home, CreditCard, Brain,
  MapPin, ChevronDown, ChevronUp, CheckCircle2, Circle,
  Download, Upload, Trash2, PieChart, Info, X
} from 'lucide-react'

type Priority = 'Essential' | 'Basic' | 'Optional' | 'Advanced'

interface ChecklistItem {
  id: string
  title: string
  description: string
  priority: Priority
  details?: string
}

interface ChecklistCategory {
  id: string
  title: string
  description: string
  icon: React.ElementType
  items: ChecklistItem[]
}

const STORAGE_KEY = 'security-checklist-progress'

// Helper function to normalize priority from YAML format
const normalizePriority = (p: string): Priority => {
  const lower = p.toLowerCase()
  if (lower === 'essential') return 'Essential'
  if (lower === 'basic') return 'Basic'
  if (lower === 'optional') return 'Optional'
  if (lower === 'advanced') return 'Advanced'
  return 'Optional'
}

const checklistData: ChecklistCategory[] = [
  {
    id: 'authentication',
    title: 'Authentication',
    description: 'Securing your online account login credentials',
    icon: Lock,
    items: [
      {
        id: 'auth-1',
        title: 'Use a Strong Password',
        description: 'If your password is too short, or contains dictionary words, places, or names, then it can be easily cracked through brute force, or guessed by someone',
        priority: 'Essential',
        details: 'Use passwords with at least 12 characters, combining uppercase, lowercase, numbers, and symbols. Consider using a passphrase made of random words for better security and memorability.'
      },
      {
        id: 'auth-2',
        title: "Don't Reuse Passwords",
        description: 'If someone were to reuse a password and one site they had an account with suffered a leak, then a criminal could easily gain unauthorized access to their other accounts',
        priority: 'Essential',
        details: 'Every account should have a unique password. Use a password manager to generate and store different passwords for each service.'
      },
      {
        id: 'auth-3',
        title: 'Use a Secure Password Manager',
        description: 'For most people, it is going to be near-impossible to remember hundreds of strong and unique passwords. A password manager will encrypt, store and auto-fill your login credentials',
        priority: 'Essential',
        details: 'Recommended password managers include Bitwarden, 1Password, KeePassXC. They keep your passwords encrypted and accessible only with your master password.'
      },
      {
        id: 'auth-4',
        title: 'Avoid Sharing Passwords',
        description: 'While there may be times that you need to share access to an account with another person, you should not share your password directly',
        priority: 'Essential',
        details: 'If sharing is necessary, use password manager sharing features or create separate accounts with proper permissions.'
      },
      {
        id: 'auth-5',
        title: 'Enable 2-Factor Authentication',
        description: '2FA is where you must provide both something you know (a password) and something you have (such as a code on your phone) to log in',
        priority: 'Essential',
        details: 'Use authenticator apps like Authy, Google Authenticator, or hardware tokens. Avoid SMS-based 2FA when possible as it can be intercepted.'
      },
      {
        id: 'auth-6',
        title: 'Keep Backup Codes Safe',
        description: 'When you enable multi-factor authentication, you will usually be given several codes that you can use if your 2FA method is lost, broken or unavailable',
        priority: 'Essential',
        details: 'Store backup codes in a secure location, separate from your password manager. Consider printing them and storing physically in a safe place.'
      },
      {
        id: 'auth-7',
        title: 'Sign Up for Breach Alerts',
        description: 'After a website suffers a significant data breach, the leaked data often ends up on the internet. Several websites collect leaked records and allow you to search by email',
        priority: 'Optional',
        details: 'Use services like Have I Been Pwned (haveibeenpwned.com) to check if your accounts have been compromised and set up notifications for future breaches.'
      },
      {
        id: 'auth-8',
        title: 'Shield your Password/PIN',
        description: 'When typing your password in public places, ensure you are not in direct line of sight of a CCTV camera and that no one is able to see over your shoulder',
        priority: 'Optional',
        details: 'Be aware of your surroundings when entering sensitive information, especially at ATMs and in crowded places.'
      },
      {
        id: 'auth-9',
        title: 'Update Critical Passwords Periodically',
        description: 'Database leaks and breaches are common, and likely several of your passwords are already somewhere online. Occasionally updating passwords of security-critical accounts can help mitigate this',
        priority: 'Optional',
        details: 'Focus on updating passwords for important accounts like email, banking, and primary social media every 6-12 months.'
      },
      {
        id: 'auth-10',
        title: "Don't Save your Password in Browsers",
        description: 'Most modern browsers offer to save your credentials when you log into a site. Don\'t allow this, as they are not always encrypted',
        priority: 'Optional',
        details: 'Browser password storage is less secure than dedicated password managers. Disable this feature and use a proper password manager instead.'
      },
      {
        id: 'auth-11',
        title: "Avoid Logging In on Someone Else's Device",
        description: "Avoid logging in on other people's computers since you can't be sure their system is clean. Be especially cautious of public computers",
        priority: 'Optional',
        details: 'If you must use someone else\'s device, use incognito/private mode and always log out completely. Clear cookies and browsing history afterward.'
      },
      {
        id: 'auth-12',
        title: 'Avoid Password Hints',
        description: 'Some sites allow you to set password hints. Often, it is very easy to guess answers. In cases where password hints are mandatory, use random answers',
        priority: 'Optional',
        details: 'Treat password hints like passwords - store random answers in your password manager rather than using real, guessable information.'
      },
      {
        id: 'auth-13',
        title: 'Never Answer Online Security Questions Truthfully',
        description: "If a site asks security questions (such as place of birth, mother's maiden name, or first car), don't provide real answers",
        priority: 'Optional',
        details: 'Use your password manager to generate and store random answers to security questions. This information is often publicly available.'
      },
      {
        id: 'auth-14',
        title: "Don't Use a 4-digit PIN",
        description: "Don't use a short PIN to access your smartphone or computer. Instead, use a text password or a much longer PIN",
        priority: 'Optional',
        details: 'Use at least 6-8 digits for PINs, or better yet, use a full password or passphrase for device security.'
      },
      {
        id: 'auth-15',
        title: 'Avoid Using SMS for 2FA',
        description: 'When enabling multi-factor authentication, opt for app-based codes or a hardware token if supported. SMS is susceptible to SIM-swapping attacks',
        priority: 'Optional',
        details: 'Authenticator apps and hardware tokens (like YubiKey) provide much stronger security than SMS-based 2FA.'
      },
      {
        id: 'auth-16',
        title: 'Avoid Using your PM to Generate OTPs',
        description: 'Many password managers are able to generate 2FA codes. It is best not to use your primary password manager as your 2FA authenticator',
        priority: 'Advanced',
        details: 'Keep 2FA codes separate from passwords to maintain true two-factor security. Use a dedicated authenticator app on your phone.'
      },
      {
        id: 'auth-17',
        title: 'Avoid Face Unlock',
        description: 'Most phones and laptops offer a facial recognition authentication feature. This can be less secure than other biometric options',
        priority: 'Advanced',
        details: 'Photos of your face are public and can be used to bypass facial recognition. Use fingerprint or PIN/password for more secure authentication.'
      },
      {
        id: 'auth-18',
        title: 'Watch Out for Keyloggers',
        description: 'A hardware keylogger is a physical device planted between your keyboard and the computer. They are able to intercept everything typed',
        priority: 'Advanced',
        details: 'Check USB ports for unusual devices. Use on-screen keyboards for sensitive passwords, or better yet, use password manager auto-fill which bypasses keyloggers.'
      },
      {
        id: 'auth-19',
        title: 'Consider a Hardware Token',
        description: 'A U2F/FIDO2 security key is a USB (or NFC) device that you insert while logging in to an online service to authenticate',
        priority: 'Advanced',
        details: 'Hardware tokens like YubiKey provide the strongest protection against phishing. They work with many major services including Google, Facebook, and GitHub.'
      },
      {
        id: 'auth-20',
        title: 'Consider Offline Password Manager',
        description: 'For increased security, an encrypted offline password manager will give you full control over your data',
        priority: 'Advanced',
        details: 'KeePassXC is a popular offline password manager. Store the database file securely and ensure you have backups.'
      },
      {
        id: 'auth-21',
        title: 'Consider Unique Usernames',
        description: 'Having different passwords for each account is a good first step, but if you also use a unique username, email, or alias then it makes it much harder for attackers',
        priority: 'Advanced',
        details: 'Use email aliases or forwarding services to create unique email addresses for each service. This prevents account enumeration across platforms.'
      }
    ]
  },
  {
    id: 'web-browsing',
    title: 'Web Browsing',
    description: 'Avoiding tracking, censorship, and data collection online',
    icon: Globe,
    items: [
      {
        id: 'web-1',
        title: 'Block Ads',
        description: 'Using an ad-blocker can help improve your privacy, by blocking the trackers that ads implement',
        priority: 'Essential',
        details: 'Use uBlock Origin or similar reputable ad-blockers. They block tracking, reduce bandwidth usage, and make pages load faster.'
      },
      {
        id: 'web-2',
        title: 'Ensure Website is Legitimate',
        description: 'When logging into any online accounts, double check the URL is correct. Phishing sites often use similar looking domains',
        priority: 'Basic',
        details: 'Check for HTTPS, verify the domain spelling, and bookmark important sites to avoid typos that could lead to phishing pages.'
      },
      {
        id: 'web-3',
        title: 'Watch out for Browser Malware',
        description: 'Your system or browser can be compromised by spyware, miners, browser hijackers, malicious redirects, and more',
        priority: 'Basic',
        details: 'Keep your browser updated, only install extensions from official stores, and regularly scan for malware with reputable security software.'
      },
      {
        id: 'web-4',
        title: 'Use a Privacy-Respecting Browser',
        description: 'Firefox (with tweaks), Brave, or LibreWolf are privacy-focused browsers that block trackers by default',
        priority: 'Essential',
        details: 'Avoid Chrome and Edge as they send significant data to Google/Microsoft. Privacy browsers protect you from tracking without sacrificing functionality.'
      },
      {
        id: 'web-5',
        title: 'Use a Private Search Engine',
        description: 'Using a privacy-preserving, non-tracking search engine will reduce risk that your search terms are not logged or sold',
        priority: 'Essential',
        details: 'DuckDuckGo, Startpage, and Brave Search don\'t track you or build profiles. They provide similar search quality without privacy invasion.'
      },
      {
        id: 'web-6',
        title: 'Remove Unnecessary Browser Addons',
        description: 'Extensions are able to see, log or modify anything you do in the browser. Only install extensions you really need',
        priority: 'Essential',
        details: 'Review installed extensions regularly. Remove those you haven\'t used recently and check reviews/permissions before installing new ones.'
      },
      {
        id: 'web-7',
        title: 'Keep Browser Up-to-date',
        description: 'Browser vulnerabilities are constantly being discovered and patched. Keep your browser updated to protect against known exploits',
        priority: 'Essential',
        details: 'Enable automatic updates. Security patches often fix critical vulnerabilities that attackers actively exploit.'
      },
      {
        id: 'web-8',
        title: 'Check for HTTPS',
        description: 'If you enter information on a non-HTTPS website, this data is transported unencrypted and can be intercepted',
        priority: 'Essential',
        details: 'Look for the padlock icon in the address bar. Enable HTTPS-only mode in browser settings to automatically upgrade connections.'
      },
      {
        id: 'web-9',
        title: 'Use DNS-over-HTTPS',
        description: 'Traditional DNS makes requests in plain text for everyone to see. DoH encrypts DNS queries',
        priority: 'Essential',
        details: 'Enable DoH in browser settings (Firefox, Chrome, Edge all support it). This prevents ISPs and others from seeing which sites you visit.'
      },
      {
        id: 'web-10',
        title: 'Multi-Session Containers',
        description: 'Compartmentalization is important to keep different aspects of your browsing separate',
        priority: 'Essential',
        details: 'Firefox Multi-Account Containers lets you isolate work, personal, shopping, and social media in separate containers that don\'t share cookies or tracking.'
      },
      {
        id: 'web-11',
        title: 'Use Incognito',
        description: "When using someone else's machine, ensure you're in a private/incognito session",
        priority: 'Essential',
        details: 'Private mode prevents history, cookies, and passwords from being saved. Always close private windows completely when done.'
      },
      {
        id: 'web-12',
        title: 'Understand Your Browser Fingerprint',
        description: 'Browser Fingerprinting is an incredibly accurate method of tracking where a website identifies you based on your browser configuration',
        priority: 'Essential',
        details: 'Test your fingerprint at amiunique.org or coveryourtracks.eff.org. Use privacy-focused browsers and avoid unique configurations to blend in.'
      },
      {
        id: 'web-13',
        title: 'Manage Cookies',
        description: 'Clearing cookies regularly is one step you can take to help reduce websites from tracking you',
        priority: 'Essential',
        details: 'Set browsers to clear cookies on exit, or use extensions like Cookie AutoDelete to automatically remove cookies when you leave a site.'
      },
      {
        id: 'web-14',
        title: 'Block Third-Party Cookies',
        description: 'Third-party cookies are placed on your device by a website other than the one you\'re visiting for cross-site tracking',
        priority: 'Essential',
        details: 'Disable third-party cookies in browser settings. Most modern browsers now block them by default or make it easy to disable.'
      },
      {
        id: 'web-15',
        title: 'Block Third-Party Trackers',
        description: 'Blocking trackers will help to stop websites, advertisers, and analytics companies from tracking you',
        priority: 'Essential',
        details: 'Privacy Badger, uBlock Origin, and Disconnect are effective tracker-blockers. Many privacy browsers have this built-in.'
      },
      {
        id: 'web-16',
        title: 'Beware of Redirects',
        description: 'While some redirects are harmless, others are used in phishing attacks. Check the redirect destination before following',
        priority: 'Optional',
        details: 'Hover over links to see destination URLs. Use tools like RedirectDetective to check suspicious redirects before clicking.'
      },
      {
        id: 'web-17',
        title: 'Do Not Sign Into Your Browser',
        description: 'Many browsers allow you to sign in to sync history and bookmarks. This associates your browsing with your identity',
        priority: 'Optional',
        details: 'Use alternative sync solutions or export bookmarks manually. Browser accounts send browsing data to corporate servers.'
      },
      {
        id: 'web-18',
        title: 'Disallow Prediction Services',
        description: 'Some browsers provide prediction services where you receive real-time search results or URL auto-fill',
        priority: 'Optional',
        details: 'These features send your keystrokes to servers in real-time before you finish typing. Disable them in browser settings.'
      },
      {
        id: 'web-19',
        title: 'Avoid G Translate for Webpages',
        description: 'When you visit a webpage in a foreign language, Google Translate extension sends the full page content to Google',
        priority: 'Optional',
        details: 'Use standalone translation services or privacy-respecting alternatives instead of browser-based translation that shares all page content.'
      },
      {
        id: 'web-20',
        title: 'Disable Web Notifications',
        description: 'Browser push notifications are often used by criminals to encourage you to click malicious links',
        priority: 'Optional',
        details: 'Disable notification permissions by default. Only enable for trusted sites you actively use.'
      },
      {
        id: 'web-21',
        title: 'Disable Automatic Downloads',
        description: 'Drive-by downloads are a common method of getting harmful files onto a device',
        priority: 'Optional',
        details: 'Set browser to ask where to save each file and disable automatic download of certain file types. Be cautious of unexpected downloads.'
      },
      {
        id: 'web-22',
        title: 'Disallow Access to Sensors',
        description: 'Mobile websites can tap into your device sensors without explicit permission',
        priority: 'Optional',
        details: 'Disable sensor access in browser permissions. Sites rarely need access to motion, light, or other sensors.'
      },
      {
        id: 'web-23',
        title: 'Disallow Location',
        description: 'Location Services lets sites ask for your physical location',
        priority: 'Optional',
        details: 'Deny location access by default. Sites can still approximate location from IP address, but this prevents precise tracking.'
      },
      {
        id: 'web-24',
        title: 'Disallow Camera/Microphone access',
        description: 'Check browser settings to ensure no websites are granted access to webcam or microphone',
        priority: 'Optional',
        details: 'Only grant camera/mic access when actively using video conferencing. Consider physical webcam covers for additional security.'
      },
      {
        id: 'web-25',
        title: 'Disable Browser Password Saves',
        description: 'Do not allow your browser to store usernames and passwords',
        priority: 'Optional',
        details: 'Browser password storage is less secure than password managers. Use a dedicated password manager instead.'
      },
      {
        id: 'web-26',
        title: 'Disable Browser Autofill',
        description: 'Turn off autofill for any confidential or personal details',
        priority: 'Optional',
        details: 'Autofill can leak information through forms and scripts. Use password manager autofill instead, which is more secure.'
      },
      {
        id: 'web-27',
        title: 'Protect from Exfil Attack',
        description: 'The CSS Exfiltrate attack is a method where credentials and other sensitive details can be stolen through CSS',
        priority: 'Optional',
        details: 'Use the CSS Exfil Protection browser extension to guard against this attack vector.'
      },
      {
        id: 'web-28',
        title: 'Deactivate ActiveX',
        description: 'ActiveX is a browser extension API built into Microsoft IE that can be exploited',
        priority: 'Optional',
        details: 'ActiveX is outdated and has many security issues. If you must use IE/Edge legacy mode, disable ActiveX completely.'
      },
      {
        id: 'web-29',
        title: 'Disable WebRTC',
        description: 'WebRTC allows peer-to-peer communication but can leak your real IP even when using a VPN',
        priority: 'Optional',
        details: 'Use browser extensions to disable WebRTC or configure your browser to prevent IP leaks while using VPN.'
      },
      {
        id: 'web-30',
        title: 'Spoof HTML5 Canvas Sig',
        description: 'Canvas Fingerprinting allows websites to identify and track users through HTML5 canvas element',
        priority: 'Optional',
        details: 'Use Canvas Blocker or similar extensions to randomize canvas fingerprints. Tor Browser has this protection built-in.'
      },
      {
        id: 'web-31',
        title: 'Spoof User Agent',
        description: 'The user agent tells the website what device, browser, and version you are using',
        priority: 'Optional',
        details: 'User agent spoofing can reduce tracking but may break some websites. Use cautiously or stick with common user agents.'
      },
      {
        id: 'web-32',
        title: 'Disregard DNT',
        description: 'Do Not Track has limited impact as most websites do not respect it',
        priority: 'Optional',
        details: 'DNT is largely ineffective and may make you more unique. Rely on actual blocking tools instead.'
      },
      {
        id: 'web-33',
        title: 'Prevent HSTS Tracking',
        description: 'HSTS was designed to help secure websites but can be abused for tracking',
        priority: 'Optional',
        details: 'Clear HSTS cache periodically or use browsers that automatically prevent HSTS tracking.'
      },
      {
        id: 'web-34',
        title: 'Prevent Automatic Browser Connections',
        description: 'Browsers may phone home to report usage, analytics, and diagnostics even when not in use',
        priority: 'Optional',
        details: 'Disable telemetry, safe browsing checks, and other automatic connections in browser settings.'
      },
      {
        id: 'web-35',
        title: 'Enable 1st-Party Isolation',
        description: 'First Party Isolation prevents cookies and data from being shared between different domains',
        priority: 'Optional',
        details: 'Enable in Firefox privacy settings. This significantly reduces tracking by isolating each website\'s data.'
      },
      {
        id: 'web-36',
        title: 'Strip Tracking Params from URLs',
        description: 'Websites append tracking parameters to URLs to monitor your behavior',
        priority: 'Advanced',
        details: 'Use ClearURLs extension or configure your browser to automatically remove tracking parameters like utm_source, fbclid, etc.'
      },
      {
        id: 'web-37',
        title: 'First Launch Security',
        description: 'After installing a browser, the first launch may send data before you configure privacy settings',
        priority: 'Advanced',
        details: 'Disconnect from internet during first browser launch, configure all privacy settings, then reconnect.'
      },
      {
        id: 'web-38',
        title: 'Use The Tor Browser',
        description: 'The Tor Project provides a browser that encrypts and routes traffic through multiple nodes',
        priority: 'Advanced',
        details: 'Tor Browser provides the strongest anonymity but is slower. Use for activities requiring maximum privacy.'
      },
      {
        id: 'web-39',
        title: 'Disable JavaScript',
        description: 'Disabling JavaScript will greatly decrease your browsing experience but significantly reduce attack surface',
        priority: 'Advanced',
        details: 'Most modern websites require JavaScript. Consider using NoScript to selectively enable it only for trusted sites.'
      }
    ]
  },
  {
    id: 'email',
    title: 'Email',
    description: 'Protecting the gateway to your online accounts',
    icon: Mail,
    items: [
      {
        id: 'email-1',
        title: 'Have more than one email address',
        description: 'Consider using a different email address for security-critical communications from trivial mail',
        priority: 'Essential',
        details: 'Separate your personal, work, and online shopping emails. This limits damage if one account is compromised.'
      },
      {
        id: 'email-2',
        title: 'Keep Email Address Private',
        description: 'Do not share your primary email publicly, as mail addresses are often the starting point for phishing attacks',
        priority: 'Essential'
      },
      {
        id: 'email-3',
        title: 'Keep your Account Secure',
        description: 'Use a long and unique password, enable 2FA and be careful while logging in',
        priority: 'Essential',
        details: 'Your email account provides an easy entry point to all your other online accounts through password reset features.'
      },
      {
        id: 'email-4',
        title: 'Disable Automatic Loading of Remote Content',
        description: 'Email messages can contain remote content such as images or stylesheets, often loaded automatically',
        priority: 'Essential',
        details: 'Remote content can be used for tracking. Disable automatic loading to prevent senders from knowing when you open emails.'
      },
      {
        id: 'email-5',
        title: 'Use Plaintext',
        description: 'There are two main types of emails: plaintext and HTML. Plaintext is strongly preferred for security',
        priority: 'Optional',
        details: 'HTML emails can contain tracking pixels, malicious scripts, and are more complex attack surface. Plaintext is simpler and safer.'
      },
      {
        id: 'email-6',
        title: "Don't connect third-party apps to your email account",
        description: 'If you give a third-party app full access to your inbox, they effectively have access to all your emails',
        priority: 'Optional',
        details: 'Review and revoke access to apps that have email permissions. They can read all your messages and sensitive information.'
      },
      {
        id: 'email-7',
        title: "Don't Share Sensitive Data via Email",
        description: 'Emails are very easily intercepted and you can\'t be sure of recipient security',
        priority: 'Optional',
        details: 'Never send passwords, credit card numbers, or confidential documents via unencrypted email. Use secure file sharing instead.'
      },
      {
        id: 'email-8',
        title: 'Consider Switching to a Secure Mail Provider',
        description: 'Secure email providers like ProtonMail or Tutanota offer end-to-end encryption',
        priority: 'Optional',
        details: 'These providers encrypt your mailbox so only you can read messages. They can\'t access your data even if legally compelled.'
      },
      {
        id: 'email-9',
        title: 'Use Smart Key',
        description: 'OpenPGP does not support Forward secrecy. Consider using a smart card or USB device for private key storage',
        priority: 'Advanced',
        details: 'Hardware keys keep your private encryption key secure on a physical device that never exposes the key.'
      },
      {
        id: 'email-10',
        title: 'Use Aliasing / Anonymous Forwarding',
        description: 'Email aliasing allows messages to be sent to [anything]@my-domain.com and land in your primary inbox',
        priority: 'Advanced',
        details: 'Services like SimpleLogin or AnonAddy let you create unlimited aliases. Each alias can be disabled if it receives spam.'
      },
      {
        id: 'email-11',
        title: 'Subaddressing',
        description: 'An alternative to aliasing where anything after the + symbol is omitted during mail delivery',
        priority: 'Optional',
        details: 'Most email providers support yourname+tag@email.com format. Use unique tags for each service to track leaks.'
      },
      {
        id: 'email-12',
        title: 'Use a Custom Domain',
        description: 'Using a custom domain means you are not dependent on the address assigned by your mail provider',
        priority: 'Advanced',
        details: 'Own your email address. If your provider shuts down or changes policy, you can move to another provider without changing addresses.'
      },
      {
        id: 'email-13',
        title: 'Sync with a client for backup',
        description: 'To avoid losing access to emails during an outage, sync emails to a local client',
        priority: 'Advanced',
        details: 'Use Thunderbird or another email client with IMAP to keep local copies of all emails as backup.'
      },
      {
        id: 'email-14',
        title: 'Be Careful with Mail Signatures',
        description: 'Email signatures can reveal personal information in insecure environments',
        priority: 'Advanced',
        details: 'Avoid including phone numbers, addresses, or other sensitive info in signatures that may be forwarded.'
      },
      {
        id: 'email-15',
        title: 'Be Careful with Auto-Replies',
        description: 'Out-of-office automatic replies often reveal too much information',
        priority: 'Advanced',
        details: 'Don\'t announce travel dates, locations, or when you\'ll be away from home. Keep auto-replies brief and vague.'
      },
      {
        id: 'email-16',
        title: 'Choose the Right Mail Protocol',
        description: 'Do not use outdated protocols (below IMAPv4 or POPv3)',
        priority: 'Advanced',
        details: 'Modern protocols have better security. Always use the latest version with TLS encryption enabled.'
      },
      {
        id: 'email-17',
        title: 'Self-Hosting',
        description: 'Self-hosting your own mail server is not recommended for non-advanced users',
        priority: 'Advanced',
        details: 'Running a mail server requires strong networking knowledge and constant security maintenance to prevent becoming a spam relay.'
      },
      {
        id: 'email-18',
        title: 'Always use TLS Ports',
        description: 'There are SSL options for POP3, IMAP, and SMTP. They should always be used instead of plaintext ports',
        priority: 'Advanced',
        details: 'Use port 993 for IMAP, 995 for POP3, and 465/587 for SMTP with TLS encryption.'
      },
      {
        id: 'email-19',
        title: 'DNS Availability',
        description: 'For self-hosted mail servers, use at least 2 MX records for redundancy',
        priority: 'Advanced',
        details: 'Secondary and tertiary MX records provide failover when the primary mail server is unavailable.'
      },
      {
        id: 'email-20',
        title: 'Prevent DDoS and Brute Force Attacks',
        description: 'For self-hosted mail servers, limit simultaneous connections and connection rate',
        priority: 'Advanced',
        details: 'Rate limiting and connection limits reduce the impact of bot attacks on your mail server.'
      },
      {
        id: 'email-21',
        title: 'Maintain IP Blacklist',
        description: 'For self-hosted mail servers, maintain an up-to-date local IP blacklist and spam URI blocklists',
        priority: 'Advanced',
        details: 'Use services like Spamhaus and configure realtime blocklists to filter malicious senders automatically.'
      }
    ]
  },
  {
    id: 'messaging',
    title: 'Messaging',
    description: 'Keeping your communications private and secure',
    icon: MessageSquare,
    items: [
      {
        id: 'msg-1',
        title: 'Only Use Fully End-to-End Encrypted Messengers',
        description: 'End-to-end encryption ensures messages are encrypted on your device and only decrypted on recipient device',
        priority: 'Essential',
        details: 'Signal, WhatsApp (with caveats), and Wire offer true E2EE. Avoid SMS, Facebook Messenger (non-secret), and Telegram (non-secret chats).'
      },
      {
        id: 'msg-2',
        title: 'Use only Open Source Messaging Platforms',
        description: 'Open source code can be independently examined and audited by anyone qualified to ensure no backdoors',
        priority: 'Essential',
        details: 'Signal, Element, and Wire are open source. Closed-source apps cannot be verified for security claims.'
      },
      {
        id: 'msg-3',
        title: 'Use a "Trustworthy" Messaging Platform',
        description: 'Ensure the platform is fully open source, stable, actively maintained, and backed by reputable developers',
        priority: 'Essential',
        details: 'Research the organization behind the app, their funding, and track record before trusting with sensitive communications.'
      },
      {
        id: 'msg-4',
        title: 'Check Security Settings',
        description: 'Enable security features including contact verification, security notifications, and encryption',
        priority: 'Essential',
        details: 'Disable optional features like read receipts, last online, and typing indicators which leak metadata.'
      },
      {
        id: 'msg-5',
        title: 'Ensure your Recipients Environment is Secure',
        description: 'Your conversation security depends on the weakest link',
        priority: 'Essential',
        details: 'Educate contacts about device security. Their compromised device can expose your conversations.'
      },
      {
        id: 'msg-6',
        title: 'Disable Cloud Services',
        description: 'Some messaging apps offer web or desktop companion apps that increase attack surface',
        priority: 'Essential',
        details: 'Web and desktop versions have been linked to security issues. Use mobile apps when possible.'
      },
      {
        id: 'msg-7',
        title: 'Secure Group Chats',
        description: 'Risk of compromise rises with more participants as attack surface increases',
        priority: 'Essential',
        details: 'Periodically review group members. Remove inactive or suspicious participants. Keep sensitive groups small.'
      },
      {
        id: 'msg-8',
        title: 'Create a Safe Environment for Communication',
        description: 'Communications can be monitored at several stages from device to network to servers',
        priority: 'Essential',
        details: 'Secure your device, use trusted networks, verify encryption is active, and choose platforms that don\'t store messages.'
      },
      {
        id: 'msg-9',
        title: 'Agree on a Communication Plan',
        description: 'In certain situations, make a communication plan with primary and backup secure methods',
        priority: 'Optional',
        details: 'Agree on fallback channels if primary becomes unavailable. Include verification methods to confirm identity.'
      },
      {
        id: 'msg-10',
        title: 'Strip Meta-Data from Media',
        description: 'Metadata is additional information attached to files that may reveal more than intended',
        priority: 'Optional',
        details: 'Photos contain EXIF data with location, time, camera info. Remove before sharing using tools like ExifTool or Scrambled Exif.'
      },
      {
        id: 'msg-11',
        title: 'Defang URLs',
        description: 'Sending links can unintentionally expose information when previews are generated',
        priority: 'Optional',
        details: 'Link previews are generated client-side, potentially revealing your IP and device info to the linked website.'
      },
      {
        id: 'msg-12',
        title: 'Verify your Recipient',
        description: 'Ensure you are talking to the intended recipient and they have not been compromised',
        priority: 'Optional',
        details: 'Use safety number/key verification features. Confirm through alternate channel if suspicious.'
      },
      {
        id: 'msg-13',
        title: 'Enable Ephemeral Messages',
        description: 'Self-destructing messages automatically delete after a set time',
        priority: 'Optional',
        details: 'Disappearing messages reduce data retention risk. Enable for sensitive conversations. Note: recipients can still screenshot.'
      },
      {
        id: 'msg-14',
        title: 'Avoid SMS',
        description: 'SMS is not secure and susceptible to interception, SIM swapping, and manipulation',
        priority: 'Optional',
        details: 'SMS is unencrypted and easily intercepted. Use Signal or WhatsApp instead for important conversations.'
      },
      {
        id: 'msg-15',
        title: 'Watch out for Trackers',
        description: 'Be wary of messaging applications with trackers as they collect detailed usage statistics',
        priority: 'Optional',
        details: 'Use tools like Exodus Privacy to check Android apps for trackers. Choose apps with minimal or no tracking.'
      },
      {
        id: 'msg-16',
        title: 'Consider Jurisdiction',
        description: 'The jurisdiction where the organization is based and data is hosted matters',
        priority: 'Advanced',
        details: 'Some countries have strong privacy laws, others require data retention or have government access requirements.'
      },
      {
        id: 'msg-17',
        title: 'Use an Anonymous Platform',
        description: 'If targeted, opt for anonymous messaging that does not require phone number or personal information',
        priority: 'Advanced',
        details: 'Session, Briar, and Tor-based messengers don\'t require phone numbers. Consider for high-risk situations.'
      },
      {
        id: 'msg-18',
        title: 'Ensure Forward Secrecy is Supported',
        description: 'Forward secrecy generates a new encryption key for every message',
        priority: 'Advanced',
        details: 'With forward secrecy, compromising one key doesn\'t expose past conversations. Signal Protocol implements this well.'
      },
      {
        id: 'msg-19',
        title: 'Consider a Decentralized Platform',
        description: 'Decentralized platforms don\'t have a central provider to trust with data',
        priority: 'Advanced',
        details: 'Matrix, Session, and Briar are decentralized. No single point of failure or censorship, but more complex to use.'
      }
    ]
  },
  {
    id: 'social-media',
    title: 'Social Media',
    description: 'Minimizing the risks associated with using online communities',
    icon: Users,
    items: [
      {
        id: 'social-1',
        title: 'Secure your Account',
        description: 'Social media profiles get stolen or taken over all too often. Use a unique, strong password and enable 2FA',
        priority: 'Essential',
        details: 'Account takeovers are common. Protect your social accounts with strong passwords and two-factor authentication.'
      },
      {
        id: 'social-2',
        title: 'Check Privacy Settings',
        description: 'Ensure you are comfortable with what data you are exposing and to whom',
        priority: 'Essential',
        details: 'Review privacy settings regularly as platforms often change defaults. Limit who can see your posts, photos, and personal information.'
      },
      {
        id: 'social-3',
        title: 'Think of All Interactions as Public',
        description: 'There are still methods of viewing a users private content across many social networks',
        priority: 'Essential',
        details: 'Before posting, ask yourself: "Would I mind if this was totally public?" Treat all social media as potentially public.'
      },
      {
        id: 'social-4',
        title: 'Think of All Interactions as Permanent',
        description: 'Posts, comments, and photos are continuously archived by third-party services',
        priority: 'Essential',
        details: 'The internet never forgets. Archive sites and cached copies make content nearly impossible to completely remove.'
      },
      {
        id: 'social-5',
        title: "Don't Reveal too Much",
        description: 'Profile information creates a goldmine for hackers to personalize phishing scams',
        priority: 'Essential',
        details: 'Avoid sharing detailed personal info like full date of birth, hometown, school names, pet names, or mother\'s maiden name.'
      },
      {
        id: 'social-6',
        title: 'Be Careful what you Upload',
        description: 'Status updates, comments, check-ins and media can unintentionally reveal more than intended',
        priority: 'Essential',
        details: 'Check photo backgrounds for sensitive information. Disable location tagging. Consider what metadata might be attached.'
      },
      {
        id: 'social-7',
        title: "Don't Share Email or Phone Number",
        description: 'Posting contact details gives hackers, trolls and spammers ammunition',
        priority: 'Essential',
        details: 'Public contact info enables harassment, phishing, and can link separate online identities together.'
      },
      {
        id: 'social-8',
        title: "Don't Grant Unnecessary Permissions",
        description: 'Social networking apps often ask for permission to access contacts, location, messaging history',
        priority: 'Essential',
        details: 'Review app permissions regularly. Revoke access to contacts, location, camera, and microphone when not necessary.'
      },
      {
        id: 'social-9',
        title: 'Be Careful of 3rd-Party Integrations',
        description: 'Avoid signing up for accounts using social network login. Revoke access to apps you no longer use',
        priority: 'Essential',
        details: 'Social login shares your data with third parties. Review connected apps regularly and remove unused ones.'
      },
      {
        id: 'social-10',
        title: 'Avoid Publishing Geo Data while still Onsite',
        description: 'If you plan to share content that reveals a location, wait until you have left',
        priority: 'Essential',
        details: 'Posting your current location in real-time can reveal you\'re not home, making you a burglary target.'
      },
      {
        id: 'social-11',
        title: 'Remove metadata before uploading media',
        description: 'Most smartphones attach comprehensive EXIF data to each photograph',
        priority: 'Optional',
        details: 'Photos contain GPS coordinates, timestamps, camera model. Use tools to strip this data before sharing.'
      },
      {
        id: 'social-12',
        title: 'Implement Image Cloaking',
        description: 'Tools like Fawkes subtly alter face structure in photos to disrupt facial recognition',
        priority: 'Advanced',
        details: 'Fawkes makes imperceptible changes that trick facial recognition systems while looking normal to humans.'
      },
      {
        id: 'social-13',
        title: 'Consider Spoofing GPS in home vicinity',
        description: 'Others who are not careful could reveal your location even if you never post',
        priority: 'Advanced',
        details: 'Family and friends tagging you or posting photos at your home can expose your location.'
      },
      {
        id: 'social-14',
        title: 'Consider False Information',
        description: 'If you just want to read, consider using an alias name and false contact details',
        priority: 'Advanced',
        details: 'Use pseudonyms and fake birthdays for accounts where you don\'t post. Protects privacy while allowing participation.'
      },
      {
        id: 'social-15',
        title: "Don't have any social media accounts",
        description: 'Social media is fundamentally un-private, so for maximum security avoid using mainstream networks',
        priority: 'Advanced',
        details: 'The most private social media is no social media. Consider alternatives like RSS feeds, newsletters, or federated platforms.'
      }
    ]
  },
  {
    id: 'networks',
    title: 'Networks',
    description: 'Safeguarding your network traffic',
    icon: Wifi,
    items: [
      {
        id: 'net-1',
        title: 'Use a VPN',
        description: 'Use a reputable, paid VPN to protect sites from logging your IP and reduce ISP data collection',
        priority: 'Essential',
        details: 'Choose VPNs with no-logs policy, strong encryption (WireGuard/OpenVPN), and servers in privacy-friendly jurisdictions.'
      },
      {
        id: 'net-2',
        title: 'Change your Router Password',
        description: 'After getting a new router, change the password. Default passwords are publicly available',
        priority: 'Essential',
        details: 'Router default passwords are listed online. Anyone nearby could connect if you don\'t change it immediately.'
      },
      {
        id: 'net-3',
        title: 'Use WPA2, and a strong password',
        description: 'Currently, the most secure WiFi authentication options are WPA2 and WPA3',
        priority: 'Essential',
        details: 'Use WPA3 if supported, otherwise WPA2-AES. Never use WEP or WPA as they\'re easily cracked.'
      },
      {
        id: 'net-4',
        title: 'Keep router firmware up-to-date',
        description: 'Manufacturers release firmware updates that fix security vulnerabilities',
        priority: 'Essential',
        details: 'Check for router firmware updates monthly. Enable automatic updates if available.'
      },
      {
        id: 'net-5',
        title: 'Implement a Network-Wide VPN',
        description: 'Configure your VPN on your router so traffic from all devices is encrypted',
        priority: 'Optional',
        details: 'Router-level VPN protects all devices including IoT devices that can\'t run VPN apps.'
      },
      {
        id: 'net-6',
        title: 'Protect against DNS leaks',
        description: 'When using VPN, exclusively use the DNS server of your VPN provider',
        priority: 'Optional',
        details: 'DNS leaks reveal which sites you visit even with VPN. Configure DNS to use VPN provider or trusted encrypted DNS.'
      },
      {
        id: 'net-7',
        title: 'Use a secure VPN Protocol',
        description: 'OpenVPN and WireGuard are open source, lightweight, secure tunneling protocols',
        priority: 'Optional',
        details: 'Avoid PPTP and SSTP which have known vulnerabilities. WireGuard offers best performance with strong security.'
      },
      {
        id: 'net-8',
        title: 'Secure DNS',
        description: 'Use DNS-over-HTTPS which performs DNS resolution via HTTPS protocol',
        priority: 'Optional',
        details: 'DoH encrypts DNS queries. Use providers like Cloudflare (1.1.1.1), Quad9, or NextDNS.'
      },
      {
        id: 'net-9',
        title: 'Avoid the free router from your ISP',
        description: 'ISP routers are typically manufactured cheaply with insecure firmware',
        priority: 'Optional',
        details: 'ISP routers often have backdoors, poor security updates, and limited configuration options. Buy your own.'
      },
      {
        id: 'net-10',
        title: 'Whitelist MAC Addresses',
        description: 'Whitelist MAC addresses to prevent unknown devices from connecting',
        priority: 'Optional',
        details: 'MAC filtering adds a layer of security though MAC addresses can be spoofed by determined attackers.'
      },
      {
        id: 'net-11',
        title: "Change the Router's Local IP Address",
        description: 'Malicious scripts can exploit routers at known local IP addresses',
        priority: 'Optional',
        details: 'Change from default 192.168.1.1 to something less common like 10.0.50.1 to avoid automated attacks.'
      },
      {
        id: 'net-12',
        title: "Don't Reveal Personal Info in SSID",
        description: 'Update network name to not identify you or include your address',
        priority: 'Optional',
        details: 'Avoid SSIDs like "Smith Family WiFi" or "Apt 3B". Use generic names that don\'t reveal identity or location.'
      },
      {
        id: 'net-13',
        title: 'Opt-Out Router Listings',
        description: 'WiFi SSIDs are scanned, logged, and published on various websites',
        priority: 'Optional',
        details: 'Services like WiGLE map WiFi networks globally. Opt out or use "_nomap" suffix in SSID.'
      },
      {
        id: 'net-14',
        title: 'Hide your SSID',
        description: 'If network name is not visible, it may receive less abuse',
        priority: 'Optional',
        details: 'Hidden SSIDs provide minimal security but reduce casual connection attempts. Not a strong security measure.'
      },
      {
        id: 'net-15',
        title: 'Disable WPS',
        description: 'WiFi Protected Setup has major security issues that can be exploited',
        priority: 'Optional',
        details: 'WPS PIN can be brute-forced in hours. Disable WPS entirely for better security.'
      },
      {
        id: 'net-16',
        title: 'Disable UPnP',
        description: 'Universal Plug and Play allows automatic port forwarding but has security issues',
        priority: 'Optional',
        details: 'UPnP can be exploited by malware to open ports. Disable and configure port forwarding manually if needed.'
      },
      {
        id: 'net-17',
        title: 'Use a Guest Network for Guests',
        description: 'Do not grant access to your primary WiFi network to visitors',
        priority: 'Optional',
        details: 'Guest networks isolate visitors from your main network and devices. Set different password you can change easily.'
      },
      {
        id: 'net-18',
        title: "Change your Router's Default IP",
        description: 'Modifying default admin panel IP makes targeting more difficult',
        priority: 'Optional',
        details: 'Changing the admin interface IP address from defaults adds obscurity against automated attacks.'
      },
      {
        id: 'net-19',
        title: 'Kill unused processes on your router',
        description: 'Services like Telnet and SSH should be disabled unless needed',
        priority: 'Optional',
        details: 'Disable all unnecessary services. Only enable what you actively use and understand.'
      },
      {
        id: 'net-20',
        title: "Don't have Open Ports",
        description: 'Close any open ports on your router that are not needed',
        priority: 'Optional',
        details: 'Open ports are entry points. Scan your network with tools like ShieldsUP and close unnecessary ports.'
      },
      {
        id: 'net-21',
        title: 'Disable Unused Remote Access Protocols',
        description: 'Protocols like PING, Telnet, SSH, UPnP, HNAP should be disabled when not needed',
        priority: 'Optional',
        details: 'Remote protocols allow probing from internet. Disable or restrict to specific IP addresses if needed.'
      },
      {
        id: 'net-22',
        title: 'Disable Cloud-Based Management',
        description: 'Router admin panels should be treated with utmost care',
        priority: 'Optional',
        details: 'Cloud management adds attack surface. Use local admin interface only, disable remote/cloud access.'
      },
      {
        id: 'net-23',
        title: 'Manage Range Correctly',
        description: 'If in smaller space, don\'t max out WiFi range unnecessarily',
        priority: 'Optional',
        details: 'Reduce transmit power if signal extends far beyond your space. Limits who can attempt to access your network.'
      },
      {
        id: 'net-24',
        title: 'Route all traffic through Tor',
        description: 'For increased security, route all internet traffic through the Tor network',
        priority: 'Advanced',
        details: 'Tor provides anonymity but is slower. Can be configured at router level or use Tor Browser for specific activities.'
      },
      {
        id: 'net-25',
        title: 'Disable WiFi on all Devices',
        description: 'Connecting to even secure WiFi increases attack surface',
        priority: 'Advanced',
        details: 'Wired Ethernet connections are more secure and faster. Consider disabling WiFi and using wired connections where possible.'
      }
    ]
  },
  {
    id: 'mobile-devices',
    title: 'Mobile Devices',
    description: 'Reduce invasive tracking for smartphones and tablets',
    icon: Smartphone,
    items: [
      {
        id: 'mobile-1',
        title: 'Encrypt your Device',
        description: 'Keep your data safe from physical access by using file encryption',
        priority: 'Essential',
        details: 'Modern iOS and Android devices encrypt by default when you set a passcode. Ensure encryption is enabled.'
      },
      {
        id: 'mobile-2',
        title: 'Turn off connectivity features not being used',
        description: 'When not using WiFi, Bluetooth, NFC, turn those features off',
        priority: 'Essential',
        details: 'Unused wireless features can be exploited for tracking and attacks. Disable when not needed.'
      },
      {
        id: 'mobile-3',
        title: 'Keep app count to a minimum',
        description: 'Uninstall apps you don\'t need. Apps run in background, collect data, and slow device',
        priority: 'Essential',
        details: 'Each app increases attack surface and privacy risks. Regularly audit and remove unused apps.'
      },
      {
        id: 'mobile-4',
        title: 'App Permissions',
        description: 'Don\'t grant apps permissions they don\'t need',
        priority: 'Essential',
        details: 'Review app permissions regularly. Revoke unnecessary access to location, contacts, camera, microphone, and storage.'
      },
      {
        id: 'mobile-5',
        title: 'Only install Apps from official source',
        description: 'Apps on Apple App Store and Google Play are scanned and cryptographically signed',
        priority: 'Essential',
        details: 'Official stores vet apps for malware. Avoid sideloading or third-party stores unless you know the risks.'
      },
      {
        id: 'mobile-6',
        title: 'Be Careful of Phone Charging Threats',
        description: 'Juice Jacking is when hackers use public charging stations to install malware',
        priority: 'Optional',
        details: 'Use power-only USB cables or your own charger with wall adapter. Avoid data-capable USB ports in public.'
      },
      {
        id: 'mobile-7',
        title: 'Set up a mobile carrier PIN',
        description: 'Protect against SIM swapping attacks by setting a carrier PIN',
        priority: 'Essential',
        details: 'Call your carrier to set a PIN required for account changes. Prevents attackers from porting your number.'
      },
      {
        id: 'mobile-8',
        title: 'Opt-out of Caller ID Listings',
        description: 'Remove your number from public caller ID databases',
        priority: 'Optional',
        details: 'Services like TrueCaller publicly list phone numbers. Opt out to reduce spam and maintain privacy.'
      },
      {
        id: 'mobile-9',
        title: 'Use Offline Maps',
        description: 'Navigation apps constantly track your location',
        priority: 'Optional',
        details: 'Download offline maps (OsmAnd, Maps.me) for navigation without continuous location tracking.'
      },
      {
        id: 'mobile-10',
        title: 'Opt-out of personalized ads',
        description: 'Disable advertising ID and opt out of personalized ads in device settings',
        priority: 'Optional',
        details: 'Reset advertising ID regularly and opt out of interest-based ads in iOS/Android settings.'
      },
      {
        id: 'mobile-11',
        title: 'Erase after too many login attempts',
        description: 'Set device to erase data after multiple failed unlock attempts',
        priority: 'Optional',
        details: 'iOS and Android can auto-wipe after 10 failed attempts. Ensure you have backups before enabling.'
      },
      {
        id: 'mobile-12',
        title: 'Monitor Trackers',
        description: 'Use tools to monitor which trackers apps use',
        priority: 'Optional',
        details: 'Exodus Privacy (Android) shows trackers in apps. Choose apps with fewer trackers.'
      },
      {
        id: 'mobile-13',
        title: 'Use a Mobile Firewall',
        description: 'Control which apps can access the internet',
        priority: 'Optional',
        details: 'NetGuard (Android) or similar firewall apps let you block internet access for specific apps.'
      },
      {
        id: 'mobile-14',
        title: 'Reduce Background Activity',
        description: 'Limit background app refresh and background data',
        priority: 'Optional',
        details: 'Disable background activity for apps that don\'t need it. Saves battery and reduces data collection.'
      },
      {
        id: 'mobile-15',
        title: 'Sandbox Mobile Apps',
        description: 'Use app isolation features to limit data access',
        priority: 'Optional',
        details: 'Android work profiles or iOS app privacy features can isolate apps from each other.'
      },
      {
        id: 'mobile-16',
        title: 'Tor Traffic',
        description: 'Route mobile traffic through Tor for anonymity',
        priority: 'Advanced',
        details: 'Use Orbot on Android to route all traffic through Tor network for maximum privacy.'
      },
      {
        id: 'mobile-17',
        title: 'Avoid Custom Virtual Keyboards',
        description: 'Third-party keyboards can log everything you type',
        priority: 'Optional',
        details: 'Stick with default system keyboards. Third-party keyboards have full access to everything typed.'
      },
      {
        id: 'mobile-18',
        title: 'Restart Device Regularly',
        description: 'Rebooting clears temporary exploits and refreshes system state',
        priority: 'Optional',
        details: 'Restart weekly to clear RAM, terminate persistent malware, and apply pending security updates.'
      },
      {
        id: 'mobile-19',
        title: 'Avoid SMS',
        description: 'SMS is unencrypted and can be intercepted',
        priority: 'Optional',
        details: 'Use Signal or WhatsApp instead of SMS for sensitive communications.'
      },
      {
        id: 'mobile-20',
        title: 'Keep your Number Private',
        description: 'Don\'t share your phone number publicly',
        priority: 'Optional',
        details: 'Use alternative numbers (Google Voice, Hushed) for online services to protect your real number.'
      },
      {
        id: 'mobile-21',
        title: 'Watch out for Stalkerware',
        description: 'Spyware apps can be installed by someone with physical access',
        priority: 'Optional',
        details: 'Check installed apps regularly. Look for unfamiliar apps or unusual battery drain. Factory reset if suspected.'
      },
      {
        id: 'mobile-22',
        title: 'Favor the Browser over Dedicated App',
        description: 'Mobile apps often request excessive permissions',
        priority: 'Optional',
        details: 'Use mobile websites instead of apps when possible. They have limited access to device sensors and data.'
      },
      {
        id: 'mobile-23',
        title: 'Consider running a custom ROM (Android)',
        description: 'Custom Android ROMs like LineageOS offer more privacy and control',
        priority: 'Advanced',
        details: 'Custom ROMs remove manufacturer bloatware and tracking. Requires technical knowledge to install safely.'
      }
    ]
  },
  {
    id: 'personal-computers',
    title: 'Personal Computers',
    description: 'Securing your PC\'s operating system, data & activity',
    icon: Monitor,
    items: [
      {
        id: 'pc-1',
        title: 'Keep your System up-to-date',
        description: 'Enable automatic updates for your operating system',
        priority: 'Essential',
        details: 'Security patches fix critical vulnerabilities. Enable auto-updates or manually check weekly.'
      },
      {
        id: 'pc-2',
        title: 'Encrypt your Device',
        description: 'Use full disk encryption to protect data if device is lost or stolen',
        priority: 'Essential',
        details: 'Enable BitLocker (Windows), FileVault (Mac), or LUKS (Linux) for full disk encryption.'
      },
      {
        id: 'pc-3',
        title: 'Backup Important Data',
        description: 'Follow 3-2-1 rule: 3 copies, 2 different media types, 1 offsite',
        priority: 'Essential',
        details: 'Regular backups protect against ransomware and hardware failure. Test restores periodically.'
      },
      {
        id: 'pc-4',
        title: 'Be Careful Plugging USB Devices',
        description: 'USB devices can contain malware or hardware implants',
        priority: 'Essential',
        details: 'Only use USB devices from trusted sources. Disable auto-run for USB drives in system settings.'
      },
      {
        id: 'pc-5',
        title: 'Activate Screen-Lock when Idle',
        description: 'Set computer to lock after short period of inactivity',
        priority: 'Essential',
        details: 'Configure screen lock after 5-10 minutes of inactivity. Require password to unlock.'
      },
      {
        id: 'pc-6',
        title: 'Disable Cortana or Siri',
        description: 'Voice assistants collect significant data and can be activated unintentionally',
        priority: 'Essential',
        details: 'Disable voice assistants or at minimum disable always-listening features and delete voice history.'
      },
      {
        id: 'pc-7',
        title: 'Review your Installed Apps',
        description: 'Regularly audit installed software and remove unnecessary programs',
        priority: 'Essential',
        details: 'Uninstall unused software, especially browser toolbars and bundled bloatware.'
      },
      {
        id: 'pc-8',
        title: 'Manage Permissions',
        description: 'Review and restrict app permissions in system settings',
        priority: 'Essential',
        details: 'Limit which apps can access camera, microphone, location, and files.'
      },
      {
        id: 'pc-9',
        title: 'Disallow Usage Data from being sent to the Cloud',
        description: 'Disable telemetry and diagnostics reporting',
        priority: 'Essential',
        details: 'Turn off diagnostic data collection in Windows, Mac, and Linux to prevent usage tracking.'
      },
      {
        id: 'pc-10',
        title: 'Avoid Quick Unlock',
        description: 'Facial recognition and fingerprint unlock can be bypassed',
        priority: 'Essential',
        details: 'Use strong passwords instead of biometrics for computers. Biometrics work well as convenience feature, not primary security.'
      },
      {
        id: 'pc-11',
        title: 'Power Off Computer instead of Standby',
        description: 'Full shutdown clears RAM and requires authentication to access',
        priority: 'Essential',
        details: 'Shutdown rather than sleep/hibernate for maximum security, especially with full disk encryption.'
      },
      {
        id: 'pc-12',
        title: "Don't link PC with Microsoft or Apple Account",
        description: 'Account linking shares more data with cloud services',
        priority: 'Optional',
        details: 'Use local accounts instead of Microsoft/Apple accounts for better privacy.'
      },
      {
        id: 'pc-13',
        title: 'Check which Sharing Services are Enabled',
        description: 'Disable file sharing, remote desktop, and other network services not needed',
        priority: 'Optional',
        details: 'Review Services in Windows or Sharing in Mac. Disable anything you don\'t actively use.'
      },
      {
        id: 'pc-14',
        title: "Don't use Root/Admin Account for Non-Admin Tasks",
        description: 'Use standard user account for daily activities',
        priority: 'Optional',
        details: 'Running as admin increases malware damage potential. Use standard account and elevate only when needed.'
      },
      {
        id: 'pc-15',
        title: 'Block Webcam + Microphone',
        description: 'Use physical covers or disable when not in use',
        priority: 'Optional',
        details: 'Webcam covers prevent spying. Disable microphone in Device Manager or unplug when not needed.'
      },
      {
        id: 'pc-16',
        title: 'Use a Privacy Filter',
        description: 'Privacy screens prevent shoulder surfing',
        priority: 'Optional',
        details: 'Physical privacy filters make screen unreadable from angles, protecting from onlookers.'
      },
      {
        id: 'pc-17',
        title: 'Physically Secure Device',
        description: 'Use cable locks and store in secure location',
        priority: 'Optional',
        details: 'Kensington locks secure laptops in public. Don\'t leave devices unattended.'
      },
      {
        id: 'pc-18',
        title: "Don't Charge Devices from your PC",
        description: 'Devices charged via USB can access computer data',
        priority: 'Optional',
        details: 'Use wall chargers instead of USB ports to charge devices. Prevents potential data exfiltration.'
      },
      {
        id: 'pc-19',
        title: 'Randomize hardware address on Wi-Fi',
        description: 'Enable MAC address randomization',
        priority: 'Optional',
        details: 'Random MAC addresses prevent tracking across WiFi networks.'
      },
      {
        id: 'pc-20',
        title: 'Use a Firewall',
        description: 'Enable built-in firewall or install third-party firewall',
        priority: 'Optional',
        details: 'Firewalls block unauthorized network access. Configure to deny by default, allow as needed.'
      },
      {
        id: 'pc-21',
        title: 'Protect Against Software Keyloggers',
        description: 'Use anti-keylogger software or virtual keyboards for sensitive input',
        priority: 'Optional',
        details: 'Password managers bypass software keyloggers. Virtual keyboards help for one-time sensitive entries.'
      },
      {
        id: 'pc-22',
        title: 'Check Keyboard Connection',
        description: 'Verify no hardware keyloggers are attached between keyboard and computer',
        priority: 'Optional',
        details: 'Physically inspect USB/PS2 ports for unfamiliar devices. Hardware keyloggers are small inline devices.'
      },
      {
        id: 'pc-23',
        title: 'Prevent Keystroke Injection Attacks',
        description: 'Disable or restrict USB ports to prevent BadUSB attacks',
        priority: 'Optional',
        details: 'USB devices can impersonate keyboards. Use USB port blockers or disable auto-run.'
      },
      {
        id: 'pc-24',
        title: 'Don\'t use commercial "Free" Anti-Virus',
        description: 'Free AV often includes invasive tracking and sells user data',
        priority: 'Optional',
        details: 'Windows Defender is sufficient for most users. If needed, use reputable paid AV without telemetry.'
      },
      {
        id: 'pc-25',
        title: 'Periodically check for Rootkits',
        description: 'Use rootkit scanners to detect deep system compromises',
        priority: 'Advanced',
        details: 'Tools like GMER, Rootkit Revealer can detect hidden malware. Run periodically if high-risk.'
      },
      {
        id: 'pc-26',
        title: 'BIOS Boot Password',
        description: 'Set BIOS/UEFI password to prevent unauthorized boot device changes',
        priority: 'Advanced',
        details: 'BIOS password prevents booting from USB or changing boot order. Required for physical security.'
      },
      {
        id: 'pc-27',
        title: 'Use a Security-Focused Operating System',
        description: 'Consider Linux distributions focused on privacy and security',
        priority: 'Advanced',
        details: 'Qubes OS, Tails, or hardened Linux distros offer better security than mainstream OSes.'
      },
      {
        id: 'pc-28',
        title: 'Make Use of VMs',
        description: 'Use virtual machines to isolate risky activities',
        priority: 'Advanced',
        details: 'VMs sandbox applications. Use separate VMs for banking, general browsing, and risky activities.'
      },
      {
        id: 'pc-29',
        title: 'Compartmentalize',
        description: 'Separate work, personal, and high-security activities',
        priority: 'Advanced',
        details: 'Use different user accounts, VMs, or devices for different security levels.'
      },
      {
        id: 'pc-30',
        title: 'Disable Undesired Features (Windows)',
        description: 'Disable Windows features that reduce privacy',
        priority: 'Advanced',
        details: 'Disable Cortana, telemetry, advertising ID, WiFi Sense, and other tracking features.'
      },
      {
        id: 'pc-31',
        title: 'Secure Boot',
        description: 'Enable Secure Boot in UEFI to prevent bootkit malware',
        priority: 'Advanced',
        details: 'Secure Boot ensures only signed bootloaders run. Protects against bootkits and rootkits.'
      },
      {
        id: 'pc-32',
        title: 'Secure SSH Access',
        description: 'Use key-based authentication and disable password login for SSH',
        priority: 'Advanced',
        details: 'Generate SSH keys, disable password auth, use non-standard port, and configure fail2ban.'
      },
      {
        id: 'pc-33',
        title: 'Close Un-used Open Ports',
        description: 'Scan and close unnecessary open ports',
        priority: 'Advanced',
        details: 'Use netstat or nmap to identify open ports. Close or firewall off unused services.'
      },
      {
        id: 'pc-34',
        title: 'Implement Mandatory Access Control',
        description: 'Use SELinux or AppArmor for mandatory access control',
        priority: 'Advanced',
        details: 'MAC systems enforce security policies at kernel level. Limits damage from compromised apps.'
      },
      {
        id: 'pc-35',
        title: 'Use Canary Tokens',
        description: 'Deploy honeytokens to detect intrusions',
        priority: 'Advanced',
        details: 'Canary tokens alert you when accessed. Place fake credentials or files to detect breaches.'
      }
    ]
  },
  {
    id: 'smart-home',
    title: 'Smart Home',
    description: 'Using IoT devices without compromising your privacy',
    icon: Home,
    items: [
      {
        id: 'smart-1',
        title: 'Rename devices to not specify brand/model',
        description: 'Generic device names prevent attackers from knowing vulnerabilities',
        priority: 'Essential',
        details: 'Name devices generically like "Camera 1" instead of "Ring Doorbell Pro" to avoid targeted attacks.'
      },
      {
        id: 'smart-2',
        title: 'Disable microphone and camera when not in use',
        description: 'Physical or software disabling prevents unauthorized surveillance',
        priority: 'Essential',
        details: 'Use physical switches or covers. Mute smart speakers when not needed.'
      },
      {
        id: 'smart-3',
        title: 'Understand what data is collected',
        description: 'Research what data devices collect, store, and transmit',
        priority: 'Essential',
        details: 'Read privacy policies. Check if data stays local or goes to cloud. Review what\'s shared with third parties.'
      },
      {
        id: 'smart-4',
        title: 'Set privacy settings and opt out',
        description: 'Configure devices to minimize data sharing',
        priority: 'Essential',
        details: 'Disable analytics, voice recording storage, and data sharing features in device settings.'
      },
      {
        id: 'smart-5',
        title: "Don't link smart home devices to real identity",
        description: 'Use separate email and avoid real name for device accounts',
        priority: 'Essential',
        details: 'Create dedicated email alias for IoT devices. Use pseudonyms to separate from main identity.'
      },
      {
        id: 'smart-6',
        title: 'Keep firmware up-to-date',
        description: 'Enable automatic updates or check manually for firmware updates',
        priority: 'Essential',
        details: 'IoT devices often have security vulnerabilities. Update firmware as soon as patches available.'
      },
      {
        id: 'smart-7',
        title: 'Protect your Network',
        description: 'Secure your router and network as foundation for IoT security',
        priority: 'Essential',
        details: 'Strong WiFi password, updated firmware, disabled UPnP/WPS are essential before adding IoT devices.'
      },
      {
        id: 'smart-8',
        title: 'Be wary of wearables',
        description: 'Fitness trackers and smartwatches collect extensive health and location data',
        priority: 'Optional',
        details: 'Review what data wearables collect. Disable unnecessary sensors. Limit third-party app integrations.'
      },
      {
        id: 'smart-9',
        title: "Don't connect critical infrastructure to Internet",
        description: 'Keep door locks, garage doors, security systems offline when possible',
        priority: 'Optional',
        details: 'Physical security devices are targets. Consider non-connected alternatives or local-only control.'
      },
      {
        id: 'smart-10',
        title: 'Mitigate Alexa/Google Home Risks',
        description: 'Configure voice assistants for minimal data collection',
        priority: 'Optional',
        details: 'Mute when not in use, delete voice history regularly, disable purchase capability, review connected services.'
      },
      {
        id: 'smart-11',
        title: 'Monitor your home network closely',
        description: 'Use network monitoring tools to track IoT device behavior',
        priority: 'Optional',
        details: 'Tools like Pi-hole or Firewalla show what each device connects to. Block unexpected connections.'
      },
      {
        id: 'smart-12',
        title: 'Deny Internet access where possible',
        description: 'Use firewall rules to keep IoT devices local-only',
        priority: 'Advanced',
        details: 'Many IoT devices work fine locally. Block internet access via router/firewall for unnecessary devices.'
      },
      {
        id: 'smart-13',
        title: 'Assess risks',
        description: 'Evaluate if convenience justifies privacy and security risks',
        priority: 'Advanced',
        details: 'Consider whether each smart device is truly necessary or if a non-connected alternative would suffice.'
      }
    ]
  },
  {
    id: 'personal-finance',
    title: 'Personal Finance',
    description: 'Protecting your funds, financial accounts and transactions',
    icon: CreditCard,
    items: [
      {
        id: 'finance-1',
        title: 'Sign up for Fraud Alerts and Credit Monitoring',
        description: 'Get notified of suspicious activity on credit reports and accounts',
        priority: 'Essential',
        details: 'Services like Credit Karma or bank fraud alerts notify you of unusual activity quickly.'
      },
      {
        id: 'finance-2',
        title: 'Apply a Credit Freeze',
        description: 'Freeze credit at all three bureaus to prevent unauthorized accounts',
        priority: 'Essential',
        details: 'Credit freeze is free and prevents new accounts from being opened. Temporarily lift when applying for credit.'
      },
      {
        id: 'finance-3',
        title: 'Use Virtual Cards',
        description: 'Use virtual card numbers for online purchases',
        priority: 'Optional',
        details: 'Services like Privacy.com or bank virtual cards create unique numbers per merchant. Easy to cancel if compromised.'
      },
      {
        id: 'finance-4',
        title: 'Use Cash for Local Transactions',
        description: 'Cash transactions leave no digital trail',
        priority: 'Optional',
        details: 'Cash preserves privacy for local purchases but requires secure physical storage.'
      },
      {
        id: 'finance-5',
        title: 'Use Cryptocurrency for Online Transactions',
        description: 'Crypto can provide more private online payments',
        priority: 'Optional',
        details: 'Monero offers strong privacy. Bitcoin is traceable but still more private than traditional payments.'
      },
      {
        id: 'finance-6',
        title: 'Store Crypto Securely',
        description: 'Use hardware wallets for cryptocurrency storage',
        priority: 'Advanced',
        details: 'Ledger or Trezor hardware wallets keep private keys offline. Never leave significant funds on exchanges.'
      },
      {
        id: 'finance-7',
        title: 'Buy Crypto Anonymously',
        description: 'Purchase cryptocurrency without linking to identity',
        priority: 'Advanced',
        details: 'Use Bitcoin ATMs, peer-to-peer exchanges, or cash transactions to acquire crypto anonymously.'
      },
      {
        id: 'finance-8',
        title: 'Tumble/Mix Coins',
        description: 'Use coin mixing services to break transaction trails',
        priority: 'Advanced',
        details: 'Bitcoin mixing services obscure transaction history. Monero has built-in mixing. Be aware of legal implications.'
      },
      {
        id: 'finance-9',
        title: 'Use Alias Details for Online Shopping',
        description: 'Use alternate names and addresses for online purchases',
        priority: 'Advanced',
        details: 'Ship to package lockers or use variations of name to compartmentalize shopping from identity.'
      },
      {
        id: 'finance-10',
        title: 'Use alternate delivery address',
        description: 'Don\'t ship packages directly to home address',
        priority: 'Advanced',
        details: 'Use PO boxes, package lockers, or mail forwarding services to protect home address.'
      }
    ]
  },
  {
    id: 'human-aspect',
    title: 'Human Aspect',
    description: 'Avoiding social engineering security risks',
    icon: Brain,
    items: [
      {
        id: 'human-1',
        title: 'Verify Recipients',
        description: 'Always verify identity before sharing sensitive information',
        priority: 'Essential',
        details: 'Independently verify requests through separate channel. Don\'t trust caller ID or email addresses alone.'
      },
      {
        id: 'human-2',
        title: "Don't Trust Your Popup Notifications",
        description: 'Fake security warnings are common social engineering tactics',
        priority: 'Essential',
        details: 'Don\'t click popup warnings. Close browser and run real security scan if concerned.'
      },
      {
        id: 'human-3',
        title: 'Never Leave Device Unattended',
        description: 'Physical access enables many attacks',
        priority: 'Essential',
        details: 'Lock devices when stepping away. Don\'t leave phones/laptops visible in cars or public places.'
      },
      {
        id: 'human-4',
        title: 'Prevent Camfecting',
        description: 'Cover webcam to prevent remote camera access',
        priority: 'Essential',
        details: 'Use webcam covers or tape. Watch for camera indicator light activating unexpectedly.'
      },
      {
        id: 'human-5',
        title: 'Stay protected from shoulder surfers',
        description: 'Be aware of people watching your screen or keyboard',
        priority: 'Essential',
        details: 'Position screen away from onlookers. Use privacy screens. Shield PIN entry with hand.'
      },
      {
        id: 'human-6',
        title: 'Educate yourself about phishing attacks',
        description: 'Learn to recognize common phishing techniques',
        priority: 'Essential',
        details: 'Check sender addresses carefully, hover over links before clicking, verify urgency claims independently.'
      },
      {
        id: 'human-7',
        title: 'Watch out for Stalkerware',
        description: 'Spyware can be installed by people you know',
        priority: 'Essential',
        details: 'Unusual battery drain, unexplained data usage, or unfamiliar apps may indicate stalkerware.'
      },
      {
        id: 'human-8',
        title: 'Install Reputable Software from Trusted Sources',
        description: 'Only download software from official websites or stores',
        priority: 'Essential',
        details: 'Verify download source, check file hashes, read reviews before installing software.'
      },
      {
        id: 'human-9',
        title: 'Store personal data securely',
        description: 'Encrypt sensitive files and use secure storage',
        priority: 'Essential',
        details: 'Use encrypted drives or password managers for sensitive data. Don\'t store passwords in plain text.'
      },
      {
        id: 'human-10',
        title: 'Obscure Personal Details from Documents',
        description: 'Redact sensitive information before sharing documents',
        priority: 'Essential',
        details: 'Black out SSN, account numbers, signatures, addresses when sharing documents publicly.'
      },
      {
        id: 'human-11',
        title: 'Do not assume site is secure just because it is HTTPS',
        description: 'HTTPS encrypts connection but doesn\'t verify site legitimacy',
        priority: 'Essential',
        details: 'Phishing sites use HTTPS too. Verify domain spelling and certificate details.'
      },
      {
        id: 'human-12',
        title: 'Use Virtual Cards when paying online',
        description: 'Virtual card numbers limit exposure from breaches',
        priority: 'Optional',
        details: 'Create unique virtual cards per merchant. Easily cancel if merchant is compromised.'
      },
      {
        id: 'human-13',
        title: 'Review application permissions',
        description: 'Regularly audit what apps can access',
        priority: 'Optional',
        details: 'Review and revoke unnecessary permissions quarterly. Remove apps you no longer use.'
      },
      {
        id: 'human-14',
        title: 'Opt-out of public lists',
        description: 'Remove yourself from people search websites',
        priority: 'Optional',
        details: 'Sites like Whitepages, Spokeo publish personal info. Opt out from each individually.'
      },
      {
        id: 'human-15',
        title: 'Never Provide Additional PII When Opting-Out',
        description: 'Don\'t give more info than necessary to remove yourself from databases',
        priority: 'Optional',
        details: 'Minimal information needed for opt-outs. Providing more creates new privacy risks.'
      },
      {
        id: 'human-16',
        title: 'Opt-out of data sharing',
        description: 'Disable data sharing in account settings',
        priority: 'Optional',
        details: 'Review privacy settings for all accounts. Opt out of data broker sharing where possible.'
      },
      {
        id: 'human-17',
        title: 'Review and update social media privacy',
        description: 'Audit social media privacy settings regularly',
        priority: 'Optional',
        details: 'Platforms change settings frequently. Review quarterly and lock down to friends/followers only.'
      },
      {
        id: 'human-18',
        title: 'Compartmentalize',
        description: 'Separate different aspects of your digital life',
        priority: 'Advanced',
        details: 'Use different emails, usernames, even devices for work, personal, and anonymous activities.'
      },
      {
        id: 'human-19',
        title: 'WhoIs Privacy Guard',
        description: 'Use domain privacy protection to hide registration details',
        priority: 'Advanced',
        details: 'Domain privacy services mask your name, address, phone from WhoIs databases.'
      },
      {
        id: 'human-20',
        title: 'Use a forwarding address',
        description: 'Use mail forwarding service instead of real address',
        priority: 'Advanced',
        details: 'Services like Anytime Mailbox provide alternate addresses for mail and packages.'
      },
      {
        id: 'human-21',
        title: 'Use anonymous payment methods',
        description: 'Use cash, prepaid cards, or cryptocurrency for anonymous purchases',
        priority: 'Advanced',
        details: 'Prepaid cards bought with cash or cryptocurrency enable anonymous online purchases.'
      }
    ]
  },
  {
    id: 'physical-security',
    title: 'Physical Security',
    description: 'Taking measures to prevent IRL security incidents',
    icon: MapPin,
    items: [
      {
        id: 'physical-1',
        title: 'Destroy Sensitive Documents',
        description: 'Shred documents containing personal information before disposal',
        priority: 'Essential',
        details: 'Use cross-cut shredder for financial statements, medical records, anything with SSN, account numbers.'
      },
      {
        id: 'physical-2',
        title: 'Opt-Out of Public Records',
        description: 'Remove your info from people search and data broker websites',
        priority: 'Essential',
        details: 'Sites like Whitepages, Spokeo, and data brokers publish address, phone, relatives. Opt out from each.'
      },
      {
        id: 'physical-3',
        title: 'Watermark Documents',
        description: 'Add unique identifiers to sensitive documents',
        priority: 'Essential',
        details: 'Subtle watermarks help identify leaks. Use different versions when sharing with different parties.'
      },
      {
        id: 'physical-4',
        title: "Don't Reveal Info on Inbound Calls",
        description: 'Never confirm personal details to unsolicited callers',
        priority: 'Essential',
        details: 'Hang up and call back using official number. Don\'t confirm name, address, or account info to inbound calls.'
      },
      {
        id: 'physical-5',
        title: 'Stay Alert',
        description: 'Be aware of your surroundings and assess potential risks',
        priority: 'Essential',
        details: 'Trust your instincts. Notice when being followed or observed. Vary your routine.'
      },
      {
        id: 'physical-6',
        title: 'Secure Perimeter',
        description: 'Ensure physical security of locations storing personal info and devices',
        priority: 'Essential',
        details: 'Lock doors and windows. Use security system. Ensure minimum external access. Store valuables securely.'
      },
      {
        id: 'physical-7',
        title: 'Physically Secure Devices',
        description: 'Use locks, covers, and physical security measures for devices',
        priority: 'Essential',
        details: 'Kensington locks for laptops, webcam covers, privacy screens, secure storage when traveling.'
      },
      {
        id: 'physical-8',
        title: 'Keep Devices Out of Direct Sight',
        description: 'Prevent devices from being visible from outside',
        priority: 'Essential',
        details: 'Position devices away from windows. Prevents laser microphone attacks and reduces theft risk.'
      },
      {
        id: 'physical-9',
        title: 'Protect your PIN',
        description: 'Shield PIN entry from onlookers and cameras',
        priority: 'Essential',
        details: 'Cover keypad with hand when entering PIN. Be aware of overhead cameras at ATMs.'
      },
      {
        id: 'physical-10',
        title: 'Check for Skimmers',
        description: 'Inspect ATMs and payment terminals for skimming devices',
        priority: 'Essential',
        details: 'Wiggle card reader, check for loose parts, look for cameras pointed at keypad. Use ATMs inside banks.'
      },
      {
        id: 'physical-11',
        title: 'Protect your Home Address',
        description: 'Use alternate addresses and forwarding to protect home location',
        priority: 'Optional',
        details: 'Use PO boxes, mail forwarding, package lockers. Avoid sharing real address publicly.'
      },
      {
        id: 'physical-12',
        title: 'Use a PIN Not Biometrics',
        description: 'Prefer PINs over biometrics for device security',
        priority: 'Advanced',
        details: 'In some jurisdictions, you can be forced to unlock with biometrics but not forced to reveal PIN.'
      },
      {
        id: 'physical-13',
        title: 'Reduce exposure to CCTV',
        description: 'Wear disguises and choose routes with fewer cameras',
        priority: 'Advanced',
        details: 'Hats, sunglasses, face masks reduce facial recognition. Avoid high-surveillance areas when possible.'
      },
      {
        id: 'physical-14',
        title: 'Anti-Facial Recognition Clothing',
        description: 'Wear clothing with patterns that trick facial-recognition',
        priority: 'Advanced',
        details: 'CV Dazzle makeup and adversarial patterns can confuse facial recognition algorithms.'
      },
      {
        id: 'physical-15',
        title: 'Reduce Night Vision Exposure',
        description: 'Use IR light sources or reflective glasses to obstruct night vision',
        priority: 'Advanced',
        details: 'IR LEDs or reflective materials can overwhelm night vision cameras and devices.'
      },
      {
        id: 'physical-16',
        title: 'Protect your DNA',
        description: 'Avoid sharing DNA with heritage websites and be cautious about DNA traces',
        priority: 'Advanced',
        details: 'DNA databases used by law enforcement. Be aware of what you touch and where you leave biological material.'
      }
    ]
  }
]

export default function SecurityChecklistPage() {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set())
  const [selectedPriorities, setSelectedPriorities] = useState<Set<Priority>>(
    new Set(['Essential', 'Basic', 'Optional', 'Advanced'])
  )
  const [showStats, setShowStats] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  // Load progress from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        setCompletedItems(new Set(data.completed || []))
      }
    } catch (e) {
      console.error('Failed to load progress:', e)
    }
  }, [])

  // Save progress to localStorage
  useEffect(() => {
    const data = {
      completed: Array.from(completedItems),
      lastUpdated: new Date().toISOString()
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [completedItems])

  const toggleItem = (itemId: string) => {
    setCompletedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId)
      } else {
        newSet.add(categoryId)
      }
      return newSet
    })
  }

  const toggleItemExpand = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }

  const togglePriority = (priority: Priority) => {
    setSelectedPriorities(prev => {
      const newSet = new Set(prev)
      if (newSet.has(priority)) {
        newSet.delete(priority)
      } else {
        newSet.add(priority)
      }
      return newSet
    })
  }

  const exportProgress = () => {
    const data = {
      completed: Array.from(completedItems),
      exportDate: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `security-checklist-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importProgress = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string)
        if (data.completed && Array.isArray(data.completed)) {
          setCompletedItems(new Set(data.completed))
        }
      } catch (err) {
        alert('Failed to import progress file')
      }
    }
    reader.readAsText(file)
  }

  const clearProgress = () => {
    if (confirm('Are you sure you want to clear all progress? This cannot be undone.')) {
      setCompletedItems(new Set())
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  // Calculate statistics
  const stats = () => {
    const total = checklistData.reduce((sum, cat) => sum + cat.items.length, 0)
    const completed = completedItems.size
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
    
    const priorityStats: Record<Priority, { total: number; completed: number }> = {
      Essential: { total: 0, completed: 0 },
      Basic: { total: 0, completed: 0 },
      Optional: { total: 0, completed: 0 },
      Advanced: { total: 0, completed: 0 }
    }
    
    checklistData.forEach(category => {
      category.items.forEach(item => {
        priorityStats[item.priority].total++
        if (completedItems.has(item.id)) {
          priorityStats[item.priority].completed++
        }
      })
    })
    
    return { total, completed, percentage, priorityStats }
  }

  const currentStats = stats()

  // Filter items
  const filteredData = checklistData.map(category => ({
    ...category,
    items: category.items.filter(item => selectedPriorities.has(item.priority))
  })).filter(category => category.items.length > 0)

  return (
    <div className="min-h-screen bg-[#0a0b0f]">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-primary-500/10 rounded-full mb-4">
            <Shield className="w-12 h-12 text-primary-500" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            Personal Security Checklist
          </h1>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            A comprehensive guide to securing your digital life. Track your progress and 
            improve your security posture step by step.
          </p>
        </div>

        {/* Progress Overview */}
        {!selectedCategory && (
          <div className="mb-8">
            <div className="bg-[#13141a] rounded-xl p-6 border border-neutral-800">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Your Progress</h2>
                <button
                  onClick={() => setShowStats(!showStats)}
                  className="text-primary-500 hover:text-primary-400 text-sm font-medium"
                >
                  {showStats ? 'Hide' : 'Show'} Details
                </button>
              </div>
              
              {/* Main Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-neutral-400 mb-2">
                  <span>Overall Completion</span>
                  <span className="font-semibold text-white">
                    {currentStats.completed} / {currentStats.total} ({currentStats.percentage}%)
                  </span>
                </div>
                <div className="h-3 bg-neutral-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary-500 to-emerald-500 transition-all duration-500"
                    style={{ width: `${currentStats.percentage}%` }}
                  />
                </div>
              </div>

              {/* Detailed Stats */}
              {showStats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-neutral-800">
                  {(['Essential', 'Basic', 'Optional', 'Advanced'] as Priority[]).map(priority => {
                    const stat = currentStats.priorityStats[priority]
                    const pct = stat.total > 0 ? Math.round((stat.completed / stat.total) * 100) : 0
                    return (
                      <div key={priority} className="text-center">
                        <div className="text-2xl font-bold text-white mb-1">{pct}%</div>
                        <div className="text-xs text-neutral-400 mb-2">{priority}</div>
                        <div className="text-xs text-neutral-500">
                          {stat.completed} / {stat.total}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Progress Visualization */}
        {!selectedCategory && (
          <div className="mb-8">
            <div className="bg-[#13141a] rounded-xl p-6 border border-neutral-800 flex items-center justify-center">
              <div className="relative" style={{ width: '200px', height: '200px' }}>
                <svg viewBox="0 0 100 100" className="transform -rotate-90">
                  {/* Background circles */}
                  {[0.2, 0.4, 0.6, 0.8, 1.0].map((scale, i) => (
                    <circle
                      key={i}
                      cx="50"
                      cy="50"
                      r={40 * scale}
                      fill="none"
                      stroke="#1f2937"
                      strokeWidth="0.5"
                    />
                  ))}
                  {/* Progress circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    strokeDasharray={`${currentStats.percentage * 2.513} 251.3`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-4xl font-bold text-white">{currentStats.percentage}%</div>
                  <div className="text-sm text-neutral-400">Complete</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="bg-[#13141a] rounded-lg border border-neutral-800 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Priority Filters */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-400 mr-2">Show:</span>
              {(['Essential', 'Basic', 'Optional', 'Advanced'] as Priority[]).map(priority => (
                <button
                  key={priority}
                  onClick={() => togglePriority(priority)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                    selectedPriorities.has(priority)
                      ? priority === 'Essential'
                        ? 'bg-red-500 text-white'
                        : priority === 'Basic'
                        ? 'bg-orange-500 text-white'
                        : priority === 'Optional'
                        ? 'bg-yellow-500 text-neutral-900'
                        : 'bg-blue-500 text-white'
                      : 'bg-neutral-800 text-neutral-500 hover:bg-neutral-700'
                  }`}
                >
                  {priority}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={exportProgress}
                className="flex items-center gap-2 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-sm transition-colors"
                title="Export progress"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <label className="flex items-center gap-2 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-sm transition-colors cursor-pointer">
                <Upload className="w-4 h-4" />
                Import
                <input
                  type="file"
                  accept=".json"
                  onChange={importProgress}
                  className="hidden"
                />
              </label>
              <button
                onClick={clearProgress}
                className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg text-sm transition-colors"
                title="Clear all progress"
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Category Grid / List View */}
        {!selectedCategory ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {filteredData.map(category => {
              const CategoryIcon = category.icon
              const categoryCompleted = category.items.filter(item => completedItems.has(item.id)).length
              const categoryTotal = category.items.length
              const categoryPercentage = categoryTotal > 0 ? Math.round((categoryCompleted / categoryTotal) * 100) : 0
              
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`bg-[#13141a] border rounded-xl p-6 text-left hover:border-primary-500 transition-all ${
                    categoryPercentage === 100 ? 'border-green-500/50' : 'border-neutral-800'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-primary-500/10 rounded-lg">
                      <CategoryIcon className="w-6 h-6 text-primary-500" />
                    </div>
                    {categoryPercentage === 100 && (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    )}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-2">{category.title}</h3>
                  <p className="text-sm text-neutral-400 mb-4 line-clamp-2">{category.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-neutral-500">
                      <span>{categoryCompleted} / {categoryTotal} completed</span>
                      <span>{categoryPercentage}%</span>
                    </div>
                    <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary-500 transition-all duration-300"
                        style={{ width: `${categoryPercentage}%` }}
                      />
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        ) : (
          /* Detail View */
          <div className="space-y-6">
            {/* Back Button */}
            <button
              onClick={() => setSelectedCategory(null)}
              className="flex items-center gap-2 text-primary-500 hover:text-primary-400 transition-colors"
            >
              <ChevronDown className="w-5 h-5 rotate-90" />
              <span>Back to all categories</span>
            </button>

            {/* Category Details */}
            {filteredData
              .filter(cat => cat.id === selectedCategory)
              .map(category => {
                const CategoryIcon = category.icon
                return (
                  <div key={category.id} className="bg-[#13141a] rounded-xl border border-neutral-800 overflow-hidden">
                    {/* Category Header */}
                    <div className="p-6 border-b border-neutral-800">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="p-3 bg-primary-500/10 rounded-lg">
                          <CategoryIcon className="w-8 h-8 text-primary-500" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-white">{category.title}</h2>
                          <p className="text-neutral-400">{category.description}</p>
                        </div>
                      </div>
                    </div>

                    {/* Checklist Items */}
                    <div className="divide-y divide-neutral-800">
                      <div className="p-6">
                        {category.items.map(item => {
                          const isCompleted = completedItems.has(item.id)
                          const isExpanded = expandedItems.has(item.id)
                          
                          return (
                            <div key={item.id} className="mb-4 last:mb-0">
                              <div className={`flex items-start gap-4 p-4 rounded-lg transition-colors ${
                                isCompleted ? 'bg-green-500/5' : 'hover:bg-neutral-800/50'
                              }`}>
                                {/* Checkbox */}
                                <button
                                  onClick={() => toggleItem(item.id)}
                                  className="flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
                                >
                                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                                    isCompleted
                                      ? 'bg-green-600 border-green-600'
                                      : 'border-neutral-600 hover:border-primary-500'
                                  }`}>
                                    {isCompleted && (
                                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                      </svg>
                                    )}
                                  </div>
                                </button>

                                {/* Icon placeholder */}
                                <div className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <Lock className="w-5 h-5 text-neutral-500" />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                  <h4 className={`font-semibold text-base mb-1 ${
                                    isCompleted ? 'text-neutral-500 line-through' : 'text-white'
                                  }`}>
                                    {item.title}
                                  </h4>
                                  <p className={`text-sm ${
                                    isCompleted ? 'text-neutral-600' : 'text-neutral-400'
                                  }`}>
                                    {item.description}
                                  </p>
                                </div>

                                {/* Priority Badge */}
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                    item.priority === 'Essential'
                                      ? 'bg-red-500 text-white'
                                      : item.priority === 'Basic'
                                      ? 'bg-orange-500 text-white'
                                      : item.priority === 'Optional'
                                      ? 'bg-yellow-500 text-neutral-900'
                                      : 'bg-blue-500 text-white'
                                  }`}>
                                    {item.priority}
                                  </span>

                                  {/* Expand button if there are details */}
                                  {item.details && (
                                    <button
                                      onClick={() => toggleItemExpand(item.id)}
                                      className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
                                      title="Show details"
                                    >
                                      <Info className={`w-5 h-5 transition-transform ${
                                        isExpanded ? 'text-primary-500' : 'text-neutral-500'
                                      }`} />
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* Expanded Details */}
                              {isExpanded && item.details && (
                                <div className="px-3 pb-4 pl-16">
                                  <div className="bg-neutral-900/50 rounded-lg p-4 border border-neutral-800">
                                    <p className="text-sm text-neutral-300 leading-relaxed">
                                      {item.details}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 p-6 bg-white rounded-lg shadow-sm text-center">
          <p className="text-neutral-600 mb-4">
            Want to learn more about cybersecurity? Check out our interactive training modules!
          </p>
          <Link
            to="/signup"
            className="inline-block px-6 py-3 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors"
          >
            Start Free Training
          </Link>
        </div>

        {/* Attribution */}
        <div className="mt-6 text-center text-sm text-neutral-500">
          <p>
            Inspired by{' '}
            <a
              href="https://digital-defense.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-500 hover:text-primary-600"
            >
              digital-defense.io
            </a>
            {' '} and{' '}
            <a
              href="https://github.com/Lissy93/personal-security-checklist"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-500 hover:text-primary-600"
            >
              Personal Security Checklist
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
