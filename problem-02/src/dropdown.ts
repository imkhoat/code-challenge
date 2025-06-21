interface TokenDropdownOptions {
  containerId: string;
  tokens: string[];
  onSelect: (token: string) => void;
  defaultToken?: string;
  placeholder?: string;
}

export function createTokenDropdown(options: TokenDropdownOptions): void {
  const { containerId, tokens, onSelect, defaultToken, placeholder = 'Select token' } = options;
  
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with id "${containerId}" not found`);
    return;
  }

  container.classList.add('dropdown-container');
  container.innerHTML = '';

  // Create selected display
  const selected = document.createElement('div');
  selected.className = 'dropdown-selected';
  selected.innerHTML = `<span class="dropdown-placeholder">${placeholder}</span>`;
  container.appendChild(selected);

  // Create dropdown arrow
  const arrow = document.createElement('span');
  arrow.className = 'dropdown-arrow';
  arrow.innerHTML = '▼';
  selected.appendChild(arrow);

  // Create dropdown list
  const list = document.createElement('div');
  list.className = 'dropdown-list';
  container.appendChild(list);

  // Create search input (optional)
  const searchContainer = document.createElement('div');
  searchContainer.className = 'dropdown-search';
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = 'Search tokens...';
  searchInput.className = 'dropdown-search-input';
  searchContainer.appendChild(searchInput);
  list.appendChild(searchContainer);

  // Render token options
  function renderOptions(filteredTokens: string[] = tokens): void {
    // Clear existing options (except search)
    const existingOptions = list.querySelectorAll('.dropdown-option');
    existingOptions.forEach(option => option.remove());

    filteredTokens.forEach(token => {
      const option = document.createElement('div');
      option.className = 'dropdown-option';
      option.setAttribute('data-token', token);
      
      // Create token icon
      const icon = document.createElement('img');
      icon.src = `src/assets/tokens/${token}.svg`;
      icon.width = 20;
      icon.height = 20;
      icon.className = 'token-icon';
      icon.onerror = () => {
        icon.style.display = 'none';
      };

      // Create token name
      const tokenName = document.createElement('span');
      tokenName.textContent = token;
      tokenName.className = 'token-name';

      option.appendChild(icon);
      option.appendChild(tokenName);

      // Handle option click
      option.onclick = () => {
        selected.innerHTML = '';
        selected.appendChild(icon.cloneNode(true));
        selected.appendChild(tokenName.cloneNode(true));
        selected.appendChild(arrow);
        list.style.display = 'none';
        onSelect(token);
      };

      list.appendChild(option);
    });
  }

  // Initial render
  renderOptions();

  // Set default selection
  if (defaultToken && tokens.includes(defaultToken)) {
    const defaultOption = list.querySelector(`[data-token="${defaultToken}"]`);
    if (defaultOption) {
      const icon = defaultOption.querySelector('.token-icon') as HTMLImageElement;
      const tokenName = defaultOption.querySelector('.token-name') as HTMLSpanElement;
      
      selected.innerHTML = '';
      selected.appendChild(icon.cloneNode(true));
      selected.appendChild(tokenName.cloneNode(true));
      selected.appendChild(arrow);
      onSelect(defaultToken);
    }
  }

  // Toggle dropdown
  selected.onclick = (e) => {
    e.stopPropagation();
    list.style.display = list.style.display === 'block' ? 'none' : 'block';
    if (list.style.display === 'block') {
      searchInput.focus();
    }
  };

  // Search functionality
  searchInput.oninput = (e) => {
    const searchTerm = (e.target as HTMLInputElement).value.toLowerCase();
    const filteredTokens = tokens.filter(token => 
      token.toLowerCase().includes(searchTerm)
    );
    renderOptions(filteredTokens);
  };

  // Close dropdown when clicking outside
  document.addEventListener('click', function handler(e) {
    if (!container.contains(e.target as Node)) {
      list.style.display = 'none';
    }
  });

  // Handle keyboard navigation
  searchInput.onkeydown = (e) => {
    if (e.key === 'Escape') {
      list.style.display = 'none';
    }
  };
}

// Utility function to get token price from API
export async function getTokenPrice(token: string): Promise<number | null> {
  try {
    const response = await fetch('https://interview.switcheo.com/prices.json');
    const data = await response.json();
    
    // Get the latest price for the token
    const tokenData = data
      .filter((item: any) => item.currency === token)
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return tokenData.length > 0 ? tokenData[0].price : null;
  } catch (error) {
    console.error('Failed to fetch token price:', error);
    return null;
  }
} 