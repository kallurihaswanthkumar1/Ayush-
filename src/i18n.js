export const HEALTH_LANGUAGES = [
    { code: 'en', name: 'English', voice: 'en-IN' },
    { code: 'hi', name: 'हिन्दी (Hindi)', voice: 'hi-IN' },
    { code: 'te', name: 'తెలుగు (Telugu)', voice: 'te-IN' },
    { code: 'ta', name: 'தமிழ் (Tamil)', voice: 'ta-IN' },
    { code: 'kn', name: 'ಕನ್ನಡ (Kannada)', voice: 'kn-IN' },
    { code: 'ml', name: 'മലയാളം (Malayalam)', voice: 'ml-IN' },
];

const agentHello = {
    en: name => `Hello ${name}. I can explain health information and help you understand this profile's records. What would you like to know?`,
    hi: name => `नमस्ते ${name}। मैं स्वास्थ्य जानकारी समझने और इस प्रोफ़ाइल के रिकॉर्ड देखने में मदद करूँगा। आप क्या जानना चाहते हैं?`,
    te: name => `నమస్తే ${name}. ఆరోగ్య సమాచారాన్ని అర్థం చేసుకోవడంలో, ఈ ప్రొఫైల్ రికార్డులను చూడడంలో సహాయపడతాను. మీరు ఏమి తెలుసుకోవాలనుకుంటున్నారు?`,
    ta: name => `வணக்கம் ${name}. சுகாதாரத் தகவலையும் இந்த விவரத்தின் பதிவுகளையும் புரிந்துகொள்ள உதவுகிறேன். நீங்கள் என்ன அறிய விரும்புகிறீர்கள்?`,
    kn: name => `ನಮಸ್ಕಾರ ${name}. ಆರೋಗ್ಯ ಮಾಹಿತಿ ಮತ್ತು ಈ ಪ್ರೊಫೈಲ್ ದಾಖಲೆಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಸಹಾಯ ಮಾಡುತ್ತೇನೆ. ಏನು ತಿಳಿಯಲು ಬಯಸುತ್ತೀರಿ?`,
    ml: name => `നമസ്കാരം ${name}. ആരോഗ്യവിവരങ്ങളും ഈ പ്രൊഫൈലിലെ രേഖകളും മനസ്സിലാക്കാൻ സഹായിക്കാം. എന്താണ് അറിയേണ്ടത്?`,
};

const questionExamples = {
    en: ['Show my sugar reports', 'What was my highest BP reading?', 'When was my last report?', 'Which medicines are on my profile?'],
    hi: ['मेरी शुगर रिपोर्ट दिखाएँ', 'मेरा सबसे अधिक BP क्या था?', 'मेरी नवीनतम रिपोर्ट कब की है?', 'मेरी प्रोफ़ाइल में कौन सी दवाएँ हैं?'],
    te: ['నా షుగర్ రిపోర్టులు చూపండి', 'నా అత్యధిక BP ఎంత?', 'నా తాజా రిపోర్ట్ ఎప్పుడు?', 'నా ప్రొఫైల్‌లో ఏ మందులు ఉన్నాయి?'],
    ta: ['என் சர்க்கரை அறிக்கைகளைக் காட்டு', 'என் அதிகபட்ச BP என்ன?', 'என் சமீபத்திய அறிக்கை எப்போது?', 'என் விவரத்தில் என்ன மருந்துகள் உள்ளன?'],
    kn: ['ನನ್ನ ಸಕ್ಕರೆ ವರದಿಗಳನ್ನು ತೋರಿಸಿ', 'ನನ್ನ ಅತಿ ಹೆಚ್ಚು BP ಎಷ್ಟು?', 'ನನ್ನ ಇತ್ತೀಚಿನ ವರದಿ ಯಾವಾಗ?', 'ನನ್ನ ಪ್ರೊಫೈಲ್‌ನಲ್ಲಿ ಯಾವ ಔಷಧಿಗಳಿವೆ?'],
    ml: ['എന്റെ ഷുഗർ റിപ്പോർട്ടുകൾ കാണിക്കുക', 'എന്റെ ഏറ്റവും ഉയർന്ന BP എത്ര?', 'എന്റെ ഏറ്റവും പുതിയ റിപ്പോർട്ട് എപ്പോഴാണ്?', 'എന്റെ പ്രൊഫൈലിൽ ഏത് മരുന്നുകളുണ്ട്?'],
};

export function agentGreeting(name, language = 'en') {
    return (agentHello[language] || agentHello.en)(name);
}

export function agentQuestions(language = 'en') {
    return questionExamples[language] || questionExamples.en;
}

