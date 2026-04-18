---
title: "React Development Patterns"
tags: [dev, react, frontend, patterns]
category: dev-concepts
created: 2026-04-12
---

# ⚛️ React Development Patterns

> Best practices and patterns for building React applications.

---

## 🏗️ Component Patterns

### 1. Container/Presentational Pattern

```typescript
// Container (logic)
export const UserListContainer = () => {
  const { users, loading, error } = useUsers();

  if (loading) return <Spinner />;
  if (error) return <Error message={error} />;

  return <UserList users={users} />;
};

// Presentational (UI)
interface UserListProps {
  users: User[];
}
export const UserList = ({ users }: UserListProps) => (
  <ul>{users.map(user => <UserItem key={user.id} user={user} />)}</ul>
);
```

**Use when**: Separating data fetching from UI rendering

---

### 2. Compound Components Pattern

```typescript
const Tabs = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  );
};

Tabs.Tab = ({ children, index }) => {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  return (
    <button onClick={() => setActiveTab(index)}>
      {children}
    </button>
  );
};

// Usage
<Tabs>
  <Tabs.Tab index={0}>Tab 1</Tabs.Tab>
  <Tabs.Tab index={1}>Tab 2</Tabs.Tab>
</Tabs>
```

**Use when**: Building reusable UI components with shared state

---

### 3. Custom Hook Pattern

```typescript
// Extract logic into reusable hook
export const useLocalStorage = <T>(key: string, initial: T) => {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initial;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
};
```

**Use when**: Logic needs to be reused across components

---

## 🎨 State Management Patterns

### 1. State Colocation

Keep state as close to where it's used as possible.

```typescript
// BAD - Lifting state too high
function App() {
  const [filter, setFilter] = useState('all');
  return <UserList filter={filter} setFilter={setFilter} />;
}

// GOOD - State where needed
function UserList() {
  const [filter, setFilter] = useState('all');
  // ...
}
```

### 2. Derived State

Don't store what can be calculated.

```typescript
// BAD
const [items, setItems] = useState([]);
const [filteredItems, setFilteredItems] = useState([]);

// GOOD
const [items, setItems] = useState([]);
const [filter, setFilter] = useState('all');
const filteredItems = useMemo(
  () => items.filter(item => filter === 'all' || item.type === filter),
  [items, filter]
);
```

---

## 🔄 Data Fetching Patterns

### Server State with React Query

```typescript
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then(r => r.json()),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

---

## 🎯 Performance Patterns

### 1. Memoization

```typescript
// Only re-render if props change
export const ExpensiveComponent = memo(({ data }) => {
  // ...
}, (prev, next) => prev.data.id === next.data.id);

// Cache expensive calculations
const sorted = useMemo(() => {
  return items.sort((a, b) => a.name.localeCompare(b.name));
}, [items]);

// Stable function references
const handleClick = useCallback((id) => {
  // ...
}, [dependency]);
```

### 2. Code Splitting

```typescript
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

---

## 🧪 Testing Patterns

```typescript
// Arrange-Act-Assert pattern
describe('UserList', () => {
  it('renders users', () => {
    // Arrange
    const users = [{ id: 1, name: 'John' }];

    // Act
    render(<UserList users={users} />);

    // Assert
    expect(screen.getByText('John')).toBeInTheDocument();
  });
});
```

---

## 📚 Resources

- [React Documentation](https://react.dev)
- [React Query](https://tanstack.com/query/latest)
- [React Patterns](https://reactpatterns.com/)

---
*Last updated: 2026-04-12*
