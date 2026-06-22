import React from 'react';
import EditIcon from '../assets/icons/edit.svg?react';
import DeleteIcon from '../assets/icons/delete.svg?react';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

interface GenericTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  idField: string;
}

export function GenericTable<T extends Record<string, any>>({ 
  data, 
  columns, 
  onEdit, 
  onDelete,
  idField
}: GenericTableProps<T>) {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key}>{col.header}</th>
            ))}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item[idField] || index}>
              {columns.map(col => (
                <td key={col.key}>
                  {col.render ? col.render(item) : item[col.key]}
                </td>
              ))}
              <td>
                <div className="action-buttons">
                  <button
                    className="icon-btn edit"
                    onClick={() => onEdit(item)}
                    title="Editar"
                  >
                    <EditIcon />
                  </button>
                  <button
                    className="icon-btn delete"
                    onClick={() => onDelete(item)}
                    title="Eliminar"
                  >
                    <DeleteIcon />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}