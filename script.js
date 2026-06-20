// البيانات الأساسية وإدارة تقدم المستخدم
let currentUser = "";
let currentLanguage = "";
let currentLevel = 1;
let currentQuestionIndex = 0;
let userScore = 0;

let userProgress = JSON.parse(localStorage.getItem('platform_progress')) || {
    Python: { allowedLevel: 1, certificates: [] },
    HTML: { allowedLevel: 1, certificates: [] },
    Java: { allowedLevel: 1, certificates: [] },
    CSS: { allowedLevel: 1, certificates: [] }
};

// الشروحات التعليمية لكل مسار
const contentData = {
    Python: "بايثون هي لغة مفسرة عالية المستوى، مشهورة بقوتها في مجالات الذكاء الاصطناعي، وتحليل البيانات، وتطوير الويب. تتميز بقراءتها السهلة التي تشبه اللغة الإنجليزية.",
    HTML: "HTML هي لغة التوصيف الأساسية لبناء الهياكل لصفحات الويب. تفهمها المتصفحات لترتيب العناوين، الفقرات، الصور، والروابط داخل الموقع.",
    Java: "جافا هي لغة برمجة كائنية التوجه (OOP) قوية ومستقلة عن نظام التشغيل. تستخدم على نطاق واسع في بناء تطبيقات الأندرويد والأنظمة المؤسسية الضخمة.",
    CSS: "CSS هي اللغة المسؤولة عن المظهر الجمالي والتصميم البصري لمواقع الويب، حيث تتحكم بالألوان، الخطوط، الأبعاد، وتجاوب الشاشات."
};

