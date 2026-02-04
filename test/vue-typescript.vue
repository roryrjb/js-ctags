<template>
  <div class="user-profile">
    <h1>{{ fullName }}</h1>
    <p>{{ user.email }}</p>
    <button @click="handleSave" :disabled="isLoading">
      {{ isLoading ? 'Saving...' : 'Save' }}
    </button>
  </div>
</template>

<script lang="ts">
// =============================================================================
// Vue Component with TypeScript - Common Patterns (Options API)
// =============================================================================

import { defineComponent, PropType } from 'vue';

// -----------------------------------------------------------------------------
// Types and Interfaces
// -----------------------------------------------------------------------------

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface UpdatePayload {
  userId: number;
  changes: Partial<User>;
}

type ValidationResult = {
  valid: boolean;
  errors: string[];
};

export type UserRole = 'admin' | 'editor' | 'viewer';

// -----------------------------------------------------------------------------
// Enums
// -----------------------------------------------------------------------------

enum FormState {
  Idle = 'idle',
  Editing = 'editing',
  Submitting = 'submitting',
  Error = 'error',
}

// -----------------------------------------------------------------------------
// Helper Functions
// -----------------------------------------------------------------------------

function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function formatFullName(first: string, last: string): string {
  return `${first} ${last}`.trim();
}

async function saveUser(payload: UpdatePayload): Promise<User> {
  const response = await fetch(`/api/users/${payload.userId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload.changes),
  });
  return response.json();
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const DEFAULT_USER: User = {
  id: 0,
  firstName: '',
  lastName: '',
  email: '',
};

const DEBOUNCE_DELAY = 300;

// -----------------------------------------------------------------------------
// Classes
// -----------------------------------------------------------------------------

class FormValidator {
  private errors: string[] = [];

  validate(user: User): ValidationResult {
    this.errors = [];

    if (!user.firstName) {
      this.errors.push('First name is required');
    }

    if (!validateEmail(user.email)) {
      this.errors.push('Invalid email address');
    }

    return {
      valid: this.errors.length === 0,
      errors: [...this.errors],
    };
  }

  getErrors(): string[] {
    return [...this.errors];
  }
}

// -----------------------------------------------------------------------------
// Component Definition
// -----------------------------------------------------------------------------

export default defineComponent({
  name: 'UserProfile',

  props: {
    userId: {
      type: Number,
      required: true,
    },
    initialUser: {
      type: Object as PropType<User>,
      default: () => ({ ...DEFAULT_USER }),
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['save', 'cancel', 'error'],

  data() {
    return {
      user: { ...this.initialUser } as User,
      formState: FormState.Idle,
      validationErrors: [] as string[],
      isDirty: false,
    };
  },

  computed: {
    fullName(): string {
      return formatFullName(this.user.firstName, this.user.lastName);
    },

    isLoading(): boolean {
      return this.formState === FormState.Submitting;
    },

    hasErrors(): boolean {
      return this.validationErrors.length > 0;
    },

    canSave(): boolean {
      return this.isDirty && !this.hasErrors && !this.readonly;
    },
  },

  watch: {
    user: {
      deep: true,
      handler(newVal: User, oldVal: User) {
        this.isDirty = true;
        this.validateForm();
      },
    },

    userId(newId: number) {
      this.loadUser(newId);
    },
  },

  methods: {
    validateForm(): void {
      const validator = new FormValidator();
      const result = validator.validate(this.user);
      this.validationErrors = result.errors;
    },

    async handleSave(): Promise<void> {
      if (!this.canSave) return;

      this.formState = FormState.Submitting;

      try {
        const updated = await saveUser({
          userId: this.userId,
          changes: this.user,
        });
        this.user = updated;
        this.isDirty = false;
        this.$emit('save', updated);
      } catch (error) {
        this.formState = FormState.Error;
        this.$emit('error', error);
      } finally {
        this.formState = FormState.Idle;
      }
    },

    handleCancel(): void {
      this.user = { ...this.initialUser };
      this.isDirty = false;
      this.$emit('cancel');
    },

    async loadUser(id: number): Promise<void> {
      const response = await fetch(`/api/users/${id}`);
      this.user = await response.json();
    },

    resetForm(): void {
      this.user = { ...DEFAULT_USER };
      this.validationErrors = [];
      this.isDirty = false;
      this.formState = FormState.Idle;
    },
  },

  mounted() {
    if (this.userId) {
      this.loadUser(this.userId);
    }
  },
});
</script>

<script setup lang="ts">
// =============================================================================
// Vue Component with TypeScript - Common Patterns (Composition API)
// =============================================================================

import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

type FilterType = 'all' | 'active' | 'completed';

// -----------------------------------------------------------------------------
// Props and Emits
// -----------------------------------------------------------------------------

const props = defineProps<{
  title: string;
  initialTodos?: Todo[];
}>();

const emit = defineEmits<{
  (e: 'update', todos: Todo[]): void;
  (e: 'complete', id: number): void;
}>();

// -----------------------------------------------------------------------------
// Reactive State
// -----------------------------------------------------------------------------

const todos = ref<Todo[]>(props.initialTodos || []);

const newTodoText = ref('');

const filter = ref<FilterType>('all');

const isEditing = ref(false);

// -----------------------------------------------------------------------------
// Computed Properties
// -----------------------------------------------------------------------------

const filteredTodos = computed(() => {
  switch (filter.value) {
    case 'active':
      return todos.value.filter(t => !t.completed);
    case 'completed':
      return todos.value.filter(t => t.completed);
    default:
      return todos.value;
  }
});

const remainingCount = computed(() => {
  return todos.value.filter(t => !t.completed).length;
});

const allCompleted = computed(() => {
  return todos.value.length > 0 && remainingCount.value === 0;
});

// -----------------------------------------------------------------------------
// Methods
// -----------------------------------------------------------------------------

function addTodo(): void {
  if (!newTodoText.value.trim()) return;

  todos.value.push({
    id: Date.now(),
    text: newTodoText.value.trim(),
    completed: false,
  });

  newTodoText.value = '';
  emit('update', todos.value);
}

function removeTodo(id: number): void {
  const index = todos.value.findIndex(t => t.id === id);
  if (index !== -1) {
    todos.value.splice(index, 1);
    emit('update', todos.value);
  }
}

function toggleTodo(id: number): void {
  const todo = todos.value.find(t => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    if (todo.completed) {
      emit('complete', id);
    }
    emit('update', todos.value);
  }
}

function clearCompleted(): void {
  todos.value = todos.value.filter(t => !t.completed);
  emit('update', todos.value);
}

async function loadTodos(): Promise<void> {
  const response = await fetch('/api/todos');
  todos.value = await response.json();
}

// -----------------------------------------------------------------------------
// Watchers
// -----------------------------------------------------------------------------

watch(todos, (newTodos) => {
  localStorage.setItem('todos', JSON.stringify(newTodos));
}, { deep: true });

watch(filter, (newFilter) => {
  console.log('Filter changed to:', newFilter);
});

// -----------------------------------------------------------------------------
// Lifecycle
// -----------------------------------------------------------------------------

onMounted(() => {
  const saved = localStorage.getItem('todos');
  if (saved) {
    todos.value = JSON.parse(saved);
  }
});

onUnmounted(() => {
  console.log('Component unmounted');
});
</script>

<style scoped>
.user-profile {
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.user-profile h1 {
  margin: 0 0 0.5rem;
  color: #333;
}

.user-profile button {
  padding: 0.5rem 1rem;
  background: #4a90d9;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.user-profile button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
