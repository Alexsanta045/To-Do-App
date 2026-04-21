export type TaskCategory = 'personal' | 'work' | 'shopping' | 'health' | 'other';

export const TASK_CATEGORIES: {
  value: TaskCategory;
  label: string;
  icon: string;
  color: string;
}[] = [
  { value: 'personal', label: 'Personal', icon: 'person-outline',              color: 'primary'   },
  { value: 'work',     label: 'Trabajo',  icon: 'briefcase-outline',           color: 'secondary' },
  { value: 'shopping', label: 'Compras',  icon: 'cart-outline',                color: 'success'   },
  { value: 'health',   label: 'Salud',    icon: 'heart-outline',               color: 'danger'    },
  { value: 'other',    label: 'Otro',     icon: 'ellipsis-horizontal-outline', color: 'medium'    },
];