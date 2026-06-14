\documentclass[12pt,a4paper]{article}

% حزم دعم اللغة العربية والخطوط (التجميع حصراً باستخدام XeLaTeX أو LuaLaTeX)
\usepackage{fontspec}
\usepackage{polyglossia}
\setmainlanguage{arabic}
\setotherlanguage{english}

% تعيين خطوط تدعم العربية والترميز الموحد بشكل كامل
\newfontfamily\arabicfont[Script=Arabic,Scale=1.1]{Amiri}
\newfontfamily\arabicfontsf[Script=Arabic,Scale=1.1]{Amiri}
\newfontfamily\arabicfonttt[Script=Arabic,Scale=0.9]{Amiri} % يحل مشكلة تشوه الخط أحادي المسافة للأكواد

% حزم التنسيق الرياضي والأكواد والتصميم
\usepackage{amsmath}
\usepackage{amssymb}
\usepackage{geometry}
\usepackage{hyperref}
\usepackage{xcolor}

% حزمة احترافية متطورة لعرض الأكواد البرمجية دون تداخل النص العربي
\usepackage[most]{tcolorbox}
\tcbuselibrary{listings}

\geometry{margin=1in}

% تعريف حاوية برمجية مستقرة للأكواد البرمجية (HTML) تمنع تشوه الحروف والرموز
\newtcblisting{htmlcode}{
    arc=3mm,
    commandsep=0pt,
    boxrule=0.5pt,
    colback=gray!5,
    colframe=gray!30,
    listing only,
    listing options={
        language=HTML,
        basicstyle=\small\ttfamily,
        breaklines=true,
        tabsize=2,
        columns=fullflexible
    },
    every listing line={\setRTL} % يضمن بقاء اتجاه الأكواد والرموز سليماً في بيئة المراجعة
}

