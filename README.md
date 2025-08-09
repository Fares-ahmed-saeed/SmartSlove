# 🧮 آلة حاسبة متقدمة | Advanced Calculator

<div align="center">

**Calculator v2.0 | MIT License | JavaScript | Web Platform**

<a href="[https://smart-solve.vercel.app/](https://smart-slove.vercel.app/)" target="_blank" rel="noopener noreferrer">
  <img src="https://img.shields.io/badge/🧮_SmartSolve_Demo-4ECDC4?style=for-the-badge&logoColor=white" alt="SmartSolve Demo" />
</a>


*A powerful and modern calculator with sleek UI and advanced features*

</div>

## 📋 جدول المحتويات | Table of Contents

- [نظرة عامة | Overview](#نظرة-عامة--overview)
- [الميزات | Features](#الميزات--features)
- [التثبيت | Installation](#التثبيت--installation)
- [الاستخدام | Usage](#الاستخدام--usage)

- [التقنيات المستخدمة | Technologies](#التقنيات-المستخدمة--technologies)
- [الهيكل | Structure](#الهيكل--structure)
- [التطوير | Development](#التطوير--development)
- [المساهمة | Contributing](#المساهمة--contributing)
- [الترخيص | License](#الترخيص--license)

## 🌟 نظرة عامة | Overview

### العربية
آلة حاسبة متطورة مبنية بتقنيات الويب الحديثة، تتميز بتصميم أنيق وسهولة في الاستخدام. تدعم العمليات الحسابية الأساسية والمتقدمة مع واجهة مستخدم تفاعلية ومتجاوبة.



## ⚡ الميزات | Features

### الميزات الأساسية | Core Features
- 🧮 **عمليات حسابية أساسية** | Basic arithmetic operations (+, -, ×, ÷)
- 📐 **عمليات متقدمة** | Advanced operations (√, x², %, sin, cos, tan)
- 🎯 **دقة عالية** | High precision calculations
- ⌨️ **دعم لوحة المفاتيح** | Keyboard support
- 📱 **تصميم متجاوب** | Responsive design
- 🌙 **الوضع المظلم/الفاتح** | Dark/Light mode toggle

### 🎨 واجهة المستخدم | User Interface
- 💫 **تأثيرات بصرية سلسة** | Smooth visual effects
- 🎭 **تصميم عصري وأنيق** | Modern and elegant design
- 🔄 **انتقالات متحركة** | Animated transitions
- 📊 **تاريخ العمليات** | Calculation history
- 🎪 **أصوات التفاعل** | Interactive sound effects

### 🛠️ ميزات تقنية | Technical Features
- ⚡ **أداء سريع** | Lightning fast performance
- 💾 **حفظ البيانات محلياً** | Local data persistence
- 🔧 **قابل للتخصيص** | Highly customizable
- 📱 **متوافق مع جميع الأجهزة** | Cross-platform compatibility



### استخدام npm | Using npm
```bash

npm install

npm run dev

```



### الخيارات المتقدمة | Advanced Options

```javascript
const calculator = new AdvancedCalculator({
    container: '#calculator',
    theme: 'auto', // 'light' | 'dark' | 'auto'
    language: 'ar', 
    precision: 10,
    history: true,
    sounds: true,
    animations: true,
    customButtons: [
        { text: 'π', value: Math.PI },
        { text: 'e', value: Math.E }
    ]
});
```

### أمثلة الاستخدام | Usage Examples

#### العمليات الأساسية | Basic Operations
```
5 + 3 = 8
10 - 4 = 6
7 × 8 = 56
15 ÷ 3 = 5
```

#### العمليات المتقدمة | Advanced Operations
```
√16 = 4
5² = 25
sin(30°) = 0.5
cos(60°) = 0.5
tan(45°) = 1
```



## 💻 التقنيات المستخدمة | Technologies

<div align="center">

| التقنية | الإصدار | الغرض |
|---------|---------|-------|
| HTML5 | 5 | هيكل الصفحة |
| CSS3 | 3 | التنسيق والتصميم |
| JavaScript | ES6+ | المنطق والتفاعل |
| Webpack | 5.x | بناء المشروع |
| Babel | 7.x | تحويل الكود |
| ESLint | 8.x | فحص الكود |

</div>



### متطلبات التطوير | Development Requirements

- Node.js 16+
- npm 7+
- Git 2.x

### إعداد بيئة التطوير | Development Setup

```bash
# استنساخ المشروع | Clone project
git clone https://github.com/username/advanced-calculator.git
cd advanced-calculator
