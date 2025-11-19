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
        description: 'Use a long, unique password for each account (14+ characters with mixed case, numbers, and symbols)',
        priority: 'essential',
        details: 'Consider using a passphrase of random words for better security and memorability.'
      },
      {
        id: 'auth-2',
        title: 'Enable Two-Factor Authentication',
        description: 'Use 2FA on all accounts that support it, preferably with an authenticator app',
        priority: 'essential',
        details: 'Avoid SMS-based 2FA when possible, as it can be intercepted. Use apps like Authy, Google Authenticator, or hardware keys.'
      },
      {
        id: 'auth-3',
        title: 'Use a Password Manager',
        description: 'Store passwords in an encrypted password manager like Bitwarden, 1Password, or KeePassXC',
        priority: 'essential',
        details: 'This allows you to use unique, complex passwords for every account without memorizing them.'
      },
      {
        id: 'auth-4',
        title: 'Keep Software Updated',
        description: 'Enable automatic updates for your password manager and authentication apps',
        priority: 'essential'
      },
      {
        id: 'auth-5',
        title: 'Use Unique Passwords',
        description: 'Never reuse passwords across different accounts',
        priority: 'essential',
        details: 'If one account is breached, all accounts with the same password become vulnerable.'
      },
      {
        id: 'auth-6',
        title: 'Review Active Sessions',
        description: 'Regularly check and revoke suspicious active sessions on your accounts',
        priority: 'optional',
        details: 'Most services show where and when you logged in. Remove any unrecognized devices.'
      },
      {
        id: 'auth-7',
        title: 'Use Hardware Security Keys',
        description: 'Use physical security keys (like YubiKey) for critical accounts',
        priority: 'advanced',
        details: 'Hardware keys provide the strongest protection against phishing and account takeover.'
      },
      {
        id: 'auth-8',
        title: 'Enable Login Notifications',
        description: 'Turn on email/SMS alerts for new login attempts',
        priority: 'optional'
      },
      {
        id: 'auth-9',
        title: 'Avoid Password Hints',
        description: 'Never use easily guessable password hints or security questions',
        priority: 'essential'
      },
      {
        id: 'auth-10',
        title: 'Use Biometric Authentication Wisely',
        description: 'Enable fingerprint/face unlock as secondary authentication, not primary',
        priority: 'optional',
        details: 'Biometrics can be compromised and cannot be changed like passwords.'
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
        title: 'Use a Privacy-Focused Browser',
        description: 'Switch to Firefox, Brave, or Tor Browser instead of Chrome or Edge',
        priority: 'essential',
        details: 'Privacy browsers block trackers by default and don\'t send your data to big tech companies.'
      },
      {
        id: 'web-2',
        title: 'Install uBlock Origin',
        description: 'Add uBlock Origin extension to block ads, trackers, and malware sites',
        priority: 'essential'
      },
      {
        id: 'web-3',
        title: 'Use HTTPS Everywhere',
        description: 'Install HTTPS Everywhere or enable HTTPS-only mode in browser settings',
        priority: 'essential',
        details: 'This ensures your connection is encrypted whenever possible.'
      },
      {
        id: 'web-4',
        title: 'Clear Cookies Regularly',
        description: 'Set your browser to clear cookies and cache when closing',
        priority: 'optional'
      },
      {
        id: 'web-5',
        title: 'Disable Third-Party Cookies',
        description: 'Block third-party cookies in browser settings to prevent cross-site tracking',
        priority: 'essential'
      },
      {
        id: 'web-6',
        title: 'Use Private/Incognito Mode',
        description: 'Browse in private mode for sensitive activities',
        priority: 'optional',
        details: 'This prevents local history and cookie storage, but doesn\'t hide your IP address.'
      },
      {
        id: 'web-7',
        title: 'Enable Do Not Track',
        description: 'Turn on DNT header in browser settings',
        priority: 'optional'
      },
      {
        id: 'web-8',
        title: 'Use a Privacy-Respecting Search Engine',
        description: 'Switch to DuckDuckGo, Startpage, or Brave Search instead of Google',
        priority: 'essential'
      },
      {
        id: 'web-9',
        title: 'Disable Browser Fingerprinting',
        description: 'Use extensions like Canvas Blocker to prevent fingerprinting',
        priority: 'advanced'
      },
      {
        id: 'web-10',
        title: 'Review Browser Extensions',
        description: 'Only install necessary extensions from trusted sources',
        priority: 'essential',
        details: 'Extensions can access all your browsing data. Remove unused ones regularly.'
      },
      {
        id: 'web-11',
        title: 'Disable WebRTC',
        description: 'Disable WebRTC to prevent IP leaks when using VPN',
        priority: 'advanced'
      },
      {
        id: 'web-12',
        title: 'Use DNS-over-HTTPS',
        description: 'Enable encrypted DNS queries in browser settings',
        priority: 'optional'
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
        title: 'Use a Secure Email Provider',
        description: 'Switch to ProtonMail, Tutanota, or Mailfence for encrypted email',
        priority: 'optional',
        details: 'These providers offer end-to-end encryption and don\'t scan your emails.'
      },
      {
        id: 'email-2',
        title: 'Be Wary of Phishing',
        description: 'Never click suspicious links or download unexpected attachments',
        priority: 'essential'
      },
      {
        id: 'email-3',
        title: 'Use Email Aliases',
        description: 'Create unique email addresses for different services using aliases or forwarding',
        priority: 'optional',
        details: 'Services like SimpleLogin or AnonAddy let you create unlimited aliases.'
      },
      {
        id: 'email-4',
        title: 'Disable Automatic Image Loading',
        description: 'Turn off auto-loading of images to prevent tracking pixels',
        priority: 'optional'
      },
      {
        id: 'email-5',
        title: 'Use End-to-End Encryption',
        description: 'Use PGP/GPG encryption for sensitive communications',
        priority: 'advanced'
      },
      {
        id: 'email-6',
        title: 'Verify Sender Identity',
        description: 'Always check the actual sender email address, not just the display name',
        priority: 'essential'
      },
      {
        id: 'email-7',
        title: 'Unsubscribe from Marketing',
        description: 'Regularly unsubscribe from unwanted mailing lists',
        priority: 'optional'
      },
      {
        id: 'email-8',
        title: 'Use SPF, DKIM, DMARC',
        description: 'If you own a domain, configure these email authentication protocols',
        priority: 'advanced'
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
        title: 'Use End-to-End Encrypted Messaging',
        description: 'Switch to Signal, WhatsApp, or Telegram for private conversations',
        priority: 'essential',
        details: 'Signal offers the strongest privacy guarantees with no metadata collection.'
      },
      {
        id: 'msg-2',
        title: 'Verify Safety Numbers',
        description: 'Verify encryption keys with contacts for sensitive conversations',
        priority: 'advanced'
      },
      {
        id: 'msg-3',
        title: 'Disable Message Previews',
        description: 'Turn off lock screen message previews',
        priority: 'optional'
      },
      {
        id: 'msg-4',
        title: 'Enable Disappearing Messages',
        description: 'Use auto-delete features for sensitive conversations',
        priority: 'optional'
      },
      {
        id: 'msg-5',
        title: 'Disable Read Receipts',
        description: 'Turn off read receipts and typing indicators for privacy',
        priority: 'optional'
      },
      {
        id: 'msg-6',
        title: 'Avoid SMS for Sensitive Info',
        description: 'Never send passwords, codes, or sensitive data via SMS',
        priority: 'essential',
        details: 'SMS is unencrypted and can be intercepted easily.'
      },
      {
        id: 'msg-7',
        title: 'Use Registration Lock',
        description: 'Enable PIN/registration lock in messaging apps',
        priority: 'optional'
      },
      {
        id: 'msg-8',
        title: 'Review App Permissions',
        description: 'Limit messaging app access to contacts, camera, and microphone',
        priority: 'essential'
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
        title: 'Review Privacy Settings',
        description: 'Set all social media profiles to private or friends-only',
        priority: 'essential'
      },
      {
        id: 'social-2',
        title: 'Limit Personal Information',
        description: 'Don\'t share your phone number, address, or location publicly',
        priority: 'essential'
      },
      {
        id: 'social-3',
        title: 'Disable Location Tagging',
        description: 'Turn off geotagging in photos and posts',
        priority: 'essential'
      },
      {
        id: 'social-4',
        title: 'Review Tagged Photos',
        description: 'Enable tag review before photos appear on your profile',
        priority: 'optional'
      },
      {
        id: 'social-5',
        title: 'Limit Third-Party App Access',
        description: 'Revoke access for apps you no longer use',
        priority: 'essential'
      },
      {
        id: 'social-6',
        title: 'Be Careful What You Share',
        description: 'Avoid posting vacation plans, expensive purchases, or daily routines',
        priority: 'essential',
        details: 'This information can be used for social engineering or physical threats.'
      },
      {
        id: 'social-7',
        title: 'Use Different Passwords',
        description: 'Don\'t reuse passwords from other accounts on social media',
        priority: 'essential'
      },
      {
        id: 'social-8',
        title: 'Review Friend Lists Regularly',
        description: 'Remove inactive or suspicious connections',
        priority: 'optional'
      },
      {
        id: 'social-9',
        title: 'Disable Face Recognition',
        description: 'Opt out of facial recognition features',
        priority: 'optional'
      },
      {
        id: 'social-10',
        title: 'Use Separate Email',
        description: 'Create a dedicated email address for social media accounts',
        priority: 'optional'
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
        description: 'Use a reputable VPN service (Mullvad, ProtonVPN, IVPN) on public networks',
        priority: 'essential',
        details: 'VPNs encrypt your traffic and hide your IP address from websites and ISPs.'
      },
      {
        id: 'net-2',
        title: 'Change Default Router Password',
        description: 'Change your router\'s default admin password immediately',
        priority: 'essential'
      },
      {
        id: 'net-3',
        title: 'Use WPA3 Encryption',
        description: 'Enable WPA3 (or at least WPA2) on your WiFi network',
        priority: 'essential'
      },
      {
        id: 'net-4',
        title: 'Disable WPS',
        description: 'Turn off WiFi Protected Setup (WPS) on your router',
        priority: 'essential',
        details: 'WPS has known vulnerabilities that can be exploited.'
      },
      {
        id: 'net-5',
        title: 'Change Default SSID',
        description: 'Don\'t use your router\'s default network name',
        priority: 'optional'
      },
      {
        id: 'net-6',
        title: 'Disable Remote Management',
        description: 'Turn off remote access to router settings',
        priority: 'essential'
      },
      {
        id: 'net-7',
        title: 'Enable Router Firewall',
        description: 'Make sure your router\'s built-in firewall is enabled',
        priority: 'essential'
      },
      {
        id: 'net-8',
        title: 'Update Router Firmware',
        description: 'Keep router firmware up to date with latest security patches',
        priority: 'essential'
      },
      {
        id: 'net-9',
        title: 'Use DNS Filtering',
        description: 'Configure DNS-level blocking (NextDNS, Quad9) for malware protection',
        priority: 'optional'
      },
      {
        id: 'net-10',
        title: 'Segment Your Network',
        description: 'Create separate networks for IoT devices and guests',
        priority: 'advanced'
      },
      {
        id: 'net-11',
        title: 'Disable UPnP',
        description: 'Turn off Universal Plug and Play to prevent automatic port forwarding',
        priority: 'advanced'
      },
      {
        id: 'net-12',
        title: 'Monitor Connected Devices',
        description: 'Regularly check which devices are connected to your network',
        priority: 'optional'
      }
    ]
  },
  {
    id: 'mobile',
    title: 'Mobile Devices',
    description: 'Reduce invasive tracking for smartphones and tablets',
    icon: Smartphone,
    items: [
      {
        id: 'mobile-1',
        title: 'Enable Device Encryption',
        description: 'Turn on full-disk encryption on your mobile device',
        priority: 'essential',
        details: 'Most modern devices have this enabled by default.'
      },
      {
        id: 'mobile-2',
        title: 'Use a Strong Lock Screen',
        description: 'Set a 6+ digit PIN or strong password (avoid patterns)',
        priority: 'essential'
      },
      {
        id: 'mobile-3',
        title: 'Keep OS Updated',
        description: 'Install system updates as soon as they\'re available',
        priority: 'essential'
      },
      {
        id: 'mobile-4',
        title: 'Review App Permissions',
        description: 'Regularly audit and revoke unnecessary app permissions',
        priority: 'essential',
        details: 'Question why apps need location, camera, or contacts access.'
      },
      {
        id: 'mobile-5',
        title: 'Install Apps from Official Stores',
        description: 'Only download apps from Google Play or Apple App Store',
        priority: 'essential'
      },
      {
        id: 'mobile-6',
        title: 'Enable Find My Device',
        description: 'Turn on remote wipe and tracking features',
        priority: 'essential'
      },
      {
        id: 'mobile-7',
        title: 'Disable Lock Screen Notifications',
        description: 'Hide sensitive notification content from lock screen',
        priority: 'optional'
      },
      {
        id: 'mobile-8',
        title: 'Use Biometric Authentication',
        description: 'Enable fingerprint or face unlock as convenience feature',
        priority: 'optional'
      },
      {
        id: 'mobile-9',
        title: 'Disable Siri/Google Assistant on Lock Screen',
        description: 'Prevent voice assistant access when locked',
        priority: 'optional'
      },
      {
        id: 'mobile-10',
        title: 'Turn Off WiFi/Bluetooth When Not Needed',
        description: 'Disable wireless features to prevent tracking',
        priority: 'optional'
      },
      {
        id: 'mobile-11',
        title: 'Use Privacy Screen Protector',
        description: 'Install a privacy screen to prevent shoulder surfing',
        priority: 'optional'
      },
      {
        id: 'mobile-12',
        title: 'Enable Auto-Lock',
        description: 'Set device to lock after 30 seconds of inactivity',
        priority: 'essential'
      }
    ]
  },
  {
    id: 'computer',
    title: 'Personal Computers',
    description: 'Securing your PC\'s operating system, data & activity',
    icon: Monitor,
    items: [
      {
        id: 'pc-1',
        title: 'Keep OS Updated',
        description: 'Enable automatic updates for your operating system',
        priority: 'essential'
      },
      {
        id: 'pc-2',
        title: 'Use Full Disk Encryption',
        description: 'Enable BitLocker (Windows) or FileVault (Mac)',
        priority: 'essential'
      },
      {
        id: 'pc-3',
        title: 'Install Antivirus Software',
        description: 'Use reputable antivirus (Windows Defender, Malwarebytes, or Bitdefender)',
        priority: 'essential'
      },
      {
        id: 'pc-4',
        title: 'Enable Firewall',
        description: 'Make sure your OS firewall is turned on',
        priority: 'essential'
      },
      {
        id: 'pc-5',
        title: 'Use Standard User Account',
        description: 'Don\'t use an admin account for daily activities',
        priority: 'optional'
      },
      {
        id: 'pc-6',
        title: 'Backup Your Data',
        description: 'Use the 3-2-1 backup rule (3 copies, 2 different media, 1 offsite)',
        priority: 'essential'
      },
      {
        id: 'pc-7',
        title: 'Disable Unused Services',
        description: 'Turn off remote desktop and other unnecessary services',
        priority: 'optional'
      },
      {
        id: 'pc-8',
        title: 'Use a Hosts File',
        description: 'Block malware and tracking domains at the system level',
        priority: 'advanced'
      },
      {
        id: 'pc-9',
        title: 'Encrypt Sensitive Files',
        description: 'Use tools like VeraCrypt for extra-sensitive data',
        priority: 'advanced'
      },
      {
        id: 'pc-10',
        title: 'Disable Webcam/Microphone',
        description: 'Use physical covers or disable when not in use',
        priority: 'optional'
      },
      {
        id: 'pc-11',
        title: 'Clear Browser Data Regularly',
        description: 'Delete browsing history, cookies, and cache periodically',
        priority: 'optional'
      },
      {
        id: 'pc-12',
        title: 'Use Secure Boot',
        description: 'Enable Secure Boot in BIOS/UEFI settings',
        priority: 'advanced'
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
        title: 'Change Default Passwords',
        description: 'Change the default password on all IoT devices',
        priority: 'essential'
      },
      {
        id: 'smart-2',
        title: 'Update Device Firmware',
        description: 'Keep all smart home devices updated',
        priority: 'essential'
      },
      {
        id: 'smart-3',
        title: 'Use Separate Network',
        description: 'Put IoT devices on a separate WiFi network',
        priority: 'optional',
        details: 'This isolates them from your main devices in case of compromise.'
      },
      {
        id: 'smart-4',
        title: 'Disable Unnecessary Features',
        description: 'Turn off remote access if you don\'t need it',
        priority: 'optional'
      },
      {
        id: 'smart-5',
        title: 'Review Privacy Policies',
        description: 'Understand what data your devices collect and share',
        priority: 'optional'
      },
      {
        id: 'smart-6',
        title: 'Disable Microphones When Not Needed',
        description: 'Mute smart speakers when not in use',
        priority: 'optional'
      },
      {
        id: 'smart-7',
        title: 'Use Local Control',
        description: 'Prefer devices that work locally without cloud services',
        priority: 'advanced'
      },
      {
        id: 'smart-8',
        title: 'Check for Open Ports',
        description: 'Scan your network for devices exposing services',
        priority: 'advanced'
      }
    ]
  },
  {
    id: 'finance',
    title: 'Personal Finance',
    description: 'Protecting your funds, financial accounts and transactions',
    icon: CreditCard,
    items: [
      {
        id: 'fin-1',
        title: 'Enable Transaction Alerts',
        description: 'Set up notifications for all card and bank transactions',
        priority: 'essential'
      },
      {
        id: 'fin-2',
        title: 'Use Virtual Card Numbers',
        description: 'Use services like Privacy.com for online purchases',
        priority: 'optional'
      },
      {
        id: 'fin-3',
        title: 'Monitor Credit Reports',
        description: 'Check your credit report regularly for suspicious activity',
        priority: 'essential'
      },
      {
        id: 'fin-4',
        title: 'Freeze Your Credit',
        description: 'Place a security freeze with credit bureaus',
        priority: 'optional',
        details: 'This prevents new accounts from being opened in your name.'
      },
      {
        id: 'fin-5',
        title: 'Use Separate Cards',
        description: 'Have different cards for online shopping and in-person purchases',
        priority: 'optional'
      },
      {
        id: 'fin-6',
        title: 'Avoid Public WiFi for Banking',
        description: 'Never access banking apps or websites on public networks',
        priority: 'essential'
      },
      {
        id: 'fin-7',
        title: 'Enable Card Locks',
        description: 'Use features to instantly lock/unlock your cards',
        priority: 'optional'
      },
      {
        id: 'fin-8',
        title: 'Review Statements Monthly',
        description: 'Check all transactions for unauthorized charges',
        priority: 'essential'
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
        title: 'Be Skeptical of Unsolicited Contact',
        description: 'Don\'t trust unexpected calls, emails, or messages asking for information',
        priority: 'essential'
      },
      {
        id: 'human-2',
        title: 'Verify Before Sharing',
        description: 'Always verify identity through a separate channel before sharing sensitive info',
        priority: 'essential'
      },
      {
        id: 'human-3',
        title: 'Don\'t Overshare Online',
        description: 'Limit personal details that could be used for social engineering',
        priority: 'essential'
      },
      {
        id: 'human-4',
        title: 'Be Wary of Urgency',
        description: 'Scammers create urgency to bypass your critical thinking',
        priority: 'essential'
      },
      {
        id: 'human-5',
        title: 'Question Authority',
        description: 'Verify claimed authority through official channels',
        priority: 'essential'
      },
      {
        id: 'human-6',
        title: 'Secure Physical Documents',
        description: 'Shred sensitive documents before disposal',
        priority: 'optional'
      },
      {
        id: 'human-7',
        title: 'Educate Family Members',
        description: 'Teach others about common scams and security practices',
        priority: 'optional'
      },
      {
        id: 'human-8',
        title: 'Use Code Words',
        description: 'Establish secret code words with family for verification',
        priority: 'optional'
      }
    ]
  },
  {
    id: 'physical',
    title: 'Physical Security',
    description: 'Taking measures to prevent IRL security incidents',
    icon: MapPin,
    items: [
      {
        id: 'phys-1',
        title: 'Lock Your Devices',
        description: 'Never leave devices unattended and unlocked',
        priority: 'essential'
      },
      {
        id: 'phys-2',
        title: 'Use Privacy Screens',
        description: 'Install privacy filters on laptops and phones',
        priority: 'optional'
      },
      {
        id: 'phys-3',
        title: 'Secure Your Home Network',
        description: 'Keep router in a secure location, not visible from outside',
        priority: 'optional'
      },
      {
        id: 'phys-4',
        title: 'Destroy Old Devices Properly',
        description: 'Wipe data before disposing of electronics',
        priority: 'essential'
      },
      {
        id: 'phys-5',
        title: 'Be Aware of Surroundings',
        description: 'Watch for shoulder surfers when entering passwords',
        priority: 'essential'
      },
      {
        id: 'phys-6',
        title: 'Use Cable Locks',
        description: 'Secure laptops with physical locks in public spaces',
        priority: 'optional'
      },
      {
        id: 'phys-7',
        title: 'Cover Webcams',
        description: 'Use a physical cover or tape over cameras when not in use',
        priority: 'optional'
      },
      {
        id: 'phys-8',
        title: 'Secure USB Ports',
        description: 'Disable USB ports or use port locks to prevent data theft',
        priority: 'advanced'
      }
    ]
  }
]

