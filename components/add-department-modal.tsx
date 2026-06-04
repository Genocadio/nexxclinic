'use client';

import { useEffect, useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Visit, Department } from '@/lib/api-types';
import { useAddDepartmentToVisit, useDepartments } from '@/hooks/auth-hooks';
import { toast } from 'react-toastify';
import { handleResponse } from '@/lib/response-handler';
import { DepartmentAutocomplete } from '@/components/ui/department-autocomplete';

interface AddDepartmentModalProps {
  visit: Visit;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddDepartmentModal({
  visit,
  isOpen,
  onClose,
  onSuccess,
}: AddDepartmentModalProps) {
  const { departments, error: departmentsError, loading: departmentsLoading } = useDepartments();
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('');
  const { addDepartmentToVisit, loading } = useAddDepartmentToVisit();

  useEffect(() => {
    if (!isOpen || !departmentsError) return;

    toast.error(departmentsError || 'Failed to load departments for this visit');
    onClose();
  }, [departmentsError, isOpen, onClose]);

  // Filter out departments already in the visit
  const existingDepartmentIds = visit.departments?.map(d => String(d.department?.id)) || [];
  const availableDepartments = departments.filter(
    dept => !existingDepartmentIds.includes(String(dept.id))
  );

  if (departmentsError) {
    return null;
  }

  const handleSubmit = async () => {
    if (!selectedDepartmentId) {
      toast.error('Choose a department before adding it to the visit')
      return
    }

    try {
      const result = await addDepartmentToVisit(visit.id, selectedDepartmentId);

      const ok = await handleResponse(result, { successMessage: 'Department added to visit', errorMessage: true })
      if (ok) {
        onSuccess?.();
        onClose();
        setSelectedDepartmentId('');
      }
    } catch (error) {
      console.error('Error adding department:', error);
      toast.error('Failed to add department to visit');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Add Department to Visit
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
          >
            <X className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Patient: {visit.patient.firstName} {visit.patient.lastName}
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Visit Date: {new Date(visit.visitDate).toLocaleDateString()}
            </p>
          </div>

          {departmentsLoading ? (
            <div className="text-center py-6 text-slate-500 dark:text-slate-400">
              <p className="text-sm">Loading departments...</p>
            </div>
          ) : availableDepartments.length === 0 ? (
            <div className="text-center py-6 text-slate-500 dark:text-slate-400">
              <p className="text-sm">All departments have been added to this visit</p>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Select Department
                </label>
                <DepartmentAutocomplete
                  departments={availableDepartments}
                  selectedDepartmentId={selectedDepartmentId}
                  onDepartmentSelect={setSelectedDepartmentId}
                  placeholder="Choose a department"
                  disabled={departmentsLoading}
                />
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="flex-1"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={!selectedDepartmentId || loading}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  {loading ? 'Adding...' : 'Add Department'}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
