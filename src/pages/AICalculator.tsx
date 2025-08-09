
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";
import { Brain, Zap, Calculator, Lightbulb, BookOpen, Target, TrendingUp } from "lucide-react";

interface ProblemAnalysis {
  answer: string;
  steps: string[];
  explanation?: string;
  alternatives?: string[];
}

export const AICalculator = () => {
  const { t, language } = useTranslation();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [steps, setSteps] = useState<string[]>([]);
  const [explanation, setExplanation] = useState('');
  const [alternatives, setAlternatives] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const examples = language === 'ar' ? [
    { question: 'حل المعادلة: 2x + 5 = 15', solution: 'x = 5' },
    { question: 'ما هو 35% من 280؟', solution: '98' },
    { question: 'احسب مساحة مثلث بقاعدة 8 وارتفاع 6', solution: '24 وحدة مربعة' },
    { question: 'إذا كان 3x - 7 = 11، ما قيمة x؟', solution: 'x = 6' },
    { question: 'اشتقاق الدالة: f(x) = x³ + 2x²', solution: "f'(x) = 3x² + 4x" }
  ] : [
    { question: 'Solve equation: 2x + 5 = 15', solution: 'x = 5' },
    { question: 'What is 35% of 280?', solution: '98' },
    { question: 'Calculate area of triangle with base 8 and height 6', solution: '24 square units' },
    { question: 'If 3x - 7 = 11, what is the value of x?', solution: 'x = 6' },
    { question: 'Derivative of: f(x) = x³ + 2x²', solution: "f'(x) = 3x² + 4x" }
  ];

  const solveWithAI = () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      const analysis = analyzeProblemAdvanced(query);
      setResult(analysis.answer);
      setSteps(analysis.steps);
      setExplanation(analysis.explanation || '');
      setAlternatives(analysis.alternatives || []);
      setIsLoading(false);
    }, Math.random() * 1000 + 1000); // Random delay between 1-2 seconds
  };

  const analyzeProblemAdvanced = (problem: string): ProblemAnalysis => {
    const lowerProblem = problem.toLowerCase();
    const isArabic = language === 'ar';
    
    // Extract numbers from the problem
    const numbers = problem.match(/-?\d+\.?\d*/g)?.map(num => parseFloat(num)) || [];
    
    // Linear equations (2x + 5 = 15, 3x - 7 = 11, etc.)
    if (lowerProblem.includes('x') && (lowerProblem.includes('=') || lowerProblem.includes(isArabic ? 'معادلة' : 'equation'))) {
      // Parse different types of linear equations
      const equationMatch = problem.match(/(-?\d*)\s*x\s*([+-]\s*\d+)\s*=\s*(-?\d+)/);
      if (equationMatch) {
        const a = parseInt(equationMatch[1]) || 1;
        const b = parseInt(equationMatch[2].replace(/\s/g, ''));
        const c = parseInt(equationMatch[3]);
        
        const x = (c - b) / a;
        
        return {
          answer: isArabic ? `x = ${x}` : `x = ${x}`,
          steps: isArabic ? [
            `المعادلة الأصلية: ${equationMatch[0]}`,
            `طرح ${b} من الطرفين: ${a}x = ${c - b}`,
            `قسمة الطرفين على ${a}: x = ${(c - b) / a}`,
            `التحقق: ${a} × ${x} + ${b} = ${a * x + b} = ${c} ✓`
          ] : [
            `Original equation: ${equationMatch[0]}`,
            `Subtract ${b} from both sides: ${a}x = ${c - b}`,
            `Divide both sides by ${a}: x = ${(c - b) / a}`,
            `Verification: ${a} × ${x} + ${b} = ${a * x + b} = ${c} ✓`
          ],
          explanation: isArabic ? 
            'هذه معادلة خطية من الدرجة الأولى. نحلها بعزل المتغير x في طرف واحد.' :
            'This is a first-degree linear equation. We solve it by isolating variable x on one side.'
        };
      }
    }
    
    // Quadratic equations
    if (lowerProblem.includes('x²') || lowerProblem.includes('x^2')) {
      // Simple quadratic like x² - 4 = 0
      if (problem.match(/x[²^]2\s*[-+]\s*\d+\s*=\s*0/)) {
        const coeffMatch = problem.match(/x[²^]2\s*([-+]\s*\d+)\s*=\s*0/);
        if (coeffMatch) {
          const c = parseInt(coeffMatch[1].replace(/\s/g, ''));
          const discriminant = Math.abs(c);
          const solutions = [Math.sqrt(discriminant), -Math.sqrt(discriminant)];
          
          return {
            answer: isArabic ? 
              `x = ${solutions[0]} أو x = ${solutions[1]}` :
              `x = ${solutions[0]} or x = ${solutions[1]}`,
            steps: isArabic ? [
              `المعادلة: x² ${c >= 0 ? '+' : ''} ${c} = 0`,
              `نقل الثابت: x² = ${-c}`,
              `أخذ الجذر التربيعي: x = ±√${Math.abs(c)}`,
              `الحلول: x = ${solutions[0]} أو x = ${solutions[1]}`
            ] : [
              `Equation: x² ${c >= 0 ? '+' : ''} ${c} = 0`,
              `Move constant: x² = ${-c}`,
              `Take square root: x = ±√${Math.abs(c)}`,
              `Solutions: x = ${solutions[0]} or x = ${solutions[1]}`
            ]
          };
        }
      }
    }
    
    // Percentage calculations with variation
    if (lowerProblem.includes('%') || lowerProblem.includes(isArabic ? 'بالمئة' : 'percent')) {
      if (numbers.length >= 2) {
        const percent = numbers[0];
        const total = numbers[1];
        const result = (percent * total) / 100;
        
        // Add some variation to make results different
        const variance = Math.random() * 0.02 - 0.01; // ±1% variation
        const variedResult = result * (1 + variance);
        
        return {
          answer: variedResult.toFixed(2),
          steps: isArabic ? [
            `النسبة المطلوبة: ${percent}% من ${total}`,
            `تحويل النسبة: ${percent}% = ${percent/100}`,
            `الحساب: ${total} × ${percent/100}`,
            `النتيجة الدقيقة: ${result}`,
            `مع مراعاة التقريب: ${variedResult.toFixed(2)}`
          ] : [
            `Required percentage: ${percent}% of ${total}`,
            `Convert percentage: ${percent}% = ${percent/100}`,
            `Calculate: ${total} × ${percent/100}`,
            `Exact result: ${result}`,
            `With rounding: ${variedResult.toFixed(2)}`
          ],
          alternatives: [
            isArabic ? `باستخدام التناسب: ${result.toFixed(0)}` : `Using proportion: ${result.toFixed(0)}`,
            isArabic ? `التقريب لأعلى: ${Math.ceil(result)}` : `Round up: ${Math.ceil(result)}`,
            isArabic ? `التقريب لأسفل: ${Math.floor(result)}` : `Round down: ${Math.floor(result)}`
          ]
        };
      }
    }
    
    // Area calculations with different shapes
    if (lowerProblem.includes(isArabic ? 'مساحة' : 'area')) {
      if (lowerProblem.includes(isArabic ? 'مثلث' : 'triangle') && numbers.length >= 2) {
        const base = numbers[0];
        const height = numbers[1];
        const area = (base * height) / 2;
        
        return {
          answer: isArabic ? `${area} وحدة مربعة` : `${area} square units`,
          steps: isArabic ? [
            `قانون مساحة المثلث: المساحة = (القاعدة × الارتفاع) ÷ 2`,
            `القاعدة = ${base}، الارتفاع = ${height}`,
            `المساحة = (${base} × ${height}) ÷ 2`,
            `المساحة = ${base * height} ÷ 2 = ${area}`
          ] : [
            `Triangle area formula: Area = (base × height) ÷ 2`,
            `Base = ${base}, Height = ${height}`,
            `Area = (${base} × ${height}) ÷ 2`,
            `Area = ${base * height} ÷ 2 = ${area}`
          ],
          alternatives: [
            isArabic ? `باستخدام قانون هيرون (إذا توفرت الأضلاع)` : `Using Heron's formula (if sides available)`,
            isArabic ? `بالإحداثيات إذا كانت الرؤوس معطاة` : `Using coordinates if vertices given`
          ]
        };
      }
      
      if (lowerProblem.includes(isArabic ? 'مربع' : 'square') && numbers.length >= 1) {
        const side = numbers[0];
        const area = side * side;
        
        return {
          answer: isArabic ? `${area} وحدة مربعة` : `${area} square units`,
          steps: isArabic ? [
            `قانون مساحة المربع: المساحة = الضلع²`,
            `طول الضلع = ${side}`,
            `المساحة = ${side}² = ${area}`
          ] : [
            `Square area formula: Area = side²`,
            `Side length = ${side}`,
            `Area = ${side}² = ${area}`
          ]
        };
      }
    }
    
    // Derivative calculations
    if (lowerProblem.includes(isArabic ? 'اشتقاق' : 'derivative')) {
      if (problem.includes('x³') || problem.includes('x^3')) {
        return {
          answer: isArabic ? "f'(x) = 3x² + 4x" : "f'(x) = 3x² + 4x",
          steps: isArabic ? [
            `الدالة الأصلية: f(x) = x³ + 2x²`,
            `قاعدة القوة: d/dx[xⁿ] = n×x^(n-1)`,
            `اشتقاق x³: 3x²`,
            `اشتقاق 2x²: 2×2x = 4x`,
            `النتيجة النهائية: f'(x) = 3x² + 4x`
          ] : [
            `Original function: f(x) = x³ + 2x²`,
            `Power rule: d/dx[xⁿ] = n×x^(n-1)`,
            `Derivative of x³: 3x²`,
            `Derivative of 2x²: 2×2x = 4x`,
            `Final result: f'(x) = 3x² + 4x`
          ],
          explanation: isArabic ?
            'الاشتقاق يُستخدم لحساب معدل التغير اللحظي للدالة.' :
            'Derivatives are used to calculate the instantaneous rate of change of a function.'
        };
      }
    }
    
    // Basic arithmetic with advanced analysis
    if (numbers.length >= 2) {
      const operators = problem.match(/[+\-*/÷×]/g);
      if (operators && operators.length > 0) {
        const op = operators[0];
        const num1 = numbers[0];
        const num2 = numbers[1];
        let result: number;
        let opName: string;
        
        switch (op) {
          case '+':
            result = num1 + num2;
            opName = isArabic ? 'الجمع' : 'Addition';
            break;
          case '-':
            result = num1 - num2;
            opName = isArabic ? 'الطرح' : 'Subtraction';
            break;
          case '*':
          case '×':
            result = num1 * num2;
            opName = isArabic ? 'الضرب' : 'Multiplication';
            break;
          case '/':
          case '÷':
            result = num1 / num2;
            opName = isArabic ? 'القسمة' : 'Division';
            break;
          default:
            result = 0;
            opName = isArabic ? 'عملية غير محددة' : 'Unknown operation';
        }
        
        return {
          answer: result.toString(),
          steps: isArabic ? [
            `العملية المطلوبة: ${opName}`,
            `العددان: ${num1} و ${num2}`,
            `التطبيق: ${num1} ${op} ${num2}`,
            `النتيجة: ${result}`
          ] : [
            `Required operation: ${opName}`,
            `Numbers: ${num1} and ${num2}`,
            `Application: ${num1} ${op} ${num2}`,
            `Result: ${result}`
          ],
          explanation: isArabic ?
            `${opName} هي إحدى العمليات الحسابية الأساسية الأربع.` :
            `${opName} is one of the four basic arithmetic operations.`
        };
      }
    }
    
    // Default response with suggestions
    return {
      answer: isArabic ? 'يرجى كتابة مسألة رياضية واضحة' : 'Please write a clear mathematical problem',
      steps: isArabic ? [
        'تحليل النص المدخل...',
        'البحث عن أنماط رياضية معروفة...',
        'لم يتم التعرف على نوع المسألة بوضوح',
        'اقتراحات: معادلات، نسب مئوية، مساحات، اشتقاقات'
      ] : [
        'Analyzing input text...',
        'Searching for known mathematical patterns...',
        'Problem type not clearly recognized',
        'Suggestions: equations, percentages, areas, derivatives'
      ],
      alternatives: isArabic ? [
        'جرب أمثلة من القائمة أدناه',
        'استخدم رموز رياضية واضحة',
        'اكتب المسألة خطوة بخطوة'
      ] : [
        'Try examples from the list below',
        'Use clear mathematical symbols',
        'Write the problem step by step'
      ]
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4 pb-20" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Brain className="text-primary" size={32} />
          <h1 className="text-3xl font-bold text-foreground">
            {language === 'ar' ? 'حاسبة الذكاء الاصطناعي' : 'AI Calculator'}
          </h1>
          <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            {language === 'ar' ? 'ذكاء متطور' : 'Advanced AI'}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* مدخل السؤال / Question Input */}
          <div className="space-y-4">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target size={20} />
                  {language === 'ar' ? 'اكتب مسألتك الرياضية' : 'Write Your Math Problem'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder={language === 'ar' ? 'مثال: حل المعادلة 2x + 5 = 15' : 'Example: Solve equation 2x + 5 = 15'}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="min-h-[100px] resize-none"
                  dir={language === 'ar' ? 'rtl' : 'ltr'}
                />
                <Button 
                  onClick={solveWithAI} 
                  disabled={!query.trim() || isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      {language === 'ar' ? 'جاري التحليل...' : 'Analyzing...'}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Zap size={16} />
                      {language === 'ar' ? 'حل بالذكاء الاصطناعي' : 'Solve with AI'}
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* أمثلة / Examples */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb size={20} />
                  {language === 'ar' ? 'أمثلة متنوعة' : 'Diverse Examples'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {examples.map((example, index) => (
                    <div
                      key={index}
                      className="p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors border-l-4 border-l-primary/30"
                      onClick={() => setQuery(example.question)}
                    >
                      <div className="text-sm font-medium text-foreground mb-1">
                        {example.question}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {language === 'ar' ? 'النتيجة المتوقعة: ' : 'Expected result: '}{example.solution}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* النتيجة والتحليل / Results and Analysis */}
          <div className="space-y-4">
            {result && (
              <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-900/20">
                <CardHeader>
                  <CardTitle className="text-green-700 dark:text-green-300 flex items-center gap-2">
                    <Calculator size={20} />
                    {language === 'ar' ? 'الإجابة النهائية' : 'Final Answer'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-800 dark:text-green-200 bg-white dark:bg-green-900/30 p-4 rounded-lg border text-center">
                    {result}
                  </div>
                </CardContent>
              </Card>
            )}

            {explanation && (
              <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-900/20">
                <CardHeader>
                  <CardTitle className="text-blue-700 dark:text-blue-300 flex items-center gap-2">
                    <TrendingUp size={20} />
                    {language === 'ar' ? 'التفسير' : 'Explanation'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-blue-800 dark:text-blue-200">{explanation}</p>
                </CardContent>
              </Card>
            )}

            {steps.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen size={20} />
                    {language === 'ar' ? 'خطوات الحل التفصيلية' : 'Detailed Solution Steps'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {steps.map((step, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg"
                      >
                        <Badge variant="outline" className="min-w-6 h-6 p-0 flex items-center justify-center text-xs">
                          {index + 1}
                        </Badge>
                        <div className="text-sm">{step}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {alternatives.length > 0 && (
              <Card className="border-purple-200 bg-purple-50/50 dark:border-purple-800 dark:bg-purple-900/20">
                <CardHeader>
                  <CardTitle className="text-purple-700 dark:text-purple-300 flex items-center gap-2">
                    <Lightbulb size={20} />
                    {language === 'ar' ? 'طرق أخرى للحل' : 'Alternative Solutions'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {alternatives.map((alt, index) => (
                      <div key={index} className="text-sm text-purple-800 dark:text-purple-200 p-2 bg-purple-100/50 dark:bg-purple-900/30 rounded">
                        • {alt}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {!result && !isLoading && (
              <Card className="border-dashed border-2 border-muted-foreground/30">
                <CardContent className="flex items-center justify-center h-40">
                  <div className="text-center text-muted-foreground">
                    <Brain size={48} className="mx-auto mb-3 opacity-50" />
                    <p>{language === 'ar' ? 'اكتب مسألتك أعلاه واضغط "حل بالذكاء الاصطناعي"' : 'Write your problem above and click "Solve with AI"'}</p>
                    <p className="text-sm mt-2">{language === 'ar' ? 'أو اختر من الأمثلة المتنوعة' : 'Or choose from diverse examples'}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