% اختصار آمن لكتابة الأكواد والتاجات المدمجة بالنص دون كسر اتجاه القراءة العربي
\newcommand{\codeinline}[1]{\lr{\texttt{#1}}}

\title{\textbf{المنهج الشامل لتفكيك ولتعلم لغة HTML}}
\author{إعداد المساعد الذكي بناءً على دليل freeCodeCamp}
\date{\the\year}

\begin{document}

\maketitle
\newpage
\tableofcontents
\newpage

\section{الدرس الأول: المستوى المبتدئ (ما هي الـ HTML والـ Tags؟)}

\subsection{1. الفكرة العامة}
تخيل أنك تكتب مقالاً على برنامج Word؛ لتجعل الكلمة ``عنواناً''، تختار حجم خط كبيراً وعريضاً. المتصفح (مثل جوجل كروم) لا يفهم بالنظر، هو يحتاج إلى أكواد تخبره: ``هذا النص هو عنوان رئيسي''، و``هذا النص هو فقرة عادية''. 
لغة HTML هي الطريقة التي نتحدث بها مع المتصفح لنحدد له \textbf{نوع ووظيفة} كل نص أو عنصر في الصفحة.

\subsection{2. الفكرة الفيزيائية والظاهرية}
في العالم المادي, إذا أردت بناء غرفة، فأنت بحاجة إلى طوب إسمنتي تضعه في البداية وطوب في النهاية ليحدد أبعاد الغرفة. 
الـ \textbf{Tags (الوسوم)} في HTML هي بمثابة ``قوالب الطوب الرقمية'' أو ``العلب الصناديق''. كل صندوق له بداية وله نهاية، وأي محتوى تضعه داخل هذا الصندوق يكتسب صفات الصندوق الفسيولوجية والمادية على الشاشة (مثلاً: صندوق العناوين يجعل الخط ضخماً، وصندوق الأزرار يحول النص إلى زر قابل للضغط).

\subsection{3. طرق الشرح الهيكلي الرياضي (تشريح الـ Tag)}
رياضياً، الـ HTML عبارة عن دالة مغلقة تبدأ بـ ``مفتاح فتح'' وتنتهي بـ ``مفتاح غلق''. 
أي عنصر (Element) في HTML يتكون من ثلاثة أجزاء أساسية:

$$\text{Element} = \text{[Opening Tag]} + \text{Content} + \text{[Closing Tag]}$$

\begin{itemize}
    \item \textbf{وسم البداية (Opening Tag):} نكتب اسم التاج بين علامتي أصغر من وأكبر من \codeinline{<tag>}.
    \item \textbf{المحتوى (Content):} الكلام أو الشيء الذي تريد إظهاره للمستخدم.
    \item \textbf{وسم النهاية (Closing Tag):} نفس وسم البداية تماماً ولكن نضيف شرطة مائلة \codeinline{</tag>} لتنبيه المتصفح أن الصندوق قد أُغلق هنا.
\end{itemize}

\subsection{4. التطبيق بمثال تفصيلي}
كود البنية الأساسية للصفحة:

\begin{htmlcode}
<!DOCTYPE html>
<html>
  <head>
    <title>صفحة اختبار</title>
  </head>
  <body>
    <h1>أهلاً بك يا صديقي</h1>
    <p>هذا السطر عبارة عن فقرة نصية عادية جداً.</p>
  </body>
</html>
\end{htmlcode}

\subsubsection*{شرح كل جزء (Tag) بالتفصيل:}
\begin{description}
    \item[\codeinline{<!DOCTYPE html>}] هذا ليس تاًج بالمعنى الحرفي، بل هو إشعار للمتصفح نقول له فيه: ``انتبه، نحن نستخدم أحدث إصدار من لغة HTML (وهو HTML5)''.
    \item[\codeinline{<html>} و \codeinline{</html>}] هذا هو الصندوق الأكبر (الأب). كل أكواد الصفحة يجب أن تعيش داخل هذا التاج.
    \item[\codeinline{<head>} و \codeinline{</head>}] (رأس الصفحة) هذا الصندوق مخصص لأشياء خلف الكواليس، مثل عنوان الصفحة الذي يظهر في التبويب، ولا يظهر محتواه داخل الصفحة نفسها.
    \item[\codeinline{<title>} و \codeinline{</title>}] يوضع داخل الـ $\text{head}$ ليكتب اسم الموقع في شريط المتصفح من الأعلى.
    \item[\codeinline{<body>} و \codeinline{</body>}] (جسم الصفحة) هذا هو الصندوق السحري. أي شيء تكتبه هنا هو ما يراه المستخدم بعينه داخل الموقع.
    \item[\codeinline{<h1>} و \codeinline{</h1>}] حرف الـ H اختصار لكلمة Heading (عنوان). والرقم 1 يعني أنه العنوان الأكبر والأهم في الصفحة.
    \item[\codeinline{<p>} و \codeinline{</p>}] حرف الـ P اختصار لكلمة Paragraph (فقرة). نستخدمه عندما نريد كتابة أسطر نصية عادية.
\end{description}

\subsection{5. التحدي (Task 1)}
افتح برنامج VS Code، واكتب الأكواد السابقة بنفسك. قم بتغيير النص الذي بين \codeinline{<h1>} و \codeinline{</h1>} واكتب اسمك الثنائي، وتأكد من إغلاق كل تاج فتحته بالشرطة المائلة \codeinline{/}. احفظ الملف باسم \texttt{index.html} وافتحه بالمتصفح لترى النتيجة.

\newpage

\section{الدرس الثاني: المستوى المتوسط (الروابط والوسائط المتعددة)}

\subsection{1. الفكرة العامة}
بعد أن تعلمنا كيف نضع نصوصاً وعناوين جامدة، حان الوقت لنتعلم كيف نربط هذه الصفحات بالعالم الخارجي، وكيف ندرج عناصر بصرية مثل الصور. المتصفح يحتاج تاجات خاصة ليفهم أن هذا النص ليس للقراءة فقط، بل هو ``بوابة'' تنقله لمكان آخر.

\subsection{2. الفكرة الفيزيائية والظاهرية}
فيزيائياً، الروابط تعمل كـ ``الممرات أو الكباري'' التي تصل بين جزيرتين منفصلتين. أما الصور، فلأن حجم ملف الـ HTML صغير جداً، فالصورة لا تُحقن داخل الملف، بل التاج يقوم بعمل ``استدعاء مجسم'' أو نافذة تعرض صورة مخزنة في مكان آخر على جهازك أو على الإنترنت.

\subsection{3. طرق الشرح الهيكلي الرياضي (مفهوم الـ Attributes)}
هنا سنضيف مفهوماً رياضياً جديداً اسمه \textbf{الخصائص (Attributes)}. الـ Tag بمفرده لا يكفي أحياناً؛ لو قلت للمتصفح ``اصنع رابطاً''، سيسألك ``إلى أين يؤدي هذا الرابط؟''. هذه المعلومات الإضافية تسمى Attributes وتكتب دائماً داخل وسم البداية.

$$\text{Tag with Attribute} = \langle\text{tag\_name} \quad \mathbf{\text{attribute\_name}}=\text{"value"}\rangle$$

\subsection{4. التطبيق بمثال تفصيلي}

\begin{htmlcode}
<a href="https://www.google.com">اضغط هنا للانتقال لجوجل</a>

<img src="my-photo.jpg" alt="صورتي الشخصية">
\end{htmlcode}

\subsubsection*{شرح التاجات والخصائص الجديدة:}
\begin{description}
    \item[\codeinline{<a>} و \codeinline{</a>}] اختصار لكلمة Anchor (مَرسَاة)، وهو التاج المسؤول عن صنع الروابط.
    \item[\codeinline{href=""}] هذه هي الخاصية (Attribute) واختصار لـ Hypertext Reference. نكتب بين العلامتين الرابط الذي نريد الذهاب إليه.
    \item[\codeinline{<img>}] اختصار لكلمة Image (صورة). هذا التاج فريد من نوعه، ليس له وسم إغلاق لأنه لا يحتوي على نص بداخله، ويسمى (Self-closing tag).
    \item[\codeinline{src=""}] اختصار لـ Source (المصدر). نكتب داخلها مسار الصورة أو رابطها على الإنترنت لتظهر في الموقع.
    \item[\codeinline{alt=""}] اختصار لـ Alternative Text (النص البديل)، يظهر إذا لم تتحمل الصورة لشرح محتواها.
\end{description}

\subsection{5. التحدي (Task 2)}
قم بتعديل ملفك السابق، وأضف رابطاً يأخذ المستخدم إلى موقع يوتيوب، وأسفله أضف صورة لأي شيء تحبه من جهازك (تأكد أن الصورة وملف الـ HTML موجودان في نفس المجلد).

\newpage

\section{الدرس الثالث: المستوى الاحترافي (النماذج والهيكلة الدلالية)}

\subsection{1. الفكرة العامة}
الموقع الاحترافي ليس مجرد صفحات تقرأها وتتنقل بينها، بل هو موقع يتفاعل معك. عندما تسجل دخولك في فيسبوك، أنت تستخدم ``نموذجاً'' (Form). في هذا المستوى نتعلم كيف نجعل المستخدم يكتب بياناته ويرسلها إلينا، وكيف ننظم الصفحة مثل المواقع العالمية الكبرى لتفهمها محركات البحث (SEO).

\subsection{2. الفكرة الفيزيائية والظاهرية}
النموذج (\codeinline{<form>}) فيزيائياً يشبه ``استمار
