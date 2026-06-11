'use client'

import { Plus } from 'lucide-react'
import type { ComponentProps } from 'react'
import { BillingItemsList } from '@/components/BillingItemsList'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { BillingItem } from '@/lib/billing-utils'

type BillingInsuranceOption = NonNullable<
  ComponentProps<typeof BillingItemsList>['availableInsurances']
>[number]

type BillingItemsWorkspaceProps = {
  activeService: string
  allServiceNames: string[]
  items: BillingItem[]
  selectedItemIds: string[]
  selectedCountLabel: string
  canAddItems: boolean
  canEdit?: boolean
  visitInsuranceOptions: BillingInsuranceOption[]
  onServiceChange: (serviceName: string) => void
  onAddItem: () => void
  onItemChange: (item: BillingItem) => void
  onItemRemove: (itemId: string) => void
  onQuantityChange: (item: BillingItem, quantity: number) => void
  onSelectionToggle: (itemId: string, checked: boolean) => void
  onSelectAll: (itemIds: string[], checked: boolean) => void
}

export function BillingItemsWorkspace({
  activeService,
  allServiceNames,
  items,
  selectedItemIds,
  selectedCountLabel,
  canAddItems,
  canEdit = true,
  visitInsuranceOptions,
  onServiceChange,
  onAddItem,
  onItemChange,
  onItemRemove,
  onQuantityChange,
  onSelectionToggle,
  onSelectAll,
}: BillingItemsWorkspaceProps) {
  return (
    <div className="flex-1 flex flex-col min-h-0 p-6">
      <div className="flex-1 flex flex-col min-h-0 w-full min-w-0 mx-auto px-2 sm:px-4 md:px-[1cm] lg:px-[2cm]">
        <div className="flex items-center justify-between gap-3 mb-2 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <h2 className="text-sm font-semibold text-foreground">Items to Bill</h2>
            <span className="text-xs text-muted-foreground tabular-nums">{selectedCountLabel}</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {canAddItems && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 rounded-full text-xs"
                onClick={onAddItem}
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Add Product
              </Button>
            )}
          </div>
        </div>

        <div className="mb-2 flex-shrink-0">
          <Tabs value={activeService} onValueChange={onServiceChange}>
            <TabsList className="h-8">
              {allServiceNames.map((dept) => (
                <TabsTrigger key={dept} value={dept} className="rounded-full px-3 text-xs h-7">
                  {dept}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="flex-1 min-h-0 bg-card/60 backdrop-blur-xl border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto py-2">
            <BillingItemsList
              items={items}
              onItemChange={onItemChange}
              onItemRemove={onItemRemove}
              onQuantityChange={onQuantityChange}
              availableInsurances={visitInsuranceOptions}
              selectable
              selectedItemIds={selectedItemIds}
              onSelectionToggle={onSelectionToggle}
              onSelectAll={onSelectAll}
              hideDepartmentHeaders
              allDepartments={[]}
              hideTypeColumn
              canEdit={canEdit}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
