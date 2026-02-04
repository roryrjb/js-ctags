<template>
  <div class="product-list">
    <h2>{{ title }}</h2>
    <div v-if="loading">Loading...</div>
    <ul v-else>
      <li v-for="product in filteredProducts" :key="product.id">
        {{ product.name }} - ${{ product.price }}
      </li>
    </ul>
    <button @click="refresh">Refresh</button>
  </div>
</template>

<script>
// =============================================================================
// Vue Component with JavaScript - Common Patterns (Options API)
// =============================================================================

import { defineComponent } from 'vue';

// -----------------------------------------------------------------------------
// Helper Functions
// -----------------------------------------------------------------------------

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

function sortByPrice(products, ascending = true) {
  return [...products].sort((a, b) => {
    return ascending ? a.price - b.price : b.price - a.price;
  });
}

async function fetchProducts(category = null) {
  const url = category ? `/api/products?category=${category}` : '/api/products';
  const response = await fetch(url);
  return response.json();
}

function debounce(fn, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const DEFAULT_CATEGORY = 'all';

const SORT_OPTIONS = {
  PRICE_ASC: 'price_asc',
  PRICE_DESC: 'price_desc',
  NAME: 'name',
};

const ITEMS_PER_PAGE = 20;

// -----------------------------------------------------------------------------
// Classes
// -----------------------------------------------------------------------------

class ProductFilter {
  constructor(products) {
    this.products = products;
  }

  byCategory(category) {
    if (!category || category === 'all') {
      return this.products;
    }
    return this.products.filter(p => p.category === category);
  }

  byPriceRange(min, max) {
    return this.products.filter(p => p.price >= min && p.price <= max);
  }

  bySearch(query) {
    const lower = query.toLowerCase();
    return this.products.filter(p =>
      p.name.toLowerCase().includes(lower) ||
      p.description.toLowerCase().includes(lower)
    );
  }
}

class CartManager {
  #items = [];

  addItem(product, quantity = 1) {
    const existing = this.#items.find(i => i.product.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.#items.push({ product, quantity });
    }
  }

  removeItem(productId) {
    const index = this.#items.findIndex(i => i.product.id === productId);
    if (index !== -1) {
      this.#items.splice(index, 1);
    }
  }

  getTotal() {
    return this.#items.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);
  }

  getItems() {
    return [...this.#items];
  }

  clear() {
    this.#items = [];
  }
}

// -----------------------------------------------------------------------------
// Component Definition
// -----------------------------------------------------------------------------

export default defineComponent({
  name: 'ProductList',

  props: {
    title: {
      type: String,
      default: 'Products',
    },
    category: {
      type: String,
      default: DEFAULT_CATEGORY,
    },
    maxItems: {
      type: Number,
      default: ITEMS_PER_PAGE,
    },
  },

  emits: ['select', 'add-to-cart', 'error'],

  data() {
    return {
      products: [],
      loading: false,
      error: null,
      searchQuery: '',
      sortOrder: SORT_OPTIONS.NAME,
      cart: new CartManager(),
    };
  },

  computed: {
    filteredProducts() {
      const filter = new ProductFilter(this.products);
      let result = filter.byCategory(this.category);

      if (this.searchQuery) {
        result = new ProductFilter(result).bySearch(this.searchQuery);
      }

      return this.sortProducts(result).slice(0, this.maxItems);
    },

    totalItems() {
      return this.products.length;
    },

    cartTotal() {
      return this.cart.getTotal();
    },

    hasProducts() {
      return this.products.length > 0;
    },
  },

  watch: {
    category(newCategory) {
      this.loadProducts(newCategory);
    },

    searchQuery: {
      handler: debounce(function(query) {
        console.log('Searching for:', query);
      }, 300),
    },
  },

  methods: {
    async loadProducts(category = this.category) {
      this.loading = true;
      this.error = null;

      try {
        this.products = await fetchProducts(category);
      } catch (err) {
        this.error = err.message;
        this.$emit('error', err);
      } finally {
        this.loading = false;
      }
    },

    sortProducts(products) {
      switch (this.sortOrder) {
        case SORT_OPTIONS.PRICE_ASC:
          return sortByPrice(products, true);
        case SORT_OPTIONS.PRICE_DESC:
          return sortByPrice(products, false);
        case SORT_OPTIONS.NAME:
        default:
          return [...products].sort((a, b) => a.name.localeCompare(b.name));
      }
    },

    selectProduct(product) {
      this.$emit('select', product);
    },

    addToCart(product) {
      this.cart.addItem(product);
      this.$emit('add-to-cart', { product, cart: this.cart.getItems() });
    },

    refresh() {
      this.loadProducts();
    },

    clearCart() {
      this.cart.clear();
    },

    formatProductPrice(price) {
      return formatPrice(price);
    },
  },

  created() {
    this.debouncedSearch = debounce(this.loadProducts.bind(this), 300);
  },

  mounted() {
    this.loadProducts();
  },
});
</script>

<script setup>
// =============================================================================
// Vue Component with JavaScript - Common Patterns (Composition API)
// =============================================================================

import { ref, reactive, computed, watch, onMounted } from 'vue';

// -----------------------------------------------------------------------------
// Reactive State
// -----------------------------------------------------------------------------

const items = ref([]);

const loading = ref(false);

const selectedId = ref(null);

const filters = reactive({
  search: '',
  minPrice: 0,
  maxPrice: Infinity,
  inStock: false,
});

const pagination = reactive({
  page: 1,
  perPage: 10,
  total: 0,
});

// -----------------------------------------------------------------------------
// Computed
// -----------------------------------------------------------------------------

const filteredItems = computed(() => {
  return items.value.filter(item => {
    if (filters.search && !item.name.includes(filters.search)) {
      return false;
    }
    if (item.price < filters.minPrice || item.price > filters.maxPrice) {
      return false;
    }
    if (filters.inStock && item.stock <= 0) {
      return false;
    }
    return true;
  });
});

const paginatedItems = computed(() => {
  const start = (pagination.page - 1) * pagination.perPage;
  return filteredItems.value.slice(start, start + pagination.perPage);
});

const totalPages = computed(() => {
  return Math.ceil(filteredItems.value.length / pagination.perPage);
});

const selectedItem = computed(() => {
  return items.value.find(i => i.id === selectedId.value);
});

// -----------------------------------------------------------------------------
// Methods
// -----------------------------------------------------------------------------

async function fetchItems() {
  loading.value = true;
  try {
    const response = await fetch('/api/items');
    items.value = await response.json();
    pagination.total = items.value.length;
  } finally {
    loading.value = false;
  }
}

function selectItem(id) {
  selectedId.value = id;
}

function clearSelection() {
  selectedId.value = null;
}

function nextPage() {
  if (pagination.page < totalPages.value) {
    pagination.page++;
  }
}

function prevPage() {
  if (pagination.page > 1) {
    pagination.page--;
  }
}

function goToPage(page) {
  pagination.page = Math.max(1, Math.min(page, totalPages.value));
}

function resetFilters() {
  filters.search = '';
  filters.minPrice = 0;
  filters.maxPrice = Infinity;
  filters.inStock = false;
  pagination.page = 1;
}

// -----------------------------------------------------------------------------
// Watchers
// -----------------------------------------------------------------------------

watch(() => filters.search, () => {
  pagination.page = 1;
});

watch(filteredItems, (newItems) => {
  pagination.total = newItems.length;
});

// -----------------------------------------------------------------------------
// Lifecycle
// -----------------------------------------------------------------------------

onMounted(() => {
  fetchItems();
});
</script>

<style scoped>
.product-list {
  padding: 1rem;
}

.product-list h2 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.product-list ul {
  list-style: none;
  padding: 0;
}

.product-list li {
  padding: 0.5rem;
  border-bottom: 1px solid #eee;
}

.product-list button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