const labels = {
    hi: {
        'Dashboard': 'डैशबोर्ड',
        'Documents': 'दस्तावेज़',
        'Trends': 'रुझान',
        'Health Agent': 'स्वास्थ्य सहायक',
        'Health Profile': 'स्वास्थ्य प्रोफ़ाइल',
        'Reminders': 'रिमाइंडर',
        'Family Profiles': 'परिवार प्रोफ़ाइल',
        'Doctor Visit Prep': 'डॉक्टर से मिलने की तैयारी',
        'Settings': 'सेटिंग्स',
        'YOUR HEALTH': 'आपका स्वास्थ्य',
        'MANAGE': 'प्रबंधन',
        'Encrypted health data': 'एन्क्रिप्टेड स्वास्थ्य डेटा',
        'Stored in your private account.': 'आपके निजी खाते में सुरक्षित।',
        'Health workspace': 'स्वास्थ्य कार्यक्षेत्र',
        'Secure account': 'सुरक्षित खाता',
        'Sign out': 'साइन आउट',
        'Read page': 'पेज सुनें',
        'Your personal health workspace': 'आपका व्यक्तिगत स्वास्थ्य कार्यक्षेत्र',
        'Summary language': 'सारांश की भाषा',
        'AI health agent': 'AI स्वास्थ्य सहायक',
        'Suggested questions': 'सुझाए गए प्रश्न',
        'Clear chat': 'चैट साफ़ करें',
        'Voice input': 'आवाज़ से पूछें',
        'Ask': 'पूछें',
        'Speak reply': 'जवाब सुनें',
        'Read this page aloud': 'यह पेज सुनें',
        'Stop speaking': 'पढ़ना रोकें',
        'Chat with HealthCopilot': 'HealthCopilot से बात करें',
        'Language preference saved.': 'भाषा की प्राथमिकता सहेजी गई।',
        'Your language preference applies to summaries, Health Agent replies, voice input, and read-aloud.': 'आपकी भाषा प्राथमिकता सारांश, स्वास्थ्य सहायक के जवाब, आवाज़ इनपुट और पढ़कर सुनाने पर लागू होती है।',
        'Enable AI to ask general health questions and questions about this profile.': 'सामान्य स्वास्थ्य प्रश्नों और इस प्रोफ़ाइल के बारे में पूछने के लिए AI चालू करें।',
        'Allow this profile’s relevant health facts and your question to be sent to the configured AI provider.': 'इस प्रोफ़ाइल के संबंधित स्वास्थ्य तथ्यों और आपके प्रश्न को चुने गए AI प्रदाता को भेजने की अनुमति दें।',
        'Medical information only. Not a doctor or emergency service.': 'केवल स्वास्थ्य जानकारी। डॉक्टर या आपातकालीन सेवा नहीं।',
        'Ask about records or general health information…': 'रिकॉर्ड या सामान्य स्वास्थ्य जानकारी के बारे में पूछें…',
        'Your assistant can use general health knowledge and this profile’s records when AI is enabled.': 'AI चालू होने पर सहायक सामान्य स्वास्थ्य जानकारी और इस प्रोफ़ाइल के रिकॉर्ड का उपयोग कर सकता है।'
    },
    te: {
        'Dashboard': 'డ్యాష్‌బోర్డ్',
        'Documents': 'పత్రాలు',
        'Trends': 'ట్రెండ్స్',
        'Health Agent': 'ఆరోగ్య సహాయకుడు',
        'Health Profile': 'ఆరోగ్య ప్రొఫైల్',
        'Reminders': 'రిమైండర్లు',
        'Family Profiles': 'కుటుంబ ప్రొఫైళ్లు',
        'Doctor Visit Prep': 'వైద్యుడి సందర్శనకు సిద్ధత',
        'Settings': 'సెట్టింగ్‌లు',
        'YOUR HEALTH': 'మీ ఆరోగ్యం',
        'MANAGE': 'నిర్వహణ',
        'Encrypted health data': 'ఎన్‌క్రిప్ట్ చేసిన ఆరోగ్య డేటా',
        'Stored in your private account.': 'మీ ప్రైవేట్ ఖాతాలో భద్రపరచబడింది.',
        'Health workspace': 'ఆరోగ్య కార్యస్థలం',
        'Secure account': 'సురక్షిత ఖాతా',
        'Sign out': 'సైన్ అవుట్',
        'Read page': 'పేజీ చదవండి',
        'Your personal health workspace': 'మీ వ్యక్తిగత ఆరోగ్య కార్యస్థలం',
        'Summary language': 'సారాంశ భాష',
        'AI health agent': 'AI ఆరోగ్య సహాయకుడు',
        'Suggested questions': 'సూచించిన ప్రశ్నలు',
        'Clear chat': 'చాట్ క్లియర్ చేయండి',
        'Voice input': 'వాయిస్ ఇన్‌పుట్',
        'Ask': 'అడగండి',
        'Speak reply': 'సమాధానం వినండి',
        'Read this page aloud': 'ఈ పేజీని చదవండి',
        'Stop speaking': 'చదవడం ఆపండి',
        'Chat with HealthCopilot': 'HealthCopilot‌తో మాట్లాడండి',
        'Language preference saved.': 'భాషా ప్రాధాన్యత సేవ్ చేయబడింది.',
        'Your language preference applies to summaries, Health Agent replies, voice input, and read-aloud.': 'మీ భాషా ప్రాధాన్యత సారాంశాలు, సమాధానాలు, వాయిస్ ఇన్‌పుట్ మరియు చదివి వినిపించడానికి వర్తిస్తుంది.',
        'Enable AI to ask general health questions and questions about this profile.': 'సాధారణ ఆరోగ్య ప్రశ్నలు మరియు ఈ ప్రొఫైల్ గురించి అడగడానికి AIని ప్రారంభించండి.',
        'Allow this profile’s relevant health facts and your question to be sent to the configured AI provider.': 'ఈ ప్రొఫైల్ ఆరోగ్య వివరాలు మరియు మీ ప్రశ్నను AI ప్రొవైడర్‌కు పంపడానికి అనుమతించండి.',
        'Medical information only. Not a doctor or emergency service.': 'ఆరోగ్య సమాచారం మాత్రమే. వైద్యుడు లేదా అత్యవసర సేవ కాదు.',
        'Ask about records or general health information…': 'రికార్డులు లేదా సాధారణ ఆరోగ్య సమాచారం గురించి అడగండి…',
        'Your assistant can use general health knowledge and this profile’s records when AI is enabled.': 'AI ప్రారంభిస్తే సహాయకుడు సాధారణ ఆరోగ్య జ్ఞానం మరియు ఈ ప్రొఫైల్ రికార్డులను ఉపయోగించగలడు.'
    },
    ta: {
        'Dashboard': 'முகப்புப்பலகை',
        'Documents': 'ஆவணங்கள்',
        'Trends': 'போக்குகள்',
        'Health Agent': 'சுகாதார உதவியாளர்',
        'Health Profile': 'சுகாதார விவரம்',
        'Reminders': 'நினைவூட்டல்கள்',
        'Family Profiles': 'குடும்ப விவரங்கள்',
        'Doctor Visit Prep': 'மருத்துவர் சந்திப்புக்குத் தயாராகுங்கள்',
        'Settings': 'அமைப்புகள்',
        'YOUR HEALTH': 'உங்கள் சுகாதாரம்',
        'MANAGE': 'நிர்வகிக்க',
        'Encrypted health data': 'மறைகுறியாக்கப்பட்ட சுகாதாரத் தரவு',
        'Stored in your private account.': 'உங்கள் தனிப்பட்ட கணக்கில் சேமிக்கப்பட்டது.',
        'Health workspace': 'சுகாதாரப் பணியிடம்',
        'Secure account': 'பாதுகாப்பான கணக்கு',
        'Sign out': 'வெளியேறு',
        'Read page': 'பக்கத்தைப் படிக்கவும்',
        'Your personal health workspace': 'உங்கள் தனிப்பட்ட சுகாதாரப் பணியிடம்',
        'Summary language': 'சுருக்க மொழி',
        'AI health agent': 'AI சுகாதார உதவியாளர்',
        'Suggested questions': 'பரிந்துரைக்கப்பட்ட கேள்விகள்',
        'Clear chat': 'உரையாடலை அழிக்கவும்',
        'Voice input': 'குரல் உள்ளீடு',
        'Ask': 'கேளுங்கள்',
        'Speak reply': 'பதிலைக் கேளுங்கள்',
        'Read this page aloud': 'இந்தப் பக்கத்தை வாசிக்கவும்',
        'Stop speaking': 'வாசிப்பதை நிறுத்தவும்',
        'Chat with HealthCopilot': 'HealthCopilot-உடன் பேசுங்கள்',
        'Language preference saved.': 'மொழி விருப்பம் சேமிக்கப்பட்டது.',
        'Your language preference applies to summaries, Health Agent replies, voice input, and read-aloud.': 'உங்கள் மொழி விருப்பம் சுருக்கங்கள், பதில்கள், குரல் உள்ளீடு மற்றும் வாசிப்புக்குப் பொருந்தும்.',
        'Enable AI to ask general health questions and questions about this profile.': 'பொது சுகாதாரக் கேள்விகளுக்கும் இந்த விவரத்தைப் பற்றியும் கேட்க AI-ஐ இயக்கவும்.',
        'Allow this profile’s relevant health facts and your question to be sent to the configured AI provider.': 'இந்த விவரத்தின் தொடர்புடைய சுகாதாரத் தகவல்களையும் உங்கள் கேள்வியையும் AI சேவைக்கு அனுப்ப அனுமதிக்கவும்.',
        'Medical information only. Not a doctor or emergency service.': 'சுகாதாரத் தகவல் மட்டுமே. மருத்துவரோ அவசர சேவையோ அல்ல.',
        'Ask about records or general health information…': 'பதிவுகள் அல்லது பொது சுகாதாரம் பற்றி கேளுங்கள்…',
        'Your assistant can use general health knowledge and this profile’s records when AI is enabled.': 'AI இயக்கப்பட்டால் உதவியாளர் பொது சுகாதார அறிவையும் இந்த விவரப் பதிவுகளையும் பயன்படுத்தலாம்.'
    },
    kn: {
        'Dashboard': 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
        'Documents': 'ದಾಖಲೆಗಳು',
        'Trends': 'ಪ್ರವೃತ್ತಿಗಳು',
        'Health Agent': 'ಆರೋಗ್ಯ ಸಹಾಯಕ',
        'Health Profile': 'ಆರೋಗ್ಯ ಪ್ರೊಫೈಲ್',
        'Reminders': 'ಜ್ಞಾಪನೆಗಳು',
        'Family Profiles': 'ಕುಟುಂಬ ಪ್ರೊಫೈಲ್‌ಗಳು',
        'Doctor Visit Prep': 'ವೈದ್ಯರ ಭೇಟಿಗೆ ಸಿದ್ಧತೆ',
        'Settings': 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
        'YOUR HEALTH': 'ನಿಮ್ಮ ಆರೋಗ್ಯ',
        'MANAGE': 'ನಿರ್ವಹಣೆ',
        'Encrypted health data': 'ಎನ್‌ಕ್ರಿಪ್ಟ್ ಮಾಡಿದ ಆರೋಗ್ಯ ಮಾಹಿತಿ',
        'Stored in your private account.': 'ನಿಮ್ಮ ಖಾಸಗಿ ಖಾತೆಯಲ್ಲಿ ಸಂಗ್ರಹಿಸಲಾಗಿದೆ.',
        'Health workspace': 'ಆರೋಗ್ಯ ಕಾರ್ಯಕ್ಷೇತ್ರ',
        'Secure account': 'ಸುರಕ್ಷಿತ ಖಾತೆ',
        'Sign out': 'ಸೈನ್ ಔಟ್',
        'Read page': 'ಪುಟ ಓದಿ',
        'Your personal health workspace': 'ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಆರೋಗ್ಯ ಕಾರ್ಯಕ್ಷೇತ್ರ',
        'Summary language': 'ಸಾರಾಂಶದ ಭಾಷೆ',
        'AI health agent': 'AI ಆರೋಗ್ಯ ಸಹಾಯಕ',
        'Suggested questions': 'ಸೂಚಿತ ಪ್ರಶ್ನೆಗಳು',
        'Clear chat': 'ಚಾಟ್ ತೆರವುಗೊಳಿಸಿ',
        'Voice input': 'ಧ್ವನಿ ಇನ್‌ಪುಟ್',
        'Ask': 'ಕೇಳಿ',
        'Speak reply': 'ಉತ್ತರ ಕೇಳಿ',
        'Read this page aloud': 'ಈ ಪುಟವನ್ನು ಓದಿ',
        'Stop speaking': 'ಓದುವುದನ್ನು ನಿಲ್ಲಿಸಿ',
        'Chat with HealthCopilot': 'HealthCopilot ಜೊತೆ ಮಾತನಾಡಿ',
        'Language preference saved.': 'ಭಾಷೆಯ ಆಯ್ಕೆ ಉಳಿಸಲಾಗಿದೆ.',
        'Your language preference applies to summaries, Health Agent replies, voice input, and read-aloud.': 'ನಿಮ್ಮ ಭಾಷೆಯ ಆಯ್ಕೆ ಸಾರಾಂಶ, ಉತ್ತರ, ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಮತ್ತು ಓದುವುದಕ್ಕೆ ಅನ್ವಯಿಸುತ್ತದೆ.',
        'Enable AI to ask general health questions and questions about this profile.': 'ಸಾಮಾನ್ಯ ಆರೋಗ್ಯ ಪ್ರಶ್ನೆಗಳಿಗೆ ಮತ್ತು ಈ ಪ್ರೊಫೈಲ್ ಕುರಿತು ಕೇಳಲು AI ಸಕ್ರಿಯಗೊಳಿಸಿ.',
        'Allow this profile’s relevant health facts and your question to be sent to the configured AI provider.': 'ಈ ಪ್ರೊಫೈಲ್‌ನ ಸಂಬಂಧಿತ ಆರೋಗ್ಯ ಮಾಹಿತಿ ಮತ್ತು ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು AI ಸೇವೆಗೆ ಕಳುಹಿಸಲು ಅನುಮತಿಸಿ.',
        'Medical information only. Not a doctor or emergency service.': 'ಆರೋಗ್ಯ ಮಾಹಿತಿ ಮಾತ್ರ. ವೈದ್ಯರಲ್ಲ ಅಥವಾ ತುರ್ತು ಸೇವೆಯಲ್ಲ.',
        'Ask about records or general health information…': 'ದಾಖಲೆಗಳು ಅಥವಾ ಸಾಮಾನ್ಯ ಆರೋಗ್ಯ ಮಾಹಿತಿ ಬಗ್ಗೆ ಕೇಳಿ…',
        'Your assistant can use general health knowledge and this profile’s records when AI is enabled.': 'AI ಸಕ್ರಿಯವಾಗಿದ್ದಾಗ ಸಹಾಯಕ ಸಾಮಾನ್ಯ ಆರೋಗ್ಯ ಜ್ಞಾನ ಮತ್ತು ಈ ಪ್ರೊಫೈಲ್ ದಾಖಲೆಗಳನ್ನು ಬಳಸಬಹುದು.'
    },
    ml: {
        'Dashboard': 'ഡാഷ്ബോർഡ്',
        'Documents': 'രേഖകൾ',
        'Trends': 'ട്രെൻഡുകൾ',
        'Health Agent': 'ആരോഗ്യ സഹായി',
        'Health Profile': 'ആരോഗ്യ പ്രൊഫൈൽ',
        'Reminders': 'ഓർമ്മപ്പെടുത്തലുകൾ',
        'Family Profiles': 'കുടുംബ പ്രൊഫൈലുകൾ',
        'Doctor Visit Prep': 'ഡോക്ടർ സന്ദർശനത്തിനുള്ള തയ്യാറെടുപ്പ്',
        'Settings': 'ക്രമീകരണങ്ങൾ',
        'YOUR HEALTH': 'നിങ്ങളുടെ ആരോഗ്യം',
        'MANAGE': 'നിർവഹണം',
        'Encrypted health data': 'എൻക്രിപ്റ്റ് ചെയ്ത ആരോഗ്യ ഡാറ്റ',
        'Stored in your private account.': 'നിങ്ങളുടെ സ്വകാര്യ അക്കൗണ്ടിൽ സൂക്ഷിച്ചിരിക്കുന്നു.',
        'Health workspace': 'ആരോഗ്യ പ്രവർത്തനമേഖല',
        'Secure account': 'സുരക്ഷിത അക്കൗണ്ട്',
        'Sign out': 'സൈൻ ഔട്ട്',
        'Read page': 'പേജ് വായിക്കുക',
        'Your personal health workspace': 'നിങ്ങളുടെ വ്യക്തിഗത ആരോഗ്യ പ്രവർത്തനമേഖല',
        'Summary language': 'സംഗ്രഹ ഭാഷ',
        'AI health agent': 'AI ആരോഗ്യ സഹായി',
        'Suggested questions': 'നിർദ്ദേശിച്ച ചോദ്യങ്ങൾ',
        'Clear chat': 'ചാറ്റ് മായ്ക്കുക',
        'Voice input': 'ശബ്ദ ഇൻപുട്ട്',
        'Ask': 'ചോദിക്കുക',
        'Speak reply': 'മറുപടി കേൾക്കുക',
        'Read this page aloud': 'ഈ പേജ് വായിക്കുക',
        'Stop speaking': 'വായന നിർത്തുക',
        'Chat with HealthCopilot': 'HealthCopilot-നോട് സംസാരിക്കുക',
        'Language preference saved.': 'ഭാഷാ മുൻഗണന സംരക്ഷിച്ചു.',
        'Your language preference applies to summaries, Health Agent replies, voice input, and read-aloud.': 'നിങ്ങളുടെ ഭാഷാ മുൻഗണന സംഗ്രഹങ്ങൾക്കും മറുപടികൾക്കും ശബ്ദ ഇൻപുട്ടിനും വായനയ്ക്കും ബാധകമാണ്.',
        'Enable AI to ask general health questions and questions about this profile.': 'പൊതു ആരോഗ്യ ചോദ്യങ്ങളും ഈ പ്രൊഫൈലിനെക്കുറിച്ചുള്ള ചോദ്യങ്ങളും ചോദിക്കാൻ AI പ്രവർത്തനക്ഷമമാക്കുക.',
        'Allow this profile’s relevant health facts and your question to be sent to the configured AI provider.': 'ഈ പ്രൊഫൈലിലെ ബന്ധപ്പെട്ട ആരോഗ്യ വിവരങ്ങളും നിങ്ങളുടെ ചോദ്യവും AI സേവനത്തിലേക്ക് അയയ്ക്കാൻ അനുവദിക്കുക.',
        'Medical information only. Not a doctor or emergency service.': 'ആരോഗ്യ വിവരം മാത്രം. ഡോക്ടറോ അടിയന്തര സേവനമോ അല്ല.',
        'Ask about records or general health information…': 'രേഖകളെയോ പൊതുവായ ആരോഗ്യ വിവരങ്ങളെയോ കുറിച്ച് ചോദിക്കുക…',
        'Your assistant can use general health knowledge and this profile’s records when AI is enabled.': 'AI പ്രവർത്തനക്ഷമമായാൽ സഹായി പൊതുവായ ആരോഗ്യ അറിവും ഈ പ്രൊഫൈലിലെ രേഖകളും ഉപയോഗിക്കും.'
    },
};

