\documentclass[12pt,a4paper]{article}

% الحزم الأساسية لدعم اللغة العربية والإنجليزية بدون تداخل
\usepackage[utf8]{inputenc}
\usepackage[LFE,LAE]{fontenc}
\usepackage[arabic,english]{babel}

% حزم الرياضيات المتقدمة
\usepackage{amsmath}
\usepackage{amssymb}
\usepackage{amsfonts}

% حزمة تنسيق الأكواد البرمجية بدقة
\usepackage{listings}
\usepackage{xcolor}

% إعدادات الألوان الخاصة بكود TypeScript
\definecolor{lightpurple}{HTML}{F3F0FF}
\definecolor{brandpurple}{HTML}{754EF5}
\definecolor{codegray}{rgb}{0.5,0.5,0.5}
\definecolor{backcolour}{rgb}{0.95,0.95,0.92}

\lstdefinelanguage{TypeScript}{
  keywords={let, const, var, number, string, boolean, any, unknown, console, log},
  keywordstyle=\color{brandpurple}\bfseries,
  ndkeywords={class, export, boolean, throw, implements, import, this},
  ndkeywordstyle=\color{blue}\bfseries,
  identifierstyle=\color{black},
  sensitive=false,
  comment=[l]{//},
  morecomment=[s]{/*}{*/},
  commentstyle=\color{codegray}\ttfamily,
  stringstyle=\color{teal}\ttfamily,
  morestring=[b]',
  morestring=[b]"
}

\lstset{
    language=TypeScript,
    backgroundcolor=\color{backcolour},
    numberstyle=\tiny\color{codegray},
    basicstyle=\ttfamily\small,
    breakatwhitespace=false,
    breaklines=true,
    captionpos=b,
    keepspaces=true,
    numbers=left,
    numbersep=5pt,
    showspaces=false,
    showstringspaces=false,
    showtabs=false,
    tabsize=2
}

\begin{document}
\selectlanguage{arabic}

%--- واجهة الكتاب الإلكتروني ---
\begin{center}
    \vspace*{2cm}
    {\Huge \bfseries دورة TypeScript الاحترافية} \\[0.5cm]
    {\Large من الصفر إلى هندسة البرمجيات المتكاملة (Full-Stack)} \\[1.5cm]
    
    \textbf{إعداد المدرب الخاص:} خبير التعليم البرمجي (12 سنة خبرة) \\
    \textbf{المستهدف:} المهندس عبد الرحمن عادل متولي \\[2cm]
\end{center}

\newpage

%--- الجزء الأول ---
\section*{المرحلة الأولى: الأساسيات | الجزء 1: نظام الأنواع الثابت (Static Typing)}

\subsection*{1. التعريف العام}
في بيئة التطوير التقليدية باستخدام لغة JavaScript، يتم التعامل مع المتغيرات بنظام الأنواع الديناميكي (Dynamic Typing)، حيث يمكن للمتغير الواحد أن تتغير طبيعة البيانات المخزنة فيه أثناء وقت التشغيل (Runtime) دون أي قيود مسبقة. 

جاءت لغة TypeScript لتقدم حلاً جذرياً عبر إدخال نظام الأنواع الثابت (Static Typing). يُعرف هذا النظام بأنه آلية صارمة تتيح للمطور تحديد نوع البيانات المتوقع لكل متغير أثناء مرحلة كتابة الكود وبناء البرنامج (Compile-time).

\subsection*{2. التمثيل الرياضي والمنطقي}
بفرض أن لدينا المجموعة الشاملة لجميع القيم البرمجية الممكنة ونرمز لها بالرمز $U$. 
النوع (Type) هو مجموعة جزئية (Subset) من المجموعة الشاملة $U$. نرمز لمجموعة الأعداد بـ $Number$ ومجموعة النصوص بـ $String$:
\begin{equation*}
Number \subset U \quad , \quad String \subset U
\end{equation*}

عندما نقوم بالإعلان عن متغير $x$ وتعيين نوع محدد له مثل $number$، فإننا نضع شرطاً منطقياً ينص على أن القيمة المنتمية للمتغير يجب أن تكون عنصراً في المجموعة الجزئية المحددة:
\begin{equation*}
x \in Number
\end{equation*}

بما أن المجموعات منفصلة تماماً:
\begin{equation*}
Number \cap String = \emptyset
\end{equation*}
فإن محاولة إسناد نص إلى المتغير $x$ ينتج عنه تناقض منطقي يكتشفه المترجم فوراً ويطلق خطأ التصريف.

\subsection*{3. أمثلة الأكواد البرمجية}
\begin{lstlisting}[caption={تطبيق نظام الأنواع الثابت}]
// تعيين النوع الصريح يمنع العشوائية تماما
let totalAmount: number = 500;

// محاولة إعادة التعيين التالية ستتسبب في فشل بناء المشروع:
// totalAmount = "خمس مئة"; 
// Error: Type 'string' is not assignable to type 'number'.
\end{lstlisting}

\subsection*{4. التطبيق العملي في الـ Full-Stack}
في مشاريع الويب الشاملة، نضع عقوداً صارمة للبيانات تمنع الاختلاف بين الـ Frontend والـ Backend. لو أرسل السيرفر رقماً على هيئة نص مثل "199"، فإن التجميع في JavaScript سيجعل العملية دمج نصوص بدلاً من جمع حسابي، بينما TypeScript تمنع هذا تماماً قبل رفع الكود للإنتاج.

\newpage

%--- الجزء الثاني ---
\section*{المرحلة الأولى: الأساسيات | الجزء 2: الأنواع الأساسية والاستنتاج التلقائي}

\subsection*{1. التعريف العام}
\begin{itemize}
    \item \textbf{الأنواع الأساسية (Primitive Types):} هي أنواع البيانات البسيطة وغير المركبة المبنية داخل اللغة مباشرة مثل \texttt{number}، \texttt{string}، و \texttt{boolean}.
    \item \textbf{استنتاج النوع (Type Inference):} ميزة ذكية تجعل المحرر يكتشف نوع المتغير تلقائياً بمجرد إعطائه قيمة ابتدائية، دون الحاجة لكتابة النوع صراحة في كل سطر.
\end{itemize}

\subsection*{2. التمثيل الرياضي والمنطقي}
نظام استنتاج الأنواع يُصاغ كدالة اقتران منطقي $\mathcal{T}$ تعمل على القيمة المسندة $v$ لتعيين نوع المتغير $y$ تلقائياً:
\begin{equation*}
\text{If } y = v \text{ and } v \in String \implies \mathcal{T}(v) = String \implies y \in String
\end{abstract}

\subsection*{3. أمثلة الأكواد البرمجية}
\begin{lstlisting}[caption={استنتاج الأنواع تلقائيا}]
let university = "Fayoum University"; // string استنتاج تلقائي
let graduateYear = 2026;              // number استنتاج تلقائي

// university = 123; -> Error!
\end{lstlisting}

\subsection*{4. التطبيق العملي في الـ Full-Stack}
نعتمد على الاستنتاج التلقائي داخل الدوال المحلية لتسريع كتابة الكود ونظافته، ونلتزم بالتصريح الصريح والجامد (Explicit Typing) عند بناء استجابات الـ APIs والـ DTOs لضمان عدم تمرير قيم مشوهة لقاعدة البيانات.

\end{document}
