export type ChallengeDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface Challenge {
  id: string;
  title: string;
  difficulty: ChallengeDifficulty;
  rewardXp: number;
  rewardGems: number;
  description: string;
  constraints: string[];
  examples: { input: string; output: string }[];
  initialCode: string;
  expectedOutput: string;
}

export const challenges: Challenge[] = [
  {
    id: 'fibonacci-number',
    title: 'Fibonacci Number',
    difficulty: 'Easy',
    rewardXp: 100,
    rewardGems: 20,
    description: 'The Fibonacci numbers form a sequence where each number is the sum of the two preceding ones, starting from 0 and 1. \n\nGiven an integer `n`, calculate the `n`th Fibonacci number.',
    constraints: [
      '0 <= n <= 30'
    ],
    examples: [
      { input: 'n = 2', output: '1' },
      { input: 'n = 5', output: '5' },
    ],
    initialCode: `def fib(n):
    # Write your code here
    pass

# Test cases
print(fib(2))
print(fib(5))
`,
    expectedOutput: `1
5`,
  },
  {
    id: 'find-maximum',
    title: 'Find Maximum',
    difficulty: 'Easy',
    rewardXp: 100,
    rewardGems: 20,
    description: 'Given a list of integers `nums`, return the largest integer in the list. Do not use the built-in `max()` function if possible, try to solve it with a loop!',
    constraints: [
      '1 <= nums.length <= 100',
      '-1000 <= nums[i] <= 1000'
    ],
    examples: [
      { input: 'nums = [1, 5, 3, 9, 2]', output: '9' },
      { input: 'nums = [-10, -5, -2]', output: '-2' },
    ],
    initialCode: `def findMax(nums):
    # Write your code here
    pass

# Test cases
print(findMax([1, 5, 3, 9, 2]))
print(findMax([-10, -5, -2]))
`,
    expectedOutput: `9
-2`,
  },
  {
    id: 'count-vowels',
    title: 'Count Vowels',
    difficulty: 'Easy',
    rewardXp: 150,
    rewardGems: 30,
    description: 'Given a string `s`, return the number of vowels (`a`, `e`, `i`, `o`, `u`) present in the string. The string may contain both uppercase and lowercase letters.',
    constraints: [
      '1 <= s.length <= 1000',
      's consists of English letters.'
    ],
    examples: [
      { input: 's = "hello"', output: '2' },
      { input: 's = "Python"', output: '1' },
    ],
    initialCode: `def countVowels(s):
    # Write your code here
    pass

# Test cases
print(countVowels("hello"))
print(countVowels("Python"))
`,
    expectedOutput: `2
1`,
  }
];

export const getChallengeById = (id: string) => challenges.find(c => c.id === id);
