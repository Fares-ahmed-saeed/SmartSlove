import { useSettings } from './useSettings';

const translations = {
  ar: {
    // Navigation
    calculator: 'حاسبة',
    programmer: 'برمجة',
    converter: 'تحويل',
    graphing: 'رسم',
    settings: 'الإعدادات',
    ai: 'ذكاء اصطناعي',
    currency: 'عملات',
    investment: 'استثمار',
    
    // Calculator Page
    basicCalculator: 'الآلة الحاسبة الأساسية',
    scientificCalculator: 'الآلة الحاسبة العلمية',
    basic: 'أساسي',
    scientific: 'علمي',
    
    // AI Calculator
    aiCalculator: 'حاسبة الذكاء الاصطناعي',
    
    // Currency Converter
    currencyConverter: 'محول العملات',
    
    // Investment Calculator
    investmentCalculator: 'حاسبة الاستثمار',
    
    // Graphing Calculator
    graphingCalculator: 'الآلة الحاسبة البيانية',
    plotSettings: 'إعدادات الرسم',
    equation: 'المعادلة',
    equationPlaceholder: 'مثال: x^2 + 2*x + 1',
    xMin: 'X الأدنى',
    xMax: 'X الأعلى',
    yMin: 'Y الأدنى',
    yMax: 'Y الأعلى',
    plotEquation: 'ارسم المعادلة',
    commonFunctions: 'دوال شائعة',
    graph: 'الرسم البياني',
    currentEquation: 'المعادلة الحالية',
    range: 'النطاق',
    
    // Unit Converter
    unitConverter: 'محول الوحدات',
    conversionType: 'نوع التحويل',
    from: 'من',
    to: 'إلى',
    value: 'القيمة',
    result: 'النتيجة',
    enterValue: 'أدخل القيمة',
    unitType: 'نوع الوحدة',
    conversionResult: 'نتيجة التحويل',
    
    // Conversion types
    length: 'الطول',
    weight: 'الوزن',
    temperature: 'درجة الحرارة',
    volume: 'الحجم',
    area: 'المساحة',
    time: 'الوقت',
    speed: 'السرعة',
    
    // Length units
    meter: 'متر',
    kilometer: 'كيلومتر',
    centimeter: 'سنتيمتر',
    millimeter: 'مليمتر',
    inch: 'بوصة',
    foot: 'قدم',
    yard: 'ياردة',
    mile: 'ميل',
    
    // Weight units
    kilogram: 'كيلوجرام',
    gram: 'جرام',
    pound: 'رطل',
    ounce: 'أونصة',
    ton: 'طن',
    
    // Temperature units
    celsius: 'مئوية',
    fahrenheit: 'فهرنهايت',
    kelvin: 'كلفن',
    
    // Volume units
    liter: 'لتر',
    milliliter: 'مليلتر',
    gallon: 'جالون',
    quart: 'كوارت',
    cup: 'كوب',
    
    // Area units
    squareMeter: 'متر مربع',
    squareKilometer: 'كيلومتر مربع',
    squareFoot: 'قدم مربع',
    acre: 'فدان',
    hectare: 'هكتار',
    
    // Time units
    second: 'ثانية',
    minute: 'دقيقة',
    hour: 'ساعة',
    day: 'يوم',
    week: 'أسبوع',
    month: 'شهر',
    year: 'سنة',
    
    // Speed units
    meterPerSecond: 'متر/ثانية',
    kilometerPerHour: 'كم/ساعة',
    milePerHour: 'ميل/ساعة',
    knot: 'عقدة',
    
    // Settings
    appearance: 'المظهر',
    chooseTheme: 'اختر المظهر المناسب لك',
    light: 'فاتح',
    dark: 'غامق',
    sound: 'الصوت',
    buttonSounds: 'تفعيل أو إلغاء أصوات الأزرار',
    buttonSoundsLabel: 'أصوات الأزرار',
    vibration: 'الاهتزاز',
    buttonVibration: 'تفعيل الاهتزاز عند الضغط على الأزرار',
    buttonVibrationLabel: 'اهتزاز الأزرار',
    language: 'اللغة',
    chooseLanguage: 'اختر لغة التطبيق',
    arabic: 'العربية',
    english: 'English',
    appInfo: 'معلومات التطبيق',
    version: 'الإصدار',
    developer: 'المطور',
    appLanguage: 'اللغة',
    additionalFeatures: 'ميزات إضافية',
    moreOptions: 'مزيد',
    saveOperations: 'حفظ العمليات',
    scientificDefault: 'الوضع العلمي افتراضي',
    history: 'التاريخ',
    scientificDefault: 'الوضع العلمي افتراضي',

    // Calculator History
    calculatorHistory: 'تاريخ الحاسبة',
    saved: 'محفوظة',
    noHistory: 'لا يوجد تاريخ',
    noSavedResults: 'لا توجد نتائج محفوظة',
    operations: 'عمليات',
    savedResults: 'نتائج محفوظة',
    clearHistory: 'مسح التاريخ',
    clearSaved: 'مسح المحفوظات',
    keyboardSupport: 'دعم لوحة المفاتيح',

    // Graphing Calculator enhancements
    equations: 'المعادلات',
    addEquation: 'إضافة معادلة',
    importantPoints: 'النقاط المهمة',
    roots: 'الجذور',
    intersections: 'التقاطعات',
    extrema: 'النقاط القصوى',
    noPointsFound: 'لم يتم العثور على نقاط مهمة',
    dragToPan: 'اسحب للتحريك',
    scrollToZoom: 'اسحب بالعجلة للتكبير',
    export: 'تصدير',
    zoomIn: 'تكبير',
    zoomOut: 'تصغير',
    resetView: 'إعادة تعيين العرض',
    
    // Social Features
    socialFeatures: 'الميزات الاجتماعية',
    shareAndExport: 'مشاركة وتصدير وحفظ الحسابات',
    shareCalculations: 'مشاركة الحسابات',
    exportPDF: 'تصدير PDF',
    exportExcel: 'تصدير Excel',
    backupHistory: 'نسخ احتياطي للسجل',
    createCollaborativeWorkspace: 'إنشاء مساحة عمل تعاونية',
  },
  en: {
    // Navigation - نصوص مختصرة للتنقل
    calculator: 'Calc',
    programmer: 'Code',
    converter: 'Convert',
    graphing: 'Graph',
    settings: 'Settings',
    ai: 'AI',
    currency: 'Money',
    investment: 'Invest',
    
    // Calculator Page
    basicCalculator: 'Basic Calculator',
    scientificCalculator: 'Scientific Calculator',
    basic: 'Basic',
    scientific: 'Scientific',
    
    // AI Calculator
    aiCalculator: 'AI Calculator',
    
    // Currency Converter
    currencyConverter: 'Currency Converter',
    
    // Investment Calculator
    investmentCalculator: 'Investment Calculator',
    
    // Graphing Calculator
    graphingCalculator: 'Graphing Calculator',
    plotSettings: 'Plot Settings',
    equation: 'Equation',
    equationPlaceholder: 'Example: x^2 + 2*x + 1',
    xMin: 'X Min',
    xMax: 'X Max',
    yMin: 'Y Min',
    yMax: 'Y Max',
    plotEquation: 'Plot Equation',
    commonFunctions: 'Common Functions',
    graph: 'Graph',
    currentEquation: 'Current Equation',
    range: 'Range',
    
    // Unit Converter
    unitConverter: 'Unit Converter',
    conversionType: 'Conversion Type',
    from: 'From',
    to: 'To',
    value: 'Value',
    result: 'Result',
    enterValue: 'Enter value',
    unitType: 'Unit Type',
    conversionResult: 'Conversion Result',
    
    // Conversion types
    length: 'Length',
    weight: 'Weight',
    temperature: 'Temperature',
    volume: 'Volume',
    area: 'Area',
    time: 'Time',
    speed: 'Speed',
    
    // Length units
    meter: 'Meter',
    kilometer: 'Kilometer',
    centimeter: 'Centimeter',
    millimeter: 'Millimeter',
    inch: 'Inch',
    foot: 'Foot',
    yard: 'Yard',
    mile: 'Mile',
    
    // Weight units
    kilogram: 'Kilogram',
    gram: 'Gram',
    pound: 'Pound',
    ounce: 'Ounce',
    ton: 'Ton',
    
    // Temperature units
    celsius: 'Celsius',
    fahrenheit: 'Fahrenheit',
    kelvin: 'Kelvin',
    
    // Volume units
    liter: 'Liter',
    milliliter: 'Milliliter',
    gallon: 'Gallon',
    quart: 'Quart',
    cup: 'Cup',
    
    // Area units
    squareMeter: 'Square Meter',
    squareKilometer: 'Square Kilometer',
    squareFoot: 'Square Foot',
    acre: 'Acre',
    hectare: 'Hectare',
    
    // Time units
    second: 'Second',
    minute: 'Minute',
    hour: 'Hour',
    day: 'Day',
    week: 'Week',
    month: 'Month',
    year: 'Year',
    
    // Speed units
    meterPerSecond: 'Meter/Second',
    kilometerPerHour: 'Km/Hour',
    milePerHour: 'Mile/Hour',
    knot: 'Knot',
    
    // Settings
    appearance: 'Appearance',
    chooseTheme: 'Choose your preferred theme',
    light: 'Light',
    dark: 'Dark',
    sound: 'Sound',
    buttonSounds: 'Enable or disable button sounds',
    buttonSoundsLabel: 'Button Sounds',
    vibration: 'Vibration',
    buttonVibration: 'Enable vibration on button press',
    buttonVibrationLabel: 'Button Vibration',
    language: 'Language',
    chooseLanguage: 'Choose app language',
    arabic: 'العربية',
    english: 'English',
    appInfo: 'App Information',
    version: 'Version',
    developer: 'Developer',
    appLanguage: 'Language',
    additionalFeatures: 'Additional Features',
    moreOptions: 'More',
    saveOperations: 'Save Operations',
    scientificDefault: 'Scientific Mode Default',
    history: 'History',
    saved: 'Saved',
    noHistory: 'No history',
    noSavedResults: 'No saved results',
    operations: 'Operations',
    savedResults: 'Saved Results',
    clearHistory: 'Clear History',
    clearSaved: 'Clear Saved',
    keyboardSupport: 'Keyboard Support',

    // Graphing Calculator enhancements
    equations: 'Equations',
    addEquation: 'Add Equation',
    importantPoints: 'Important Points',
    roots: 'Roots',
    intersections: 'Intersections',
    extrema: 'Extrema',
    noPointsFound: 'No important points found',
    dragToPan: 'Drag to pan',
    scrollToZoom: 'Scroll to zoom',
    export: 'Export',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',
    resetView: 'Reset View',
    },
  };

export const useTranslation = () => {
  const { language } = useSettings();
  
  const t = (key: keyof typeof translations.ar): string => {
    return translations[language][key] || key;
  };

  return { t, language };
};
