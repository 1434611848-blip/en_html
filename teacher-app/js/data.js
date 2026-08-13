/**
 * 七年级英语暑假综合检测试卷
 * 题目数据、答案、考点、个性化诊断配置
 *
 * 满分：100分
 * 题型分布：
 *  一、单项选择：20题 × 1分 = 20分
 *  二、完形填空：10题 × 2分 = 20分
 *  三、阅读理解：5题 × 3分  = 15分
 *  四、任务型阅读：5空 × 1分 = 5分
 *  五、语法填空：10题 × 2分 = 20分
 */

window.EXAM_DATA = {
  meta: {
    title: '七年级英语暑假综合检测试卷',
    durationMin: 90,
    totalScore: 80, // 答案卷显示满分80分（试卷题头标注"满分100分"但内容为80分题目，本工具按答案卷实际覆盖80分计分）
    grade: '七年级',
    subject: '英语',
    term: '暑假综合',
    scoreNote: '试卷题头为"满分100分"，答案卷明确写明"满分：80分（对应优学生版）"。本工具按答案卷实际覆盖的80分客观题计分。'
  },

  // 一、单项选择
  choice: {
    sectionName: '一、单项选择',
    perScore: 1,
    questions: [
      {
        no: 1,
        stem: 'There are many ______ in the zoo.',
        options: { A: 'fox', B: 'foxs', C: 'foxes', D: "foxes'" },
        answer: 'C',
        knowledge: '名词复数规则：以 -s, -x, -ch, -sh 结尾的可数名词变复数需加 -es。',
        diagnosis: '你把 fox（狐狸）的复数形式记错了。规则：以 -s / -x / -ch / -sh 结尾的可数名词变复数要加 -es，比如 box → boxes，watch → watches。',
        tip: '背诵"加 -es 结尾四兄弟"：s, x, ch, sh。'
      },
      {
        no: 2,
        stem: 'I can see three ______ in the park.',
        options: { A: 'child', B: 'childs', C: 'children', D: 'childrens' },
        answer: 'C',
        knowledge: '不规则名词复数：child → children。',
        diagnosis: 'child（孩子）的复数是不规则变化 children，不是加 -s 或 -ren。',
        tip: '常见不规则复数：child→children, tooth→teeth, foot→feet, mouse→mice。'
      },
      {
        no: 3,
        stem: 'Please give me some ______.',
        options: { A: 'waters', B: 'water', C: 'a water', D: 'many water' },
        answer: 'B',
        knowledge: 'some 既可修饰可数名词复数，也可修饰不可数名词；water 是不可数名词，没有复数形式，也不能说 a water。',
        diagnosis: 'water 是不可数名词，没有复数形式，不能用 many 修饰，也不能说 a water。some 可以修饰不可数名词，因此 some water 是正确的。',
        tip: '不可数名词没有复数形式，不能直接用 a/an 或 many 修饰；表示数量时可借助量词，如 a glass of water / two bottles of water。'
      },
      {
        no: 4,
        stem: 'We need two ______ for the salad.',
        options: { A: 'tomatos', B: 'tomato', C: 'tomatoes', D: 'a tomato' },
        answer: 'C',
        knowledge: '以辅音字母 + o 结尾的可数名词变复数加 -es。',
        diagnosis: 'tomato（西红柿）以"辅音+o"结尾，复数要加 -es → tomatoes。常见同类：potato→potatoes, hero→heroes。',
        tip: '"西红柿、土豆"是典型"辅音 + o 加 -es"代表，记口诀：英雄爱吃土豆和西红柿。'
      },
      {
        no: 5,
        stem: 'This is ______ room. They share it.',
        options: { A: "Lucy and Lily's", B: "Lucy's and Lily's", C: "Lucy and Lily", D: 'Lucy and Lily' },
        answer: 'A',
        knowledge: '两人共有某物时，所有格 -’s 只加在后一个名词上。',
        diagnosis: 'Lucy and Lily 共用一个房间，应在最后一个名字后加 \'s → Lucy and Lily\'s room。如果两人各自拥有，则各自都要加 \'s。',
        tip: '"共享加最后，独立各加各"。'
      },
      {
        no: 6,
        stem: 'Mr. Wang teaches ______ English.',
        options: { A: 'we', B: 'our', C: 'us', D: 'ours' },
        answer: 'C',
        knowledge: 'teach sb. sth. 中 sb. 用宾格。',
        diagnosis: 'teach 是动词，"教某人英语"中"某人"必须用宾格，we 的宾格是 us。our 是形容词性物主代词，ours 是名词性物主代词，都不能作宾语。',
        tip: '动词后接"人"用宾格：teach us, help them, thank her。'
      },
      {
        no: 7,
        stem: '— Is this ______ pen? — No, it\'s not mine. It\'s ______.',
        options: { A: 'you; her', B: 'your; hers', C: 'yours; her', D: 'you; hers' },
        answer: 'B',
        knowledge: '形容词性物主代词 + 名词；名词性物主代词单独使用。',
        diagnosis: '"你的钢笔"中 pen 前需用形容词性物主代词 your；后半句"它是她的（钢笔）"，没有名词，用名词性物主代词 hers。',
        tip: '形容词性物主代词：my/your/his/her/its/our/their（必带名词）；名词性物主代词：mine/yours/his/hers/its/ours/theirs（独立使用）。'
      },
      {
        no: 8,
        stem: 'My brother ______ to school every day.',
        options: { A: 'go', B: 'going', C: 'goes', D: 'to go' },
        answer: 'C',
        knowledge: '一般现在时：主语为第三人称单数，动词加 -s/-es。',
        diagnosis: 'My brother 是第三人称单数，every day 提示一般现在时，谓语动词 go 要加 -es → goes。',
        tip: '第三人称单数动词变化：一般加 -s；以 s, x, ch, sh, o 结尾加 -es；辅音 + y 改 y 为 i 加 -es。'
      },
      {
        no: 9,
        stem: 'Tom is ______ honest boy.',
        options: { A: 'a', B: 'an', C: 'the', D: '/' },
        answer: 'B',
        knowledge: '不定冠词 a/an：an 用于以元音音素开头的单词前。',
        diagnosis: 'honest 的 h 不发音，首音素是 /ɒ/，属元音，所以用 an；不要被首字母 h 误导，关键看发音。',
        tip: '"看发音不看字母"：hour, honest, honor 等"哑音 h"开头的词用 an。'
      },
      {
        no: 10,
        stem: 'She can play ______ piano very well.',
        options: { A: 'a', B: 'an', C: 'the', D: '/' },
        answer: 'C',
        knowledge: '乐器名词前要加定冠词 the。',
        diagnosis: '表示演奏某种乐器时，乐器名词前必须加 the（如 play the piano）；而球类运动前不加 the（如 play basketball）。',
        tip: '"乐器要 the，球类不要 the"。'
      },
      {
        no: 11,
        stem: 'The book is ______ the desk and the chair.',
        options: { A: 'among', B: 'between', C: 'in', D: 'on' },
        answer: 'B',
        knowledge: 'between 用于两者之间；among 用于三者或三者以上。',
        diagnosis: 'between 用于"两者之间"，among 用于"三者或以上之间"。这里是书桌和椅子"两者之间"，所以用 between。',
        tip: '"两 between，三 among"；between 强调"两者之间逐一"，among 强调"群体之中"。'
      },
      {
        no: 12,
        stem: 'She usually plays basketball ______ the afternoon.',
        options: { A: 'on', B: 'in', C: 'at', D: 'for' },
        answer: 'B',
        knowledge: '时间介词：in the morning / afternoon / evening。',
        diagnosis: '"在下午"是固定搭配 in the afternoon；on 用于具体某一天，at 用于某一时刻。',
        tip: '时间介词口诀：年/月/季节 in，星期/某天 on，时刻 at。in the morning/afternoon/evening。'
      },
      {
        no: 13,
        stem: 'He ______ like milk. He likes juice.',
        options: { A: "don't", B: "doesn't", C: 'not', D: "isn't" },
        answer: 'B',
        knowledge: '一般现在时否定：主语为第三人称单数用 doesn\'t + 动词原形。',
        diagnosis: 'He 是第三人称单数，否定要借助 doesn\'t，后接动词原形 like，不能用 don\'t。',
        tip: '"第三人称否定三步走"：doesn\'t + 动词原形，且原句中的动词变化要去掉。'
      },
      {
        no: 14,
        stem: 'My sister enjoys ______ books.',
        options: { A: 'read', B: 'reading', C: 'reads', D: 'to read' },
        answer: 'B',
        knowledge: 'enjoy doing sth.：喜欢做某事。',
        diagnosis: 'enjoy 后必须接 doing（动名词），不能用动词原形或不定式。类似用法的还有 finish doing, mind doing, practise doing。',
        tip: '"enjoy + doing" 是固定搭配，记住：享受过程，所以用 -ing。'
      },
      {
        no: 15,
        stem: '句子结构 "She likes music." 是 ______',
        options: { A: 'S+V+O (主语+谓语+宾语)', B: 'S+V+P (主语+谓语+表语)', C: 'S+V (主语+谓语)', D: 'S+V+O+OC (主语+谓语+宾语+宾语补足语)' },
        answer: 'A',
        knowledge: '简单句五种基本结构：主谓、主谓宾、主谓表、主谓宾宾、主谓宾补。',
        diagnosis: 'She（主语 S）+ likes（谓语 V）+ music（宾语 O），是典型的"主谓宾"结构。music 是及物动词 likes 的承受者，所以是宾语，不是表语。',
        tip: '"谓语后接动作承受者→宾语；接描述性质→表语"。'
      },
      {
        no: 16,
        stem: 'I have ______ homework to do today.',
        options: { A: 'many', B: 'a lot', C: 'a lot of', D: 'a lots of' },
        answer: 'C',
        knowledge: 'a lot of 既可修饰可数又可修饰不可数名词。',
        diagnosis: 'homework 是不可数名词，不能用 many；a lot of 既可修饰可数也可修饰不可数；a lot 单独用不作定语；a lots of 是错误搭配。',
        tip: '"many + 可数复数；much + 不可数；a lot of 通吃。"'
      },
      {
        no: 17,
        stem: 'There are two ______ in our school.',
        options: { A: 'library', B: 'libraies', C: 'libraries', D: 'librareys' },
        answer: 'C',
        knowledge: '以辅音字母 + y 结尾的可数名词，变复数改 y 为 i 加 -es。',
        diagnosis: 'library 以"辅音 + y"结尾，复数要变 y 为 i 加 -es → libraries。同类：family→families, baby→babies。',
        tip: '"辅音 + y，改 y 为 i 加 -es；元音 + y，直接加 -s"（如 boy→boys）。'
      },
      {
        no: 18,
        stem: 'Those ______ are our teachers.',
        options: { A: 'woman', B: 'womans', C: 'womens', D: 'women' },
        answer: 'D',
        knowledge: '不规则名词复数：woman → women。',
        diagnosis: 'woman 的复数是不规则变化 women，且要把 man 也变成 men，类似 foot→feet, tooth→teeth。',
        tip: '常见"内部变元音"的不规则复数：man→men, woman→women, foot→feet, tooth→teeth, mouse→mice, goose→geese。'
      },
      {
        no: 19,
        stem: '______ he play football every day? — Yes, he does.',
        options: { A: 'Do', B: 'Does', C: 'Is', D: 'Are' },
        answer: 'B',
        knowledge: '一般现在时一般疑问句：主语为第三人称单数用 Does。',
        diagnosis: '第三人称单数 he 提问，借助 does，且回答 "Yes, he does" 也印证了这一点。',
        tip: '"提问看主语，单数第三人称 does；其他 do；be 动词另当别论"。'
      },
      {
        no: 20,
        stem: 'Tom and Jerry ______ basketball after school.',
        options: { A: 'plays', B: 'play', C: 'playing', D: 'to play' },
        answer: 'B',
        knowledge: '一般现在时：主语为复数，谓语动词用原形。',
        diagnosis: 'Tom and Jerry 是 and 连接的并列主语，视作复数，谓语动词 play 用原形。',
        tip: '"and 连接通常作复数"，但有例外：bread and butter, the writer and teacher（指同一人）等。'
      }
    ]
  },

  // 二、完形填空（语篇：Ben 一家做家庭菜园）
  cloze: {
    sectionName: '二、完形填空',
    perScore: 2,
    passage: 'Every Saturday, Ben\'s family has a "family hour". They do not watch TV. Instead, everyone __1__ one thing to do together. Last Saturday, Ben\'s mother suggested making a small garden __2__ the window. She said the garden could make the room brighter and give the family something to care for.\n\nBefore they started, they made a simple plan. Ben\'s father brought some small boxes, his mother prepared the soil, and Ben\'s sister found some seeds. Ben wrote the names of the vegetables on paper. Everyone had a job, so they worked happily together.\n\nAt first, Ben thought it was __3__ difficult. He did not know how __4__ the soil or plant the seeds. His sister showed __5__ a picture in her science book. "The seeds need water, light and care," she said. Ben then __6__ the instructions and worked with his father. They planted three kinds of vegetables and put the boxes __7__ a sunny place. Ben made labels for __8__ so that the family could tell them apart.\n\nAfter two weeks, green leaves came out. Ben was excited, but his mother told him that the plants __9__ grow well in one day. He learned that patience is important and decided __10__ the garden every morning.',
    questions: [
      {
        no: 1,
        stem: 'everyone ______ one thing to do together',
        options: { A: 'chooses', B: 'chooses to', C: 'choose', D: 'choosing' },
        answer: 'A',
        knowledge: 'everyone 为第三人称单数，谓语动词加 -s。',
        diagnosis: 'everyone 指"每个人"，作主语时谓语用第三人称单数 chooses；句意"每个人选择一件事一起做"。',
        tip: '"every - one/body/thing" 都是第三人称单数谓语：everybody knows, everything is fine。'
      },
      {
        no: 2,
        stem: 'making a small garden ______ the window',
        options: { A: 'near', B: 'between', C: 'under', D: 'from' },
        answer: 'A',
        knowledge: '方位介词：near the window 表示"在窗户附近"。',
        diagnosis: '句意"在窗户附近建一个小花园"，near 表示"靠近"，最符合语境。',
        tip: '"位置介词"辨析：near 附近，between 两者之间，under 正下方，from 来自。'
      },
      {
        no: 3,
        stem: 'Ben thought it was ______ difficult',
        options: { A: 'a few', B: 'a little', C: 'few', D: 'many' },
        answer: 'B',
        knowledge: 'a little 修饰不可数概念/形容词/副词，表示"有一点"。',
        diagnosis: 'difficult 是形容词，"有一点难"用 a little；a few / few 修饰可数名词复数，many 也修饰可数名词复数。',
        tip: '"a little + 不可数 / 形容词 / 副词；a few + 可数复数"。'
      },
      {
        no: 4,
        stem: 'how ______ the soil or plant the seeds',
        options: { A: 'prepare', B: 'preparing', C: 'to prepare', D: 'prepared' },
        answer: 'C',
        knowledge: '"疑问词 + to do" 是动词不定式结构。',
        diagnosis: '"如何准备土壤"应表达为 how to prepare；how / what / where + to do 表示"如何/做什么/在哪做"。',
        tip: '"疑问词 + to do" 相当于名词短语：I don\'t know what to do = I don\'t know what I should do。'
      },
      {
        no: 5,
        stem: 'His sister showed ______ a picture',
        options: { A: 'he', B: 'him', C: 'his', D: 'himself' },
        answer: 'B',
        knowledge: 'show sb. sth. 中 sb. 用宾格。',
        diagnosis: '"给某人看某物" 用 show sb. sth.，句中 sb. 指代 Ben（他），应用宾格 him。',
        tip: '"双宾语动词"：show/teach/give/buy/pass sb. sth. = sth. to/for sb.。'
      },
      {
        no: 6,
        stem: 'Ben then ______ the instructions',
        options: { A: 'reads', B: 'read', C: 'reading', D: 'to read' },
        answer: 'B',
        knowledge: '叙述过去发生的事用一般过去时；read 的过去式与原形同形。',
        diagnosis: '故事发生在 Last Saturday，过去时 read 与原形同形；不要误写成 reads。',
        tip: '"过去式同形"动词：read→read, cut→cut, put→put, let→let, hit→hit。'
      },
      {
        no: 7,
        stem: 'put the boxes ______ a sunny place',
        options: { A: 'in', B: 'on', C: 'at', D: 'to' },
        answer: 'B',
        knowledge: 'put ... on a place 指"放在某处表面"。',
        diagnosis: '把箱子放在阳光充足的地方的"面上"，用 on；in 强调"内部"，at 强调"某一点"，to 强调方向。',
        tip: '"放在面上用 on，放在里面用 in"，如 put the book on the desk / in the bag。'
      },
      {
        no: 8,
        stem: 'Ben made labels for ______',
        options: { A: 'they', B: 'them', C: 'their', D: 'theirs' },
        answer: 'B',
        knowledge: '介词 for 后接宾格。',
        diagnosis: 'labels 指的是前面提到的 boxes/for them，所以 for 后接宾格 them。',
        tip: '"介词后必用宾格"：for us, with her, to him, between them。'
      },
      {
        no: 9,
        stem: 'the plants ______ grow well in one day',
        options: { A: "don't", B: "doesn't", C: "aren't", D: "isn't" },
        answer: 'A',
        knowledge: '一般现在时否定：plants 是复数主语，用 don\'t。',
        diagnosis: 'plants 是复数，否定借助 don\'t；用 doesn\'t 是第三人称单数。',
        tip: '"否定看主语：单数 doesn\'t，复数 don\'t"。'
      },
      {
        no: 10,
        stem: 'decided ______ the garden every morning',
        options: { A: 'check', B: 'checking', C: 'to check', D: 'checked' },
        answer: 'C',
        knowledge: 'decide to do sth.：决定做某事。',
        diagnosis: 'decide 之后接动词不定式 to do；句意"决定每天早上照看花园"。',
        tip: '"decide / hope / plan / agree / want + to do"。'
      }
    ]
  },

  // 三、阅读理解
  reading: {
    sectionName: '三、阅读理解',
    perScore: 3,
    passage: 'A Little Library at School\n\nOur school has a small reading room. It is next to the library. There are many interesting books in it, but students can read them only during the lunch break. Last month, our English teacher, Ms Green, asked us to help make the room better.\n\nAt first, we put the books in different groups. Storybooks went on one shelf, science books on another, and English newspapers near the window. Then we made a simple list of the books. Now students can find a book quickly. I also made a "book corner" for students to write about their favorite books.\n\nThe reading room is busier than before. Some students come there to read quietly, while others share ideas with their classmates. Ms Green says reading for a short time every day is a good habit. We are happy because the room is not only cleaner but also more useful.',
    questions: [
      {
        no: 1,
        stem: 'When can students read in the reading room?',
        options: { A: 'Before breakfast.', C: 'After school every day.', B: 'During the lunch break.', D: 'On Sunday morning.' },
        answer: 'B',
        knowledge: '细节理解题：根据原文 "during the lunch break" 判断。',
        diagnosis: '你可能没注意时间状语。原文明确说 only during the lunch break（只能在午餐休息时间）。',
        tip: '"细节题要回到原句圈出关键时间、地点、数字"。'
      },
      {
        no: 2,
        stem: 'How did the students put the books at first?',
        options: { A: 'They put all the books near the window.', B: 'They put the books in different groups.', C: 'They gave all the books to Ms Green.', D: 'They took the books home.' },
        answer: 'B',
        knowledge: '细节理解题：第二段首句。',
        diagnosis: '原文是 put the books in different groups（把书分成不同类），不是全放在窗边。',
        tip: '细节题关键是【同义替换】，原句可换词，意思不变。'
      },
      {
        no: 3,
        stem: 'The word "groups" in Paragraph 2 means ______.',
        options: { A: 'kinds of food', B: 'different classes of books', C: 'school subjects', D: 'reading rooms' },
        answer: 'B',
        knowledge: '词义猜测题：根据下文 Storybooks / science books / English newspapers 推断。',
        diagnosis: 'groups 在这里指"书的类别"，下文紧接着列举了 storybooks、science books、English newspapers 三类书。',
        tip: '"词义猜猜三步走"：看上下文、看举例、看对比。'
      },
      {
        no: 4,
        stem: 'Why can students find a book quickly now?',
        options: { A: 'Because the room is next to the library.', B: 'Because Ms Green buys new books every day.', C: 'Because the books are put in groups and listed.', D: 'Because students read only newspapers.' },
        answer: 'C',
        knowledge: '原因推断题：根据第二段描述推断。',
        diagnosis: '原文说"按类别摆放 + 列了一份简单清单"，所以学生能快速找到书，A、B、D 都没依据。',
        tip: '"原因题在文中找动作/做法的描述，再看结果是什么"。'
      },
      {
        no: 5,
        stem: 'Which is the best title for the passage?',
        options: { A: 'A Little Library at School', B: 'A Difficult English Lesson', C: 'A Busy Lunch Break', D: 'Ms Green\'s Favorite Book' },
        answer: 'A',
        knowledge: '主旨大意题：标题要概括地点、对象与核心。',
        diagnosis: '文章围绕"校园小图书馆"展开，A 选项既点明地点（at School）又点明对象（A Little Library），最能概括全文主旨。',
        tip: '"好标题三看"：看主语高频词、看首尾段、看每段主题词。'
      }
    ]
  },

  // 四、任务型阅读（表格）
  task: {
    sectionName: '四、任务型阅读（表格类）',
    perScore: 1,
    passage: 'American Families on Weekends\n\nMany American families often do some sports on weekends. Running, biking, playing volleyball and swimming are popular sports among them. The weekend is also a time for American families to work in the yard. Many families plant flowers and vegetables in the yard. Sometimes some families spend the weekend painting their houses. They are busy on weekends, but they are very relaxed.\n\nChildren are very happy on weekends. They can go to the park, the zoo, the cinema and many other places they want to go. They can play games, fly kites and play any ball game. Sometimes they may help their parents do some housework at home. Their parents may also take them to restaurants for a good dinner. They think the weekend is the best time of a week.',
    blanks: [
      {
        no: 1,
        label: 'Do sports: running, biking, playing ______ and swimming',
        answer: 'volleyball',
        knowledge: '细节提取：sports 列举中空格前的 playing 提示填运动项目。',
        diagnosis: '原句列举"running, biking, playing volleyball and swimming"，空格处需填可与 play 搭配的球类名词 volleyball。',
        tip: '"球类名词与 play 搭配时不加 the"：play basketball / play volleyball / play football。'
      },
      {
        no: 2,
        label: 'Work in the yard: plant ______ and vegetables; paint houses',
        answer: 'flowers',
        knowledge: '细节提取：plant flowers and vegetables。',
        diagnosis: '原句 plant flowers and vegetables（种花和蔬菜），空格需填 flowers。',
        tip: '"并列结构中空格需填与所给词同类且在文中出现过"。'
      },
      {
        no: 3,
        label: 'Go to the ______, the zoo and the cinema',
        answer: 'park',
        knowledge: '细节提取：go to the park, the zoo and the cinema。',
        diagnosis: '原句列举了 park / zoo / cinema 三个地点，空格应填 park。',
        tip: '"地点并列要单复数匹配，the + 名词单数"。'
      },
      {
        no: 4,
        label: 'Help parents do ______',
        answer: 'housework',
        knowledge: '细节提取：help parents do some housework。',
        diagnosis: '原句 help parents do some housework（帮父母做家务），空格需填 housework（不可数名词）。',
        tip: '"do housework" 是固定搭配，不可数。'
      },
      {
        no: 5,
        label: 'Busy but ______',
        answer: 'relaxed',
        knowledge: '同义转述：They are busy on weekends, but they are very relaxed. → Busy but relaxed',
        diagnosis: '原句"他们很忙但很放松"，空格填形容词 relaxed（感到放松的）。注意是 -ed 结尾的形容词（修饰人）。',
        tip: '"-ing 修饰物（令人放松的 music），-ed 修饰人（感到放松的）"。'
      }
    ]
  },

  // 五、语法填空
  grammar: {
    sectionName: '五、语法填空',
    perScore: 2,
    questions: [
      {
        no: 1,
        stem: 'My father ______ (watch) TV every evening.',
        answer: 'watches',
        altAnswers: ['watches'],
        knowledge: '一般现在时第三人称单数：动词加 -es。',
        diagnosis: 'My father 是第三人称单数，watch 加 -es → watches。',
        tip: '以 -ch / -sh / -s / -x / -o 结尾加 -es。'
      },
      {
        no: 2,
        stem: 'We need some ______ (tomato) for the salad.',
        answer: 'tomatoes',
        altAnswers: ['tomatoes'],
        knowledge: '可数名词复数：辅音 + o 结尾加 -es。',
        diagnosis: 'tomato 以"辅音+o"结尾，复数要加 -es → tomatoes。',
        tip: '"辅音+o 加 -es：potato / tomato / hero"。'
      },
      {
        no: 3,
        stem: 'Those ______ (woman) are our teachers.',
        answer: 'women',
        altAnswers: ['women'],
        knowledge: '不规则名词复数：woman → women。',
        diagnosis: 'woman 的复数是不规则变化 women；Those 复数指示代词也提示这里需要复数。',
        tip: '"a woman → two women，a man → two men"。'
      },
      {
        no: 4,
        stem: 'This is my book, and ______ (he) is on the desk.',
        answer: 'his',
        altAnswers: ['his'],
        knowledge: '名词性物主代词：his = his book。',
        diagnosis: '后半句需要"他的（书）"，his 在此相当于 his book，作主语。',
        tip: '"名词性物主代词独立使用：This is mine / his / hers"。'
      },
      {
        no: 5,
        stem: 'He ______ (not go) to school on Sundays.',
        answer: "doesn't go",
        altAnswers: ["doesn't go", 'does not go', "doesn't"],
        knowledge: '一般现在时否定：第三人称单数用 doesn\'t + 动词原形。',
        diagnosis: 'He 是第三人称单数，否定借助 doesn\'t，后接动词原形 go；不要写成 don\'t go 或 doesn\'t goes。',
        tip: '"否定第三人称 doesn\'t + 动词原形"。'
      },
      {
        no: 6,
        stem: 'There are two ______ (library) in our city.',
        answer: 'libraries',
        altAnswers: ['libraries'],
        knowledge: '可数名词复数：辅音 + y 改 y 为 i 加 -es。',
        diagnosis: 'library 以"辅音+y"结尾，复数变 y 为 i 加 -es → libraries。',
        tip: '"辅音 + y 改 y 为 i 加 -es"。'
      },
      {
        no: 7,
        stem: 'You should brush your ______ (tooth) every morning.',
        answer: 'teeth',
        altAnswers: ['teeth'],
        knowledge: '不规则名词复数：tooth → teeth。',
        diagnosis: 'tooth（牙齿）的复数是不规则变化 teeth；同样不规则的还有 foot→feet。',
        tip: '"内部变元音"复数：tooth→teeth, foot→feet。'
      },
      {
        no: 8,
        stem: 'She enjoys ______ (swim) very much.',
        answer: 'swimming',
        altAnswers: ['swimming'],
        knowledge: 'enjoy doing sth.；重读闭音节末尾只有一个辅音字母时双写再加 -ing。',
        diagnosis: 'enjoy 后接动名词；swim 是重读闭音节单词，双写 m 加 -ing → swimming。',
        tip: '"重读闭音节三步走：双写 + -ing：swim→swimming, run→running"。'
      },
      {
        no: 9,
        stem: 'He always ______ (go) to bed early.',
        answer: 'goes',
        altAnswers: ['goes'],
        knowledge: '一般现在时第三人称单数：动词加 -es。',
        diagnosis: 'He 是第三人称单数，go 加 -es → goes。',
        tip: '"以 o 结尾加 -es：go→goes, do→does"。'
      },
      {
        no: 10,
        stem: 'There are two ______ (box) on the table.',
        answer: 'boxes',
        altAnswers: ['boxes'],
        knowledge: '可数名词复数：以 -x 结尾加 -es。',
        diagnosis: 'box 以 -x 结尾，复数加 -es → boxes；同类：fox→foxes。',
        tip: '"s / x / ch / sh 加 -es"。'
      }
    ]
  },

  // 薄弱知识点诊断配置（按知识点聚合）
  // related 格式：{ sectionKey: [题号, ...], ... }，避免跨题型题号重复导致统计错误
  knowledgePoints: {
    '名词复数规则': {
      related: {
        choice: [1, 2, 4, 17, 18],
        grammar: [2, 3, 6, 7, 10]
      },
      weakness: '你对名词复数规则掌握不牢固，特别是"辅音+o"和"辅音+y"的变化，以及不规则变化（child/foot/tooth/woman 等）。',
      advice: '① 列表记忆"加 -es 四兄弟（s/x/ch/sh）"；② 区分"元音+y 直接加 s，辅音+y 改 y 为 i 加 es"；③ 整理 10 个常考不规则复数，每天默写。'
    },
    '冠词使用': {
      related: {
        choice: [9, 10]
      },
      weakness: '你对冠词 a/an/the 的用法容易混淆，特别是 a/an 看"发音"和"乐器前用 the"的规则。',
      advice: '① a/an 看发音不看字母，记住 honest/hour/honor 等哑音 h 单词；② 球类运动不加 the，乐器前必须加 the；③ 牢记"特指用 the，泛指用 a/an"。'
    },
    '代词（人称/物主/反身）': {
      related: {
        choice: [6, 7],
        grammar: [4],
        cloze: [5, 8]
      },
      weakness: '代词种类多（主格/宾格/形容词性物主/名词性物主），你在不同句子成分中容易选错形式。',
      advice: '① 画一张表格，分清 8 个代词的"主/宾/形物/名物"四列；② 牢记"动词/介词后必用宾格"；③ 区分"形容词性物主代词必带名词，名词性物主代词独立用"。'
    },
    '介词（时间/方位）': {
      related: {
        choice: [11, 12],
        cloze: [2, 7]
      },
      weakness: '你对介词辨析（between/among、in/on/at）容易混淆。',
      advice: '① 时间介词口诀：年/月/季节 in，星期/某天 on，时刻 at，in the morning/afternoon/evening；② 方位介词：between 两者，among 三者以上。'
    },
    '一般现在时（第三人称单数）': {
      related: {
        choice: [8, 13, 19, 20],
        grammar: [1, 5, 9],
        cloze: [1, 9]
      },
      weakness: '一般现在时主语为第三人称单数时，谓语动词变化以及否定/疑问的助动词（does/doesn\'t）你掌握不熟练。',
      advice: '① 主语是 he/she/it/单数名词/不可数名词时，谓语加 -s/-es；② 否定借 doesn\'t + 动词原形；③ 疑问借 Does + 主语 + 动词原形；④ 复数主语用动词原形。'
    },
    '动词搭配（enjoy/decide/show/put 等）': {
      related: {
        choice: [14],
        grammar: [8],
        cloze: [4, 5, 10]
      },
      weakness: '你对动词 + doing 或动词 + to do 的固定搭配区分不清。',
      advice: '① 强记 enjoy/finish/mind/practise + doing；② decide/hope/want/plan/agree + to do；③ show/teach + sb. + sth. 中 sb. 用宾格。'
    },
    '句子结构（简单句五种基本句型）': {
      related: {
        choice: [15]
      },
      weakness: '你还没完全掌握英语简单句的五种基本结构（S+V, S+V+O, S+V+P, S+V+IO+DO, S+V+O+OC）。',
      advice: '① 主谓宾：He plays football；② 主谓表：She is a teacher；③ 主谓宾宾：He gives me a book；④ 主谓宾补：We call him Tom；⑤ 牢记"谓语后承受者是宾语，描述性质是表语"。'
    },
    '量词（some/a lot of/many/much）': {
      related: {
        choice: [16],
        cloze: [3]
      },
      weakness: '你对 some / many / much / a lot of 修饰可数与不可数名词的搭配容易混淆。',
      advice: '① many + 可数复数；② much + 不可数；③ a lot of / lots of 通吃；④ some 可修饰两者，但注意不可数名词不能直接加 s。'
    },
    '阅读理解（细节/词义/推断/主旨）': {
      related: {
        reading: [1, 2, 3, 4, 5]
      },
      weakness: '你的阅读理解在不同题型上的表现不一，可能在词义猜测或主旨大意题上失分较多。',
      advice: '① 细节题：回到原句圈关键词；② 词义题：看上下文/举例/对比；③ 原因题：找文中"动作→结果"；④ 主旨题：看首尾段、各段主题词、高频词。'
    },
    '任务型阅读（细节提取/同义转述）': {
      related: {
        task: [1, 2, 3, 4, 5]
      },
      weakness: '你在任务型阅读中失分较多，可能是细节提取不准确或同义转述能力不足。',
      advice: '① 先读题再回文定位关键词；② 注意同义替换和词形转换；③ 检查拼写和语法形式。'
    },
    '完形填空（上下文逻辑）': {
      related: {
        cloze: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      },
      weakness: '你的完形填空可能在时态判断、固定搭配和上下文逻辑上失分。',
      advice: '① 通读首段抓主旨；② 注意时间状语判断时态（Last Saturday → 过去时）；③ 牢记常见搭配（how to do, decide to do, show sb. sth.）；④ 空格前后语境推理。'
    },
    '语法填空综合（时态/语态/词形）': {
      related: {
        grammar: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      },
      weakness: '你在语法填空中需要综合运用"时态 + 主谓一致 + 词形变化 + 固定搭配"的能力。',
      advice: '① 第一步先看时态/语态标志词；② 第二步看主语确定谓语形式；③ 第三步看空格所需词性；④ 最后核对搭配（介词/冠词/动词不定式/动名词等）。'
    }
  },

  // ===== 知识点→讲义回放章节映射表 =====
  // 依据 26年暑假7年级英语 第1~10节笔记首页 Part2 内容整理
  // type: 'basic'(基础不扎实→看回放) / 'advanced'(升级题目→加餐练习) / 'instability'(不稳定→分析原因)
  lectureMap: {
    '名词复数': {
      lectures: ['第2节 名词基础', '第3节 名词进阶'],
      type: 'basic',
      solution: '基础知识不扎实。名词复数变化规则是七年级核心考点，建议回看【第2节 名词基础】和【第3节 名词进阶】课程回放，重点复习：① s/x/ch/sh结尾加-es；② 辅音+y改y为i加-es；③ 辅音+o结尾加-es（tomato→tomatoes）。回看后请完成课后配套练习。',
      extraPractice: '找辅导老师领取"名词复数变化专项加餐练习"15题'
    },
    '不规则名词': {
      lectures: ['第3节 名词进阶'],
      type: 'basic',
      solution: '基础知识不扎实。不规则名词复数需要记忆，建议回看【第3节 名词进阶】课程回放，整理10个常考不规则复数（child→children, woman→women, tooth→teeth, foot→feet, mouse→mice），每天默写一遍，连续坚持5天。',
      extraPractice: '找辅导老师领取"不规则名词默写卡"'
    },
    '不可数名词': {
      lectures: ['第2节 名词基础'],
      type: 'basic',
      solution: '基础知识不扎实。不可数名词不能直接加-s，建议回看【第2节 名词基础】课程回放，掌握常见不可数名词（water, homework, housework, bread, money等）及量词搭配（a glass of / a bottle of / a piece of）。',
    },
    '所有格': {
      lectures: ['第5节 名词拔高'],
      type: 'advanced',
      solution: '属于拔高知识点。名词所有格的"共有与独立"规则较灵活，建议回看【第5节 名词拔高】课程回放，掌握"共享加最后，独立各加各"的口诀，并注意"of所有格"的用法。',
      extraPractice: '找辅导老师要"名词所有格加餐练习"10题（含易错对比题）'
    },
    '代词': {
      lectures: ['第4节 人称和物主代词'],
      type: 'basic',
      solution: '基础知识不扎实。代词是七年级重点，建议回看【第4节 人称和物主代词】课程回放，画一张"主格/宾格/形容词性物主/名词性物主"四列表格，熟记：① 动词和介词后用宾格；② 形容词性物主代词必须带名词；③ 名词性物主代词独立使用。',
      extraPractice: '找辅导老师领取"代词四格转换练习表"'
    },
    '物主代词': {
      lectures: ['第4节 人称和物主代词'],
      type: 'basic',
      solution: '基础知识不扎实。代词是七年级重点，建议回看【第4节 人称和物主代词】课程回放，画一张"主格/宾格/形容词性物主/名词性物主"四列表格，熟记：① 动词和介词后用宾格；② 形容词性物主代词必须带名词；③ 名词性物主代词独立使用。',
      extraPractice: '找辅导老师领取"代词四格转换练习表"'
    },
    '宾格': {
      lectures: ['第4节 人称和物主代词'],
      type: 'basic',
      solution: '基础知识不扎实。动词和介词后必须用宾格，建议回看【第4节 人称和物主代词】课程回放，牢记teach us / show him / for them / between them等搭配。',
    },
    '一般现在时': {
      lectures: ['第9节 一般现在时'],
      type: 'basic',
      solution: '基础知识不扎实。一般现在时是七年级语法核心，建议回看【第9节 一般现在时】课程回放，重点掌握：① 第三人称单数动词变化（加-s/-es）；② 否定句doesn\'t+动词原形；③ 疑问句Does+主语+动词原形；④ 复数主语用动词原形。',
      extraPractice: '找辅导老师领取"一般现在时专项加餐练习"20题'
    },
    '冠词': {
      lectures: ['第7节 冠词基础'],
      type: 'basic',
      solution: '基础知识不扎实。冠词a/an/the的用法建议回看【第7节 冠词基础】课程回放，掌握：① a/an看发音不看字母（honest用an）；② 乐器前加the，球类不加the；③ 特指用the，泛指用a/an。',
    },
    '介词': {
      lectures: ['第6节 方位介词'],
      type: 'basic',
      solution: '基础知识不扎实。介词用法建议回看【第6节 方位介词】课程回放，掌握时间介词口诀（年月季in/星期天on/时刻at）和方位介词辨析（between两者/among三者以上/near附近/on表面/in内部）。',
    },
    '动词搭配': {
      lectures: ['第1节 语法概览', '第4节 人称和物主代词'],
      type: 'basic',
      solution: '基础知识不扎实。动词搭配需区分 +doing 和 +to do，以及双宾语动词 sb. 用宾格。建议回看【第1节 语法概览】复习 enjoy/finish/mind/practise+doing 和 decide/hope/want/plan+to do，再回看【第4节 人称和物主代词】复习 show/teach/give sb. sth. 中 sb. 用宾格。',
      extraPractice: '找辅导老师领取"动词搭配口诀卡"'
    },
    'enjoy': {
      lectures: ['第1节 语法概览'],
      type: 'basic',
      solution: '基础知识不扎实。动词+doing/to do的搭配是常考点，建议回看【第1节 语法概览】课程回放，强记：enjoy/finish/mind/practise+doing；decide/hope/want/plan/agree+to do。',
      extraPractice: '找辅导老师领取"动词搭配口诀卡"'
    },
    'decide': {
      lectures: ['第1节 语法概览'],
      type: 'basic',
      solution: '基础知识不扎实。decide+to do是固定搭配，建议回看【第1节 语法概览】课程回放，牢记decide/hope/want/plan/agree+to do，enjoy/finish/mind/practise+doing。',
    },
    '句子结构': {
      lectures: ['第1节 语法概览'],
      type: 'advanced',
      solution: '属于拔高知识点。简单句五种基本句型是语法分析的基础，建议回看【第1节 语法概览】课程回放，掌握：S+V（主谓）、S+V+O（主谓宾）、S+V+P（主谓表）、S+V+IO+DO（主谓双宾）、S+V+O+OC（主谓宾补），并学会判断宾语vs表语。',
      extraPractice: '找辅导老师要"句子结构分析加餐练习"10题'
    },
    'a lot of': {
      lectures: ['第2节 名词基础'],
      type: 'basic',
      solution: '基础知识不扎实。量词搭配建议回看【第2节 名词基础】课程回放，掌握：many+可数复数；much+不可数；a lot of/lots of通吃；some可修饰两者。',
    },
    'show': {
      lectures: ['第4节 人称和物主代词'],
      type: 'basic',
      solution: '基础知识不扎实。双宾语动词show/teach/give/buy/pass sb. sth.中sb.必须用宾格，建议回看【第4节 人称和物主代词】课程回放。',
    },
    '过去': {
      lectures: ['第1节 语法概览'],
      type: 'instability',
      solution: '答题不稳定。过去时态判断需要根据时间状语（Last Saturday, yesterday等），建议回看【第1节 语法概览】课程回放复习时态标志词，特别注意read等过去式与原形同形的动词，避免误写成reads。',
    },
    '阅读理解': {
      lectures: [
        '第1节 语法概览',
        '第4节 人称和物主代词',
        '第5节 名词拔高',
        '第8节 初阶写作（认知概览）',
        '第10节 初阶写作（审题训练）'
      ],
      type: 'instability',
      solution: '答题不稳定。阅读理解选择题失分原因多样：① 细节题没回原文定位关键词；② 词义题没看上下文举例；③ 原因题没找"动作→结果"逻辑；④ 主旨题没抓首尾段和高频词。建议回看第1、4、5、8、10节阅读理解相关回放，每天坚持阅读1篇短文并做题。',
      extraPractice: '找辅导老师领取"阅读理解分类专项训练"5篇'
    },
    '任务型阅读': {
      lectures: ['第3节 名词进阶', '第7节 冠词基础'],
      type: 'instability',
      solution: '答题不稳定。任务型阅读失分原因：① 没回原文定位关键词；② 同义转述时词形不对（单复数、时态）；③ 拼写错误。建议回看第3、7节任务型阅读回放，做题时先通读全文，再逐空回文定位。',
      extraPractice: '找辅导老师领取"任务型阅读专项训练"3篇'
    },
    '完形': {
      lectures: ['第2节 名词基础', '第6节 方位介词', '第9节 一般现在时'],
      type: 'instability',
      solution: '答题不稳定。完形填空失分原因：① 时态判断错误（看时间状语）；② 固定搭配不熟（how to do / decide to do / show sb. sth.）；③ 上下文逻辑断裂。建议回看第2、6、9节完形相关回放，做题时先通读全文抓主旨，再逐空填。',
      extraPractice: '找辅导老师领取"完形填空专项训练"3篇'
    },
    '语法填空': {
      lectures: [
        '第1节 语法概览',
        '第2节 名词基础',
        '第3节 名词进阶',
        '第4节 人称和物主代词',
        '第5节 名词拔高',
        '第6节 方位介词',
        '第7节 冠词基础',
        '第9节 一般现在时'
      ],
      type: 'instability',
      solution: '答题不稳定。语法填空需综合运用"时态+主谓一致+词形变化+固定搭配"，建议回看第1、2、3、4、5、6、7、9节语法回放，按四步法做题：①看时态标志词→②看主语定谓语→③看空格定词性→④核搭配。',
      extraPractice: '找辅导老师领取"语法填空四步法加餐练习"10题'
    }
  },

  // 知识点匹配函数：根据题目的knowledge字段文本匹配讲义
  matchLecture: function(knowledgeText) {
    var map = this.lectureMap;
    var keys = Object.keys(map);
    for (var i = 0; i < keys.length; i++) {
      if (knowledgeText.indexOf(keys[i]) >= 0) {
        return map[keys[i]];
      }
    }
    // 默认回退
    return {
      lectures: ['第1节 语法概览'],
      type: 'basic',
      solution: '建议回看【第1节 语法概览】课程回放，巩固相关语法知识点。',
    };
  }
};