const extraLabels = {
    hi: { 'Your health, all in one place.': 'आपका स्वास्थ्य, सब एक जगह।', 'Upload a record to turn it into a clear, easy-to-understand summary.': 'रिकॉर्ड अपलोड करें और उसका आसान सारांश पाएँ।', 'Add a health record': 'स्वास्थ्य रिकॉर्ड जोड़ें', 'Health records': 'स्वास्थ्य रिकॉर्ड', 'Current medicines': 'वर्तमान दवाएँ', 'Lab values': 'लैब परिणाम', 'Needs a closer look': 'ध्यान से देखें', 'Recent health activity': 'हाल की स्वास्थ्य गतिविधि', 'Latest lab results': 'नवीनतम लैब परिणाम', 'Health trends': 'स्वास्थ्य रुझान', 'No records yet. Upload a medical document.': 'अभी कोई रिकॉर्ड नहीं। चिकित्सा दस्तावेज़ अपलोड करें।', 'Documents and reports': 'दस्तावेज़ और रिपोर्ट', 'Upload a document': 'दस्तावेज़ अपलोड करें', 'Add manually': 'मैन्युअल रूप से जोड़ें', 'Search your records': 'अपने रिकॉर्ड खोजें', 'No reminders set. Add one for a prescribed medicine.': 'कोई रिमाइंडर नहीं। निर्धारित दवा के लिए जोड़ें।', 'Questions to ask your clinician': 'अपने चिकित्सक से पूछने के प्रश्न', 'Prepare for your visit': 'अपनी मुलाक़ात की तैयारी करें', 'Open Settings': 'सेटिंग्स खोलें', 'Stop': 'रोकें' },
    te: { 'Your health, all in one place.': 'మీ ఆరోగ్యం, అన్నీ ఒకేచోట.', 'Upload a record to turn it into a clear, easy-to-understand summary.': 'రికార్డును అప్‌లోడ్ చేసి సులభమైన సారాంశాన్ని పొందండి.', 'Add a health record': 'ఆరోగ్య రికార్డును జోడించండి', 'Health records': 'ఆరోగ్య రికార్డులు', 'Current medicines': 'ప్రస్తుత మందులు', 'Lab values': 'ల్యాబ్ విలువలు', 'Needs a closer look': 'మరింత పరిశీలించాలి', 'Recent health activity': 'ఇటీవలి ఆరోగ్య కార్యకలాపాలు', 'Latest lab results': 'తాజా ల్యాబ్ ఫలితాలు', 'Health trends': 'ఆరోగ్య ట్రెండ్స్', 'No records yet. Upload a medical document.': 'ఇంకా రికార్డులు లేవు. వైద్య పత్రాన్ని అప్‌లోడ్ చేయండి.', 'Documents and reports': 'పత్రాలు మరియు నివేదికలు', 'Upload a document': 'పత్రాన్ని అప్‌లోడ్ చేయండి', 'Add manually': 'మాన్యువల్‌గా జోడించండి', 'Search your records': 'మీ రికార్డులను వెతకండి', 'No reminders set. Add one for a prescribed medicine.': 'రిమైండర్లు లేవు. సూచించిన మందుకు ఒకటి జోడించండి.', 'Questions to ask your clinician': 'వైద్యుడిని అడగాల్సిన ప్రశ్నలు', 'Prepare for your visit': 'మీ సందర్శనకు సిద్ధం అవ్వండి', 'Open Settings': 'సెట్టింగ్‌లను తెరవండి', 'Stop': 'ఆపండి' },
    ta: { 'Your health, all in one place.': 'உங்கள் சுகாதாரம், அனைத்தும் ஒரே இடத்தில்.', 'Upload a record to turn it into a clear, easy-to-understand summary.': 'பதிவைப் பதிவேற்றி எளிய சுருக்கத்தைப் பெறுங்கள்.', 'Add a health record': 'சுகாதாரப் பதிவைச் சேர்க்கவும்', 'Health records': 'சுகாதாரப் பதிவுகள்', 'Current medicines': 'தற்போதைய மருந்துகள்', 'Lab values': 'ஆய்வக மதிப்புகள்', 'Needs a closer look': 'மேலும் கவனிக்க வேண்டும்', 'Recent health activity': 'சமீபத்திய சுகாதார செயல்பாடு', 'Latest lab results': 'சமீபத்திய ஆய்வக முடிவுகள்', 'Health trends': 'சுகாதாரப் போக்குகள்', 'No records yet. Upload a medical document.': 'இன்னும் பதிவுகள் இல்லை. மருத்துவ ஆவணத்தைப் பதிவேற்றவும்.', 'Documents and reports': 'ஆவணங்கள் மற்றும் அறிக்கைகள்', 'Upload a document': 'ஆவணத்தைப் பதிவேற்றவும்', 'Add manually': 'கைமுறையாகச் சேர்க்கவும்', 'Search your records': 'உங்கள் பதிவுகளைத் தேடுங்கள்', 'No reminders set. Add one for a prescribed medicine.': 'நினைவூட்டல்கள் இல்லை. பரிந்துரைக்கப்பட்ட மருந்துக்கு ஒன்றைச் சேர்க்கவும்.', 'Questions to ask your clinician': 'மருத்துவரிடம் கேட்க வேண்டிய கேள்விகள்', 'Prepare for your visit': 'சந்திப்புக்குத் தயாராகுங்கள்', 'Open Settings': 'அமைப்புகளைத் திறக்கவும்', 'Stop': 'நிறுத்து' },
    kn: { 'Your health, all in one place.': 'ನಿಮ್ಮ ಆರೋಗ್ಯ, ಎಲ್ಲವೂ ಒಂದೇ ಸ್ಥಳದಲ್ಲಿ.', 'Upload a record to turn it into a clear, easy-to-understand summary.': 'ದಾಖಲೆಯನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಸರಳ ಸಾರಾಂಶ ಪಡೆಯಿರಿ.', 'Add a health record': 'ಆರೋಗ್ಯ ದಾಖಲೆಯನ್ನು ಸೇರಿಸಿ', 'Health records': 'ಆರೋಗ್ಯ ದಾಖಲೆಗಳು', 'Current medicines': 'ಪ್ರಸ್ತುತ ಔಷಧಿಗಳು', 'Lab values': 'ಲ್ಯಾಬ್ ಮೌಲ್ಯಗಳು', 'Needs a closer look': 'ಹೆಚ್ಚು ಗಮನಿಸಿ', 'Recent health activity': 'ಇತ್ತೀಚಿನ ಆರೋಗ್ಯ ಚಟುವಟಿಕೆ', 'Latest lab results': 'ಇತ್ತೀಚಿನ ಲ್ಯಾಬ್ ಫಲಿತಾಂಶಗಳು', 'Health trends': 'ಆರೋಗ್ಯದ ಪ್ರವೃತ್ತಿಗಳು', 'No records yet. Upload a medical document.': 'ಇನ್ನೂ ದಾಖಲೆಗಳಿಲ್ಲ. ವೈದ್ಯಕೀಯ ದಾಖಲೆಯನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.', 'Documents and reports': 'ದಾಖಲೆಗಳು ಮತ್ತು ವರದಿಗಳು', 'Upload a document': 'ದಾಖಲೆಯನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ', 'Add manually': 'ಕೈಯಾರೆ ಸೇರಿಸಿ', 'Search your records': 'ನಿಮ್ಮ ದಾಖಲೆಗಳನ್ನು ಹುಡುಕಿ', 'No reminders set. Add one for a prescribed medicine.': 'ಜ್ಞಾಪನೆಗಳಿಲ್ಲ. ಸೂಚಿಸಿದ ಔಷಧಿಗೆ ಒಂದನ್ನು ಸೇರಿಸಿ.', 'Questions to ask your clinician': 'ವೈದ್ಯರನ್ನು ಕೇಳಬೇಕಾದ ಪ್ರಶ್ನೆಗಳು', 'Prepare for your visit': 'ಭೇಟಿಗೆ ಸಿದ್ಧರಾಗಿ', 'Open Settings': 'ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ತೆರೆಯಿರಿ', 'Stop': 'ನಿಲ್ಲಿಸಿ' },
    ml: { 'Your health, all in one place.': 'നിങ്ങളുടെ ആരോഗ്യം, എല്ലാം ഒരിടത്ത്.', 'Upload a record to turn it into a clear, easy-to-understand summary.': 'രേഖ അപ്‌ലോഡ് ചെയ്ത് ലളിതമായ സംഗ്രഹം നേടുക.', 'Add a health record': 'ആരോഗ്യ രേഖ ചേർക്കുക', 'Health records': 'ആരോഗ്യ രേഖകൾ', 'Current medicines': 'നിലവിലെ മരുന്നുകൾ', 'Lab values': 'ലാബ് മൂല്യങ്ങൾ', 'Needs a closer look': 'കൂടുതൽ ശ്രദ്ധിക്കുക', 'Recent health activity': 'സമീപകാല ആരോഗ്യ പ്രവർത്തനം', 'Latest lab results': 'ഏറ്റവും പുതിയ ലാബ് ഫലങ്ങൾ', 'Health trends': 'ആരോഗ്യ പ്രവണതകൾ', 'No records yet. Upload a medical document.': 'ഇതുവരെ രേഖകളില്ല. ഒരു മെഡിക്കൽ രേഖ അപ്‌ലോഡ് ചെയ്യുക.', 'Documents and reports': 'രേഖകളും റിപ്പോർട്ടുകളും', 'Upload a document': 'രേഖ അപ്‌ലോഡ് ചെയ്യുക', 'Add manually': 'കൈയോടെ ചേർക്കുക', 'Search your records': 'നിങ്ങളുടെ രേഖകൾ തിരയുക', 'No reminders set. Add one for a prescribed medicine.': 'ഓർമ്മപ്പെടുത്തലുകളില്ല. നിർദ്ദേശിച്ച മരുന്നിനായി ഒന്ന് ചേർക്കുക.', 'Questions to ask your clinician': 'ഡോക്ടറോട് ചോദിക്കേണ്ട ചോദ്യങ്ങൾ', 'Prepare for your visit': 'സന്ദർശനത്തിന് തയ്യാറാകുക', 'Open Settings': 'ക്രമീകരണങ്ങൾ തുറക്കുക', 'Stop': 'നിർത്തുക' }
};

