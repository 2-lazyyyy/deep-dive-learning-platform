import { Unit, Lesson } from '@/types';

// ============================================
// Mock Data: Unit → Module → Lesson
// 3 Lesson Types: code_fix, fill_blanks, multiple_choice
// ============================================

export const units: Unit[] = [
  {
    id: 'unit-1',
    title: 'Unit 1: Python Basics',
    description: 'Python ရဲ့ အခြေခံအကျဆုံး concept တွေကို လေ့လာမယ်',
    orderIndex: 1,
    modules: [
      {
        id: 'mod-1-1',
        unitId: 'unit-1',
        title: 'Output & Formatting',
        orderIndex: 1,
        lessons: [
          // --- CODE FIX ---
          {
            id: '1',
            moduleId: 'mod-1-1',
            lessonType: 'code_fix',
            title: 'Output ထုတ်ခြင်း (print)',
            contentBlocks: [
              { type: 'text', content: 'Welcome to Python! The `print()` function outputs text to the console.' },
              { type: 'code', content: 'print("Hello World!")', language: 'python' },
              { type: 'text', content: '**Your task:** Print the exact phrase: **Hello Python!**' },
              { type: 'image', content: '/images/python-print.png', caption: 'print() function ရဲ့ syntax' },
            ],
            initialCode: 'print("Your code here")',
            expectedOutput: 'Hello Python!\n',
            xpReward: 10,
            orderIndex: 1,
          },
          // --- FILL IN THE BLANKS ---
          {
            id: '2',
            moduleId: 'mod-1-1',
            lessonType: 'fill_blanks',
            title: '.format() သုံးခြင်း',
            contentBlocks: [
              { type: 'text', content: 'Python မှာ `.format()` method ကိုသုံးပြီး variables တွေကို string ထဲ inject လုပ်နိုင်ပါတယ်။' },
              { type: 'code', content: 'name = "Aung"\nprint("Hello {}".format(name))', language: 'python' },
              { type: 'text', content: '`{}` ဆိုတဲ့ placeholder ထဲကို `.format()` ထဲက value ဝင်သွားပါတယ်။' },
              { type: 'text', content: '**Fill in the blanks** to print: `I love Python`' },
            ],
            codeTemplate: [
              'print("I love _BLANK_"._BLANK_("Python"))',
            ],
            correctTokens: ['{}', 'format'],
            tokenPool: ['{}', 'format', '[]', 'print', 'str', 'Python'],
            xpReward: 15,
            orderIndex: 2,
          },
          // --- MULTIPLE CHOICE ---
          {
            id: '3',
            moduleId: 'mod-1-1',
            lessonType: 'multiple_choice',
            title: 'F-String သုံးခြင်း',
            contentBlocks: [
              { type: 'text', content: 'Python 3.6+ မှာ f-strings ဆိုတဲ့ formatting method ရှိပါတယ်။ String ရှေ့မှာ `f` ထည့်ရပါတယ်။' },
              { type: 'code', content: 'name = "Aung"\nprint(f"Hello {name}")\n# Output: Hello Aung', language: 'python' },
              { type: 'text', content: 'F-string ဟာ `.format()` ထက် ပိုမိုရိုးရှင်းပြီး ဖတ်ရလွယ်ပါတယ်။' },
            ],
            question: 'What will this code print?\n\n```python\nx = 10\nprint(f"Value is {x + 5}")\n```',
            options: [
              'Value is {x + 5}',
              'Value is 15',
              'Value is 10',
              'Error: invalid syntax',
            ],
            correctIndex: 1,
            xpReward: 15,
            orderIndex: 3,
          },
        ],
      },
      {
        id: 'mod-1-2',
        unitId: 'unit-1',
        title: 'Variables & Data Types',
        orderIndex: 2,
        lessons: [
          // --- CODE FIX ---
          {
            id: '4',
            moduleId: 'mod-1-2',
            lessonType: 'code_fix',
            title: 'Variable တည်ဆောက်ခြင်း',
            contentBlocks: [
              { type: 'text', content: 'Variables in Python are labels that point to objects in memory. You don\'t need to declare a type.' },
              { type: 'code', content: 'age = 25\nname = "Aung"\nprint(age, name)', language: 'python' },
              { type: 'text', content: '**Your task:** Create variable `a` with value `10` and print it.' },
            ],
            initialCode: 'a = 0\nprint(a)',
            expectedOutput: '10\n',
            xpReward: 15,
            orderIndex: 1,
          },
          // --- FILL IN THE BLANKS ---
          {
            id: '5',
            moduleId: 'mod-1-2',
            lessonType: 'fill_blanks',
            title: 'Data Type စစ်ဆေးခြင်း (type)',
            contentBlocks: [
              { type: 'text', content: '`type()` function ကို value ရဲ့ data type စစ်ဖို့သုံးပါတယ်။' },
              { type: 'code', content: 'print(type(42))     # <class \'int\'>\nprint(type("hi"))   # <class \'str\'>\nprint(type(3.14))   # <class \'float\'>', language: 'python' },
              { type: 'text', content: '**Fill in the blanks** to check the type of `3.14`' },
            ],
            codeTemplate: [
              '_BLANK_(type(_BLANK_))',
            ],
            correctTokens: ['print', '3.14'],
            tokenPool: ['print', '3.14', 'type', '42', 'str', 'float', 'int'],
            xpReward: 15,
            orderIndex: 2,
          },
          // --- MULTIPLE CHOICE ---
          {
            id: '6',
            moduleId: 'mod-1-2',
            lessonType: 'multiple_choice',
            title: 'Type Casting ပြောင်းလဲခြင်း',
            contentBlocks: [
              { type: 'text', content: 'Data type ပြောင်းဖို့ `int()`, `str()`, `float()` functions သုံးပါတယ်။' },
              { type: 'code', content: 'num_str = "42"\nnum = int(num_str)\nprint(num + 8)  # 50', language: 'python' },
              { type: 'text', content: 'String ကို number ပြောင်းပြီးမှ arithmetic operation လုပ်နိုင်ပါတယ်။' },
            ],
            question: 'What is the result of `int("100") + float("5.5")`?',
            options: [
              '1005.5',
              '105.5',
              '"1005.5"',
              'TypeError',
            ],
            correctIndex: 1,
            xpReward: 20,
            orderIndex: 3,
          },
        ],
      },
    ],
  },
  {
    id: 'unit-2',
    title: 'Unit 2: Control Flow',
    description: 'Conditions နဲ့ Loops သုံးပြီး program ရဲ့ flow ကိုထိန်းချုပ်မယ်',
    orderIndex: 2,
    modules: [
      {
        id: 'mod-2-1',
        unitId: 'unit-2',
        title: 'Conditionals (if/else)',
        orderIndex: 1,
        lessons: [
          // --- FILL IN THE BLANKS ---
          {
            id: '7',
            moduleId: 'mod-2-1',
            lessonType: 'fill_blanks',
            title: 'If Statement ရေးခြင်း',
            contentBlocks: [
              { type: 'text', content: '`if` statement ဟာ condition true ဖြစ်မှ code block ကို execute လုပ်ပါတယ်။' },
              { type: 'code', content: 'age = 18\nif age >= 18:\n    print("Adult")', language: 'python' },
              { type: 'image', content: '/images/if-flowchart.png', caption: 'If statement flowchart' },
              { type: 'text', content: '**Fill in the blanks:** Check if `x = 25` is greater than `10`. If yes, print `Big number`.' },
            ],
            codeTemplate: [
              'x = 25',
              '_BLANK_ x > _BLANK_:',
              '    print("Big number")',
            ],
            correctTokens: ['if', '10'],
            tokenPool: ['if', '10', 'else', 'while', '25', 'for', '0', 'print'],
            xpReward: 20,
            orderIndex: 1,
          },
          // --- MULTIPLE CHOICE ---
          {
            id: '8',
            moduleId: 'mod-2-1',
            lessonType: 'multiple_choice',
            title: 'If-Else ရွေးချယ်ခြင်း',
            contentBlocks: [
              { type: 'text', content: '`else` ကိုသုံးပြီး condition false ဖြစ်တဲ့ case ကို handle လုပ်ပါတယ်။' },
              { type: 'code', content: 'score = 75\nif score >= 50:\n    print("Pass")\nelse:\n    print("Fail")', language: 'python' },
              { type: 'text', content: '`elif` ကိုသုံးပြီး condition အများကြီးကို စစ်ဆေးနိုင်ပါတယ်။' },
            ],
            question: 'What will this code output?\n\n```python\nx = 3\nif x > 5:\n    print("A")\nelif x > 1:\n    print("B")\nelse:\n    print("C")\n```',
            options: ['A', 'B', 'C', 'A and B'],
            correctIndex: 1,
            xpReward: 20,
            orderIndex: 2,
          },
        ],
      },
      {
        id: 'mod-2-2',
        unitId: 'unit-2',
        title: 'Loops (for/while)',
        orderIndex: 2,
        lessons: [
          // --- FILL IN THE BLANKS ---
          {
            id: '9',
            moduleId: 'mod-2-2',
            lessonType: 'fill_blanks',
            title: 'For Loop ရေးခြင်း',
            contentBlocks: [
              { type: 'text', content: '`for` loop ဟာ sequence (list, range, etc.) ထဲက item တိုင်းကို iterate လုပ်ပါတယ်။' },
              { type: 'code', content: 'for i in range(3):\n    print(i)\n# Prints: 0, 1, 2', language: 'python' },
              { type: 'text', content: '**Fill in the blanks** to print numbers `1` through `5`.' },
            ],
            codeTemplate: [
              '_BLANK_ i in range(_BLANK_, 6):',
              '    print(i)',
            ],
            correctTokens: ['for', '1'],
            tokenPool: ['for', '1', 'while', 'in', '0', '5', '6', 'range'],
            xpReward: 25,
            orderIndex: 1,
          },
          // --- CODE FIX ---
          {
            id: '10',
            moduleId: 'mod-2-2',
            lessonType: 'code_fix',
            title: 'While Loop ရေးခြင်း',
            contentBlocks: [
              { type: 'text', content: '`while` loop ဟာ condition true ဖြစ်နေသ၍ ထပ်ခါထပ်ခါ execute လုပ်ပါတယ်။' },
              { type: 'code', content: 'count = 0\nwhile count < 3:\n    print(count)\n    count += 1', language: 'python' },
              { type: 'video', content: 'https://www.youtube.com/embed/demo', caption: 'While Loop Explained' },
              { type: 'text', content: '**Your task:** Print `"Hello"` exactly 3 times using a while loop.' },
            ],
            initialCode: 'count = 0\nwhile count < ___:\n    print("Hello")\n    count += 1',
            expectedOutput: 'Hello\nHello\nHello\n',
            xpReward: 25,
            orderIndex: 2,
          },
        ],
      },
    ],
  },
];

// Helper functions moved to useLessonStore to support dynamic data
