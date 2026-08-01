export const lessons = [
  {
    id: '1',
    unit: 1,
    module: 1,
    title: 'Output ထုတ်ခြင်း (print)',
    theory: 'Welcome to the very first step in Python. The print() function allows you to output text to the screen.\n\nTry writing the code to print the exact phrase: Hello Python!',
    initialCode: 'print("Your code here")',
    expectedOutput: 'Hello Python!\n',
    xpReward: 10,
  },
  {
    id: '2',
    unit: 1,
    module: 1,
    title: 'စာသားများကို လှပအောင်စီစဉ်ခြင်း (.format)',
    theory: 'In Python, we can inject variables into strings using the .format() method. For example: \n\nprint("My name is {}".format("Win Htut")). \n\nTry to print "I love Python" by using .format("Python").',
    initialCode: 'print("I love {}".format("___"))',
    expectedOutput: 'I love Python\n',
    xpReward: 15,
  },
  {
    id: '3',
    unit: 1,
    module: 2,
    title: 'Variable တည်ဆောက်ခြင်း',
    theory: 'Variables in Python are like references to objects in memory. Create a variable named "a" and assign it the value 10, then print it.',
    initialCode: 'a = 0\nprint(a)',
    expectedOutput: '10\n',
    xpReward: 15,
  }
];
