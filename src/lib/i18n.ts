export type Language = 'en' | 'my';

export const translations = {
  // Navigation & Common
  nav: {
    learn: { en: 'Learn', my: 'လေ့လာမည်' },
    leaderboard: { en: 'Leaderboard', my: 'အဆင့်ဇယား' },
    quests: { en: 'Quests', my: 'မစ်ရှင်များ' },
    shop: { en: 'Shop', my: 'ဆိုင်' },
    profile: { en: 'Profile', my: 'ပရိုဖိုင်' },
    challenge: { en: 'Challenge', my: 'စိန်ခေါ်မှု' },
    more: { en: 'More', my: 'အခြား' },
    settings: { en: 'Settings', my: 'ဆက်တင်များ' },
    help: { en: 'Help', my: 'အကူအညီ' },
    logout: { en: 'Log Out', my: 'အကောင့်ထွက်မည်' },
  },

  // Home Screen
  home: {
    progress: { en: 'Progress', my: 'လေ့လာမှု တိုးတက်မှု' },
    lessonsCompleted: { en: 'lessons completed', my: 'သင်ခန်းစာများ ပြီးစီး' },
    dailyQuests: { en: 'Daily Quests', my: 'နေ့စဉ် မစ်ရှင်များ' },
    earnXp: { en: 'Earn 50 XP', my: 'XP ၅၀ ရယူပါ' },
    topAdvance: { en: 'Top 20 advance to next league', my: 'ထိပ်ဆုံး ၂၀ ဦး နောက် League သို့ တက်မည်' },
    startLesson: { en: 'START', my: 'စတင်မည်' },
    about: { en: 'About', my: 'အကြောင်းအရာ' },
    contact: { en: 'Contact', my: 'ဆက်သွယ်ရန်' },
    terms: { en: 'Terms', my: 'စည်းကမ်းချက်များ' },
    privacy: { en: 'Privacy', my: 'ကိုယ်ရေးလုံခြုံမှု' },
    unit: { en: 'UNIT', my: 'UNIT' },
    tipPrefix: { en: 'Tip:', my: 'အကြံပြုချက်:' },
  },

  // Lesson Screen
  lesson: {
    exit: { en: 'Exit Lesson', my: 'သင်ခန်းစာမှ ထွက်မည်' },
    previous: { en: 'Previous Lesson', my: 'ရှေ့သင်ခန်းစာ' },
    next: { en: 'Next Lesson', my: 'နောက်သင်ခန်းစာ' },
    lessonTab: { en: 'Lesson', my: 'သင်ခန်းစာ' },
    exerciseTab: { en: 'Exercise', my: 'လေ့ကျင့်ခန်း' },
    codeEditor: { en: 'Code Editor', my: 'ကုဒ်ရေးသားရန်နေရာ (Code Editor)' },
    fillBlanks: { en: 'Fill in the Blanks', my: 'ကွက်လပ်ဖြည့်ပါ (Fill in the Blanks)' },
    chooseAnswer: { en: 'Choose the Answer', my: 'အဖြေမှန်ရွေးချယ်ပါ (Choose Answer)' },
    runCode: { en: 'CHECK', my: 'ကုဒ် စစ်ဆေးမည်' },
    runningCloud: { en: 'RUNNING ON CLOUD...', my: 'Cloud ပေါ်တွင် ကုဒ် run နေပါသည်...' },
    checkAnswer: { en: 'CHECK', my: 'အဖြေ စစ်မည်' },
    retry: { en: 'TRY AGAIN', my: 'ပြန်ကြိုးစားမည်' },
    continue: { en: 'CONTINUE', my: 'ရှေ့သို့ ဆက်သွားမည်' },
    reset: { en: 'Reset', my: 'ပြန်စမည်' },
    availableTokens: { en: 'Available Tokens', my: 'ရွေးချယ်နိုင်သော Token များ' },
    correct: { en: 'Great Job! Correct!', my: 'မှန်ကန်ပါသည်! ထူးချွန်ပါသည်!' },
    incorrect: { en: 'Not quite, check the solution and try again.', my: 'မှားယွင်းနေပါသည်၊ ကုဒ်ကို စစ်ဆေးပြီး ပြန်လည်ကြိုးစားပါ။' },
    successSubtitle: { en: "You're doing great, keep it up!", my: 'သင် အလွန်တော်ပါသည်၊ ဆက်လက်ကြိုးစားပါ!' },
    errorSubtitle: { en: "Don't worry, try again!", my: 'စိတ်မပူပါနှင့်၊ ပြန်လည်ကြိုးစားကြည့်ပါ!' },
    tapTokens: { en: 'Tap tokens below to complete the code:', my: 'ကုဒ် ပြီးပြည့်စုံစေရန် အောက်ပါ Token များကို နှိပ်ပါ:' },
    expectedOutput: { en: 'Expected Output:', my: 'မျှော်မှန်းရလဒ် (Expected Output):' },
    terminalOutput: { en: 'Console Output:', my: 'စနစ် ထွက်ပေါ်ရလဒ် (Console Output):' },
  },

  // Settings
  settings: {
    title: { en: 'Settings', my: 'ဆက်တင်များ' },
    accountTab: { en: 'Account', my: 'အကောင့်' },
    preferencesTab: { en: 'Preferences', my: 'ဦးစားပေးများ' },
    notificationsTab: { en: 'Notifications', my: 'အသိပေးချက်များ' },
    subscriptionTab: { en: 'Subscription', my: 'အသင်းဝင်အဆင့်' },
    accountTitle: { en: 'Account Settings', my: 'အကောင့် ဆက်တင်များ' },
    accountDesc: { en: 'Manage your login credentials, name, and security preferences.', my: 'မိမိ၏ အကောင့်အမည်၊ အီးမေးလ်နှင့် လုံခြုံရေးဆိုင်ရာများကို စီမံခန့်ခွဲပါ။' },
    fullName: { en: 'Full Name', my: 'အမည် အပြည့်အစုံ' },
    username: { en: 'Username', my: 'အသုံးပြုသူအမည် (Username)' },
    emailAddress: { en: 'Email Address', my: 'အီးမေးလ် လိပ်စာ' },
    changePassword: { en: 'Change Password', my: 'စကားဝှက် ပြောင်းလဲမည်' },
    passwordPlaceholder: { en: 'Enter new password (leave blank to keep current)', my: 'စကားဝှက်အသစ် ထည့်ပါ (မပြောင်းလိုပါက အလွတ်ထားပါ)' },
    saveAccount: { en: 'Save Account', my: 'အကောင့် သိမ်းဆည်းမည်' },
    saving: { en: 'Saving...', my: 'သိမ်းဆည်းနေပါသည်...' },
    savedSuccess: { en: 'Account settings saved successfully!', my: 'အကောင့် အချက်အလက်များ အောင်မြင်စွာ သိမ်းဆည်းပြီးပါပြီ!' },
    dangerZone: { en: 'Danger Zone', my: 'အန္တရာယ်ရှိသော ဇုန် (Danger Zone)' },
    dangerDesc: { en: 'Once you delete your account, there is no going back. All XP and lesson progress will be permanently erased.', my: 'အကောင့်ဖျက်လိုက်ပါက ပြန်လည်ရယူနိုင်မည် မဟုတ်ပါ။ သင်ယူထားသော XP နှင့် သင်ခန်းစာ မှတ်တမ်းအားလုံး ပျက်ပြယ်သွားပါမည်။' },
    deleteAccount: { en: 'Delete Account', my: 'အကောင့် ဖျက်သိမ်းမည်' },
    preferencesTitle: { en: 'Preferences', my: 'ဦးစားပေး ရွေးချယ်မှုများ' },
    preferencesDesc: { en: 'Customize your language, audio, and appearance settings.', my: 'ဘာသာစကား၊ အသံနှင့် မြင်ကွင်းပုံစံများကို မိမိစိတ်ကြိုက် ရွေးချယ်ပါ။' },
    languageSelection: { en: 'Display Language', my: 'ပြသလိုသော ဘာသာစကား' },
    languageDesc: { en: 'Choose your preferred interface language across the platform.', my: 'စနစ်တစ်ခုလုံးတွင် အသုံးပြုလိုသော ဘာသာစကားကို ရွေးချယ်ပါ။' },
    themeMode: { en: 'Theme Mode', my: 'မျက်နှာပြင် အရောင်အသွေး (Theme)' },
    themeDesc: { en: 'Toggle dark and light mode', my: 'Dark Mode နှင့် Light Mode အကူးအပြောင်း ပြုလုပ်ပါ' },
    soundEffects: { en: 'Sound Effects', my: 'အသံထွက်များ (Sound Effects)' },
    soundDesc: { en: 'Play sound effects in lessons', my: 'သင်ခန်းစာ ဖြေဆိုချိန်များတွင် အသံဖွင့်/ပိတ် ပြုလုပ်ပါ' },
  },

  // Profile
  profile: {
    title: { en: 'Profile', my: 'ပရိုဖိုင်' },
    profileShowcase: { en: 'Profile Showcase', my: 'ပရိုဖိုင် ဂုဏ်ပြုဆုများ' },
    statistics: { en: 'Statistics', my: 'သင်ယူမှု စာရင်းအင်းများ' },
    streak: { en: 'Day Streak', my: 'ရက်ဆက် လေ့လာမှု' },
    totalXp: { en: 'Total XP', my: 'စုစုပေါင်း XP' },
    currentLeague: { en: 'Current League', my: 'လက်ရှိ League အဆင့်' },
    topFinishes: { en: 'Top 3 Finishes', my: 'ထိပ်တန်း ၃ နေရာ ဝင်မှု' },
    achievements: { en: 'Achievements', my: 'အောင်လက်မှတ် ဆုတံဆိပ်များ' },
    following: { en: 'Following', my: 'လေ့လာဖော်များ (Following)' },
    followers: { en: 'Followers', my: 'နောက်လိုက်များ (Followers)' },
    changeAvatar: { en: 'Change Avatar', my: 'Avatar ရုပ်ပုံ ပြောင်းမည်' },
    editProfile: { en: 'Edit Profile', my: 'ပရိုဖိုင် ပြင်ဆင်မည်' },
    editName: { en: 'Edit Name', my: 'အမည် ပြင်ဆင်မည်' },
    saveChanges: { en: 'Save Changes', my: 'သိမ်းဆည်းမည်' },
    cancel: { en: 'Cancel', my: 'မလုပ်တော့ပါ' },
    searchFriends: { en: 'Search friends...', my: 'သူငယ်ချင်း ရှာဖွေပါ...' },
    follow: { en: 'Follow', my: 'Follow လုပ်မည်' },
    unfollow: { en: 'Following', my: 'Following' },
    wildfire: { en: 'Wildfire', my: 'Wildfire' },
    wildfireDesc: { en: 'Reach a streak of days', my: 'ရက်ဆက် လေ့လာမှု ပြုလုပ်ပါ' },
    sage: { en: 'Sage', my: 'Sage' },
    sageDesc: { en: 'Earn total XP points', my: 'စုစုပေါင်း XP များ ရယူပါ' },
    scholar: { en: 'Scholar', my: 'Scholar' },
    scholarDesc: { en: 'Complete curriculum lessons', my: 'သင်ခန်းစာများကို အောင်မြင်စွာ ပြီးမြောက်ပါ' },
    challenger: { en: 'Challenger', my: 'Challenger' },
    challengerDesc: { en: 'Solve advanced coding challenges', my: 'ကုတ်ဒင်း စိန်ခေါ်မှုများကို ဖြေရှင်းပါ' },
    sharpshooter: { en: 'Sharpshooter', my: 'Sharpshooter' },
    sharpshooterDesc: { en: 'Complete lessons with 100% accuracy', my: 'သင်ခန်းစာများကို အမှားမရှိ ပြီးမြောက်ပါ' },
    bigspender: { en: 'Big Spender', my: 'Big Spender' },
    bigspenderDesc: { en: 'Purchase power-ups in the shop', my: 'ဆိုင်မှ ပစ္စည်းများ ဝယ်ယူပါ' },
  },

  // Leaderboard
  leaderboard: {
    title: { en: 'Leaderboard', my: 'ခေါင်းဆောင်များ အဆင့်ဇယား' },
    subtitle: { en: 'Real-time student rankings across all courses', my: 'သင်တန်းသားများ၏ အချိန်နှင့်တပြေးညီ အဆင့်သတ်မှတ်ချက်များ' },
    league: { en: 'League', my: 'လိဂ်' },
    competingDesc: { en: 'You are currently competing in this league!', my: 'သင်သည် လက်ရှိတွင် ဤလိဂ်၌ ပါဝင်ယှဉ်ပြိုင်နေပါသည်!' },
    advanceDesc: { en: 'Advance through the lessons to climb to higher leagues.', my: 'ပိုမိုမြင့်မားသော လိဂ်များသို့ တက်လှမ်းရန် သင်ခန်းစာများကို ဆက်လက်လေ့လာပါ။' },
    yourRank: { en: 'YOUR CURRENT RANK', my: 'သင်၏ လက်ရှိအဆင့်' },
    rankAndStudent: { en: 'Rank & Student', my: 'အဆင့် နှင့် ကျောင်းသား' },
    totalXp: { en: 'Total XP', my: 'စုစုပေါင်း XP' },
    loading: { en: 'Loading rankings...', my: 'အဆင့်များကို ရယူနေပါသည်...' },
    you: { en: 'YOU', my: 'သင်' },
    tiers: {
      bronze: { en: 'Bronze', my: 'ကြေး (Bronze)' },
      silver: { en: 'Silver', my: 'ငွေ (Silver)' },
      gold: { en: 'Gold', my: 'ရွှေ (Gold)' },
      platinum: { en: 'Platinum', my: 'ပလက်တီနမ် (Platinum)' },
      diamond: { en: 'Diamond', my: 'စိန် (Diamond)' },
      ruby: { en: 'Ruby', my: 'ပတ္တမြား (Ruby)' },
    },
  },

  // Quests
  quests: {
    title: { en: 'Quests', my: 'မစ်ရှင်များနှင့် ဆုလာဘ်များ' },
    daily: { en: 'Daily Quests', my: 'နေ့စဉ် မစ်ရှင်များ' },
    monthly: { en: 'Monthly Quests', my: 'လစဉ် မစ်ရှင်များ' },
    claim: { en: 'CLAIM REWARD', my: 'ဆုလာဘ် ရယူမည်' },
    claimed: { en: 'CLAIMED', my: 'ရယူပြီး' },
    inProgress: { en: 'IN PROGRESS', my: 'လုပ်ဆောင်ဆဲ' },
    earn50Xp: { en: 'Earn 50 XP', my: 'XP ၅၀ ရယူပါ' },
    complete3Lessons: { en: 'Complete 3 Lessons', my: 'သင်ခန်းစာ ၃ ခု ပြီးမြောက်ပါ' },
    scorePerfect: { en: 'Score a perfect lesson', my: 'သင်ခန်းစာတစ်ခုကို အမှားမရှိ ဖြေဆိုပါ' },
    earn1000Xp: { en: 'Earn 1000 XP', my: 'XP ၁,၀၀၀ ရယူပါ' },
    reach7Streak: { en: 'Reach a 7-day streak', my: '၇ ရက် ဆက်တိုက် streak ရယူပါ' },
  },

  // Shop
  shop: {
    title: { en: 'Shop', my: 'ပစ္စည်းအရောင်းဆိုင်' },
    insufficientGems: { en: '💎 Not enough Gems!', my: '💎 Gems မလုံလောက်ပါ!' },
    successPurchased: { en: 'Successfully purchased', my: 'ဝယ်ယူမှု အောင်မြင်ပါသည် -' },
    failedPurchased: { en: 'Failed to purchase. (Check if hearts are already full)', my: 'ဝယ်ယူမှု မအောင်မြင်ပါ။ (Hearts ပြည့်နေခြင်း ရှိမရှိ စစ်ဆေးပါ)' },
    buy: { en: 'BUY', my: 'ဝယ်မည်' },
    currentHearts: { en: 'Hearts', my: 'Hearts' },
    currentGems: { en: 'Gems', my: 'Gems' },
    items: {
      heartRefill: {
        name: { en: 'Heart Refill', my: 'Hearts ပြန်ဖြည့်ခြင်း' },
        desc: { en: 'Refill to 5 hearts', my: 'Hearts ၅ ခု အပြည့် ပြန်ဖြည့်ပါ' },
      },
      streakFreeze: {
        name: { en: 'Streak Freeze', my: 'Streak ထိန်းသိမ်းခြင်း' },
        desc: { en: 'Keep your streak active if you miss a day', my: 'တစ်ရက်မလေ့ကျင့်ရင်တောင် streak မကျပါ' },
      },
      doubleXp: {
        name: { en: 'Double XP (15 min)', my: 'XP ၂ ဆ တိုးမြှင့်ခြင်း' },
        desc: { en: 'Earn 2x XP for 15 minutes', my: '၁၅ မိနစ်အတွင်း XP ၂ ဆ ရရှိပါမည်' },
      },
      heartShield: {
        name: { en: 'Heart Shield', my: 'Heart အကာအကွယ်' },
        desc: { en: 'Prevents losing a heart on next mistake', my: 'နောက်တစ်ခေါက် မှားရင် heart မနုတ်ပါ' },
      },
    },
  },

  // Coding Challenges
  challenge: {
    title: { en: 'Coding Challenges', my: 'ကုတ်ဒင်း စိန်ခေါ်မှုများ' },
    noChallenges: { en: 'No challenges available', my: 'စိန်ခေါ်မှုများ မရှိသေးပါ' },
    waitTeacher: { en: 'Wait for your teachers to create new challenges.', my: 'ဆရာများမှ စိန်ခေါ်မှုအသစ်များ ထည့်သွင်းပေးသည်အထိ စောင့်ဆိုင်းပေးပါ။' },
    startChallenge: { en: 'START CHALLENGE', my: 'စတင် ယှဉ်ပြိုင်မည်' },
    completed: { en: 'COMPLETED', my: 'အောင်မြင်ပြီး' },
    easy: { en: 'Easy', my: 'လွယ်ကူ' },
    medium: { en: 'Medium', my: 'အလယ်အလတ်' },
    hard: { en: 'Hard', my: 'ခက်ခဲ' },
  },

  // Help & Support
  help: {
    title: { en: 'Help & Support', my: 'အကူအညီနှင့် ဝန်ဆောင်မှု' },
    faqTitle: { en: 'Frequently Asked Questions', my: 'မကြာခဏ မေးလေ့ရှိသော မေးခွန်းများ' },
    contactSupport: { en: 'Contact Support', my: 'အကူအညီ တောင်းခံရန်' },
    askQuestion: { en: 'Have a question? We are here to help.', my: 'သိလိုသည်များ ရှိပါက ကျွန်ုပ်တို့ထံ မေးမြန်းနိုင်ပါသည်။' },
    faqs: [
      {
        question: { en: 'How do I earn XP and Gems?', my: 'XP နှင့် Gems များကို မည်သို့ ရယူနိုင်သနည်း။' },
        answer: { en: 'You earn XP and Gems by completing lessons and challenges. Daily quests also provide bonus rewards!', my: 'သင်ခန်းစာများနှင့် စိန်ခေါ်မှုများကို ဖြေဆိုပြီးမြောက်ခြင်းဖြင့် XP နှင့် Gems များ ရရှိနိုင်ပါသည်။ နေ့စဉ်မစ်ရှင်များမှလည်း အပိုဆုလာဘ်များ ရရှိနိုင်ပါသည်။' }
      },
      {
        question: { en: 'What happens if I run out of hearts?', my: 'Hearts များ ကုန်သွားပါက ဘာဖြစ်မည်နည်း။' },
        answer: { en: 'If you lose all your hearts, you cannot start new lessons. Hearts regenerate over time, or you can refill them in the Shop using Gems.', my: 'Hearts များ ကုန်သွားပါက သင်ခန်းစာအသစ်များ စတင်နိုင်မည် မဟုတ်ပါ။ အချိန်အတိုင်းအတာတစ်ခုအကြာတွင် Hearts များ အလိုအလျောက် ပြန်လည်ပြည့်လာမည်ဖြစ်ပြီး Shop တွင်လည်း Gems သုံး၍ ချက်ချင်း ပြန်ဖြည့်နိုင်ပါသည်။' }
      },
      {
        question: { en: 'How do I change my avatar?', my: 'မိမိ၏ Avatar ရုပ်ပုံကို မည်သို့ ပြောင်းလဲနိုင်သနည်း။' },
        answer: { en: 'Go to your Profile page and click on your current avatar to open the avatar selection menu. Some avatars may require unlocking.', my: 'Profile စာမျက်နှာသို့ သွားပြီး လက်ရှိ Avatar ပေါ်တွင် နှိပ်ကာ မိမိနှစ်သက်ရာ ရုပ်ပုံကို ပြောင်းလဲနိုင်ပါသည်။' }
      },
      {
        question: { en: 'Are there leaderboards?', my: 'အဆင့်ဇယားများ (Leaderboards) ရှိပါသလား။' },
        answer: { en: 'Yes! Compete with other learners in weekly leagues. The top users in each league are promoted to higher tiers.', my: 'ရှိပါသည်! အပတ်စဉ် လိဂ်များတွင် အခြားသင်တန်းသားများနှင့် ယှဉ်ပြိုင်နိုင်ပြီး ထိပ်ဆုံး အဆင့်ရရှိသူများသည် ပိုမိုမြင့်မားသော လိဂ်များသို့ တက်လှမ်းနိုင်မည် ဖြစ်ပါသည်။' }
      }
    ]
  }
};