const maternalCareTranslations = {
    'Maternal Care': { hi: 'मातृ देखभाल', te: 'మాతృ సంరక్షణ', ta: 'மகப்பேறு பராமரிப்பு', kn: 'ತಾಯಂದಿರ ಆರೈಕೆ', ml: 'മാതൃ പരിചരണം' },
    'Maternal care': { hi: 'मातृ देखभाल', te: 'మాతృ సంరక్షణ', ta: 'மகப்பேறு பராமரிப்பு', kn: 'ತಾಯಂದಿರ ಆರೈಕೆ', ml: 'മാതൃ പരിചരണം' },
    'Optional pregnancy timeline, appointment notes, and trusted care links.': { hi: 'वैकल्पिक गर्भावस्था समयरेखा, मुलाक़ात नोट्स और भरोसेमंद देखभाल लिंक।', te: 'ఐచ్ఛిక గర్భధారణ కాలక్రమం, అపాయింట్‌మెంట్ గమనికలు, నమ్మకమైన సంరక్షణ లింకులు.', ta: 'விருப்ப கர்ப்பகால காலவரிசை, சந்திப்பு குறிப்புகள், நம்பகமான பராமரிப்பு இணைப்புகள்.', kn: 'ಐಚ್ಛಿಕ ಗರ್ಭಾವಸ್ಥೆ ಕಾಲರೇಖೆ, ಭೇಟಿಯ ಟಿಪ್ಪಣಿಗಳು ಮತ್ತು ನಂಬಲರ್ಹ ಆರೈಕೆ ಲಿಂಕ್‌ಗಳು.', ml: 'ഐച്ഛിക ഗർഭകാല സമയരേഖ, സന്ദർശന കുറിപ്പുകൾ, വിശ്വസനീയ പരിചരണ ലിങ്കുകൾ.' },
    'Optional care organizer. Pregnancy timing is an estimate, not a medical assessment. Confirm dates and care plans with your clinician.': { hi: 'वैकल्पिक देखभाल आयोजक। गर्भावस्था का समय अनुमान है, चिकित्सकीय आकलन नहीं। तारीखें और योजना अपने चिकित्सक से पुष्टि करें।', te: 'ఐచ్ఛిక సంరక్షణ నిర్వాహకం. గర్భధారణ సమయం అంచనా మాత్రమే, వైద్య నిర్ధారణ కాదు. తేదీలు, సంరక్షణ ప్రణాళికను వైద్యుడితో నిర్ధారించండి.', ta: 'விருப்ப பராமரிப்பு திட்டம். கர்ப்பகாலம் ஒரு கணிப்பு மட்டுமே, மருத்துவ மதிப்பீடு அல்ல. தேதிகளையும் திட்டத்தையும் மருத்துவரிடம் உறுதிப்படுத்துங்கள்.', kn: 'ಐಚ್ಛಿಕ ಆರೈಕೆ ವ್ಯವಸ್ಥೆ. ಗರ್ಭಾವಸ್ಥೆಯ ಸಮಯ ಅಂದಾಜು ಮಾತ್ರ, ವೈದ್ಯಕೀಯ ಮೌಲ್ಯಮಾಪನವಲ್ಲ. ದಿನಾಂಕ ಮತ್ತು ಯೋಜನೆಯನ್ನು ವೈದ್ಯರೊಂದಿಗೆ ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.', ml: 'ഐച്ഛിക പരിചരണ ക്രമീകരണം. ഗർഭകാലം ഒരു ഏകദേശ കണക്കാണ്, വൈദ്യപരിശോധനയല്ല. തീയതികളും പരിചരണ പദ്ധതിയും ഡോക്ടറുമായി ഉറപ്പാക്കുക.' },
    'Pregnancy timeline': { hi: 'गर्भावस्था समयरेखा', te: 'గర్భధారణ కాలక్రమం', ta: 'கர்ப்பகால காலவரிசை', kn: 'ಗರ್ಭಾವಸ್ಥೆ ಕಾಲರೇಖೆ', ml: 'ഗർഭകാല സമയരേഖ' },
    'Only dates you enter are stored in this encrypted profile.': { hi: 'केवल आपके दर्ज किए गए दिनांक इस एन्क्रिप्टेड प्रोफ़ाइल में सहेजे जाते हैं।', te: 'మీరు నమోదు చేసిన తేదీలు మాత్రమే ఈ ఎన్‌క్రిప్ట్ చేసిన ప్రొఫైల్‌లో భద్రపరచబడతాయి.', ta: 'நீங்கள் உள்ளிடும் தேதிகள் மட்டுமே இந்த மறைகுறியாக்கப்பட்ட விவரத்தில் சேமிக்கப்படும்.', kn: 'ನೀವು ನಮೂದಿಸಿದ ದಿನಾಂಕಗಳು ಮಾತ್ರ ಈ ಎನ್‌ಕ್ರಿಪ್ಟ್ ಮಾಡಿದ ಪ್ರೊಫೈಲ್‌ನಲ್ಲಿ ಉಳಿಯುತ್ತವೆ.', ml: 'നിങ്ങൾ നൽകുന്ന തീയതികൾ മാത്രമാണ് ഈ എൻക്രിപ്റ്റ് ചെയ്ത പ്രൊഫൈലിൽ സൂക്ഷിക്കുന്നത്.' },
    'Set up dates': { hi: 'तारीखें दर्ज करें', te: 'తేదీలను నమోదు చేయండి', ta: 'தேதிகளை அமைக்கவும்', kn: 'ದಿನಾಂಕಗಳನ್ನು ಹೊಂದಿಸಿ', ml: 'തീയതികൾ നൽകുക' },
    'Edit dates': { hi: 'तारीखें बदलें', te: 'తేదీలను సవరించండి', ta: 'தேதிகளைத் திருத்தவும்', kn: 'ದಿನಾಂಕಗಳನ್ನು ತಿದ್ದುಪಡಿ ಮಾಡಿ', ml: 'തീയതികൾ തിരുത്തുക' },
    'Add a last menstrual period date or an estimated due date to see a calendar estimate.': { hi: 'समयरेखा का अनुमान देखने के लिए अंतिम माहवारी की तारीख या अनुमानित प्रसव तारीख दर्ज करें।', te: 'కాలక్రమ అంచనా కోసం చివరి నెలసరి తేదీ లేదా అంచనా ప్రసవ తేదీ నమోదు చేయండి.', ta: 'காலவரிசை கணிப்பைக் காண கடைசி மாதவிடாய் தேதி அல்லது எதிர்பார்க்கப்படும் பிரசவ தேதியை உள்ளிடுங்கள்.', kn: 'ಕಾಲರೇಖೆಯ ಅಂದಾಜಿಗಾಗಿ ಕೊನೆಯ ಮಾಸಿಕ ದಿನಾಂಕ ಅಥವಾ ಅಂದಾಜು ಹೆರಿಗೆ ದಿನಾಂಕ ನಮೂದಿಸಿ.', ml: 'സമയരേഖ കണക്കാക്കാൻ അവസാന ആർത്തവ തീയതിയോ പ്രതീക്ഷിക്കുന്ന പ്രസവ തീയതിയോ നൽകുക.' },
    'Estimated pregnancy week': { hi: 'अनुमानित गर्भावस्था सप्ताह', te: 'అంచనా గర్భధారణ వారం', ta: 'கர்ப்பகால வாரக் கணிப்பு', kn: 'ಅಂದಾಜು ಗರ್ಭಾವಸ್ಥೆ ವಾರ', ml: 'ഏകദേശ ഗർഭകാല ആഴ്ച' },
    'Estimated due date': { hi: 'अनुमानित प्रसव तारीख', te: 'అంచనా ప్రసవ తేదీ', ta: 'எதிர்பார்க்கப்படும் பிரசவ தேதி', kn: 'ಅಂದಾಜು ಹೆರಿಗೆ ದಿನಾಂಕ', ml: 'പ്രതീക്ഷിക്കുന്ന പ്രസവ തീയതി' },
    'Trimester estimate': { hi: 'अनुमानित त्रैमासिक', te: 'అంచనా త్రైమాసికం', ta: 'மூன்று மாதக் காலக் கணிப்பு', kn: 'ಅಂದಾಜು ತ್ರೈಮಾಸಿಕ', ml: 'ഏകദേശ ത്രൈമാസം' },
    'Calculated from the entered dates': { hi: 'दर्ज तारीखों के आधार पर गणना', te: 'నమోదు చేసిన తేదీల ఆధారంగా లెక్కింపు', ta: 'உள்ளிட்ட தேதிகளின் அடிப்படையிலான கணிப்பு', kn: 'ನಮೂದಿಸಿದ ದಿನಾಂಕಗಳ ಆಧಾರದ ಲೆಕ್ಕಾಚಾರ', ml: 'നൽകിയ തീയതികളെ അടിസ്ഥാനമാക്കിയ കണക്കുകൂട്ടൽ' },
    'Confirm with your clinician': { hi: 'चिकित्सक से पुष्टि करें', te: 'వైద్యుడితో నిర్ధారించండి', ta: 'மருத்துவரிடம் உறுதிப்படுத்துங்கள்', kn: 'ವೈದ್ಯರೊಂದಿಗೆ ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ', ml: 'ഡോക്ടറുമായി ഉറപ്പാക്കുക' },
    'Appointments': { hi: 'मुलाक़ातें', te: 'అపాయింట్‌మెంట్‌లు', ta: 'சந்திப்புகள்', kn: 'ಭೇಟಿಗಳು', ml: 'സന്ദർശനങ്ങൾ' },
    'Record checkups and scans advised by your care team.': { hi: 'अपनी देखभाल टीम द्वारा बताई गई जाँच और स्कैन दर्ज करें।', te: 'మీ సంరక్షణ బృందం సూచించిన పరీక్షలు, స్కాన్‌లను నమోదు చేయండి.', ta: 'உங்கள் பராமரிப்பு குழு பரிந்துரைத்த பரிசோதனைகள் மற்றும் ஸ்கேன்களைப் பதிவு செய்யுங்கள்.', kn: 'ನಿಮ್ಮ ಆರೈಕೆ ತಂಡ ಸೂಚಿಸಿದ ತಪಾಸಣೆ ಮತ್ತು ಸ್ಕ್ಯಾನ್‌ಗಳನ್ನು ದಾಖಲಿಸಿ.', ml: 'പരിചരണ സംഘം നിർദ്ദേശിച്ച പരിശോധനകളും സ്കാനുകളും രേഖപ്പെടുത്തുക.' },
    'Add appointment': { hi: 'मुलाक़ात जोड़ें', te: 'అపాయింట్‌మెంట్ జోడించండి', ta: 'சந்திப்பைச் சேர்க்கவும்', kn: 'ಭೇಟಿ ಸೇರಿಸಿ', ml: 'സന്ദർശനം ചേർക്കുക' },
    'No appointments recorded. Add the date and details provided by your maternity care team.': { hi: 'कोई मुलाक़ात दर्ज नहीं है। अपनी मातृत्व देखभाल टीम द्वारा दी गई तारीख और जानकारी जोड़ें।', te: 'అపాయింట్‌మెంట్‌లు నమోదు కాలేదు. మీ ప్రసూతి సంరక్షణ బృందం ఇచ్చిన తేదీ, వివరాలు జోడించండి.', ta: 'சந்திப்புகள் எதுவும் இல்லை. மகப்பேறு பராமரிப்பு குழு வழங்கிய தேதி மற்றும் விவரங்களைச் சேர்க்கவும்.', kn: 'ಯಾವುದೇ ಭೇಟಿಗಳು ದಾಖಲಾಗಿಲ್ಲ. ತಾಯಂದಿರ ಆರೈಕೆ ತಂಡ ನೀಡಿದ ದಿನಾಂಕ ಮತ್ತು ವಿವರಗಳನ್ನು ಸೇರಿಸಿ.', ml: 'സന്ദർശനങ്ങൾ രേഖപ്പെടുത്തിയിട്ടില്ല. പരിചരണ സംഘം നൽകിയ തീയതിയും വിവരങ്ങളും ചേർക്കുക.' },
    'Next appointment': { hi: 'अगली मुलाक़ात', te: 'తదుపరి అపాయింట్‌మెంట్', ta: 'அடுத்த சந்திப்பு', kn: 'ಮುಂದಿನ ಭೇಟಿ', ml: 'അടുത്ത സന്ദർശനം' },
    'Prepare questions for a visit': { hi: 'मुलाक़ात के प्रश्न तैयार करें', te: 'సందర్శన కోసం ప్రశ్నలు సిద్ధం చేయండి', ta: 'சந்திப்பிற்கான கேள்விகளைத் தயாரிக்கவும்', kn: 'ಭೇಟಿಗಾಗಿ ಪ್ರಶ್ನೆಗಳನ್ನು ಸಿದ್ಧಪಡಿಸಿ', ml: 'സന്ദർശനത്തിനുള്ള ചോദ്യങ്ങൾ തയ്യാറാക്കുക' },
    'Emergency help': { hi: 'आपातकालीन सहायता', te: 'అత్యవసర సహాయం', ta: 'அவசர உதவி', kn: 'ತುರ್ತು ಸಹಾಯ', ml: 'അടിയന്തര സഹായം' },
    'For an immediate emergency in India, call the national emergency number.': { hi: 'भारत में तत्काल आपात स्थिति में राष्ट्रीय आपातकालीन नंबर पर कॉल करें।', te: 'భారతదేశంలో తక్షణ అత్యవసర పరిస్థితిలో జాతీయ అత్యవసర నంబర్‌కు కాల్ చేయండి.', ta: 'இந்தியாவில் உடனடி அவசரநிலைக்கு தேசிய அவசர எண்ணை அழைக்கவும்.', kn: 'ಭಾರತದಲ್ಲಿ ತಕ್ಷಣದ ತುರ್ತು ಪರಿಸ್ಥಿತಿಗೆ ರಾಷ್ಟ್ರೀಯ ತುರ್ತು ಸಂಖ್ಯೆಗೆ ಕರೆ ಮಾಡಿ.', ml: 'ഇന്ത്യയിൽ അടിയന്തരാവസ്ഥയിൽ ദേശീയ അടിയന്തര നമ്പറിൽ വിളിക്കുക.' },
    'Call 112': { hi: '112 पर कॉल करें', te: '112కు కాల్ చేయండి', ta: '112-ஐ அழைக்கவும்', kn: '112ಕ್ಕೆ ಕರೆ ಮಾಡಿ', ml: '112-ൽ വിളിക്കുക' },
    'Nearby maternity care': { hi: 'पास की मातृत्व देखभाल', te: 'సమీప ప్రసూతి సంరక్షణ', ta: 'அருகிலுள்ள மகப்பேறு பராமரிப்பு', kn: 'ಹತ್ತಿರದ ತಾಯಂದಿರ ಆರೈಕೆ', ml: 'സമീപത്തെ മാതൃപരിചരണം' },
    'Open a map search. Your browser or Maps may request your location.': { hi: 'मानचित्र खोज खोलें। ब्राउज़र या Maps आपका स्थान पूछ सकता है।', te: 'మ్యాప్ శోధనను తెరవండి. బ్రౌజర్ లేదా Maps మీ స్థానాన్ని అడగవచ్చు.', ta: 'வரைபடத் தேடலைத் திறக்கவும். உங்கள் உலாவி அல்லது Maps உங்கள் இருப்பிடத்தைக் கேட்கலாம்.', kn: 'ನಕ್ಷೆ ಹುಡುಕಾಟ ತೆರೆಯಿರಿ. ನಿಮ್ಮ ಬ್ರೌಸರ್ ಅಥವಾ Maps ನಿಮ್ಮ ಸ್ಥಳವನ್ನು ಕೇಳಬಹುದು.', ml: 'മാപ്പ് തിരയൽ തുറക്കുക. ബ്രൗസറോ Maps-ഓ നിങ്ങളുടെ സ്ഥലം ചോദിച്ചേക്കാം.' },
    'Find nearby hospitals': { hi: 'पास के अस्पताल खोजें', te: 'సమీప ఆసుపత్రులను కనుగొనండి', ta: 'அருகிலுள்ள மருத்துவமனைகளைக் கண்டறியவும்', kn: 'ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆಗಳನ್ನು ಹುಡುಕಿ', ml: 'സമീപത്തെ ആശുപത്രികൾ കണ്ടെത്തുക' },
    'Trusted care resources': { hi: 'भरोसेमंद देखभाल संसाधन', te: 'నమ్మకమైన సంరక్షణ వనరులు', ta: 'நம்பகமான பராமரிப்பு வளங்கள்', kn: 'ನಂಬಲರ್ಹ ಆರೈಕೆ ಸಂಪನ್ಮೂಲಗಳು', ml: 'വിശ്വസനീയ പരിചരണ വിഭവങ്ങൾ' },
    'This link starts a phone call. Use emergency services for urgent danger.': { hi: 'यह लिंक फ़ोन कॉल शुरू करता है। तत्काल खतरे में आपातकालीन सेवाओं का उपयोग करें।', te: 'ఈ లింక్ ఫోన్ కాల్ ప్రారంభిస్తుంది. తక్షణ ప్రమాదంలో అత్యవసర సేవలను సంప్రదించండి.', ta: 'இந்த இணைப்பு தொலைபேசி அழைப்பைத் தொடங்கும். உடனடி ஆபத்தில் அவசர சேவைகளைப் பயன்படுத்துங்கள்.', kn: 'ಈ ಲಿಂಕ್ ಫೋನ್ ಕರೆ ಪ್ರಾರಂಭಿಸುತ್ತದೆ. ತಕ್ಷಣದ ಅಪಾಯದಲ್ಲಿ ತುರ್ತು ಸೇವೆಗಳನ್ನು ಸಂಪರ್ಕಿಸಿ.', ml: 'ഈ ലിങ്ക് ഫോൺ കോൾ ആരംഭിക്കും. അടിയന്തര അപകടത്തിൽ അടിയന്തര സേവനങ്ങളെ ബന്ധപ്പെടുക.' },
    'National Health Mission': { hi: 'राष्ट्रीय स्वास्थ्य मिशन', te: 'జాతీయ ఆరోగ్య మిషన్', ta: 'தேசிய சுகாதார இயக்கம்', kn: 'ರಾಷ್ಟ್ರೀಯ ಆರೋಗ್ಯ ಮಿಷನ್', ml: 'ദേശീയ ആരോഗ്യ ദൗത്യം' },
    'India health programs and maternal care resources': { hi: 'भारत के स्वास्थ्य कार्यक्रम और मातृत्व देखभाल संसाधन', te: 'భారత ఆరోగ్య కార్యక్రమాలు మరియు మాతృ సంరక్షణ వనరులు', ta: 'இந்திய சுகாதாரத் திட்டங்கள் மற்றும் மகப்பேறு பராமரிப்பு வளங்கள்', kn: 'ಭಾರತದ ಆರೋಗ್ಯ ಕಾರ್ಯಕ್ರಮಗಳು ಮತ್ತು ತಾಯಂದಿರ ಆರೈಕೆ ಸಂಪನ್ಮೂಲಗಳು', ml: 'ഇന്ത്യയിലെ ആരോഗ്യ പദ്ധതികളും മാതൃപരിചരണ വിഭവങ്ങളും' },
    'WHO breastfeeding information': { hi: 'WHO स्तनपान जानकारी', te: 'WHO తల్లిపాల సమాచారం', ta: 'WHO தாய்ப்பால் தகவல்', kn: 'WHO ಸ್ತನ್ಯಪಾನ ಮಾಹಿತಿ', ml: 'WHO മുലയൂട്ടൽ വിവരങ്ങൾ' },
    'General information; ask your care team about your situation': { hi: 'सामान्य जानकारी; अपनी स्थिति के बारे में देखभाल टीम से पूछें', te: 'సాధారణ సమాచారం; మీ పరిస్థితి గురించి సంరక్షణ బృందాన్ని అడగండి', ta: 'பொதுத் தகவல்; உங்கள் நிலையைப் பற்றி பராமரிப்பு குழுவிடம் கேளுங்கள்', kn: 'ಸಾಮಾನ್ಯ ಮಾಹಿತಿ; ನಿಮ್ಮ ಪರಿಸ್ಥಿತಿಯ ಬಗ್ಗೆ ಆರೈಕೆ ತಂಡವನ್ನು ಕೇಳಿ', ml: 'പൊതുവിവരം; നിങ്ങളുടെ സാഹചര്യത്തെക്കുറിച്ച് പരിചരണ സംഘത്തോട് ചോദിക്കുക' },
    'WHO infant feeding information': { hi: 'WHO शिशु आहार जानकारी', te: 'WHO శిశు ఆహార సమాచారం', ta: 'WHO குழந்தை உணவு தகவல்', kn: 'WHO ಶಿಶು ಆಹಾರ ಮಾಹಿತಿ', ml: 'WHO ശിശു ആഹാര വിവരങ്ങൾ' },
    'General information; local clinical guidance may differ': { hi: 'सामान्य जानकारी; स्थानीय चिकित्सकीय सलाह अलग हो सकती है', te: 'సాధారణ సమాచారం; స్థానిక వైద్య సూచనలు భిన్నంగా ఉండవచ్చు', ta: 'பொதுத் தகவல்; உள்ளூர் மருத்துவ வழிகாட்டுதல் மாறுபடலாம்', kn: 'ಸಾಮಾನ್ಯ ಮಾಹಿತಿ; ಸ್ಥಳೀಯ ವೈದ್ಯಕೀಯ ಮಾರ್ಗದರ್ಶನ ಭಿನ್ನವಾಗಿರಬಹುದು', ml: 'പൊതുവിവരം; പ്രാദേശിക വൈദ്യോപദേശം വ്യത്യസ്തമായിരിക്കാം' },
    'First': { hi: 'पहला', te: 'మొదటి', ta: 'முதல்', kn: 'ಮೊದಲ', ml: 'ഒന്നാം' },
    'Second': { hi: 'दूसरा', te: 'రెండవ', ta: 'இரண்டாம்', kn: 'ಎರಡನೇ', ml: 'രണ്ടാം' },
    'Third': { hi: 'तीसरा', te: 'మూడవ', ta: 'மூன்றாம்', kn: 'ಮೂರನೇ', ml: 'മൂന്നാം' },
    'Pregnancy dates and care contacts': { hi: 'गर्भावस्था की तारीखें और देखभाल संपर्क', te: 'గర్భధారణ తేదీలు మరియు సంరక్షణ సంప్రదింపులు', ta: 'கர்ப்பகால தேதிகள் மற்றும் பராமரிப்பு தொடர்புகள்', kn: 'ಗರ್ಭಾವಸ್ಥೆ ದಿನಾಂಕಗಳು ಮತ್ತು ಆರೈಕೆ ಸಂಪರ್ಕಗಳು', ml: 'ഗർഭകാല തീയതികളും പരിചരണ ബന്ധപ്പെടലുകളും' },
    'Enter dates from your clinician or records. If both dates are entered, the due date you provide is shown.': { hi: 'अपने चिकित्सक या रिकॉर्ड से तारीखें दर्ज करें। दोनों तारीखें देने पर आपकी दर्ज की हुई प्रसव तारीख दिखाई जाएगी।', te: 'వైద్యుడు లేదా రికార్డులలోని తేదీలను నమోదు చేయండి. రెండు తేదీలు ఇస్తే మీరు ఇచ్చిన ప్రసవ తేదీ చూపబడుతుంది.', ta: 'மருத்துவர் அல்லது பதிவுகளில் உள்ள தேதிகளை உள்ளிடுங்கள். இரண்டையும் உள்ளிடினால் நீங்கள் வழங்கிய பிரசவ தேதி காட்டப்படும்.', kn: 'ವೈದ್ಯರು ಅಥವಾ ದಾಖಲೆಗಳ ದಿನಾಂಕಗಳನ್ನು ನಮೂದಿಸಿ. ಎರಡನ್ನೂ ನೀಡಿದರೆ ನೀವು ನಮೂದಿಸಿದ ಹೆರಿಗೆ ದಿನಾಂಕ ತೋರಿಸಲಾಗುತ್ತದೆ.', ml: 'ഡോക്ടറിലോ രേഖകളിലോ ഉള്ള തീയതികൾ നൽകുക. രണ്ടും നൽകിയാൽ നിങ്ങൾ നൽകിയ പ്രസവ തീയതി കാണിക്കും.' },
    'Last menstrual period (optional)': { hi: 'अंतिम माहवारी (वैकल्पिक)', te: 'చివరి నెలసరి (ఐచ్ఛికం)', ta: 'கடைசி மாதவிடாய் (விருப்பம்)', kn: 'ಕೊನೆಯ ಮಾಸಿಕ (ಐಚ್ಛಿಕ)', ml: 'അവസാന ആർത്തവം (ഐച്ഛികം)' },
    'Estimated due date (optional)': { hi: 'अनुमानित प्रसव तारीख (वैकल्पिक)', te: 'అంచనా ప్రసవ తేదీ (ఐచ్ఛికం)', ta: 'எதிர்பார்க்கப்படும் பிரசவ தேதி (விருப்பம்)', kn: 'ಅಂದಾಜು ಹೆರಿಗೆ ದಿನಾಂಕ (ಐಚ್ಛಿಕ)', ml: 'പ്രതീക്ഷിക്കുന്ന പ്രസവ തീയതി (ഐച്ഛികം)' },
    'Clinician or clinic (optional)': { hi: 'चिकित्सक या क्लिनिक (वैकल्पिक)', te: 'వైద్యుడు లేదా క్లినిక్ (ఐచ్ఛికం)', ta: 'மருத்துவர் அல்லது மருத்துவமனை (விருப்பம்)', kn: 'ವೈದ್ಯರು ಅಥವಾ ಕ್ಲಿನಿಕ್ (ಐಚ್ಛಿಕ)', ml: 'ഡോക്ടർ അല്ലെങ്കിൽ ക്ലിനിക് (ഐച്ഛികം)' },
    'Emergency contact phone (optional)': { hi: 'आपातकालीन संपर्क फ़ोन (वैकल्पिक)', te: 'అత్యవసర సంప్రదింపు ఫోన్ (ఐచ్ఛికం)', ta: 'அவசர தொடர்பு தொலைபேசி (விருப்பம்)', kn: 'ತುರ್ತು ಸಂಪರ್ಕ ಫೋನ್ (ಐಚ್ಛಿಕ)', ml: 'അടിയന്തര ബന്ധപ്പെടൽ ഫോൺ (ഐച്ഛികം)' },
    'The due date is an estimate based on a 280-day pregnancy calculation. It does not replace an ultrasound or clinician assessment.': { hi: 'प्रसव तारीख 280-दिन की गर्भावस्था गणना पर आधारित अनुमान है। यह अल्ट्रासाउंड या चिकित्सक के आकलन का विकल्प नहीं है।', te: 'ప్రసవ తేదీ 280 రోజుల గర్భధారణ లెక్క ఆధారంగా అంచనా మాత్రమే. ఇది స్కాన్ లేదా వైద్యుడి అంచనాకు ప్రత్యామ్నాయం కాదు.', ta: 'பிரசவ தேதி 280 நாள் கணக்கீட்டின் அடிப்படையிலான கணிப்பு மட்டுமே. இது ஸ்கேன் அல்லது மருத்துவர் மதிப்பீட்டிற்கு மாற்றாகாது.', kn: 'ಹೆರಿಗೆ ದಿನಾಂಕ 280 ದಿನಗಳ ಗರ್ಭಧಾರಣೆಯ ಲೆಕ್ಕದ ಅಂದಾಜು ಮಾತ್ರ. ಇದು ಸ್ಕ್ಯಾನ್ ಅಥವಾ ವೈದ್ಯರ ಮೌಲ್ಯಮಾಪನಕ್ಕೆ ಪರ್ಯಾಯವಲ್ಲ.', ml: 'പ്രസവ തീയതി 280 ദിവസത്തെ ഗർഭകാല കണക്കിലെ ഏകദേശമാണ്. ഇത് സ്കാനിനോ ഡോക്ടറുടെ വിലയിരുത്തലിനോ പകരമല്ല.' },
    'Enter a last menstrual period or estimated due date.': { hi: 'अंतिम माहवारी या अनुमानित प्रसव तारीख दर्ज करें।', te: 'చివరి నెలసరి లేదా అంచనా ప్రసవ తేదీ నమోదు చేయండి.', ta: 'கடைசி மாதவிடாய் அல்லது எதிர்பார்க்கப்படும் பிரசவ தேதியை உள்ளிடுங்கள்.', kn: 'ಕೊನೆಯ ಮಾಸಿಕ ಅಥವಾ ಅಂದಾಜು ಹೆರಿಗೆ ದಿನಾಂಕ ನಮೂದಿಸಿ.', ml: 'അവസാന ആർത്തവമോ പ്രതീക്ഷിക്കുന്ന പ്രസവ തീയതിയോ നൽകുക.' },
    'Add a care appointment': { hi: 'देखभाल मुलाक़ात जोड़ें', te: 'సంరక్షణ అపాయింట్‌మెంట్ జోడించండి', ta: 'பராமரிப்பு சந்திப்பைச் சேர்க்கவும்', kn: 'ಆರೈಕೆ ಭೇಟಿ ಸೇರಿಸಿ', ml: 'പരിചരണ സന്ദർശനം ചേർക്കുക' },
    'Appointment type': { hi: 'मुलाक़ात का प्रकार', te: 'అపాయింట్‌మెంట్ రకం', ta: 'சந்திப்பு வகை', kn: 'ಭೇಟಿಯ ವಿಧ', ml: 'സന്ദർശന തരം' },
    'ANC checkup': { hi: 'ANC जाँच', te: 'ANC పరీక్ష', ta: 'ANC பரிசோதனை', kn: 'ANC ತಪಾಸಣೆ', ml: 'ANC പരിശോധന' },
    'Ultrasound or scan': { hi: 'अल्ट्रासाउंड या स्कैन', te: 'అల్ట్రాసౌండ్ లేదా స్కాన్', ta: 'அல்ட்ராசவுண்ட் அல்லது ஸ்கேன்', kn: 'ಅಲ್ಟ್ರಾಸೌಂಡ್ ಅಥವಾ ಸ್ಕ್ಯಾನ್', ml: 'അൾട്രാസൗണ്ട് അല്ലെങ്കിൽ സ്കാൻ' },
    'Vaccination visit': { hi: 'टीकाकरण मुलाक़ात', te: 'టీకా అపాయింట్‌మెంట్', ta: 'தடுப்பூசி சந்திப்பு', kn: 'ಲಸಿಕೆ ಭೇಟಿ', ml: 'വാക്സിൻ സന്ദർശനം' },
    'Other': { hi: 'अन्य', te: 'ఇతర', ta: 'மற்றவை', kn: 'ಇತರೆ', ml: 'മറ്റുള്ളവ' },
    'Title': { hi: 'शीर्षक', te: 'శీర్షిక', ta: 'தலைப்பு', kn: 'ಶೀರ್ಷಿಕೆ', ml: 'തലക്കെട്ട്' },
    'Date': { hi: 'तारीख', te: 'తేదీ', ta: 'தேதி', kn: 'ದಿನಾಂಕ', ml: 'തീയതി' },
    'Location (optional)': { hi: 'स्थान (वैकल्पिक)', te: 'స్థలం (ఐచ్ఛికం)', ta: 'இடம் (விருப்பம்)', kn: 'ಸ್ಥಳ (ಐಚ್ಛಿಕ)', ml: 'സ്ഥലം (ഐച്ഛികം)' },
    'Notes (optional)': { hi: 'नोट्स (वैकल्पिक)', te: 'గమనికలు (ఐచ్ఛికం)', ta: 'குறிப்புகள் (விருப்பம்)', kn: 'ಟಿಪ್ಪಣಿಗಳು (ಐಚ್ಛಿಕ)', ml: 'കുറിപ്പുകൾ (ഐച്ഛികം)' },
    'Use the name from your care team': { hi: 'अपनी देखभाल टीम द्वारा दिया गया नाम लिखें', te: 'మీ సంరక్షణ బృందం ఇచ్చిన పేరును ఉపయోగించండి', ta: 'உங்கள் பராமரிப்பு குழு வழங்கிய பெயரைப் பயன்படுத்தவும்', kn: 'ನಿಮ್ಮ ಆರೈಕೆ ತಂಡ ನೀಡಿದ ಹೆಸರನ್ನು ಬಳಸಿ', ml: 'പരിചരണ സംഘം നൽകിയ പേര് ഉപയോഗിക്കുക' },
    'Clinician (optional)': { hi: 'चिकित्सक (वैकल्पिक)', te: 'వైద్యుడు (ఐచ్ఛికం)', ta: 'மருத்துவர் (விருப்பம்)', kn: 'ವೈದ್ಯರು (ಐಚ್ಛಿಕ)', ml: 'ഡോക്ടർ (ഐച്ഛികം)' },
    'Enter an appointment title and valid date.': { hi: 'मुलाक़ात का शीर्षक और सही तारीख दर्ज करें।', te: 'అపాయింట్‌మెంట్ శీర్షిక మరియు సరైన తేదీ నమోదు చేయండి.', ta: 'சந்திப்பு தலைப்பு மற்றும் சரியான தேதியை உள்ளிடுங்கள்.', kn: 'ಭೇಟಿಯ ಶೀರ್ಷಿಕೆ ಮತ್ತು ಸರಿಯಾದ ದಿನಾಂಕ ನಮೂದಿಸಿ.', ml: 'സന്ദർശനത്തിന്റെ തലക്കെട്ടും ശരിയായ തീയതിയും നൽകുക.' },
    'Cancel': { hi: 'रद्द करें', te: 'రద్దు చేయండి', ta: 'ரத்து செய்', kn: 'ರದ್ದುಮಾಡಿ', ml: 'റദ്ദാക്കുക' },
    'Save': { hi: 'सहेजें', te: 'సేవ్ చేయండి', ta: 'சேமி', kn: 'ಉಳಿಸಿ', ml: 'സേവ് ചെയ്യുക' },
};
for (const [english, translations] of Object.entries(maternalCareTranslations)) {
    for (const [language, translated] of Object.entries(translations)) extraLabels[language][english] = translated;
}