export default function SecurityChecklistPage() {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set())
  const [selectedPriorities, setSelectedPriorities] = useState<Set<Priority>>(
    new Set(['essential', 'optional', 'advanced'])
  )
  const [showStats, setShowStats] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setCompletedItems(new Set(data.completed || []))
      } catch (e) {
        console.error('Failed to load checklist progress:', e)
      }
    }
  }, [])

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ completed: Array.from(completedItems) })
    )
  }, [completedItems])

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const toggleItem = (itemId: string) => {
    const newCompleted = new Set(completedItems)
    if (newCompleted.has(itemId)) {
      newCompleted.delete(itemId)
    } else {
      newCompleted.add(itemId)
    }
    setCompletedItems(newCompleted)
  }

  const toggleItemExpand = (itemId: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId)
    } else {
      newExpanded.add(itemId)
    }
    setExpandedItems(newExpanded)
  }

  const togglePriority = (priority: Priority) => {
    const newPriorities = new Set(selectedPriorities)
    if (newPriorities.has(priority)) {
      newPriorities.delete(priority)
    } else {
      newPriorities.add(priority)
    }
    setSelectedPriorities(newPriorities)
  }

  const exportProgress = () => {
    const data = {
      exported: new Date().toISOString(),
      completed: Array.from(completedItems)
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'security-checklist-progress.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const importProgress = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target?.result as string)
            if (data.completed && Array.isArray(data.completed)) {
              setCompletedItems(new Set(data.completed))
            }
          } catch (e) {
            alert('Failed to import progress file')
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const clearProgress = () => {
    if (confirm('Are you sure you want to clear all progress? This cannot be undone.')) {
      setCompletedItems(new Set())
    }
  }

  const expandAll = () => {
    setExpandedCategories(new Set(checklistData.map(cat => cat.id)))
  }

  const collapseAll = () => {
    setExpandedCategories(new Set())
  }

  // Calculate statistics
  const totalItems = checklistData.reduce((sum, cat) => sum + cat.items.length, 0)
  const completedCount = completedItems.size
  const completionPercentage = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0

  const priorityStats = {
    essential: { total: 0, completed: 0 },
    optional: { total: 0, completed: 0 },
    advanced: { total: 0, completed: 0 }
  }

  checklistData.forEach(category => {
    category.items.forEach(item => {
      priorityStats[item.priority].total++
      if (completedItems.has(item.id)) {
        priorityStats[item.priority].completed++
      }
    })
  })

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'essential':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'optional':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'advanced':
        return 'text-blue-600 bg-blue-50 border-blue-200'
    }
  }

  const getPriorityBadge = (priority: Priority) => {
    switch (priority) {
      case 'essential':
        return 'bg-red-100 text-red-700'
      case 'optional':
        return 'bg-yellow-100 text-yellow-700'
      case 'advanced':
        return 'bg-blue-100 text-blue-700'
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0b0f]">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-10 h-10 text-primary-500" />
            <h1 className="text-4xl font-bold text-white">
              Personal Security Checklist
            </h1>
          </div>
          <p className="text-lg text-neutral-400 mb-6">
            A comprehensive guide to securing your digital life and protecting your privacy.
            Track your progress as you implement each security measure.
          </p>
          
          {/* Stats Banner - Left side with progress info and radar chart */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Left: Progress Card */}
            <div className="bg-[#13141a] rounded-xl p-6 border border-neutral-800">
              <h2 className="text-2xl font-bold text-white mb-2">Your Progress</h2>
              <p className="text-neutral-400 mb-6">
                You've completed {completedCount} out of {totalItems} items
              </p>
              
              {/* Progress circles */}
              <div className="flex gap-8 mb-6">
                <div className="text-center">
                  <div className="relative w-24 h-24 mb-3">
                    <svg className="w-24 h-24 transform -rotate-90">
                      <circle cx="48" cy="48" r="40" stroke="#1f2937" strokeWidth="8" fill="none" />
                      <circle 
                        cx="48" 
                        cy="48" 
                        r="40" 
                        stroke="#ef4444" 
                        strokeWidth="8" 
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - priorityStats.essential.completed / priorityStats.essential.total)}`}
                        className="transition-all duration-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold text-white">
                        {priorityStats.essential.total > 0 ? Math.round((priorityStats.essential.completed / priorityStats.essential.total) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-neutral-400">Essential</div>
                </div>

                <div className="text-center">
                  <div className="relative w-24 h-24 mb-3">
                    <svg className="w-24 h-24 transform -rotate-90">
                      <circle cx="48" cy="48" r="40" stroke="#1f2937" strokeWidth="8" fill="none" />
                      <circle 
                        cx="48" 
                        cy="48" 
                        r="40" 
                        stroke="#eab308" 
                        strokeWidth="8" 
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - priorityStats.optional.completed / priorityStats.optional.total)}`}
                        className="transition-all duration-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold text-white">
                        {priorityStats.optional.total > 0 ? Math.round((priorityStats.optional.completed / priorityStats.optional.total) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-neutral-400">Optional</div>
                </div>

                <div className="text-center">
                  <div className="relative w-24 h-24 mb-3">
                    <svg className="w-24 h-24 transform -rotate-90">
                      <circle cx="48" cy="48" r="40" stroke="#1f2937" strokeWidth="8" fill="none" />
                      <circle 
                        cx="48" 
                        cy="48" 
                        r="40" 
                        stroke="#3b82f6" 
                        strokeWidth="8" 
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - priorityStats.advanced.completed / priorityStats.advanced.total)}`}
                        className="transition-all duration-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold text-white">
                        {priorityStats.advanced.total > 0 ? Math.round((priorityStats.advanced.completed / priorityStats.advanced.total) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-neutral-400">Advanced</div>
                </div>
              </div>

              <div className="text-sm text-neutral-400 mb-4">
                Next up, consider switching to more secure and privacy-respecting apps and services.
              </div>
              
              <a 
                href="https://awesome-privacy.xyz/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-500 hover:text-primary-400 text-sm"
              >
                View our directory of recommended software, at awesome-privacy.xyz
              </a>
            </div>

            {/* Right: Radar Chart */}
            <div className="bg-[#13141a] rounded-xl p-6 border border-neutral-800 flex items-center justify-center">
              <div className="relative w-80 h-80">
                {/* Radar chart background */}
                <svg viewBox="0 0 400 400" className="w-full h-full">
                  {/* Grid circles */}
                  {[0.2, 0.4, 0.6, 0.8, 1.0].map((scale, i) => (
                    <circle
                      key={i}
                      cx="200"
                      cy="200"
                      r={160 * scale}
                      fill="none"
                      stroke="#1f2937"
                      strokeWidth="1"
                    />
                  ))}
                  
                  {/* Grid lines */}
                  {checklistData.map((_, index) => {
                    const angle = (index * 360) / checklistData.length - 90
                    const rad = (angle * Math.PI) / 180
                    const x = 200 + Math.cos(rad) * 160
                    const y = 200 + Math.sin(rad) * 160
                    return (
                      <line
                        key={index}
                        x1="200"
                        y1="200"
                        x2={x}
                        y2={y}
                        stroke="#1f2937"
                        strokeWidth="1"
                      />
                    )
                  })}

                  {/* Data polygon */}
                  <polygon
                    points={checklistData.map((category, index) => {
                      const categoryItems = category.items.filter(item => selectedPriorities.has(item.priority))
                      const categoryCompleted = categoryItems.filter(item => completedItems.has(item.id)).length
                      const categoryTotal = categoryItems.length
                      const progress = categoryTotal > 0 ? categoryCompleted / categoryTotal : 0
                      const angle = (index * 360) / checklistData.length - 90
                      const rad = (angle * Math.PI) / 180
                      const x = 200 + Math.cos(rad) * 160 * progress
                      const y = 200 + Math.sin(rad) * 160 * progress
                      return `${x},${y}`
                    }).join(' ')}
                    fill="rgba(99, 102, 241, 0.3)"
                    stroke="#6366f1"
                    strokeWidth="2"
                  />
                  
                  {/* Labels */}
                  {checklistData.map((category, index) => {
                    const angle = (index * 360) / checklistData.length - 90
                    const rad = (angle * Math.PI) / 180
                    const x = 200 + Math.cos(rad) * 190
                    const y = 200 + Math.sin(rad) * 190
                    return (
                      <text
                        key={index}
                        x={x}
                        y={y}
                        fill="#9ca3af"
                        fontSize="11"
                        textAnchor="middle"
                        className="select-none"
                      >
                        {category.title}
                      </text>
                    )
                  })}
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-[#13141a] rounded-lg border border-neutral-800 p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Priority Filters */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-neutral-400">Show:</span>
              <button
                onClick={() => togglePriority('essential')}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                  selectedPriorities.has('essential')
                    ? 'bg-red-900/30 text-red-400 border-red-800'
                    : 'bg-neutral-800 text-neutral-500 border-neutral-700'
                }`}
              >
                Essential
              </button>
              <button
                onClick={() => togglePriority('optional')}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                  selectedPriorities.has('optional')
                    ? 'bg-yellow-900/30 text-yellow-400 border-yellow-800'
                    : 'bg-neutral-800 text-neutral-500 border-neutral-700'
                }`}
              >
                Optional
              </button>
              <button
                onClick={() => togglePriority('advanced')}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                  selectedPriorities.has('advanced')
                    ? 'bg-blue-900/30 text-blue-400 border-blue-800'
                    : 'bg-neutral-800 text-neutral-500 border-neutral-700'
                }`}
              >
                Advanced
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={expandAll}
                className="px-3 py-1 text-sm text-neutral-400 hover:text-white transition-colors"
              >
                Expand All
              </button>
              <button
                onClick={collapseAll}
                className="px-3 py-1 text-sm text-neutral-400 hover:text-white transition-colors"
              >
                Collapse All
              </button>
              <div className="w-px h-6 bg-neutral-700" />
              <button
                onClick={exportProgress}
                className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-colors"
                title="Export Progress"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={importProgress}
                className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-colors"
                title="Import Progress"
              >
                <Upload className="w-4 h-4" />
              </button>
              <button
                onClick={clearProgress}
                className="p-2 text-neutral-400 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
                title="Clear Progress"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {checklistData.map((category) => {
            const Icon = category.icon
            const categoryItems = category.items.filter(item => 
              selectedPriorities.has(item.priority)
            )
            const categoryCompleted = categoryItems.filter(item => 
              completedItems.has(item.id)
            ).length
            const categoryTotal = categoryItems.length
            const categoryProgress = categoryTotal > 0 
              ? Math.round((categoryCompleted / categoryTotal) * 100) 
              : 0

            if (categoryItems.length === 0) return null

            const isNotStarted = categoryCompleted === 0

            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`bg-[#13141a] border rounded-xl p-6 text-left hover:border-primary-500 transition-all ${
                  selectedCategory === category.id ? 'border-primary-500' : 'border-neutral-800'
                }`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-primary-900/30 rounded-lg">
                    <Icon className="w-8 h-8 text-primary-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white mb-1">
                      {category.title}
                    </h3>
                    <p className="text-sm text-neutral-400 mb-2">{category.description}</p>
                    {isNotStarted ? (
                      <span className="text-xs text-neutral-500">Not yet started</span>
                    ) : (
                      <span className="text-xs text-neutral-400">
                        {categoryCompleted} / {categoryTotal} items
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Progress bar */}
                {!isNotStarted && (
                  <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-primary-600 h-full transition-all duration-500"
                      style={{ width: `${categoryProgress}%` }}
                    />
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Selected Category Details */}
        {selectedCategory && (
          <div className="space-y-4 mb-8">
            {checklistData
              .filter(cat => cat.id === selectedCategory)
              .map((category) => {
                const Icon = category.icon
                const categoryItems = category.items.filter(item => 
                  selectedPriorities.has(item.priority)
                )

                return (
                  <div key={category.id} className="bg-[#13141a] rounded-xl border border-neutral-800 overflow-hidden">
                    {/* Category Header */}
                    <div className="p-6 border-b border-neutral-800">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary-900/30 rounded-lg">
                          <Icon className="w-8 h-8 text-primary-500" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-white mb-1">
                            {category.title}
                          </h3>
                          <p className="text-neutral-400">{category.description}</p>
                        </div>
                        <button
                          onClick={() => setSelectedCategory(null)}
                          className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Category Items */}
                    <div className="p-6">
                      <div className="space-y-2">
                        {categoryItems.map((item) => {
                          const isCompleted = completedItems.has(item.id)
                          const isExpanded = expandedItems.has(item.id)

                          return (
                            <div
                              key={item.id}
                              className={`border-b border-neutral-800 last:border-b-0 transition-all ${
                                isCompleted ? 'opacity-60' : ''
                              }`}
                            >
                              <div className="flex items-center gap-4 py-4 hover:bg-neutral-900/30 px-3 rounded-lg transition-colors">
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

                                {/* Icon placeholder (optional) */}
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
                                    item.priority === 'essential'
                                      ? 'bg-emerald-500 text-white'
                                      : item.priority === 'optional'
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