// Curriculum Title Localizations (Preserving Technical Terms)
const lessonTitleMap: Record<string, { en: string; my: string }> = {
  'Output ထုတ်ခြင်း (print function)': {
    en: 'Printing Output (print function)',
    my: 'Output ထုတ်ခြင်း (print function)',
  },
  'String Formatting (.format method)': {
    en: 'String Formatting (.format method)',
    my: 'String Formatting (.format method)',
  },
  'F-String သုံးစွဲခြင်း (Modern Interpolation)': {
    en: 'Using F-Strings (Modern Interpolation)',
    my: 'F-String သုံးစွဲခြင်း (Modern Interpolation)',
  },
  'Data Type စစ်ဆေးခြင်း (type function)': {
    en: 'Checking Data Types (type function)',
    my: 'Data Type စစ်ဆေးခြင်း (type function)',
  },
  'Type Casting ပြောင်းလဲခြင်း (int & float)': {
    en: 'Type Casting Conversion (int & float)',
    my: 'Type Casting ပြောင်းလဲခြင်း (int & float)',
  },
  'Variable Assignment & Output': {
    en: 'Variable Assignment & Output',
    my: 'Variable Assignment နှင့် Output ထုတ်ခြင်း',
  },
  'If Statement ရေးသားခြင်း': {
    en: 'Writing If Statements',
    my: 'If Statement ရေးသားခြင်း',
  },
  'If-Elif-Else အဆင့်ဆင့်စစ်ဆေးခြင်း': {
    en: 'Multi-Condition Checks (If-Elif-Else)',
    my: 'If-Elif-Else အဆင့်ဆင့်စစ်ဆေးခြင်း',
  },
  'Pass/Fail စစ်ဆေးသည့် ပရိုဂရမ် (Code Fix)': {
    en: 'Pass/Fail Evaluation Program (Code Fix)',
    my: 'Pass/Fail စစ်ဆေးသည့် ပရိုဂရမ် (Code Fix)',
  },
  'For Loop & range() Function': {
    en: 'For Loop & range() Function',
    my: 'For Loop & range() Function အသုံးပြုခြင်း',
  },
  'While Loop ရေးသားခြင်း (Code Fix)': {
    en: 'Writing While Loops (Code Fix)',
    my: 'While Loop ရေးသားခြင်း (Code Fix)',
  },
  'Negative Indexing စနစ်': {
    en: 'Negative Indexing System',
    my: 'Negative Indexing စနစ်',
  },
  'List သို့ Item အသစ်ထည့်ခြင်း (.append)': {
    en: 'Appending Items to List (.append)',
    my: 'List သို့ Item အသစ်ထည့်ခြင်း (.append)',
  },
  'List ပေါင်းလဒ်တွက်ချက်ခြင်း (Code Fix)': {
    en: 'Calculating List Sum (Code Fix)',
    my: 'List ပေါင်းလဒ်တွက်ချက်ခြင်း (Code Fix)',
  },
  'Dictionary Keys & Lookup သဘောတရား': {
    en: 'Dictionary Keys & Lookup Concepts',
    my: 'Dictionary Keys & Lookup သဘောတရား',
  },
  'Safe Retrieval with .get() Method': {
    en: 'Safe Retrieval with .get() Method',
    my: '.get() Method ဖြင့် လုံခြုံစွာ Data ဆွဲထုတ်ခြင်း',
  },
  'Dictionary တည်ဆောက်ပြီး Output ထုတ်ခြင်း': {
    en: 'Building Dictionaries & Output',
    my: 'Dictionary တည်ဆောက်ပြီး Output ထုတ်ခြင်း',
  },
  'Function Return Value vs Print': {
    en: 'Function Return Value vs Print',
    my: 'Function တွင် Return Value နှင့် Print ကွာခြားချက်',
  },
  'Function ရေးသားခြင်း Syntax': {
    en: 'Function Definition Syntax',
    my: 'Function ရေးသားခြင်း Syntax',
  },
  'Square Number Function (Code Fix)': {
    en: 'Square Number Function (Code Fix)',
    my: 'Square Number Function ရေးသားခြင်း (Code Fix)',
  },
  'Class နှင့် Object အခြေခံ သဘောတရား': {
    en: 'Class & Object Core Concepts',
    my: 'Class နှင့် Object အခြေခံ သဘောတရား',
  },
  '__init__ Constructor ရေးသားခြင်း': {
    en: 'Writing __init__ Constructor',
    my: '__init__ Constructor ရေးသားခြင်း',
  },
  'Class Method ရေးသားခြင်း (Code Fix)': {
    en: 'Writing Class Methods (Code Fix)',
    my: 'Class Method ရေးသားခြင်း (Code Fix)',
  },
  'Inheritance (အမွေဆက်ခံခြင်း) သဘောတရား': {
    en: 'OOP Inheritance Concepts',
    my: 'Inheritance (အမွေဆက်ခံခြင်း) သဘောတရား',
  },
  'Inheritance Syntax တည်ဆောက်ခြင်း': {
    en: 'Building Inheritance Syntax',
    my: 'Inheritance Syntax တည်ဆောက်ခြင်း',
  },
  'Method Overriding & Polymorphism (Code Fix)': {
    en: 'Method Overriding & Polymorphism (Code Fix)',
    my: 'Method Overriding & Polymorphism (Code Fix)',
  },
};

