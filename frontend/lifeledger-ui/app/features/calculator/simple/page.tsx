'use client';

import { useState } from 'react';
import CalculatorHeader from '../components/CalculatorHeader';

type Operator = '+' | '-' | '×' | '÷';

type PercentageMode =
  | 'percentageOf'
  | 'whatPercentage'
  | 'increaseDecrease'
  | 'addSubtract';

export default function SimpleCalculatorPage() {
  /*
   * ============================================================
   * SIMPLE CALCULATOR STATE
   * ============================================================
   */

  const [display, setDisplay] = useState('0');

  const [firstValue, setFirstValue] = useState<number | null>(null);

  const [operator, setOperator] = useState<Operator | null>(null);

  const [expression, setExpression] = useState('');

  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const [hasCalculated, setHasCalculated] = useState(false);

  /*
   * ============================================================
   * PERCENTAGE CALCULATOR STATE
   * ============================================================
   */

  const [percentageMode, setPercentageMode] =
    useState<PercentageMode>('percentageOf');

  const [percentageValue, setPercentageValue] = useState('');

  const [percentageBase, setPercentageBase] = useState('');

  const [percentageResult, setPercentageResult] = useState<string | null>(
    null
  );

  /*
   * ============================================================
   * SIMPLE CALCULATOR
   * ============================================================
   */

  const calculate = (
    first: number,
    second: number,
    currentOperator: Operator
  ): number => {
    switch (currentOperator) {
      case '+':
        return first + second;

      case '-':
        return first - second;

      case '×':
        return first * second;

      case '÷':
        return second === 0 ? NaN : first / second;

      default:
        return second;
    }
  };

  /*
   * Format number so we don't show unnecessarily long
   * floating-point values.
   */
  const formatNumber = (value: number) => {
    if (!Number.isFinite(value)) {
      return 'Error';
    }

    return Number(value.toPrecision(12)).toString();
  };

  /*
   * Get the currently entered second number.
   *
   * Example:
   *
   * 5 × 25
   *
   * expression = "5 × 25"
   *
   * current operand = 25
   */
  const getCurrentOperand = () => {
    if (firstValue === null || operator === null) {
      return display;
    }

    const parts = expression.split(' ');

    if (parts.length >= 3) {
      return parts[2];
    }

    return '0';
  };

  /*
   * ============================================================
   * LIVE CALCULATION
   * ============================================================
   *
   * Example:
   *
   * 5 × 5
   *
   * immediately displays:
   *
   * 25
   */

  const updateLiveCalculation = (currentValue: string) => {
    if (firstValue === null || operator === null) {
      return;
    }

    const secondValue = Number(currentValue);

    if (Number.isNaN(secondValue)) {
      return;
    }

    const result = calculate(
      firstValue,
      secondValue,
      operator
    );

    if (!Number.isFinite(result)) {
      setDisplay('Error');
      return;
    }

    setDisplay(formatNumber(result));
  };

  /*
   * ============================================================
   * NUMBER INPUT
   * ============================================================
   */

  const inputNumber = (number: string) => {
    /*
     * Start a new calculation after "=".
     */
    if (hasCalculated) {
      setDisplay(number);
      setExpression('');
      setFirstValue(null);
      setOperator(null);
      setWaitingForOperand(false);
      setHasCalculated(false);

      return;
    }

    /*
     * After selecting an operator:
     *
     * 5 ×
     *
     * Start second number.
     */
    if (waitingForOperand) {
      const newValue = number;

      setDisplay(newValue);

      setExpression(
        `${firstValue} ${operator} ${newValue}`
      );

      setWaitingForOperand(false);

      /*
       * Calculate immediately.
       */
      updateLiveCalculation(newValue);

      return;
    }

    /*
     * Normal number entry.
     */
    const newValue =
      display === '0'
        ? number
        : `${display}${number}`;

    /*
     * Live calculation.
     */
    if (firstValue !== null && operator !== null) {
      setExpression(
        `${firstValue} ${operator} ${newValue}`
      );

      updateLiveCalculation(newValue);

      return;
    }

    setDisplay(newValue);
  };

  /*
   * ============================================================
   * DECIMAL
   * ============================================================
   */

  const inputDecimal = () => {
    if (hasCalculated) {
      setDisplay('0.');
      setExpression('');
      setFirstValue(null);
      setOperator(null);
      setWaitingForOperand(false);
      setHasCalculated(false);

      return;
    }

    if (waitingForOperand) {
      setDisplay('0.');

      setExpression(
        `${firstValue} ${operator} 0.`
      );

      setWaitingForOperand(false);

      return;
    }

    if (!display.includes('.')) {
      const newValue = `${display}.`;

      setDisplay(newValue);

      if (firstValue !== null && operator !== null) {
        setExpression(
          `${firstValue} ${operator} ${newValue}`
        );
      }
    }
  };

  /*
   * ============================================================
   * OPERATOR
   * ============================================================
   */

  const chooseOperator = (nextOperator: Operator) => {
    const currentValue = Number(display);

    if (Number.isNaN(currentValue)) {
      return;
    }

    /*
     * Continue after "=".
     *
     * 10 + 5 =
     * 15
     *
     * Then ×
     *
     * 15 ×
     */
    if (hasCalculated) {
      setFirstValue(currentValue);
      setOperator(nextOperator);

      setExpression(
        `${formatNumber(currentValue)} ${nextOperator}`
      );

      setWaitingForOperand(true);
      setHasCalculated(false);

      return;
    }

    /*
     * First operator.
     *
     * 5 ×
     */
    if (firstValue === null) {
      setFirstValue(currentValue);
      setOperator(nextOperator);

      setExpression(
        `${formatNumber(currentValue)} ${nextOperator}`
      );

      setWaitingForOperand(true);

      return;
    }

    /*
     * Change operator if user presses another operator.
     *
     * 5 ×
     * then +
     *
     * becomes:
     *
     * 5 +
     */
    if (waitingForOperand) {
      setOperator(nextOperator);

      setExpression(
        `${formatNumber(firstValue)} ${nextOperator}`
      );

      return;
    }

    /*
     * Continue calculation using the live result.
     *
     * 5 × 5
     * = 25
     *
     * press +
     *
     * 25 +
     */
    const secondValue = Number(
      getCurrentOperand()
    );

    const result = calculate(
      firstValue,
      secondValue,
      operator!
    );

    if (!Number.isFinite(result)) {
      setDisplay('Error');
      setExpression('');
      setFirstValue(null);
      setOperator(null);
      setWaitingForOperand(true);

      return;
    }

    setFirstValue(result);
    setOperator(nextOperator);

    setDisplay(formatNumber(result));

    setExpression(
      `${formatNumber(result)} ${nextOperator}`
    );

    setWaitingForOperand(true);
  };

  /*
   * ============================================================
   * EQUALS
   * ============================================================
   */

  const handleEquals = () => {
    if (firstValue === null || operator === null) {
      return;
    }

    const secondValue = Number(
      getCurrentOperand()
    );

    if (Number.isNaN(secondValue)) {
      return;
    }

    const result = calculate(
      firstValue,
      secondValue,
      operator
    );

    if (!Number.isFinite(result)) {
      setDisplay('Error');
      setExpression('');
      setFirstValue(null);
      setOperator(null);
      setWaitingForOperand(true);
      setHasCalculated(true);

      return;
    }

    setExpression(
      `${formatNumber(firstValue)} ${operator} ${formatNumber(secondValue)} =`
    );

    setDisplay(formatNumber(result));

    setFirstValue(null);
    setOperator(null);
    setWaitingForOperand(true);
    setHasCalculated(true);
  };

  /*
   * ============================================================
   * CLEAR
   * ============================================================
   */

  const clear = () => {
    setDisplay('0');
    setFirstValue(null);
    setOperator(null);
    setExpression('');
    setWaitingForOperand(false);
    setHasCalculated(false);
  };

  /*
   * ============================================================
   * BACKSPACE
   * ============================================================
   */

  const backspace = () => {
    if (waitingForOperand || hasCalculated) {
      return;
    }

    /*
     * Editing second operand.
     */
    if (firstValue !== null && operator !== null) {
      const currentOperand = getCurrentOperand();

      if (currentOperand.length <= 1) {
        const newValue = '0';

        setExpression(
          `${firstValue} ${operator} ${newValue}`
        );

        updateLiveCalculation(newValue);

        return;
      }

      const newValue = currentOperand.slice(0, -1);

      setExpression(
        `${firstValue} ${operator} ${newValue}`
      );

      updateLiveCalculation(newValue);

      return;
    }

    /*
     * Normal backspace.
     */
    if (display.length <= 1) {
      setDisplay('0');
      return;
    }

    setDisplay(display.slice(0, -1));
  };

  /*
   * ============================================================
   * +/- 
   * ============================================================
   */

  const toggleSign = () => {
    const currentValue = Number(
      getCurrentOperand()
    );

    if (Number.isNaN(currentValue)) {
      return;
    }

    const newValue = currentValue * -1;

    if (firstValue !== null && operator !== null) {
      setExpression(
        `${firstValue} ${operator} ${newValue}`
      );

      updateLiveCalculation(
        String(newValue)
      );

      return;
    }

    setDisplay(formatNumber(newValue));
  };

  /*
   * ============================================================
   * SIMPLE CALCULATOR BUTTONS
   *
   * NOTE:
   * There is intentionally NO % button here.
   * Percentage is a separate calculator below.
   * ============================================================
   */

  const buttons = [
    {
      label: 'C',
      action: clear,
      style:
        'bg-slate-200 text-slate-900 hover:bg-slate-300',
    },

    {
      label: '⌫',
      action: backspace,
      style:
        'bg-slate-200 text-slate-900 hover:bg-slate-300',
    },

    {
      label: '÷',
      action: () => chooseOperator('÷'),
      style:
        'bg-violet-600 text-white hover:bg-violet-700',
    },

    {
      label: '×',
      action: () => chooseOperator('×'),
      style:
        'bg-violet-600 text-white hover:bg-violet-700',
    },

    {
      label: '7',
      action: () => inputNumber('7'),
      style:
        'bg-white text-slate-900 hover:bg-slate-50',
    },

    {
      label: '8',
      action: () => inputNumber('8'),
      style:
        'bg-white text-slate-900 hover:bg-slate-50',
    },

    {
      label: '9',
      action: () => inputNumber('9'),
      style:
        'bg-white text-slate-900 hover:bg-slate-50',
    },

    {
      label: '-',
      action: () => chooseOperator('-'),
      style:
        'bg-violet-600 text-white hover:bg-violet-700',
    },

    {
      label: '4',
      action: () => inputNumber('4'),
      style:
        'bg-white text-slate-900 hover:bg-slate-50',
    },

    {
      label: '5',
      action: () => inputNumber('5'),
      style:
        'bg-white text-slate-900 hover:bg-slate-50',
    },

    {
      label: '6',
      action: () => inputNumber('6'),
      style:
        'bg-white text-slate-900 hover:bg-slate-50',
    },

    {
      label: '+',
      action: () => chooseOperator('+'),
      style:
        'bg-violet-600 text-white hover:bg-violet-700',
    },

    {
      label: '1',
      action: () => inputNumber('1'),
      style:
        'bg-white text-slate-900 hover:bg-slate-50',
    },

    {
      label: '2',
      action: () => inputNumber('2'),
      style:
        'bg-white text-slate-900 hover:bg-slate-50',
    },

    {
      label: '3',
      action: () => inputNumber('3'),
      style:
        'bg-white text-slate-900 hover:bg-slate-50',
    },

    {
      label: '+/-',
      action: toggleSign,
      style:
        'bg-slate-100 text-slate-900 hover:bg-slate-200',
    },
  ];

  /*
   * ============================================================
   * PERCENTAGE CALCULATOR
   * ============================================================
   */

  const calculatePercentage = () => {
    const value = Number(percentageValue);
    const base = Number(percentageBase);

    if (
      percentageValue === '' ||
      percentageBase === '' ||
      Number.isNaN(value) ||
      Number.isNaN(base)
    ) {
      setPercentageResult(null);
      return;
    }

    let result = 0;

    switch (percentageMode) {
      /*
       * X% of Y
       *
       * 15% of 200 = 30
       */
      case 'percentageOf':
        result = (value / 100) * base;

        setPercentageResult(
          `${formatNumber(result)}`
        );
        break;

      /*
       * X is what percentage of Y?
       *
       * 25 is 25% of 100
       */
      case 'whatPercentage':
        if (base === 0) {
          setPercentageResult('Cannot divide by zero');
          return;
        }

        result = (value / base) * 100;

        setPercentageResult(
          `${formatNumber(result)}%`
        );
        break;

      /*
       * Percentage increase/decrease
       */
      case 'increaseDecrease':
        if (base === 0) {
          setPercentageResult('Cannot divide by zero');
          return;
        }

        result = ((value - base) / base) * 100;

        if (result > 0) {
          setPercentageResult(
            `${formatNumber(Math.abs(result))}% increase`
          );
        } else if (result < 0) {
          setPercentageResult(
            `${formatNumber(Math.abs(result))}% decrease`
          );
        } else {
          setPercentageResult('0% change');
        }

        break;

      /*
       * Add/subtract percentage
       */
      case 'addSubtract':
        result =
          base + (base * value) / 100;

        setPercentageResult(
          `${formatNumber(result)}`
        );

        break;
    }
  };

  const clearPercentageCalculator = () => {
    setPercentageValue('');
    setPercentageBase('');
    setPercentageResult(null);
  };

  /*
   * ============================================================
   * PERCENTAGE LABELS
   * ============================================================
   */

  const percentageLabels: Record<
    PercentageMode,
    string
  > = {
    percentageOf: 'X% of Y',

    whatPercentage: 'X is what % of Y?',

    increaseDecrease:
      'Percentage Increase / Decrease',

    addSubtract:
      'Add Percentage to Number',
  };

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6">

      <div className="mx-auto max-w-xl">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <CalculatorHeader
          title="Simple Calculator"
          description="Perform everyday mathematical calculations quickly and easily."
          icon="🧮"
        />

        {/* =====================================================
            SIMPLE CALCULATOR
        ====================================================== */}

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">

          {/* Display */}

          <div className="mb-4 min-h-[125px] rounded-2xl bg-slate-950 p-5 text-right">

            {/* Expression */}

            <p className="min-h-7 overflow-x-auto whitespace-nowrap text-sm font-medium text-slate-400">
              {expression}
            </p>

            {/* Live Result */}

            <p className="mt-3 overflow-x-auto whitespace-nowrap text-4xl font-bold tracking-tight text-white">
              {display}
            </p>

          </div>

          {/* Buttons */}

          <div className="grid grid-cols-4 gap-3">

            {buttons.map((button) => (
              <button
                key={button.label}
                type="button"
                onClick={button.action}
                className={`h-14 rounded-2xl text-lg font-semibold transition hover:-translate-y-0.5 hover:shadow-md ${button.style}`}
              >
                {button.label}
              </button>
            ))}

            {/* Decimal */}

            <button
              type="button"
              onClick={inputDecimal}
              className="h-14 rounded-2xl border border-slate-200 bg-white text-lg font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              .
            </button>

            {/* Zero */}

            <button
              type="button"
              onClick={() => inputNumber('0')}
              className="h-14 rounded-2xl border border-slate-200 bg-white text-lg font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              0
            </button>

            {/* Equals */}

            <button
              type="button"
              onClick={handleEquals}
              className="col-span-2 h-14 rounded-2xl bg-violet-600 text-lg font-bold text-white transition hover:bg-violet-700"
            >
              =
            </button>

          </div>

        </div>

        {/* =====================================================
            SIMPLE CALCULATOR HELP
        ====================================================== */}

        <div className="mt-5 rounded-2xl border border-violet-100 bg-violet-50 p-4">

          <p className="font-semibold text-slate-900">
            Live calculation
          </p>

          <p className="mt-1 text-sm leading-6 text-slate-600">
            Results update immediately as you enter numbers.
            You don't need to press the equals button after
            every operation.
          </p>

          <div className="mt-3 space-y-1 rounded-xl bg-white/70 p-3 font-mono text-xs text-slate-600">
            <p>5 × 5 → 25</p>
            <p>10 + 20 → 30</p>
            <p>100 ÷ 4 → 25</p>
          </div>

        </div>

        {/* =====================================================
            PERCENTAGE CALCULATOR
        ====================================================== */}

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">

          {/* Header */}

          <div className="mb-6">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-xl">
                %
              </div>

              <div>

                <h2 className="text-xl font-bold">
                  Percentage Calculator
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Quickly calculate common percentage problems.
                </p>

              </div>

            </div>

          </div>

          {/* =================================================
              MODES
          ================================================== */}

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">

            {(
              Object.keys(
                percentageLabels
              ) as PercentageMode[]
            ).map((mode) => (

              <button
                key={mode}
                type="button"
                onClick={() => {
                  setPercentageMode(mode);
                  setPercentageResult(null);
                }}
                className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${percentageMode === mode
                  ? 'border-violet-300 bg-violet-50 text-violet-700 ring-2 ring-violet-500/10'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
              >
                {percentageLabels[mode]}
              </button>

            ))}

          </div>

          {/* =================================================
              INPUTS
          ================================================== */}

          <div className="mt-6 space-y-4">

            {/* Percentage */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">

                {percentageMode ===
                  'whatPercentage'
                  ? 'Value'
                  : 'Percentage'}

              </label>

              <div className="relative">

                <input
                  type="number"
                  inputMode="decimal"
                  value={percentageValue}
                  onChange={(e) => {
                    setPercentageValue(
                      e.target.value
                    );
                    setPercentageResult(null);
                  }}
                  placeholder={
                    percentageMode ===
                      'whatPercentage'
                      ? 'e.g. 25'
                      : 'e.g. 15'
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
                />

                {percentageMode !==
                  'whatPercentage' && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                      %
                    </span>
                  )}

              </div>

            </div>

            {/* Base */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">

                {percentageMode ===
                  'whatPercentage'
                  ? 'Total / Base Value'
                  : percentageMode ===
                    'increaseDecrease'
                    ? 'Original Value'
                    : 'Number'}

              </label>

              <input
                type="number"
                inputMode="decimal"
                value={percentageBase}
                onChange={(e) => {
                  setPercentageBase(
                    e.target.value
                  );
                  setPercentageResult(null);
                }}
                placeholder={
                  percentageMode ===
                    'increaseDecrease'
                    ? 'e.g. 100'
                    : 'e.g. 200'
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
              />

            </div>

            {/* New value for increase/decrease */}

            {percentageMode ===
              'increaseDecrease' && (

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    New Value
                  </label>

                  <input
                    type="number"
                    inputMode="decimal"
                    value={percentageValue}
                    onChange={(e) => {
                      setPercentageValue(
                        e.target.value
                      );
                      setPercentageResult(null);
                    }}
                    placeholder="e.g. 125"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
                  />

                </div>

              )}

          </div>

          {/* =================================================
              BUTTONS
          ================================================== */}

          <div className="mt-6 flex gap-3">

            <button
              type="button"
              onClick={clearPercentageCalculator}
              className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={calculatePercentage}
              disabled={
                !percentageValue ||
                !percentageBase
              }
              className="flex-1 rounded-2xl bg-violet-600 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Calculate
            </button>

          </div>

          {/* =================================================
              RESULT
          ================================================== */}

          {percentageResult !== null && (

            <div className="mt-5 rounded-2xl border border-violet-100 bg-violet-50 p-5">

              <p className="text-sm font-medium text-slate-500">
                Result
              </p>

              <p className="mt-1 text-3xl font-bold text-violet-700">
                {percentageResult}
              </p>

            </div>

          )}

          {/* =================================================
              EXAMPLE
          ================================================== */}

          <div className="mt-5 rounded-2xl bg-slate-50 p-4">

            <p className="text-sm font-semibold text-slate-700">
              Example
            </p>

            {percentageMode ===
              'percentageOf' && (
                <p className="mt-1 text-sm text-slate-500">
                  15% of 200 = 30
                </p>
              )}

            {percentageMode ===
              'whatPercentage' && (
                <p className="mt-1 text-sm text-slate-500">
                  25 is 25% of 100
                </p>
              )}

            {percentageMode ===
              'increaseDecrease' && (
                <p className="mt-1 text-sm text-slate-500">
                  Going from 100 to 125 = 25% increase
                </p>
              )}

            {percentageMode ===
              'addSubtract' && (
                <p className="mt-1 text-sm text-slate-500">
                  200 + 15% = 230
                </p>
              )}

          </div>

        </div>

      </div>
    </div>
  );
}