Object.assign(extraLabels.hi, {
    'Ask about your records or general health information. With AI enabled, replies use your selected language.': 'अपने रिकॉर्ड या सामान्य स्वास्थ्य जानकारी के बारे में पूछें। AI चालू होने पर जवाब आपकी चुनी भाषा में होंगे।',
    'When enabled, your question, recent conversation, and relevant extracted health facts from this profile are sent to the configured AI provider. The AI can answer general health questions and questions about these records. Turn this on only if you consent.': 'चालू करने पर आपका प्रश्न, हाल की बातचीत और इस प्रोफ़ाइल के संबंधित निकाले गए स्वास्थ्य तथ्य AI प्रदाता को भेजे जाएँगे। AI सामान्य स्वास्थ्य और रिकॉर्ड से जुड़े प्रश्नों के जवाब दे सकता है। सहमति होने पर ही चालू करें।',
    'AI is off for this profile. Enable it in Settings to ask general health questions and receive multilingual answers.': 'इस प्रोफ़ाइल के लिए AI बंद है। सामान्य स्वास्थ्य प्रश्नों और कई भाषाओं में जवाब पाने के लिए सेटिंग्स में इसे चालू करें.',
    'I can explain general health information and summarize what your records say. I cannot diagnose or prescribe treatment.': 'मैं सामान्य स्वास्थ्य जानकारी और आपके रिकॉर्ड का सार समझा सकता हूँ। मैं निदान या दवा नहीं लिख सकता।',
    'AI can use general health information and this profile’s facts when enabled. Answers may be incomplete; verify records with your clinician.': 'AI चालू होने पर सामान्य स्वास्थ्य जानकारी और इस प्रोफ़ाइल के तथ्य उपयोग कर सकता है। जवाब अधूरे हो सकते हैं; चिकित्सक से पुष्टि करें।',
    'Ask about a result, medicine, symptom, or general health question.': 'किसी परिणाम, दवा, लक्षण या सामान्य स्वास्थ्य प्रश्न के बारे में पूछें।',
    'Ask about records or general health information…': 'रिकॉर्ड या सामान्य स्वास्थ्य जानकारी के बारे में पूछें…'
});
Object.assign(extraLabels.te, {
    'Ask about your records or general health information. With AI enabled, replies use your selected language.': 'మీ రికార్డులు లేదా సాధారణ ఆరోగ్య సమాచారం గురించి అడగండి. AI ప్రారంభమైతే సమాధానాలు మీరు ఎంచుకున్న భాషలో వస్తాయి.',
    'When enabled, your question, recent conversation, and relevant extracted health facts from this profile are sent to the configured AI provider. The AI can answer general health questions and questions about these records. Turn this on only if you consent.': 'ప్రారంభించినప్పుడు మీ ప్రశ్న, ఇటీవలి సంభాషణ, ఈ ప్రొఫైల్‌కు సంబంధించిన ఆరోగ్య వివరాలు AI ప్రొవైడర్‌కు పంపబడతాయి. సాధారణ ఆరోగ్య ప్రశ్నలు మరియు రికార్డుల గురించి సమాధానాలు వస్తాయి. మీ సమ్మతితోనే ప్రారంభించండి.',
    'AI is off for this profile. Enable it in Settings to ask general health questions and receive multilingual answers.': 'ఈ ప్రొఫైల్‌కు AI ఆఫ్‌లో ఉంది. సాధారణ ఆరోగ్య ప్రశ్నలు, బహుభాషా సమాధానాల కోసం సెట్టింగ్‌లలో ప్రారంభించండి.',
    'I can explain general health information and summarize what your records say. I cannot diagnose or prescribe treatment.': 'నేను సాధారణ ఆరోగ్య సమాచారం, మీ రికార్డుల సారాంశం వివరించగలను. నిర్ధారణ లేదా మందుల ప్రిస్క్రిప్షన్ ఇవ్వలేను.',
    'AI can use general health information and this profile’s facts when enabled. Answers may be incomplete; verify records with your clinician.': 'AI ప్రారంభమైతే సాధారణ ఆరోగ్య సమాచారం, ఈ ప్రొఫైల్ వివరాలను ఉపయోగించగలదు. సమాధానాలు అసంపూర్ణంగా ఉండవచ్చు; వైద్యుడితో నిర్ధారించండి.',
    'Ask about a result, medicine, symptom, or general health question.': 'ఫలితం, మందు, లక్షణం లేదా సాధారణ ఆరోగ్య ప్రశ్న గురించి అడగండి.',
    'Ask about records or general health information…': 'రికార్డులు లేదా సాధారణ ఆరోగ్య సమాచారం గురించి అడగండి…'
});
Object.assign(extraLabels.ta, {
    'Ask about your records or general health information. With AI enabled, replies use your selected language.': 'உங்கள் பதிவுகள் அல்லது பொது சுகாதாரத் தகவலைப் பற்றிக் கேளுங்கள். AI இயக்கப்பட்டால், நீங்கள் தேர்ந்தெடுத்த மொழியில் பதில் வரும்.',
    'When enabled, your question, recent conversation, and relevant extracted health facts from this profile are sent to the configured AI provider. The AI can answer general health questions and questions about these records. Turn this on only if you consent.': 'இயக்கினால், உங்கள் கேள்வி, சமீபத்திய உரையாடல் மற்றும் இந்த விவரத்தின் தொடர்புடைய சுகாதாரத் தகவல்கள் AI சேவைக்கு அனுப்பப்படும். பொது சுகாதார மற்றும் பதிவு சார்ந்த கேள்விகளுக்கு AI பதிலளிக்கும். ஒப்புதல் இருந்தால் மட்டும் இயக்கவும்.',
    'AI is off for this profile. Enable it in Settings to ask general health questions and receive multilingual answers.': 'இந்த விவரத்திற்கு AI முடக்கப்பட்டுள்ளது. பொது சுகாதாரக் கேள்விகளுக்கும் பலமொழிப் பதில்களுக்கும் அமைப்புகளில் இயக்கவும்.',
    'I can explain general health information and summarize what your records say. I cannot diagnose or prescribe treatment.': 'பொது சுகாதாரத் தகவலையும் உங்கள் பதிவுகளையும் விளக்க முடியும். நோயறிதலோ மருந்துச் சீட்டோ வழங்க முடியாது.',
    'AI can use general health information and this profile’s facts when enabled. Answers may be incomplete; verify records with your clinician.': 'AI இயக்கப்பட்டால் பொதுத் தகவலையும் இந்த விவரத்தின் தரவையும் பயன்படுத்தும். பதில்கள் முழுமையற்றிருக்கலாம்; மருத்துவரிடம் சரிபார்க்கவும்.',
    'Ask about a result, medicine, symptom, or general health question.': 'முடிவு, மருந்து, அறிகுறி அல்லது பொது சுகாதாரக் கேள்வியைக் கேளுங்கள்.',
    'Ask about records or general health information…': 'பதிவுகள் அல்லது பொது சுகாதாரத் தகவலைப் பற்றிக் கேளுங்கள்…'
});
Object.assign(extraLabels.kn, {
    'Ask about your records or general health information. With AI enabled, replies use your selected language.': 'ನಿಮ್ಮ ದಾಖಲೆಗಳು ಅಥವಾ ಸಾಮಾನ್ಯ ಆರೋಗ್ಯ ಮಾಹಿತಿಯ ಬಗ್ಗೆ ಕೇಳಿ. AI ಸಕ್ರಿಯವಾಗಿದ್ದರೆ ಉತ್ತರಗಳು ನಿಮ್ಮ ಆಯ್ದ ಭಾಷೆಯಲ್ಲಿ ಬರುತ್ತವೆ.',
    'When enabled, your question, recent conversation, and relevant extracted health facts from this profile are sent to the configured AI provider. The AI can answer general health questions and questions about these records. Turn this on only if you consent.': 'ಸಕ್ರಿಯಗೊಳಿಸಿದಾಗ ನಿಮ್ಮ ಪ್ರಶ್ನೆ, ಇತ್ತೀಚಿನ ಸಂಭಾಷಣೆ ಮತ್ತು ಈ ಪ್ರೊಫೈಲ್‌ನ ಸಂಬಂಧಿತ ಆರೋಗ್ಯ ಮಾಹಿತಿ AI ಸೇವೆಗೆ ಕಳುಹಿಸಲಾಗುತ್ತದೆ. ಸಾಮಾನ್ಯ ಆರೋಗ್ಯ ಮತ್ತು ದಾಖಲೆಯ ಪ್ರಶ್ನೆಗಳಿಗೆ AI ಉತ್ತರಿಸಬಹುದು. ನಿಮ್ಮ ಒಪ್ಪಿಗೆಯಿದ್ದಾಗ ಮಾತ್ರ ಸಕ್ರಿಯಗೊಳಿಸಿ.',
    'AI is off for this profile. Enable it in Settings to ask general health questions and receive multilingual answers.': 'ಈ ಪ್ರೊಫೈಲ್‌ಗೆ AI ಆಫ್ ಆಗಿದೆ. ಸಾಮಾನ್ಯ ಆರೋಗ್ಯ ಪ್ರಶ್ನೆ ಮತ್ತು ಬಹುಭಾಷಾ ಉತ್ತರಗಳಿಗಾಗಿ ಸೆಟ್ಟಿಂಗ್‌ಗಳಲ್ಲಿ ಸಕ್ರಿಯಗೊಳಿಸಿ.',
    'I can explain general health information and summarize what your records say. I cannot diagnose or prescribe treatment.': 'ಸಾಮಾನ್ಯ ಆರೋಗ್ಯ ಮಾಹಿತಿ ಮತ್ತು ನಿಮ್ಮ ದಾಖಲೆಗಳ ಸಾರಾಂಶವನ್ನು ವಿವರಿಸಬಹುದು. ರೋಗನಿರ್ಣಯ ಅಥವಾ ಔಷಧಿ ಸೂಚಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ.',
    'AI can use general health information and this profile’s facts when enabled. Answers may be incomplete; verify records with your clinician.': 'AI ಸಕ್ರಿಯವಾಗಿದ್ದರೆ ಸಾಮಾನ್ಯ ಮಾಹಿತಿ ಮತ್ತು ಈ ಪ್ರೊಫೈಲ್ ವಿವರಗಳನ್ನು ಬಳಸುತ್ತದೆ. ಉತ್ತರಗಳು ಅಪೂರ್ಣವಾಗಿರಬಹುದು; ವೈದ್ಯರೊಂದಿಗೆ ಪರಿಶೀಲಿಸಿ.',
    'Ask about a result, medicine, symptom, or general health question.': 'ಫಲಿತಾಂಶ, ಔಷಧಿ, ಲಕ್ಷಣ ಅಥವಾ ಸಾಮಾನ್ಯ ಆರೋಗ್ಯ ಪ್ರಶ್ನೆ ಕೇಳಿ.',
    'Ask about records or general health information…': 'ದಾಖಲೆಗಳು ಅಥವಾ ಸಾಮಾನ್ಯ ಆರೋಗ್ಯ ಮಾಹಿತಿಯ ಬಗ್ಗೆ ಕೇಳಿ…'
});
Object.assign(extraLabels.ml, {
    'Ask about your records or general health information. With AI enabled, replies use your selected language.': 'നിങ്ങളുടെ രേഖകളെയോ പൊതുവായ ആരോഗ്യ വിവരങ്ങളെയോ കുറിച്ച് ചോദിക്കുക. AI പ്രവർത്തിച്ചാൽ തിരഞ്ഞെടുത്ത ഭാഷയിൽ മറുപടി ലഭിക്കും.',
    'When enabled, your question, recent conversation, and relevant extracted health facts from this profile are sent to the configured AI provider. The AI can answer general health questions and questions about these records. Turn this on only if you consent.': 'പ്രവർത്തനക്ഷമമാക്കിയാൽ നിങ്ങളുടെ ചോദ്യവും സമീപകാല സംഭാഷണവും ഈ പ്രൊഫൈലിലെ ബന്ധപ്പെട്ട ആരോഗ്യ വിവരങ്ങളും AI സേവനത്തിലേക്ക് അയയ്ക്കും. പൊതുവായ ആരോഗ്യ ചോദ്യങ്ങൾക്കും രേഖകളെക്കുറിച്ചും മറുപടി നൽകാം. സമ്മതമുണ്ടെങ്കിൽ മാത്രം പ്രവർത്തനക്ഷമമാക്കുക.',
    'AI is off for this profile. Enable it in Settings to ask general health questions and receive multilingual answers.': 'ഈ പ്രൊഫൈലിൽ AI ഓഫ് ആണ്. പൊതുവായ ആരോഗ്യ ചോദ്യങ്ങൾക്കും പലഭാഷാ മറുപടികൾക്കും ക്രമീകരണങ്ങളിൽ പ്രവർത്തനക്ഷമമാക്കുക.',
    'I can explain general health information and summarize what your records say. I cannot diagnose or prescribe treatment.': 'പൊതുവായ ആരോഗ്യ വിവരങ്ങളും നിങ്ങളുടെ രേഖകളുടെ സംഗ്രഹവും വിശദീകരിക്കാം. രോഗനിർണയമോ മരുന്ന് നിർദ്ദേശമോ നൽകില്ല.',
    'AI can use general health information and this profile’s facts when enabled. Answers may be incomplete; verify records with your clinician.': 'AI പ്രവർത്തിച്ചാൽ പൊതുവായ വിവരങ്ങളും ഈ പ്രൊഫൈലിലെ വിവരങ്ങളും ഉപയോഗിക്കും. മറുപടി അപൂർണ്ണമായിരിക്കാം; ഡോക്ടറോട് ഉറപ്പാക്കുക.',
    'Ask about a result, medicine, symptom, or general health question.': 'ഫലം, മരുന്ന്, ലക്ഷണം, അല്ലെങ്കിൽ പൊതുവായ ആരോഗ്യ ചോദ്യം ചോദിക്കുക.',
    'Ask about records or general health information…': 'രേഖകളെയോ പൊതുവായ ആരോഗ്യ വിവരങ്ങളെയോ കുറിച്ച് ചോദിക്കുക…'
});

