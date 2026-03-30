'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Visit, Department } from '@/hooks/auth-hooks';

const ADD_DEPARTMENT_TO_VISIT = gql`
  mutation AddDepartmentToVisit($input: AddDepartmentInput!) {
    addDepartmentToVisit(input: $input) {
      status
      messages {
        text
        type
      }
      data {
        id
        visitStatus
        departments {
          id
          department {
            id
            name
          }
          status
        }
      }
    }
  }
`;

interface AddDepartmentModalProps {
  visit: Visit;
  departments: Department[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddDepartmentModal({
  visit,
  departments,
  isOpen,
  onClose,
  onSuccess,
}: AddDepartmentModalProps) {
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('');
  const [addDepartment, { loading }] = useMutation(ADD_DEPARTMENT_TO_VISIT);

  // Filter out departments already in the visit
  const existingDepartmentIds = visit.departments?.map(d => String(d.department?.id)) || [];
  const availableDepartments = departments.filter(
    dept => !existingDepartmentIds.includes(String(dept.id))
  );

  const handleSubmit = async () => {
    if (!selectedDepartmentId) return;

    try {
      const result = await addDepartment({
        variables: {
          input: {
            visitId: visit.id,
            departmentId: selectedDepartmentId,
          },
        },
        refetchQueries: ['GetVisits', 'GetVisit'],
        awaitRefetchQueries: true,
      });

      if (result.data?.addDepartmentToVisit?.status === 'SUCCESS') {
        onSuccess?.();
        onClose();
        setSelectedDepartmentId('');
      } else {
        const errorMessage = result.data?.addDepartmentToVisit?.messages?.[0]?.text || 'Failed to add department';
        alert(errorMessage);
      }
    } catch (error) {
      console.error('Error adding department:', error);
      alert('Failed to add department to visit');
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

          {availableDepartments.length === 0 ? (
            <div className="text-center py-6 text-slate-500 dark:text-slate-400">
              <p className="text-sm">All departments have been added to this visit</p>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Select Department
                </label>
                <Select value={selectedDepartmentId} onValueChange={setSelectedDepartmentId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a department" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDepartments.map((dept) => (
                      <SelectItem key={dept.id} value={String(dept.id)}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
