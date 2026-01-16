# Toast Notification System

Professional toast notification system for instant user feedback using `react-hot-toast`.

## 📦 Installation

The toast notification system is already installed and configured in the application.

```bash
npm install react-hot-toast@^2.4.1
```

## 🎨 Components

### ToastProvider
Located at: `src/components/Toast/ToastProvider.tsx`

The provider component that manages toast notifications with dark mode support.

```tsx
import { ToastProvider } from '@/components/Toast/ToastProvider';

// Already integrated in src/main.jsx
```

### useToast Hook
Located at: `src/hooks/useToast.tsx`

Custom hook that provides methods for displaying toast notifications.

```tsx
import { useToast } from '@/hooks/useToast';

const toast = useToast();
```

## 🎯 Usage

### Basic Notifications

```tsx
import { useToast } from '@/hooks/useToast';

function MyComponent() {
  const toast = useToast();

  const handleSuccess = () => {
    toast.success('✅ Opération réussie!');
  };

  const handleError = () => {
    toast.error('❌ Une erreur est survenue');
  };

  const handleInfo = () => {
    toast.info('ℹ️ Information importante');
  };

  const handleWarning = () => {
    toast.warning('⚠️ Attention requise');
  };

  return (
    <div>
      <button onClick={handleSuccess}>Success</button>
      <button onClick={handleError}>Error</button>
      <button onClick={handleInfo}>Info</button>
      <button onClick={handleWarning}>Warning</button>
    </div>
  );
}
```

### Promise-based Toasts

For async operations that show loading, success, and error states:

```tsx
const handleUpload = async () => {
  const uploadPromise = uploadFile();
  
  toast.promise(
    uploadPromise,
    {
      loading: 'Upload en cours...',
      success: 'Fichier uploadé avec succès!',
      error: 'Erreur lors de l\'upload',
    }
  );
};
```

### Undoable Actions

For reversible operations with an undo button:

```tsx
const handleDelete = () => {
  deleteItem(itemId);
  
  toast.undoable('Article supprimé', {
    onUndo: () => {
      restoreItem(itemId);
      toast.success('Article restauré');
    },
    undoText: 'Annuler',
    duration: 5000,
  });
};
```

### Custom Positioning

```tsx
toast.success('Message en haut à gauche', {
  position: 'top-left',
});

toast.info('Message en bas au centre', {
  position: 'bottom-center',
});
```

### Custom Duration

```tsx
toast.success('Message court', {
  duration: 2000, // 2 seconds
});

toast.error('Message long', {
  duration: 7000, // 7 seconds
});
```

## 🎨 Integrated Components

The toast system is already integrated in these components:

### 1. ExportDataButton
Shows promise-based toasts for CSV/JSON/TXT exports.

```tsx
// Before: alert('Erreur lors de l\'export')
// After: toast.promise() with loading/success/error states
```

### 2. ProductSearch
Shows info toast when no search results are found.

```tsx
// Before: No feedback
// After: toast.info('Aucun résultat trouvé')
```

### 3. AddToTiPanierButton
Shows undoable toast when adding items to cart.

```tsx
// Before: Simple state update
// After: toast.undoable() with undo functionality
```

## 🎨 Features

- ✅ **4 notification types**: Success, Error, Warning, Info
- ✅ **Auto-dismiss**: Configurable duration (default: 4 seconds)
- ✅ **Stack notifications**: Multiple toasts displayed simultaneously
- ✅ **Undo actions**: Reversible operations with undo button
- ✅ **Dark mode support**: Automatic theming based on app theme
- ✅ **Smooth animations**: Enter/exit transitions
- ✅ **Promise-based**: Loading → Success/Error flow
- ✅ **Accessibility**: ARIA labels and screen reader support
- ✅ **Mobile responsive**: Adapts to screen size

## 🔧 Configuration

Default configuration in `ToastProvider`:
- Position: `top-right`
- Duration: `4000ms` (4 seconds)
- Success duration: `3000ms`
- Error duration: `5000ms`
- Gutter: `8px` (spacing between toasts)

## 🎨 Dark Mode

The toast system automatically adapts to the app's theme:

**Dark Mode:**
- Background: `#1f2937` (gray-800)
- Text: `#f9fafb` (gray-50)
- Border: `#374151` (gray-700)

**Light Mode:**
- Background: `#ffffff` (white)
- Text: `#111827` (gray-900)
- Border: `#e5e7eb` (gray-200)

## 📚 API Reference

### useToast()

Returns an object with the following methods:

#### `success(message, options?)`
Shows a success toast with a checkmark icon.

#### `error(message, options?)`
Shows an error toast with an X icon.

#### `info(message, options?)`
Shows an info toast with an info icon (ℹ️).

#### `warning(message, options?)`
Shows a warning toast with a warning icon (⚠️).

#### `loading(message, options?)`
Shows a loading toast with a spinner.

#### `promise(promise, messages, options?)`
Shows loading → success/error based on promise result.

#### `undoable(message, options)`
Shows a toast with an undo button.

#### `dismiss(toastId?)`
Dismisses a specific toast or all toasts if no ID provided.

#### `dismissAll()`
Dismisses all active toasts.

## 🔒 Security

- ✅ No XSS vulnerabilities (no dangerouslySetInnerHTML)
- ✅ No eval() or unsafe code execution
- ✅ Safe dependency (react-hot-toast v2.4.1)
- ✅ Input sanitization not required (text only)

## 📝 Examples in Codebase

1. **Export Operations** (`src/components/ExportDataButton.tsx`)
2. **Search Results** (`src/components/ProductSearch.jsx`)
3. **Cart Actions** (`src/components/AddToTiPanierButton.tsx`)

## 🚀 Next Steps

To add toasts to other components:

1. Import the hook: `import { useToast } from '@/hooks/useToast';`
2. Use in component: `const toast = useToast();`
3. Call methods: `toast.success('Message')`

## 📖 Documentation

Official react-hot-toast documentation: https://react-hot-toast.com/