export const getLocalizedLessonTitle = (title: string, lang: Language): string => {
  if (!title) return '';
  const match = lessonTitleMap[title.trim()];
  if (match) return match[lang];

  if (lang === 'en') {
    // If English, remove burmese annotations in parentheses
    return title.replace(/[က-႟ꩠ-ꩿꧠ-꧿]+/g, '').replace(/\s*\(\s*\)/g, '').trim() || title;
  }
  return title;
};

export const getLocalizedModuleTitle = (title: string, lang: Language): string => {
  if (!title) return '';
  const burmeseRegex = /[\u1000-\u109F\uAA60-\uAA7F\uA9E0-\uA9FF]/;
  const burmeseParenthesesRegex = /\s*\([\u1000-\u109F\uAA60-\uAA7F\uA9E0-\uA9FF\s\S]*?\)/g;

  if (lang === 'en') {
    // English mode: Return clean English portion with any Burmese text or parentheses completely stripped
    return title.replace(burmeseParenthesesRegex, '').replace(/[\u1000-\u109F\uAA60-\uAA7F\uA9E0-\uA9FF]+/g, '').trim() || title;
  }

  // Myanmar mode: Extract clean Burmese title if available
  const match = title.match(/\(([\u1000-\u109F\uAA60-\uAA7F\uA9E0-\uA9FF\s\S]+?)\)/);
  if (match && match[1] && burmeseRegex.test(match[1])) {
    const prefixMatch = title.match(/^(MODULE\s*[\d.]+:?)\s*/i);
    const prefix = prefixMatch ? prefixMatch[1] + ' ' : '';
    return `${prefix}${match[1].trim()}`;
  }
  return title;
};