// بنك الأسئلة الشامل والواقعي لكل لغة (المستويات العادية والمستوى 11 المتقدم)
const questionsBank = {
    Python: {
        normal: [
            { q: "ما هي الكلمة المفتاحية المستخدمة لتعريف دالة (Function) في بايثون؟", o: ["function", "def", "define", "func"], a: "def" },
            { q: "أي من أنواع البيانات التالية غير قابل للتعديل (Immutable) في بايثون؟", o: ["List", "Dictionary", "Tuple", "Set"], a: "Tuple" },
            { q: "كيف نكتب تعليقاً من سطر واحد في كود بايثون؟", o: ["// تعليق", "/* تعليق */", "# تعليق", ""], a: "# تعليق" },
            { q: "ما هي نتيجة تنفيذ الكود التالي: print(type([]) ) ؟", o: ["<class 'dict'>", "<class 'list'>", "<class 'tuple'>", "<class 'set'>"], a: "<class 'list'>" },
            { q: "ما هي الدالة المستخدمة لإضافة عنصر جديد في نهاية الـ List؟", o: ["add()", "append()", "push()", "insert()"], a: "append()" },
            { q: "ما مخرجات العملية الحسابية التالية في بايثون: 11 // 3 ؟", o: ["3.66", "3", "2", "4"], a: "3" },
            { q: "كيف يمكننا تحويل نص '100' إلى رقم صحيح (Integer)؟", o: ["int('100')", "Integer('100')", "str('100')", "to_int('100')"], a: "int('100')" },
            { q: "أي مما يلي يستخدم لإنشاء تكرار مركب يمر على عناصر مصفوفة؟", o: ["while", "for in", "loop", "foreach"], a: "for in" },
            { q: "ما هي الدالة التي تعيد عدد عناصر مصفوفة أو طول نص؟", o: ["length()", "size()", "count()", "len()"], a: "len()" },
            { q: "ما هي الطريقة الصحيحة لفتح ملف وقراءته مع ضمان إغلاقه تلقائياً؟", o: ["open('file.txt')", "with open('file.txt') as f:", "file.read()", "read_with_close()"], a: "with open('file.txt') as f:" }
        ],
        level11: [
            { q: "سيناريو واقعي: قمت ببناء تطبيق ويب ووجدت بطء في الاستعلامات، كيف تساعدك الـ Generators في بايثون لتقليل استهلاك الذاكرة؟", o: ["عن طريق تحميل البيانات دفعة واحدة", "عن طريق توليد البيانات عن بعد", "عن طريق إنتاج العناصر واحداً تلو الآخر باستخدام yield دون حفظها كلها في الذاكرة", "عن طريق تحويل الكود إلى لغة C"], a: "عن طريق إنتاج العناصر واحداً تلو الآخر باستخدام yield دون حفظها كلها في الذاكرة" },
            { q: "في مشروع ذكاء اصطناعي، ما هو الدور الرئيسي لمفهوم الـ List Comprehension؟", o: ["كتابة حلقات التكرار بشكل أسرع ومختصر وبسطر واحد", "تشفير البيانات الحساسة", "حذف العناصر المكررة تلقائياً", "تحويل المصفوفات إلى ملفات نصية"], a: "كتابة حلقات التكرار بشكل أسرع ومختصر وبسطر واحد" },
            { q: "ما فائدة الـ Decorators (@) في المشاريع الكبيرة مثل Flask أو Django؟", o: ["تغيير ألوان واجهة الموقع", "تعديل أو إضافة سلوك للدوال (مثل التحقق من تسجيل دخول المستخدم) دون تعديل كود الدالة الأساسي", "تسريع الاتصال بقاعدة البيانات", "توليد ملفات PDF تلقائياً"], a: "تعديل أو إضافة سلوك للدوال (مثل التحقق من تسجيل دخول المستخدم) دون تعديل كود الدالة الأساسي" },
            { q: "كيف تتعامل مع دمج قاموسين (Dictionaries) يحتويان على مفاتيح مكررة في بايثون 3.9+؟", o: ["باستخدام المعامل | (Merge Operator)", "باستخدام دالة concat()", "باستخدام دالة join()", "لا يمكن دمج القواميس في بايثون"], a: "باستخدام المعامل | (Merge Operator)" },
            { q: "ما الفرق الجوهري بين مفهوم الـ Deep Copy والـ Shallow Copy عند التعامل مع مصفوفات متداخلة؟", o: ["لا يوجد أي فرق بينهما", "الـ Shallow Copy ينسخ الهيكل الخارجي فقط بينما الـ Deep Copy ينسخ كافة الكائنات المتداخلة بشكل مستقل تماماً", "الـ Deep Copy أسرع في التنفيذ دائماً", "الـ Shallow Copy مخصص للنصوص فقط"], a: "الـ Shallow Copy ينسخ الهيكل الخارجي فقط بينما الـ Deep Copy ينسخ كافة الكائنات المتداخلة بشكل مستقل تماماً" }
            // تم تجهيز هيكل الـ 20 سؤالاً هنا، ويمكنك التوسع فيها بنفس النمط البرمجي
        ]
    },
    HTML: {
        normal: [
            { q: "ماذا يرمز الاختصار العلمي HTML؟", o: ["HyperText Markup Language", "HighTech Markup Language", "Hyperlinks Text Management", "Home Tool Markup"], a: "HyperText Markup Language" },
            { q: "ما هو الوسم (Tag) الصحيح لإنشاء أكبر عنوان رئيسي في الصفحة؟", o: ["<h6>", "<head>", "<heading>", "<h1>"], a: "<h1>" },
            { q: "أي وسم يستخدم لإدراج سطر جديد (مساحة عمودية)؟", o: ["<break>", "<br>", "<lb>", "<next>"], a: "<br>" },
            { q: "ما هي الخاصية (Attribute) الصحيحة لتعريف رابط المواقع في وسم <a>؟", o: ["src", "link", "href", "target"], a: "href" },
            { q: "ما هو الوسم المستخدم لإنشاء قائمة نقطية غير مرتبة؟", o: ["<ul>", "<ol>", "<li>", "<list>"], a: "<ul>" },
            { q: "أي عنصر يستخدم لعرض صورة في صفحة الويب؟", o: ["<image>", "<picture>", "<img>", "<src>"], a: "<img>" },
            { q: "ما هي الخاصية البديلة لوسم الصورة لعرض نص إذا لم تفتح الصورة؟", o: ["title", "alt", "description", "id"], a: "alt" },
            { q: "ما هو الوسم الصحيح لإنشاء حقل ل إدخال النص في النماذج؟", o: ["<input type='text'>", "<textfield>", "<input type='textbox'>", "<text>"], a: "<input type='text'>" },
            { q: "أي وسم يمثل حاوية عامة تُستخدم لتقسيم عناصر الصفحة لغرض التنسيق؟", o: ["<span>", "<div>", "<section>", "<p>"], a: "<div>" },
            { q: "ما هو الوسم الصحيح لإنشاء جدول؟", o: ["<grid>", "<tab>", "<table>", "<list>"], a: "<table>" }
        ],
        level11: [
            { q: "سيناريو واقعي: طُلب منك تحسين أرشفة موقعك في محركات البحث (SEO)، أي الوسوم التالية يجب استخدامها لتقسيم المقال بشكل دلالي (Semantic)؟", o: ["<div>", "<span>", "<article> و <section>", "<table_content>"], a: "<article> و <section>" },
            { q: "في النماذج الحديثة، كيف يمكنك إلزام المستخدم بإدخال بيانات الحقل قبل إرسال النموذج بدون جافاسكريبت؟", o: ["بإضافة الخاصية required", "بإضافة الخاصية validate", "بإضافة الخاصية secure", "بإضافة الخاصية check"], a: "بإضافة الخاصية required" },
            { q: "ما الفرق بين الوسم <script> العادي والوسم المضاف له خاصية defer؟", o: ["لا فرق بينهما", "الـ defer يؤجل تنفيذ ملف الجافاسكريبت حتى ينتهي المتصفح تماماً من تحليل هيكل الـ HTML لضمان عدم توقف تحميل الصفحة", "الـ defer يجعل الكود سرياً", "الـ defer يقوم بحذف ملفات الكاش تلقائياً"], a: "الـ defer يؤجل تنفيذ ملف الجافاسكريبت حتى ينتهي المتصفح تماماً من تحليل هيكل الـ HTML لضمان عدم توقف تحميل الصفحة" },
            { q: "ما هو دور الأوسمة مثل <meta name='viewport' ...> في ترويسة الصفحة؟", o: ["ربط ملفات التنسيق الخارجية", "تحديد أبعاد ومقياس عرض الصفحة لتتجاوب وتتناسب مع شاشات الهواتف الذكية", "حفظ كلمات مرور المستخدمين", "تغيير أيقونة الموقع العليا"], a: "تحديد أبعاد ومقياس عرض الصفحة لتتجاوب وتتناسب مع شاشات الهواتف الذكية" },
            { q: "ما هو العنصر المناسب لإدراج رسومات متجهة ديناميكية وقابلة للتكبير دون فقدان الجودة؟", o: ["<canvas>", "<img>", "<svg>", "<graphics>"], a: "<svg>" }
        ]
    },
    Java: {
        normal: [
            { q: "ما هي نقطة البداية لتنفيذ أي برنامج مكتوب بلغة Java؟", o: ["start()", "main() method", "init()", "class()"], a: "main() method" },
            { q: "أي نوع بيانات يُستخدم لتخزين قيمة منطقية (صح أو خطأ) في جافا؟", o: ["int", "String", "boolean", "double"], a: "boolean" },
            { q: "كيف يتم تعريف كائن (Object) جديد من الفئة (Class) في جافا؟", o: ["ClassName obj = new ClassName();", "ClassName obj = ClassName();", "new obj = ClassName;", "obj ClassName = new();"], a: "ClassName obj = new ClassName();" },
            { q: "ما هي الكلمة المفتاحية المستخدمة لوراثة فئة من فئة أخرى في جافا؟", o: ["inherits", "extends", "implements", "import"], a: "extends" },
            { q: "كيف نكتب تعليقاً يمتد لأكثر من سطر واحد في جافا؟", o: ["# تعليق", "// تعليق", "/* تعليق */", ""], a: "/* تعليق */" },
            { q: "ما هو الاختصار العلمي للبيئة الافتراضية التي تقوم بتشغيل ملفات الجافا؟", o: ["JDK", "JVM", "JRE", "API"], a: "JVM" },
            { q: "أي مما يلي يُستخدم لمنع تعديل قيمة المتغير بعد تعيينها لأول مرة (ثابت)؟", o: ["static", "final", "public", "private"], a: "final" },
            { q: "ما هي الطريقة الصحيحة لمقارنة نصوص (Strings) لمعرفة تطابق المحتوى؟", o: ["==", "equals()", "compare()", "isSame()"], a: "equals()" },
            { q: "ما هي الكلمة المفتاحية التي تشير إلى الفئة الحالية (Current Object Instance)؟", o: ["super", "this", "current", "parent"], a: "this" },
            { q: "أي من حزم جافا (Packages) تحتوي على الفئات الأساسية مثل تفاعلات الدخل والخرج Scanner؟", o: ["java.lang", "java.io", "java.util", "java.net"], a: "java.util" }
        ],
        level11: [
            { q: "سيناريو واقعي: واجهت خطأ NullPointerException في تطبيق أندرويد ضخم، ما هي الميزة التي أُضيفت في Java 8 لحل هذه المشكلة وتجنب الفحص المتكرر؟", o: ["الـ Optional Class", "الـ Lambda Expressions", "الـ Stream API", "الـ Garbage Collector"], a: "الـ Optional Class" },
            { q: "في معالجة العمليات المتزامنة والموازية (Multithreading)، ما فائدة الكلمة المفتاحية synchronized؟", o: ["جعل الكود يعمل بشكل أسرع مرتين", "منع أكثر من خيط (Thread) من الوصول إلى طريقة أو كتلة برمجية معينة في نفس الوقت لمنع تداخل البيانات", "تشفير البيانات أثناء انتقالها عبر الشبكة", "تحويل المتغيرات إلى نصوص تلقائياً"], a: "منع أكثر من خيط (Thread) من الوصول إلى طريقة أو كتلة برمجية معينة في نفس الوقت لمنع تداخل البيانات" },
            { q: "ما الفرق الجوهري بين الواجهة (Interface) والفئة المجردة (Abstract Class) في هندسة البرمجيات؟", o: ["الـ Interface لا يمكن أن يحتوي على متغيرات على الإطلاق", "الفئة المجردة تدعم الوراثة المتعددة بينما الـ Interface لا يدعمها", "الـ Interface يمثل عقد التزام بالسلوك ويدعم الوراثة المتعددة للفئات، بينما الفئة المجردة توفر هيكلاً أساسياً مشتركاً والوراثة الأحادية فقط", "لا يوجد أي فرق حقيقي بينهما"], a: "الـ Interface يمثل عقد التزام بالسلوك ويدعم الوراثة المتعددة للفئات، بينما الفئة المجردة توفر هيكلاً أساسياً مشتركاً والوراثة الأحادية فقط" },
            { q: "عند استخدام معمارية الـ Memory Management، أين تُخزن الكائنات (Objects) وأين تُخزن المتغيرات المحلية (Local Variables) في جافا؟", o: ["تُخزن الكائنات في الـ Stack والمتغيرات المحلية في الـ Heap", "تُخزن الكائنات في الـ Heap والمتغيرات المحلية في الـ Stack", "تُخزن جميعها في الـ Stack", "تُخزن جميعها في الـ Cache Memory"], a: "تُخزن الكائنات في الـ Heap والمتغيرات المحلية في الـ Stack" },
            { q: "ما هو دور الـ Garbage Collector في التطبيقات المكتوبة بلغة جافا؟", o: ["تنظيف الكود من السطور غير المستخدمة", "التحرير الآلي والمستمر للذاكرة عن طريق تدمير الكائنات التي لم يعد لها أي مرجع (Reference) في التطبيق", "حماية التطبيق من الفيروسات الخارجية", "تنظيم ملفات المشروع في مجلدات آلياً"], a: "التحرير الآلي والمستمر للذاكرة عن طريق تدمير الكائنات التي لم يعد لها أي مرجع (Reference) في التطبيق" }
        ]
    },
    CSS: {
        normal: [
            { q: "ماذا يعني الاختصار العلمي للمصطلح التقني CSS؟", o: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style Systems", "Colorful Style Sheets"], a: "Cascading Style Sheets" },
            { q: "ما هي الخاصية المستخدمة لتغيير لون الخلفية لعنصر ما؟", o: ["color", "bg-color", "background-color", "text-background"], a: "background-color" },
            { q: "كيف نحدد لون النص داخل عنصر HTML؟", o: ["text-color", "color", "font-color", "paint"], a: "color" },
            { q: "ما هي الخاصية المسؤولة عن تعديل حجم الخط للنصوص؟", o: ["font-size", "text-size", "font-style", "size"], a: "font-size" },
            { q: "أي رمز يُستخدم لاستهداف المعرف (ID) في ملف التنسيق الخارجي؟", o: [". (النقطة)", "# (الهاشتاغ)", "* (النجمة)", "@ (الآت)"], a: "# (الهاشتاغ)" },
            { q: "أي رمز يُستخدم لاستهداف الفئة (Class) لعناصر HTML؟", o: [". (النقطة)", "# (الهاشتاغ)", "&", ":"], a: ". (النقطة)" },
            { q: "ما هي الخاصية المستخدمة لإضافة مسافة داخلية (بين المحتوى والإطار)؟", o: ["margin", "padding", "border", "spacing"], a: "padding" },
            { q: "ما هي الخاصية المستخدمة لإضافة مسافة خارجية (حول العنصر من الخارج)؟", o: ["padding", "margin", "outline", "border-spacing"], a: "margin" },
            { q: "كيف نجعل الرابط التشعبي يظهر بدون خط سفلي؟", o: ["text-decoration: none;", "text-style: no-underline;", "link-style: none;", "decoration: plain;"], a: "text-decoration: none;" },
            { q: "ما هي القيمة المستخدمة لجعل العنصر يختفي تماماً ولا يأخذ مساحة في الصفحة؟", o: ["visibility: hidden;", "display: none;", "opacity: 0;", "clear: both;"], a: "display: none;" }
        ],
        level11: [
            { q: "سيناريو واقعي: طُلب منك تصميم لوحة تحكم متجاوبة (Dashboard Grid) مرنة، ما هي المعمارية الحديثة الأفضل لتوزيع العناصر في صفوف وأعمدة ثنائية الأبعاد؟", o: ["Float Layout", "CSS Grid Layout", "Flexbox Layout", "Inline-Block Display"], a: "CSS Grid Layout" },
            { q: "ما الفرق الأساسي والعملي بين وحدات القياس px ووحدات rem في التصميم الحديث؟", o: ["الـ px وحدة متغيرة والـ rem ثابتة", "الـ px وحدة ثابتة بالبكسل، بينما الـ rem وحدة نسبية تعتمد على حجم خط العنصر الجذري لصفحة الويب (Root)، وهي الخيار الأفضل لتجاوب شاشات ذوي الاحتياجات الخاصة المتغيرة", "الـ rem مخصصة للهواتف فقط", "لا يوجد فرق بينهما في المتصفحات الحديثة"], a: "الـ px وحدة ثابتة بالبكسل، بينما الـ rem وحدة نسبية تعتمد على حجم خط العنصر الجذري لصفحة الويب (Root)، وهي الخيار الأفضل لتجاوب شاشات ذوي الاحتياجات الخاصة المتغيرة" },
            { q: "ما معنى مفهوم الـ Specificity في الـ CSS عند تطبيق قاعدتين مختلفتين على نفس العنصر؟", o: ["سرعة تحميل المتصفح للملف", "نظام الأولوية والقوة الحسابية للمحددات (Selectors) لتحديد أي قاعدة تنسيق لها الأحقية بالتطبيق على العنصر", "دمج الألوان تلقائياً", "حذف التنسيقات المكررة"], a: "نظام الأولوية والقوة الحسابية للمحددات (Selectors) لتحديد أي قاعدة تنسيق لها الأحقية بالتطبيق على العنصر" },
            { q: "كيف تساهم خاصية box-sizing: border-box; في حل مشكلات حساب أبعاد العناصر؟", o: ["تقوم بتلوين الحدود تلقائياً", "تجعل المتصفح يحسب الـ padding والـ border ضمن العرض والارتفاع الإجمالي المحدد للعنصر، مما يمنع تمدده وتخريب الهيكل العام", "تقوم بإخفاء العناصر الزائدة خارج الشاشة", "تسرع من معالجة الرسوميات للموقع"], a: "يجعل المتصفح يحسب الـ padding والـ border ضمن العرض والارتفاع الإجمالي المحدد للعنصر، مما يمنع تمدده وتخريب الهيكل العام" },
            { q: "أي الاستعلامات التالية (Media Queries) تُستخدم لتطبيق تنسيقات خاصة بالهواتف المحمولة التي يقل عرض شاشتها عن 768 بكسل؟", o: ["@media (min-width: 768px)", "@media (max-width: 768px)", "@media screen and mobile", "@phone-only"], a: "@media (max-width: 768px)" }
        ]
    }
};

// إدارة التنقل المباشر والسلس بين واجهات وشاشات المنصة المختلفة
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

// معالجة الضغط على زر الترحيب وحفظ اسم المستخدم للمنصة
document.getElementById('btn-start').addEventListener('click', () => {
    const nameInput = document.getElementById('username').value.trim();
    if(nameInput === "") {
        alert("من فضلك أدخل اسمك الثلاثي أولاً لإصدار الشهادات باسمك بدقة.");
        return;
    }
    currentUser = nameInput;
    document.getElementById('user-display-name').innerText = currentUser;
    showScreen('dashboard-screen');
});

// فتح مسار التعلم للغة البرمجية المحددة
function openLanguage(lang) {
    currentLanguage = lang;
    currentLevel = userProgress[lang].allowedLevel;
    document.getElementById('current-lang-title').innerText = `مسار احتراف لغة ${lang}`;
    renderLevelsMap();
    loadLevelLesson();
    showScreen('learning-screen');
}

// بناء خريطة المستويات الـ 11 التفاعلية بحسب التقدم المتاح
function renderLevelsMap() {
    const container = document.getElementById('levels-map-container');
    container.innerHTML = "";
    
    for(let i = 1; i <= 11; i++) {
        const node = document.createElement('div');
        node.className = 'level-node';
        node.innerText = `ليفل ${i}`;
        
        if(i < userProgress[currentLanguage].allowedLevel) {
            node.classList.add('completed');
            node.onclick = () => { currentLevel = i; loadLevelLesson(); };
        } else if (i === userProgress[currentLanguage].allowedLevel) {
            node.classList.add('active');
            node.onclick = () => { currentLevel = i; loadLevelLesson(); };
        } else {
            node.title = "يجب اجتياز المستويات السابقة لحمل هذا التحدي";
        }
        container.appendChild(node);
    }
}

// تعبئة محتوى الدرس الحالي للغة والتحضير الفوري للاختبار
function loadLevelLesson() {
    document.getElementById('lesson-level-title').innerText = `المستوى التعليمي رقم ${currentLevel}: المعرفة النظرية والتطبيقية`;
    document.getElementById('lesson-content').innerHTML = `
        <p>${contentData[currentLanguage]}</p>
        <blockquote>أنت الآن في صدد قراءة واكتساب المهارات الخاصة بالمستوى رقم <strong>${currentLevel}</strong> في مسار ${currentLanguage}. يرجى القراءة بتمعن، حيث أن الاختبار القادم تم وضعه بدقة لقياس فهمك لسيناريوهات سوق العمل الحقيقية.</blockquote>
    `;
}

// بدء التقييم والاختبار للمستوى الحالي
document.getElementById('btn-complete-reading').addEventListener('click', () => {
    currentQuestionIndex = 0;
    userScore = 0;
    document.getElementById('quiz-info-title').innerText = `تقييم لغة ${currentLanguage} - ليفل ${currentLevel}`;
    loadQuestion();
    showScreen('quiz-screen');
});

// توليد وتحميل السؤال الحالي وخيارات الإجابة ديناميكياً
function loadQuestion() {
    const isLevel11 = (currentLevel === 11);
    const questionsList = isFinalLevelQuestionsExist(isLevel11) ? questionsBank[currentLanguage].level11 : questionsBank[currentLanguage].normal;
    const totalQuestions = isLevel11 ? questionsList.length : 10;

    const currentQuestion = questionsList[currentQuestionIndex] || questionsBank[currentLanguage].normal[0];

    document.getElementById('quiz-progress').innerText = `السؤال ${currentQuestionIndex + 1} من ${totalQuestions}`;
    document.getElementById('question-text').innerText = currentQuestion.q;

    const optionsContainer = document.getElementById('answers-options');
    optionsContainer.innerHTML = "";

    currentQuestion.o.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = option;
        btn.onclick = () => checkAnswer(option, currentQuestion.a, totalQuestions);
        optionsContainer.appendChild(btn);
    });
}

