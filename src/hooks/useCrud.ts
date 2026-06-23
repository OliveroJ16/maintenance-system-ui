import { useState, useEffect } from 'react';
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

  const fetchItems = async () => {
    try {
      const response = await api.get(`/api/${config.endpoint}`);
      setItems(response.data);
    } catch (error) {
      showErrorAlert('Error', `No se pudieron cargar los ${config.entityName}s`);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setFormData(config.initialFormData);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: T) => {
    setEditingItem(item);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEditing = !!editingItem;

    try {
      if (isEditing && editingItem) {
        await api.put(`/api/${config.endpoint}/${editingItem[idField]}`, formData);
      } else {
        await api.post(`/api/${config.endpoint}`, formData);
      }

      showSuccessAlert(
        isEditing ? '¡Actualizado!' : '¡Registrado!',
        `El ${config.entityName} se ha ${isEditing ? 'actualizado' : 'guardado'} correctamente.`
      );

      setIsModalOpen(false);
      fetchItems();
    } catch (error) {
      showErrorAlert('Error', 'Error de conexión con el servidor.');
    }
  };

  const handleDelete = async (item: T) => {
    const result = await showConfirmDeleteAlert(
      `¿Eliminar ${config.entityName}?`,
      'Esta acción no se puede deshacer.'
    );

    if (result.isConfirmed) {
      try {
        await api.delete(`/api/${config.endpoint}/${item[idField]}`);
        showSuccessAlert('¡Eliminado!', `El ${config.entityName} ha sido eliminado.`);
        fetchItems();
      } catch (error) {
        showErrorAlert('Error', `No se pudo eliminar al ${config.entityName}.`);
      }
    }
  };

  const filteredItems = items.filter((item: any) =>
    Object.values(item).some(
      value => 
        value && 
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return {
    items: filteredItems,
    searchTerm,
    setSearchTerm,
    isModalOpen,
    setIsModalOpen,
    editingItem,
    formData,
    handleInputChange,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleSubmit,
    handleDelete,
    fetchItems
  };
}