export const getLocalizedUnitTitle = (title: string, lang: Language): string => {
  if (!title) return '';
  const burmeseRegex = /[\u1000-\u109F\uAA60-\uAA7F\uA9E0-\uA9FF]/;
  const burmeseParenthesesRegex = /\s*\([\u1000-\u109F\uAA60-\uAA7F\uA9E0-\uA9FF\s\S]*?\)/g;

  if (lang === 'en') {
    // Strip Myanmar portion in parentheses
    return title.replace(burmeseParenthesesRegex, '').replace(/[\u1000-\u109F\uAA60-\uAA7F\uA9E0-\uA9FF]+/g, '').trim() || title;
  }

  const match = title.match(/\(([\u1000-\u109F\uAA60-\uAA7F\uA9E0-\uA9FF\s\S]+?)\)/);
  if (match && match[1] && burmeseRegex.test(match[1])) {
    const prefixMatch = title.match(/^(Unit\s*\d+:?)\s*/i);
    const prefix = prefixMatch ? prefixMatch[1] + ' ' : '';
    return `${prefix}${match[1].trim()}`;
  }
  return title;
};


const contentTranslations: Record<string, string> = {
  // Lesson 6
  '## Variable သတ်မှတ်ခြင်း': '## Variable Assignment',
  'Variable နာမည် `score` တွင် တန်ဖိုး `100` ကို သတ်မှတ်ပြီး `print(score)` ဖြင့် ထုတ်ပြပါ။': 'Assign the value `100` to the variable `score` and output it using `print(score)`.',
  // Lesson 1
  '## Python Output စနစ်': '## Python Output System',
  'Python မှာ screen ပေါ်သို့ စာသား သို့မဟုတ် တန်ဖိုးများကို ထုတ်ပြရန် print() function ကို အသုံးပြုပါသည်။': 'In Python, the print() function is used to output text or values to the screen.',
  // Lesson 9
  '## အမှတ်စစ်ဆေးခြင်း': '## Score Evaluation',
  'ကျောင်းသား၏ `score = 75` ဖြစ်သည်။ အမှတ် `50` သို့မဟုတ် ၎င်းထက်ကြီးပါက `Pass` ဟု print လုပ်ပါ၊ မဟုတ်ပါက `Fail` ဟု print လုပ်ပါ။': 'The student has `score = 75`. If the score is 50 or greater, print `Pass`, otherwise print `Fail`.',
  // Lesson 11
  '## While Loop': '## While Loop',
  '`while` loop သည် condition မမှန်မချင်း အလုပ်ဆက်လုပ်သည်။': 'A `while` loop continues executing as long as the condition holds true.',
  '`Hello` ဟု စာသားကို ၃ ကြိမ် တိတိ print ထုတ်ရန် while loop ကို ပြင်ဆင်ပါ။': 'Fix the while loop to print `Hello` exactly 3 times.',
  // Lesson 14
  '## List Manipulation': '## List Manipulation',
  'ပေးထားသော numbers စာရင်း `[10, 20, 30]` ၏ စုစုပေါင်း ပေါင်းလဒ်ကို `sum()` ဖြင့် ရှာဖွေ print ထုတ်ပါ။': 'Find and print the total sum of the given numbers list `[10, 20, 30]` using `sum()`.',
  // Lesson 17
  '## Dictionary လက်တွေ့ဖန်တီးခြင်း': '## Practical Dictionary Creation',
  '`book` dictionary ထဲတွင် `title` ကို `Python Pro` ဟု သတ်မှတ်ပြီး ၎င်း title ကို print ထုတ်ပြပါ။': 'In the `book` dictionary, set `title` to `Python Pro` and print that title.',
  // Lesson 20
  '## Function ရေးသားလက်တွေ့စမ်းသပ်ခြင်း': '## Practical Function Implementation',
  'ပေးထားသော parameter `n` ကို နှစ်ထပ်ကိန်း (Square) ရှာပြီး print ထုတ်ပေးသည့် function ကို ပြင်ဆင်ပါ။': 'Fix the function that calculates the square of parameter `n` and prints it.',
  // Lesson 23
  '## Class ထဲတွင် Method ရေးသားခြင်း': '## Writing Methods in a Class',
  '`Dog` class တွင် `bark()` method တစ်ခုပါဝင်ပြီး ခေါ်ယူပါက `Woof Woof!` ဟု print လုပ်ပေးရမည်။': 'The `Dog` class contains a `bark()` method that prints `Woof Woof!` when invoked.',
  // Lesson 26
  '## Method Overriding (ပြန်လည်အစားထိုးခြင်း)': '## Method Overriding',
  'Parent class ရှိ method အဟောင်းကို Child class တွင် မိမိစိတ်ကြိုက် အသစ်ပြန်လည်ရေးသားခြင်းကို Method Overriding ဟုခေါ်သည်။': 'Replacing an existing parent class method with a custom implementation in a child class is called Method Overriding.',
  '`Robot` ၏ `greet()` method ကို override လုပ်ပြီး `I am AI` ဟု ထုတ်ပေးပါ။': 'Override the `greet()` method of `Robot` to output `I am AI`.',
};

export const getLocalizedContentText = (content: string, lang: Language): string => {
  if (!content || lang === 'my') return content;
  let translated = content;
  for (const [burmese, english] of Object.entries(contentTranslations)) {
    translated = translated.replaceAll(burmese, english);
  }
  translated = translated
    .replace(/\*\*မစ်ရှင်:\*\*/g, '**Mission:**')
    .replace(/\*\*မျှော်လင့်ထားသော Output:\*\*/g, '**Expected Output:**')
    .replace(/ကွက်လပ်ဖြည့်ပါ။/g, 'Fill in the blank.')
    .replace(/မှန်ကန်သော အဖြေကို ရွေးချယ်ပါ။/g, 'Choose the correct answer.');
  return translated;
};
