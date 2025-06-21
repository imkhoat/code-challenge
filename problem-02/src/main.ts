import './style.css'
import { createTokenDropdown, getTokenPrice } from './dropdown'

// Global variables to store selected tokens and amounts
let selectedInputToken: string = '';
let selectedOutputToken: string = '';
let inputAmount: number = 0;
let outputAmount: number = 0;

async function fetchAndPopulateTokens() {
  const url = 'https://interview.switcheo.com/prices.json';
  try {
    const res = await fetch(url);
    const data = await res.json();
    // Get unique token symbols
    const tokens = Array.from(new Set(data.map((item: any) => item.currency))) as string[];
    tokens.sort();

    // Create input token dropdown
    createTokenDropdown({
      containerId: 'input-token-dropdown',
      tokens: tokens,
      onSelect: (token: string) => {
        selectedInputToken = token;
        console.log('Input token selected:', token);
        updateSwapRate();
      },
      defaultToken: 'ETH',
      placeholder: 'Select token'
    });

    // Create output token dropdown
    createTokenDropdown({
      containerId: 'output-token-dropdown',
      tokens: tokens,
      onSelect: (token: string) => {
        selectedOutputToken = token;
        console.log('Output token selected:', token);
        updateSwapRate();
      },
      defaultToken: 'USDC',
      placeholder: 'Select token'
    });

  } catch (err) {
    console.error('Failed to fetch tokens:', err);
  }
}

async function updateSwapRate() {
  if (!selectedInputToken || !selectedOutputToken) return;

  try {
    const inputPrice = await getTokenPrice(selectedInputToken);
    const outputPrice = await getTokenPrice(selectedOutputToken);

    if (inputPrice && outputPrice) {
      // Calculate rate: input token to output token via USD
      // If 1 ETH = $1645.93 and 1 USDC = $0.99
      // Then 1 ETH = 1645.93 / 0.99 = 1662.55 USDC
      const rate = inputPrice / outputPrice;
      console.log(`Swap rate: 1 ${selectedInputToken} = ${rate.toFixed(6)} ${selectedOutputToken}`);
      console.log(`Price info: ${selectedInputToken} = $${inputPrice}, ${selectedOutputToken} = $${outputPrice}`);
      
      // Calculate output amount based on current input amount
      if (inputAmount > 0) {
        outputAmount = inputAmount * rate;
        updateOutputAmount();
      }
    }
  } catch (error) {
    console.error('Failed to calculate swap rate:', error);
  }
}

function updateOutputAmount() {
  const outputInput = document.getElementById('output-amount') as HTMLInputElement;
  if (outputInput && outputAmount > 0) {
    outputInput.value = outputAmount.toFixed(6);
  }
}

async function performSwap() {
  // Validate inputs
  if (!selectedInputToken || !selectedOutputToken) {
    alert('Please select both input and output tokens');
    return;
  }

  if (inputAmount <= 0) {
    alert('Please enter a valid amount to swap');
    return;
  }

  if (selectedInputToken === selectedOutputToken) {
    alert('Input and output tokens cannot be the same');
    return;
  }

  try {
    // Get current prices
    const inputPrice = await getTokenPrice(selectedInputToken);
    const outputPrice = await getTokenPrice(selectedOutputToken);

    if (!inputPrice || !outputPrice) {
      alert('Unable to get current token prices. Please try again.');
      return;
    }

    // Calculate swap details
    const rate = inputPrice / outputPrice;
    const calculatedOutputAmount = inputAmount * rate;
    const inputValueUSD = inputAmount * inputPrice;
    const outputValueUSD = calculatedOutputAmount * outputPrice;

    // Show loading state
    const button = document.querySelector('.button') as HTMLButtonElement;
    const originalText = button.textContent;
    button.textContent = 'Processing...';
    button.disabled = true;

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Show success message
    alert(`✅ Swap completed successfully!
    
You have swapped ${inputAmount.toFixed(6)} ${selectedInputToken} for ${calculatedOutputAmount.toFixed(6)} ${selectedOutputToken}`);

    // Reset form
    const inputAmountElement = document.getElementById('input-amount') as HTMLInputElement;
    const outputAmountElement = document.getElementById('output-amount') as HTMLInputElement;
    
    if (inputAmountElement) inputAmountElement.value = '';
    if (outputAmountElement) outputAmountElement.value = '';
    
    inputAmount = 0;
    outputAmount = 0;

    // Reset button
    button.textContent = originalText;
    button.disabled = false;

  } catch (error) {
    console.error('Swap failed:', error);
    alert('Swap failed. Please try again.');
    
    // Reset button
    const button = document.querySelector('.button') as HTMLButtonElement;
    button.textContent = 'CONFIRM SWAP';
    button.disabled = false;
  }
}

function setupEventListeners() {
  // Input amount change handler
  const inputAmountElement = document.getElementById('input-amount') as HTMLInputElement;
  if (inputAmountElement) {
    inputAmountElement.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      const value = parseFloat(target.value);
      
      // Handle empty input
      if (target.value === '') {
        inputAmount = 0;
        const outputAmountElement = document.getElementById('output-amount') as HTMLInputElement;
        if (outputAmountElement) outputAmountElement.value = '';
        outputAmount = 0;
        return;
      }
      
      // Validate number
      if (isNaN(value) || value < 0) {
        target.value = '';
        inputAmount = 0;
        const outputAmountElement = document.getElementById('output-amount') as HTMLInputElement;
        if (outputAmountElement) outputAmountElement.value = '';
        outputAmount = 0;
        return;
      }
      
      inputAmount = value;
      
      if (inputAmount > 0 && selectedInputToken && selectedOutputToken) {
        updateSwapRate();
      } else {
        // Clear output amount if input is invalid
        const outputAmountElement = document.getElementById('output-amount') as HTMLInputElement;
        if (outputAmountElement) outputAmountElement.value = '';
        outputAmount = 0;
      }
    });

    // Prevent non-numeric input
    inputAmountElement.addEventListener('keypress', (e) => {
      const char = String.fromCharCode(e.which);
      if (!/[\d.]/.test(char) && e.which !== 8 && e.which !== 9 && e.which !== 37 && e.which !== 39) {
        e.preventDefault();
      }
    });

    // Handle paste event to filter non-numeric content
    inputAmountElement.addEventListener('paste', (e) => {
      e.preventDefault();
      const clipboardData = (e.clipboardData || (window as any).clipboardData);
      const pastedText = clipboardData.getData('text');
      const numericValue = pastedText.replace(/[^\d.]/g, '');
      if (numericValue) {
        const value = parseFloat(numericValue);
        if (!isNaN(value) && value >= 0) {
          inputAmountElement.value = numericValue;
          inputAmount = value;
          if (selectedInputToken && selectedOutputToken) {
            updateSwapRate();
          }
        }
      }
    });
  }

  // Swap button click handler
  const swapButton = document.querySelector('.button') as HTMLButtonElement;
  if (swapButton) {
    swapButton.addEventListener('click', (e) => {
      e.preventDefault();
      performSwap();
    });
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  fetchAndPopulateTokens();
  setupEventListeners();
});