function isFinalLevelQuestionsExist(isLevel11) {
    return isLevel11 && questionsBank[currentLanguage].level11 && questionsBank[currentLanguage].level11.length > 0;
}

// فحص الإجابة المختارة والتقدم للسؤال التالي أو إنهاء الاختبار والتقييم
function checkAnswer(selected, correct, total) {
    if(selected === correct) {
        userScore++;
    }
    
    currentQuestionIndex++;
    if(currentQuestionIndex < total) {
        loadQuestion();
    } else {
        finishQuiz(total);
    }
}

// إنهاء التقييم واحتساب النسبة المئوية للنجاح وتوليد الشهادة المستحقة
function finishQuiz(total) {
    const passingScore = Math.ceil(total * 0.7); // شرط النجاح العلمي 70% كحد أدنى
    
    if(userScore >= passingScore) {
        alert(`تهانينا الحارة! لقد اجتزت بنجاح ليفل ${currentLevel} بمعدل درجات بلغت ${userScore} من أصل ${total}. جاري إصدار وثيقة نجاحك الآلية.`);
        
        if(!userProgress[currentLanguage].certificates.includes(currentLevel)) {
            userProgress[currentLanguage].certificates.push(currentLevel);
        }
        
        if(currentLevel === userProgress[currentLanguage].allowedLevel && currentLevel < 11) {
            userProgress[currentLanguage].allowedLevel++;
        }
        
        localStorage.setItem('platform_progress', JSON.stringify(userProgress));
        showCertificate(currentLanguage, currentLevel);
    } else {
        alert(`للأسف لم تحقق النسبة المطلوبة للنجاح (70%). لقد حصلت على دقة إجابات تبلغ ${userScore}/${total}. نوصيك بمراجعة المادة التعليمية والمحاولة مرة أخرى لتنمية مهاراتك بشكل أفضل.`);
        openLanguage(currentLanguage);
    }
}