const screenStrings = [
    'A clearer picture of your health starts here.', 'Across your timeline', 'From uploaded documents', 'No medicines identified',
    'Extracted results', 'Check with your clinician', 'No flagged values', 'Your results will appear after you add a lab report.',
    'Your health assistant', 'Get ready for an appointment', 'Build a list of questions based on your records and flagged results.',
    'Documents and reports', 'Upload record', 'All document types', 'Any time', 'Past 30 days', 'Past 6 months', 'Past year',
    'Results over time', 'All recorded lab values', 'Personal information', 'Edit profile', 'ABHA link', 'Diagnoses and conditions',
    'Allergies', 'Add reminder', 'Your reminders', 'About interactions', 'Interaction information is limited',
    'Questions to ask your clinician', 'Helpful context', 'Preferences', 'Export profile data', 'Delete this profile',
];
const screenTranslations = {
    hi: ['आपके स्वास्थ्य की स्पष्ट तस्वीर यहीं से शुरू होती है।', 'आपकी समयरेखा में', 'अपलोड किए गए दस्तावेज़ों से', 'कोई दवा नहीं मिली', 'निकाले गए परिणाम', 'अपने चिकित्सक से जाँचें', 'कोई चिह्नित मान नहीं', 'लैब रिपोर्ट जोड़ने के बाद आपके परिणाम यहाँ दिखेंगे।', 'आपका स्वास्थ्य सहायक', 'मुलाक़ात की तैयारी करें', 'अपने रिकॉर्ड और चिह्नित परिणामों के आधार पर प्रश्नों की सूची बनाएँ।', 'दस्तावेज़ और रिपोर्ट', 'रिकॉर्ड अपलोड करें', 'सभी दस्तावेज़ प्रकार', 'किसी भी समय', 'पिछले 30 दिन', 'पिछले 6 महीने', 'पिछला वर्ष', 'समय के साथ परिणाम', 'सभी दर्ज लैब परिणाम', 'व्यक्तिगत जानकारी', 'प्रोफ़ाइल संपादित करें', 'ABHA लिंक', 'निदान और स्थितियाँ', 'एलर्जी', 'रिमाइंडर जोड़ें', 'आपके रिमाइंडर', 'दवाओं की परस्पर क्रिया के बारे में', 'परस्पर क्रिया की जानकारी सीमित है', 'अपने चिकित्सक से पूछने के प्रश्न', 'सहायक संदर्भ', 'प्राथमिकताएँ', 'प्रोफ़ाइल डेटा निर्यात करें', 'यह प्रोफ़ाइल हटाएँ'],
    te: ['మీ ఆరోగ్యంపై స్పష్టమైన అవగాహన ఇక్కడ మొదలవుతుంది.', 'మీ టైమ్‌లైన్‌లో', 'అప్‌లోడ్ చేసిన పత్రాల నుంచి', 'మందులు గుర్తించబడలేదు', 'సేకరించిన ఫలితాలు', 'మీ వైద్యుడితో తనిఖీ చేయండి', 'గుర్తించిన విలువలు లేవు', 'ల్యాబ్ నివేదికను జోడించిన తర్వాత ఫలితాలు ఇక్కడ కనిపిస్తాయి.', 'మీ ఆరోగ్య సహాయకుడు', 'వైద్యుడి సందర్శనకు సిద్ధం అవ్వండి', 'మీ రికార్డులు, గుర్తించిన ఫలితాల ఆధారంగా ప్రశ్నల జాబితా తయారు చేయండి.', 'పత్రాలు మరియు నివేదికలు', 'రికార్డును అప్‌లోడ్ చేయండి', 'అన్ని పత్ర రకాలు', 'ఎప్పుడైనా', 'గత 30 రోజులు', 'గత 6 నెలలు', 'గత సంవత్సరం', 'కాలక్రమంలో ఫలితాలు', 'నమోదైన అన్ని ల్యాబ్ విలువలు', 'వ్యక్తిగత సమాచారం', 'ప్రొఫైల్‌ను సవరించండి', 'ABHA లింక్', 'నిర్ధారణలు మరియు ఆరోగ్య పరిస్థితులు', 'అలర్జీలు', 'రిమైండర్ జోడించండి', 'మీ రిమైండర్లు', 'మందుల పరస్పర చర్యల గురించి', 'పరస్పర చర్య సమాచారం పరిమితం', 'వైద్యుడిని అడగాల్సిన ప్రశ్నలు', 'సహాయక సందర్భం', 'ప్రాధాన్యతలు', 'ప్రొఫైల్ డేటాను ఎగుమతి చేయండి', 'ఈ ప్రొఫైల్‌ను తొలగించండి'],
    ta: ['உங்கள் சுகாதாரத்தைத் தெளிவாகப் புரிந்துகொள்வது இங்கே தொடங்குகிறது.', 'உங்கள் காலவரிசையில்', 'பதிவேற்றிய ஆவணங்களிலிருந்து', 'மருந்துகள் கண்டறியப்படவில்லை', 'எடுக்கப்பட்ட முடிவுகள்', 'மருத்துவரிடம் சரிபார்க்கவும்', 'குறிக்கப்பட்ட மதிப்புகள் இல்லை', 'ஆய்வக அறிக்கையைச் சேர்த்த பிறகு முடிவுகள் இங்கே தோன்றும்.', 'உங்கள் சுகாதார உதவியாளர்', 'சந்திப்புக்குத் தயாராகுங்கள்', 'உங்கள் பதிவுகள் மற்றும் குறிக்கப்பட்ட முடிவுகளின் அடிப்படையில் கேள்விப் பட்டியலை உருவாக்குங்கள்.', 'ஆவணங்கள் மற்றும் அறிக்கைகள்', 'பதிவைப் பதிவேற்றவும்', 'அனைத்து ஆவண வகைகள்', 'எந்த நேரமும்', 'கடந்த 30 நாட்கள்', 'கடந்த 6 மாதங்கள்', 'கடந்த ஆண்டு', 'காலப்போக்கில் முடிவுகள்', 'பதிவான அனைத்து ஆய்வக மதிப்புகள்', 'தனிப்பட்ட தகவல்', 'விவரத்தைத் திருத்தவும்', 'ABHA இணைப்பு', 'நோயறிதல்கள் மற்றும் நிலைகள்', 'ஒவ்வாமைகள்', 'நினைவூட்டலைச் சேர்க்கவும்', 'உங்கள் நினைவூட்டல்கள்', 'மருந்து இடையினைகள் பற்றி', 'இடையினைத் தகவல் குறைவாக உள்ளது', 'மருத்துவரிடம் கேட்க வேண்டிய கேள்விகள்', 'உதவும் தகவல்', 'விருப்பங்கள்', 'விவரத் தரவை ஏற்றுமதி செய்யவும்', 'இந்த விவரத்தை நீக்கவும்'],
    kn: ['ನಿಮ್ಮ ಆರೋಗ್ಯದ ಸ್ಪಷ್ಟ ಚಿತ್ರಣ ಇಲ್ಲಿ ಆರಂಭವಾಗುತ್ತದೆ.', 'ನಿಮ್ಮ ಕಾಲರೇಖೆಯಲ್ಲಿ', 'ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ದಾಖಲೆಗಳಿಂದ', 'ಔಷಧಿಗಳು ಗುರುತಿಸಲ್ಪಟ್ಟಿಲ್ಲ', 'ಹೊರತೆಗೆಯಲಾದ ಫಲಿತಾಂಶಗಳು', 'ವೈದ್ಯರೊಂದಿಗೆ ಪರಿಶೀಲಿಸಿ', 'ಗುರುತಿಸಿದ ಮೌಲ್ಯಗಳಿಲ್ಲ', 'ಲ್ಯಾಬ್ ವರದಿ ಸೇರಿಸಿದ ನಂತರ ಫಲಿತಾಂಶಗಳು ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತವೆ.', 'ನಿಮ್ಮ ಆರೋಗ್ಯ ಸಹಾಯಕ', 'ಭೇಟಿಗೆ ಸಿದ್ಧರಾಗಿ', 'ನಿಮ್ಮ ದಾಖಲೆಗಳು ಮತ್ತು ಗುರುತಿಸಿದ ಫಲಿತಾಂಶಗಳ ಆಧಾರದ ಮೇಲೆ ಪ್ರಶ್ನೆಗಳ ಪಟ್ಟಿಯನ್ನು ರಚಿಸಿ.', 'ದಾಖಲೆಗಳು ಮತ್ತು ವರದಿಗಳು', 'ದಾಖಲೆಯನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ', 'ಎಲ್ಲ ದಾಖಲೆ ಪ್ರಕಾರಗಳು', 'ಯಾವುದೇ ಸಮಯ', 'ಕಳೆದ 30 ದಿನಗಳು', 'ಕಳೆದ 6 ತಿಂಗಳುಗಳು', 'ಕಳೆದ ವರ್ಷ', 'ಕಾಲಾನಂತರದ ಫಲಿತಾಂಶಗಳು', 'ದಾಖಲಾದ ಎಲ್ಲಾ ಲ್ಯಾಬ್ ಮೌಲ್ಯಗಳು', 'ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ', 'ಪ್ರೊಫೈಲ್ ಸಂಪಾದಿಸಿ', 'ABHA ಲಿಂಕ್', 'ರೋಗನಿರ್ಣಯಗಳು ಮತ್ತು ಸ್ಥಿತಿಗಳು', 'ಅಲರ್ಜಿಗಳು', 'ಜ್ಞಾಪನೆ ಸೇರಿಸಿ', 'ನಿಮ್ಮ ಜ್ಞಾಪನೆಗಳು', 'ಔಷಧಿ ಪರಸ್ಪರ ಕ್ರಿಯೆಗಳ ಬಗ್ಗೆ', 'ಪರಸ್ಪರ ಕ್ರಿಯೆಯ ಮಾಹಿತಿ ಸೀಮಿತವಾಗಿದೆ', 'ವೈದ್ಯರನ್ನು ಕೇಳಬೇಕಾದ ಪ್ರಶ್ನೆಗಳು', 'ಸಹಾಯಕ ಮಾಹಿತಿ', 'ಆದ್ಯತೆಗಳು', 'ಪ್ರೊಫೈಲ್ ಡೇಟಾ ರಫ್ತು ಮಾಡಿ', 'ಈ ಪ್ರೊಫೈಲ್ ಅಳಿಸಿ'],
    ml: ['നിങ്ങളുടെ ആരോഗ്യത്തെ വ്യക്തമായി മനസ്സിലാക്കുന്നത് ഇവിടെ തുടങ്ങുന്നു.', 'നിങ്ങളുടെ ടൈംലൈനിൽ', 'അപ്‌ലോഡ് ചെയ്ത രേഖകളിൽ നിന്ന്', 'മരുന്നുകൾ കണ്ടെത്തിയില്ല', 'എടുത്തെടുത്ത ഫലങ്ങൾ', 'ഡോക്ടറുമായി പരിശോധിക്കുക', 'അടയാളപ്പെടുത്തിയ മൂല്യങ്ങളില്ല', 'ലാബ് റിപ്പോർട്ട് ചേർത്താൽ ഫലങ്ങൾ ഇവിടെ കാണിക്കും.', 'നിങ്ങളുടെ ആരോഗ്യ സഹായി', 'സന്ദർശനത്തിന് തയ്യാറാകുക', 'നിങ്ങളുടെ രേഖകളും അടയാളപ്പെടുത്തിയ ഫലങ്ങളും അടിസ്ഥാനമാക്കി ചോദ്യങ്ങളുടെ പട്ടിക തയ്യാറാക്കുക.', 'രേഖകളും റിപ്പോർട്ടുകളും', 'രേഖ അപ്‌ലോഡ് ചെയ്യുക', 'എല്ലാ രേഖാ തരങ്ങളും', 'എപ്പോൾ വേണമെങ്കിലും', 'കഴിഞ്ഞ 30 ദിവസം', 'കഴിഞ്ഞ 6 മാസം', 'കഴിഞ്ഞ വർഷം', 'കാലക്രമത്തിലുള്ള ഫലങ്ങൾ', 'രേഖപ്പെടുത്തിയ എല്ലാ ലാബ് മൂല്യങ്ങളും', 'വ്യക്തിഗത വിവരം', 'പ്രൊഫൈൽ തിരുത്തുക', 'ABHA ലിങ്ക്', 'രോഗനിർണയങ്ങളും അവസ്ഥകളും', 'അലർജികൾ', 'ഓർമ്മപ്പെടുത്തൽ ചേർക്കുക', 'നിങ്ങളുടെ ഓർമ്മപ്പെടുത്തലുകൾ', 'മരുന്നുകളുടെ പരസ്പരപ്രവർത്തനങ്ങളെക്കുറിച്ച്', 'പരസ്പരപ്രവർത്തന വിവരങ്ങൾ പരിമിതമാണ്', 'ഡോക്ടറോട് ചോദിക്കേണ്ട ചോദ്യങ്ങൾ', 'സഹായകരമായ വിവരം', 'മുൻഗണനകൾ', 'പ്രൊഫൈൽ ഡാറ്റ കയറ്റുമതി ചെയ്യുക', 'ഈ പ്രൊഫൈൽ ഇല്ലാതാക്കുക'],
};
for (const [language, translations] of Object.entries(screenTranslations)) screenStrings.forEach((key, index) => extraLabels[language][key] = translations[index]);

