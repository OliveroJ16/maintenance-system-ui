import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { showSuccessAlert, showConfirmDeleteAlert, showErrorAlert } from '../utils/alert';

interface CrudConfig<T> {
  endpoint: string;
  initialFormData: T;
  entityName: string;
  idField?: string;
}

export function useCrud<T extends Record<string, any>>(config: CrudConfig<T>) {
  const idField = config.idField || 'id';
  
  const [items, setItems] = useState<T[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [formData, setFormData] = useState<T>(config.initialFormData);
  const [loading, setLoading] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/${config.endpoint}`);
      setItems(response.data);
    } catch (error) {
      showErrorAlert('Error', `No se pudieron cargar los ${config.entityName}s`);
    } finally {
      setLoading(false);
    }
  }, [config.endpoint, config.entityName]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: value === '' ? '' : Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setFormData(config.initialFormData);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: T) => {
    setEditingItem(item);
    
    const editData: Record<string, any> = { ...item };
    
    Object.keys(editData).forEach(key => {
      const value = editData[key];
      if (value && typeof value === 'object' && value !== null) {
        const nestedId = Object.keys(value).find(k => k.startsWith('id') || k.toLowerCase().includes('id'));
        if (nestedId) {
          editData[key] = value[nestedId]?.toString();
        }
      }
    });
    
    setFormData(editData as T);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEditing = !!editingItem;

    try {
      if (isEditing && editingItem) {
        const itemId = (editingItem as Record<string, any>)[idField];
        await api.put(`/api/${config.endpoint}/${itemId}`, formData);
      } else {
        await api.post(`/api/${config.endpoint}`, formData);
      }

      showSuccessAlert(
        isEditing ? '¡Actualizado!' : '¡Registrado!',
        `El ${config.entityName} se ha ${isEditing ? 'actualizado' : 'guardado'} correctamente.`
      );

      setIsModalOpen(false);
      fetchItems();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Error de conexión con el servidor.';
      showErrorAlert('Error', errorMsg);
    }
  };

  const handleDelete = async (item: T) => {
    const result = await showConfirmDeleteAlert(
      `¿Eliminar ${config.entityName}?`,
      'Esta acción no se puede deshacer.'
    );

    if (result.isConfirmed) {
      try {
        const itemId = (item as Record<string, any>)[idField];
        await api.delete(`/api/${config.endpoint}/${itemId}`);
        showSuccessAlert('¡Eliminado!', `El ${config.entityName} ha sido eliminado.`);
        fetchItems();
      } catch (error: any) {
        const errorMsg = error.response?.data?.message || `No se pudo eliminar al ${config.entityName}.`;
        showErrorAlert('Error', errorMsg);
      }
    }
  };

  const filteredItems = items.filter((item: T) => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const itemRecord = item as Record<string, any>;
    
    return Object.values(itemRecord).some(value => {
      if (value === null || value === undefined) return false;
      
      if (typeof value === 'string' || typeof value === 'number') {
        return value.toString().toLowerCase().includes(searchLower);
      }
      
      if (typeof value === 'object') {
        return Object.values(value).some(nestedValue => {
          if (typeof nestedValue === 'string' || typeof nestedValue === 'number') {
            return nestedValue.toString().toLowerCase().includes(searchLower);
          }
          return false;
        });
      }
      
      return false;
    });
  });

  return {
    items: filteredItems,
    loading,
    searchTerm,
    setSearchTerm,
    isModalOpen,
    setIsModalOpen,
    editingItem,
    setEditingItem,
    formData,
    setFormData,  
    handleInputChange,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleSubmit,
    handleDelete,
    fetchItems
  };
}