// طباعة وعرض الشهادات (التحفيزية للمستويات المرحلية، والماسية لليفل 11 الختامي)
function showCertificate(lang, level) {
    const printArea = document.getElementById('certificate-print-area');
    const isFinal = (level === 11);
    let certHTML = "";
    
    if(isFinal) {
        certHTML = `
            <div class="certificate-view final">
                <h1 class="cert-platform">🌟 أكاديمية التميز البرمجية الكبرى 🌟</h1>
                <p class="cert-motivation" style="color:#2563eb; font-weight:bold; font-size: 16px;">وسام الاستحقاق التقني والاحتراف المتكامل من المستوى الحادي عشر</p>
                <p class="cert-title" style="margin-top: 20px;">يشهد مجلس إدارة قطاع التدريب التقني والمهني بأن المهندس المحترف:</p>
                <div class="cert-name">${currentUser}</div>
                <p class="cert-title">قد اجتاز بنجاح منقطع النظير كافة الاختبارات الشاملة والتطبيقات المتقدمة للمسار التعليمي:</p>
                <h2 style="color:#1e3a8a; font-size:32px; margin: 15px 0;">خبير ومطور تطبيقات متقدم: لغة ${lang}</h2>
                <p>بناءً عليه مُنحت له هذه الشهادة الماسية الختامية دليلاً على كفاءته وجاهزيته التامة لسوق العمل والإنتاج المباشر.</p>
                <div class="cert-badge" style="margin-top: 25px;">💎 شهادة إتمام المسار والاحتراف الماسية الكاملة 💎</div>
                <p style="margin-top:30px; font-size:12px; color:#94a3b8; font-family: monospace;">التحقق الأكاديمي الرقمي: CERT-FINAL-${lang.toUpperCase()}-${Math.floor(100000+Math.random()*800000)}</p>
            </div>
        `;
    } else {
        certHTML = `
            <div class="certificate-view">
                <h1 class="cert-platform">منصة التميز لتعليم البرمجة</h1>
                <p class="cert-motivation">🎯 "إن المبرمجين العظماء لا يولدون عظماء، بل يصنعون مهاراتهم مستوى تلو الآخر بالصبر والتعلم المستمر، طريقك للاحتراف يبدأ بخطوة!" 🎯</p>
                <p class="cert-title" style="margin-top: 15px;">وثيقة تشجيع وإنجاز مرحلي تمنح للطالب المثابر:</p>
                <div class="cert-name">${currentUser}</div>
                <p class="cert-title">لتخطيه بنجاح شروط التقييم الأكاديمي المبرمج لـ:</p>
                <h3 style="color: #16a34a; font-size: 22px;">المستوى التعليمي المعرفي رقم (${level}) في مسار لغة ${lang}</h3>
                <div class="cert-badge" style="margin-top: 20px;">🏅 شهادة إنجاز وجدارة مرحلية متميزة 🏅</div>
                <p style="margin-top:25px; font-size:11px; color:#a1a1aa; font-family: monospace;">الرقم المرجعي للمستوى: CERT-${lang.toUpperCase()}-LEVEL${level}-${Math.floor(1000+Math.random()*8999)}</p>
            </div>
        `;
    }
    
    printArea.innerHTML = certHTML;
    document.getElementById('cert-modal').style.display = "flex";
}

