# Sum to N - Three Different Solutions

This project demonstrates three different approaches to calculate the sum from 1 to n:

1. **Iterative Approach** - Using a for loop
2. **Mathematical Formula** - Using arithmetic series formula
3. **Recursive Approach** - Using recursion

## Setup

1. Install dependencies:
```bash
npm install
```

## Running the Code

### Option 1: Direct execution with ts-node
```bash
npm start
```

### Option 2: Development mode with watch
```bash
npm run dev
```

### Option 3: Build and run
```bash
npm run build
node dist/index.js
```

## Output

The program will test all three functions with different values (1, 5, 10, 100) and show the results.

## Time Complexity Comparison

- **Solution A (Iterative)**: O(n)
- **Solution B (Formula)**: O(1) 
- **Solution C (Recursive)**: O(n)

## Space Complexity Comparison

- **Solution A (Iterative)**: O(1)
- **Solution B (Formula)**: O(1)
- **Solution C (Recursive)**: O(n) - due to call stack 