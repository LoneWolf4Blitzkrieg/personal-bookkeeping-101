// The remedial unit for the prerequisite check: the money arithmetic the
// course uses everywhere. Amounts are illustrative.

export const PREREQ_LESSON = {
  id: 'prereq',
  position: 'prereq',
  checkId: 'prereq',
  practiceId: null,
  title: 'Before you start: money arithmetic',
  coreIdea: 'Money is written in dollars and cents, and every amount in this course is worked out to the cent.',
  steps: [
    {
      id: 'cents', kind: 'explain', title: 'Dollars and cents', uses: ['decimals'],
      text: [
        'An amount like $12.07 means 12 dollars and 7 cents. The two digits after the point are cents: hundredths of a dollar.',
        'Always write two digits after the point. Seven cents is .07, not .7. And $5 is the same as $5.00.',
      ],
    },
    {
      id: 'predict-cents', kind: 'predict', title: 'Try it', uses: ['decimals'],
      text: ['You have $3.50 and find 25 cents. Write how much you have now.'],
      answer: 375,
      misconceptions: [{ cents: 352, explanation: '25 cents is .25, so add 25 to the cents: 50 + 25 = 75.' }],
      explanation: '$3.50 + $0.25 = $3.75.',
    },
    {
      id: 'adding', kind: 'explain', title: 'Adding and taking away money', uses: ['adding-money', 'decimals'],
      text: [
        'To add or subtract money, line the amounts up by the point, so dollars sit over dollars and cents over cents.',
        'Example: $48.26 + $12.99. Cents: 26 + 99 = 125 cents, which is $1.25. Dollars: 48 + 12 = 60. Total: $61.25.',
        'Taking away works the same way: $20.00 − $13.47 = $6.53. That is the change you get when you pay $13.47 with a twenty.',
      ],
      prompt: 'Why do the points need to line up?',
    },
    {
      id: 'predict-change', kind: 'predict', title: 'Your change', uses: ['adding-money', 'decimals'],
      text: ['A meal costs $8.65 and you pay with a $10 bill. How much change do you get?'],
      answer: 135,
      misconceptions: [{ cents: 245, explanation: 'Line up the points: $10.00 − $8.65. Take 65 cents from 100 cents to get 35, and 8 dollars from 9 to get 1.' }],
      explanation: '$10.00 − $8.65 = $1.35.',
    },
    {
      id: 'percent', kind: 'explain', title: 'Percentages', uses: ['percentages', 'decimals'],
      text: [
        'Percent means "out of 100". 10% of an amount is one tenth of it: move the point one place left. 10% of $250.00 is $25.00.',
        '1% is one hundredth: move the point two places left. 1% of $250.00 is $2.50. 5% is half of 10%, and 15% is 10% plus 5%.',
        'To find 15% of $250.00: 10% is $25.00, 5% is $12.50, so 15% is $37.50.',
      ],
      prompt: 'How would you find 5% of an amount using 10%?',
    },
    {
      id: 'predict-percent', kind: 'predict', title: 'Find 15%', uses: ['percentages', 'decimals'],
      text: ['What is 15% of $80.00?'],
      answer: 1200,
      misconceptions: [{ cents: 120, explanation: 'That is 1.5%. 10% of $80.00 is $8.00 and 5% is $4.00, so 15% is $12.00.' }],
      explanation: '10% is $8.00, 5% is $4.00, so 15% is $12.00.',
    },
    {
      id: 'rounding', kind: 'explain', title: 'Rounding to the cent', uses: ['percentages', 'decimals'],
      text: [
        'Sometimes a percentage gives more than two digits after the point. 6.2% of $1,212.00 is $75.144. Money stops at the cent, so we round.',
        'Look at the third digit after the point, the thousandths. Remember the rhyme: "4 and below, keep it below; 5 and above, give it a shove."',
        '$75.144: the third digit is 4, so keep it below: $75.14. $1.005: the third digit is 5, so give it a shove: $1.01. Digits after the third never matter.',
      ],
      prompt: 'Say the rhyme in your own words. Which digit does it look at?',
    },
    {
      id: 'predict-round', kind: 'predict', title: 'Round it', uses: ['percentages', 'decimals'],
      text: ['A tax works out to $23.486. Round it to the cent.'],
      answer: 2349,
      misconceptions: [{ cents: 2348, explanation: 'The third digit is 6: 5 and above, give it a shove.' }],
      explanation: 'The thousandths digit is 6, so the cents go up by one: $23.49.',
    },
  ],
  resources: ['cfpb-budget'],
};