export function languageOptions(selected = 'en') {
    return HEALTH_LANGUAGES.map(({ code, name }) => `<option value="${code}" ${code===selected?'selected':''}>${name}</option>`).join('');
}

export function localizeTree(root, language = 'en') {
    const dictionary = {...(labels[language] || {}), ...(extraLabels[language] || {}) };
    if (!root || !dictionary) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
        const node = walker.currentNode,
            trimmed = node.nodeValue.trim();
        if (dictionary[trimmed]) node.nodeValue = node.nodeValue.replace(trimmed, dictionary[trimmed]);
    }
    root.querySelectorAll('[placeholder],[aria-label],[title]').forEach(el => {
        for (const attr of['placeholder', 'aria-label', 'title']) {
            const value = el.getAttribute(attr);
            if (value && dictionary[value]) el.setAttribute(attr, dictionary[value]);
        }
    });
}

export function summarizeDocument(doc, language = 'en') {
    const values = doc.values || [],
        medicines = doc.medicines || [],
        flagged = values.filter(v => v.abnormal);
    const rows = {
        en: ['This ' + String(doc.type || 'health record').toLowerCase() + ' is dated ' + (doc.date || 'unknown') + '.', values.length + ' test result(s) found.', 'The report flags ' + flagged.map(v => v.name + ' ' + v.value + ' ' + (v.unit || '') + ' (reference ' + (v.range || 'not shown') + ')').join('; ') + '. A flag is not a diagnosis; ask your clinician what it means for you.', 'Medicines detected: ' + medicines.map(m => m.name).join('; ') + '. Verify against the original prescription.', 'This is informational only, not medical advice. Verify the source and consult a healthcare professional.', 'No structured values were confidently identified. Review the original document.'],
        hi: ['यह ' + (doc.type || 'स्वास्थ्य रिकॉर्ड') + ' ' + (doc.date || 'अज्ञात तारीख') + ' की है।', values.length + ' जाँच परिणाम मिले।', 'रिपोर्ट में समीक्षा के लिए चिह्नित मान: ' + flagged.map(v => v.name + ' ' + v.value + ' ' + (v.unit || '')).join('; ') + '. यह निदान नहीं है; अपने चिकित्सक से अर्थ पूछें।', 'पहचानी गई दवाएँ: ' + medicines.map(m => m.name).join('; ') + '. मूल पर्चे से जाँचें।', 'यह जानकारी के लिए है, चिकित्सा सलाह नहीं। मूल रिपोर्ट जाँचें और स्वास्थ्य पेशेवर से बात करें।', 'संरचित जानकारी भरोसे के साथ नहीं पढ़ी जा सकी। मूल दस्तावेज़ देखें।'],
        te: [(doc.date || 'తెలియని తేదీ') + ' నాటి ' + (doc.type || 'ఆరోగ్య రికార్డు') + '.', values.length + ' పరీక్ష ఫలితాలు గుర్తించబడ్డాయి.', 'నివేదికలో సమీక్షకు గుర్తించినవి: ' + flagged.map(v => v.name + ' ' + v.value + ' ' + (v.unit || '')).join('; ') + '. ఇది నిర్ధారణ కాదు; మీ వైద్యుడిని అడగండి.', 'గుర్తించిన మందులు: ' + medicines.map(m => m.name).join('; ') + '. అసలు ప్రిస్క్రిప్షన్‌తో తనిఖీ చేయండి.', 'ఇది సమాచారం మాత్రమే, వైద్య సలహా కాదు. అసలు నివేదికను తనిఖీ చేసి ఆరోగ్య నిపుణుడిని సంప్రదించండి.', 'నిర్మిత వివరాలను నమ్మకంగా గుర్తించలేకపోయాము. అసలు పత్రాన్ని చూడండి.'],
        ta: [(doc.date || 'தெரியாத தேதி') + ' தேதியிட்ட ' + (doc.type || 'சுகாதாரப் பதிவு') + '.', values.length + ' பரிசோதனை முடிவுகள் கண்டறியப்பட்டன.', 'அறிக்கையில் மதிப்பாய்வுக்குக் குறிக்கப்பட்டவை: ' + flagged.map(v => v.name + ' ' + v.value + ' ' + (v.unit || '')).join('; ') + '. இது நோயறிதல் அல்ல; மருத்துவரிடம் கேளுங்கள்.', 'கண்டறியப்பட்ட மருந்துகள்: ' + medicines.map(m => m.name).join('; ') + '. அசல் மருந்துச் சீட்டுடன் சரிபார்க்கவும்.', 'இது தகவலுக்காக மட்டுமே; மருத்துவ ஆலோசனை அல்ல. அசல் அறிக்கையைச் சரிபார்த்து சுகாதார நிபுணரிடம் பேசுங்கள்.', 'கட்டமைக்கப்பட்ட தகவலை நம்பகமாக அடையாளம் காண முடியவில்லை. அசல் ஆவணத்தைப் பார்க்கவும்.'],
        kn: [(doc.date || 'ತಿಳಿಯದ ದಿನಾಂಕ') + 'ರ ' + (doc.type || 'ಆರೋಗ್ಯ ದಾಖಲೆ') + '.', values.length + ' ಪರೀಕ್ಷಾ ಫಲಿತಾಂಶಗಳು ಕಂಡುಬಂದಿವೆ.', 'ವರದಿಯಲ್ಲಿ ಪರಿಶೀಲನೆಗೆ ಗುರುತಿಸಿದವು: ' + flagged.map(v => v.name + ' ' + v.value + ' ' + (v.unit || '')).join('; ') + '. ಇದು ರೋಗನಿರ್ಣಯವಲ್ಲ; ವೈದ್ಯರನ್ನು ಕೇಳಿ.', 'ಗುರುತಿಸಿದ ಔಷಧಿಗಳು: ' + medicines.map(m => m.name).join('; ') + '. ಮೂಲ ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಜೊತೆ ಪರಿಶೀಲಿಸಿ.', 'ಇದು ಮಾಹಿತಿಗಾಗಿ ಮಾತ್ರ, ವೈದ್ಯಕೀಯ ಸಲಹೆಯಲ್ಲ. ಮೂಲ ವರದಿಯನ್ನು ಪರಿಶೀಲಿಸಿ ಆರೋಗ್ಯ ವೃತ್ತಿಪರರನ್ನು ಸಂಪರ್ಕಿಸಿ.', 'ರಚನೆಯ ಮಾಹಿತಿಯನ್ನು ವಿಶ್ವಾಸದಿಂದ ಗುರುತಿಸಲಾಗಲಿಲ್ಲ. ಮೂಲ ದಾಖಲೆಯನ್ನು ಪರಿಶೀಲಿಸಿ.'],
        ml: [(doc.date || 'അജ്ഞാത തീയതി') + '-ലെ ' + (doc.type || 'ആരോഗ്യ രേഖ') + '.', values.length + ' പരിശോധനാ ഫലങ്ങൾ കണ്ടെത്തി.', 'റിപ്പോർട്ടിൽ പരിശോധിക്കാൻ അടയാളപ്പെടുത്തിയവ: ' + flagged.map(v => v.name + ' ' + v.value + ' ' + (v.unit || '')).join('; ') + '. ഇത് രോഗനിർണയമല്ല; ഡോക്ടറോട് ചോദിക്കുക.', 'തിരിച്ചറിഞ്ഞ മരുന്നുകൾ: ' + medicines.map(m => m.name).join('; ') + '. യഥാർത്ഥ കുറിപ്പടിയുമായി പരിശോധിക്കുക.', 'ഇത് വിവരത്തിനായി മാത്രം, വൈദ്യോപദേശം അല്ല. യഥാർത്ഥ റിപ്പോർട്ട് പരിശോധിച്ച് ആരോഗ്യവിദഗ്ധനോട് സംസാരിക്കുക.', 'ഘടനാപരമായ വിവരങ്ങൾ വിശ്വസനീയമായി കണ്ടെത്താനായില്ല. യഥാർത്ഥ രേഖ പരിശോധിക്കുക.']
    };
    const x = rows[language] || rows.en,
        out = [x[0]];
    if (values.length) out.push(x[1]);
    if (flagged.length) out.push(x[2]);
    if (medicines.length) out.push(x[3]);
    if (!values.length && !medicines.length) out.push(x[5]);
    out.push(x[4]);
    return out.join('\n\n');
}