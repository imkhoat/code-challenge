// Solution A: Iterative approach using a loop
function sumToNSolutionA(n: number): number {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}

// Solution B: Mathematical formula approach (arithmetic series)
function sumToNSolutionB(n: number): number {
  return (n * (n + 1)) / 2;
}

// Solution C: Recursive approach
function sumToNSolutionC(n: number): number {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  return n + sumToNSolutionC(n - 1);
}

// Test functions
function main() {
  const testCases = [1, 5, 10, 100];
  
  console.log("Testing sum functions from 1 to n:");
  console.log("==================================");
  
  testCases.forEach(n => {
    console.log(`\nFor n = ${n}:`);
    console.log(`Solution A (Iterative): ${sumToNSolutionA(n)}`);
    console.log(`Solution B (Formula):   ${sumToNSolutionB(n)}`);
    console.log(`Solution C (Recursive): ${sumToNSolutionC(n)}`);
  });
}

// Run tests
main();