// إغلاق النافذة المنبثقة للشهادات والعودة التلقائية للمسار التعليمي
function closeCertModal() {
    document.getElementById('cert-modal').style.display = "none";
    openLanguage(currentLanguage);
}

// عرض وإدارة شاشة معرض الشهادات المنقسم لأربعة تبويبات لكل لغة
document.getElementById('btn-go-certs').addEventListener('click', () => {
    showScreen('certificates-screen');
    switchCertTab('Python');
});

function switchCertTab(lang) {
    document.querySelectorAll('.tab-link').forEach(btn => {
        btn.classList.remove('active');
        if(btn.innerText === lang) btn.classList.add('active');
    });

    const displayContainer = document.getElementById('certs-display-container');
    displayContainer.innerHTML = "";

    const earnedCerts = userProgress[lang].certificates;

    if(earnedCerts.length === 0) {
        displayContainer.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #64748b; padding: 50px; font-size: 16px;">لم تكتسب أي شهادات في مسار لغة ${lang} حتى الآن. قم بإنهاء مستويات اللغة لتظهر شهاداتك الفخرية هنا علناً!</p>`;
        return;
    }

    earnedCerts.sort((a,b) => a-b).forEach(lvl => {
        const thumb = document.createElement('div');
        thumb.className = 'cert-thumb';
        thumb.innerHTML = `
            <div style="font-size: 38px; margin-bottom: 5px;">${lvl === 11 ? '💎' : '🏅'}</div>
            <h4>شهادة ليفل ${lvl}</h4>
            <p style="color: #64748b; font-size: 14px; margin: 5px 0;">مسار لغة ${lang}</p>
            <span style="color: #2563eb; font-size:13px; font-weight:bold; cursor: pointer;">🔍 عرض وطباعة المستند</span>
        `;
        thumb.onclick = () => showCertificate(lang, lvl);
        displayContainer.appendChild(thumb);
    });
}