"use client"

import { useState, useEffect, useRef, type UIEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Search, X, Pill, Filter } from "lucide-react"
import { useProductSearch } from "@/hooks/products"

type ProductTypeFilter = 'ALL' | 'DRUG' | 'MEDICAL_ACT' | 'BIOLOGICAL_ACT' | 'CONSUMABLE_DEVICE'

interface ActionOrConsumable {
  id: string
  name: string
  privatePrice: number
  isQuantifiable?: boolean
  type?: ProductTypeFilter
  description?: string
}

interface AddActionConsumableModalProps {
  isOpen: boolean
  onClose: () => void
  departments: { id: string; name: string }[]
  currentDepartmentId?: string
  viewMode: 'all' | 'service'
  onAdd: (type: 'action' | 'consumable', item: ActionOrConsumable, quantity: number, departmentId: string) => void
  isSubmitting?: boolean
}

export default function AddActionConsumableModal({
  isOpen,
  onClose,
  departments,
  currentDepartmentId,
  viewMode,
  onAdd,
  isSubmitting = false,
}: AddActionConsumableModalProps) {
  const filterOptions: ProductTypeFilter[] = ['ALL', 'DRUG', 'MEDICAL_ACT', 'BIOLOGICAL_ACT', 'CONSUMABLE_DEVICE']
  const [productType, setProductType] = useState<ProductTypeFilter>('ALL')
  const [showFilterOptions, setShowFilterOptions] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<ActionOrConsumable[]>([])
  const [loadingMore, setLoadingMore] = useState(false)
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<ActionOrConsumable | null>(null)
  const [quantity, setQuantity] = useState('1')
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(currentDepartmentId || '')
  const isFetchingMoreRef = useRef(false)
  const {
    products: searchedProducts,
    loading,
    hasMore,
    loadMore,
  } = useProductSearch(debouncedSearchQuery, { type: productType, size: 10 })

  // Keep department selection in sync with the view's current department
  useEffect(() => {
    if (currentDepartmentId && currentDepartmentId !== selectedDepartmentId) {
      setSelectedDepartmentId(currentDepartmentId)
    }
  }, [currentDepartmentId, selectedDepartmentId])

  // Debounce the search input before querying the shared products hook.
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim().length >= 2 ? searchQuery.trim() : '')
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    if (!debouncedSearchQuery) {
      setSuggestions((prev) => (prev && prev.length ? [] : prev))
      return
    }

    const results = (searchedProducts || [])
      .map((item: any) => ({
        id: String(item.id),
        name: item.name,
        privatePrice: Number(item.privateRhicPrice ?? item.clinicPrice ?? 0),
        isQuantifiable: true,
        type: item.type,
        description: item.description,
        ...item,
      }))

    // Only update suggestions if results changed (avoid repeated identical setState)
    setSuggestions((prev) => {
      const prevIds = (prev || []).map((p) => p.id).join(',')
      const nextIds = (results || []).map((r) => r.id).join(',')
      if (prevIds === nextIds) return prev
      return results
    })
  }, [debouncedSearchQuery, searchedProducts, productType])

  const handleSelectItem = (item: ActionOrConsumable) => {
    setSelectedItem(item)
  }

  const handleAddItem = () => {
    if (!selectedItem || !selectedDepartmentId) return

    const qty = parseInt(quantity, 10) || 1
    const itemType = selectedItem.type === 'CONSUMABLE_DEVICE' ? 'consumable' : 'action'
    onAdd(itemType, selectedItem, qty, selectedDepartmentId)

    // Reset form
    setSelectedItem(null)
    setQuantity('1')
    setSearchQuery('')
    setSuggestions([])
    onClose()
  }

  const handleClose = () => {
    setSelectedItem(null)
    setQuantity('1')
    setSearchQuery('')
    setSuggestions([])
    setShowFilterOptions(false)
    onClose()
  }

  const handleSuggestionsScroll = async (e: UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget
    const nearBottom = element.scrollTop + element.clientHeight >= element.scrollHeight - 24

    if (!nearBottom) return
    if (!hasMore) return
    if (loading || loadingMore || isFetchingMoreRef.current) return

    try {
      isFetchingMoreRef.current = true
      setLoadingMore(true)
      await loadMore()
    } finally {
      setLoadingMore(false)
      isFetchingMoreRef.current = false
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) handleClose()
    }}>
      <DialogContent showCloseButton={false} className="sm:max-w-[600px] backdrop-blur-xl bg-white/10 dark:bg-black/20 rounded-3xl border border-white/20 shadow-2xl">
        <DialogHeader className="text-center space-y-2">
          <DialogTitle className="text-center">Add Product</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Spotlight-style Search Box - Hidden when item selected */}
          {!selectedItem && (
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl border border-border shadow-md overflow-hidden">
            {/* Search Input */}
            <div className="px-4 py-3 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowFilterOptions(false)}
                  className="pl-10 pr-10 h-12 text-base bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              <Button
                type="button"
                variant={productType === 'ALL' ? 'outline' : 'default'}
                size="icon"
                className="h-12 w-12"
                onClick={() => setShowFilterOptions((prev) => !prev)}
                aria-label="Toggle filters"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            {(showFilterOptions || productType !== 'ALL') && (
              <div className="px-4 pb-3 space-y-2 border-t border-border/30">
                {showFilterOptions && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {filterOptions.map((option) => (
                      <Button
                        key={option}
                        type="button"
                        size="sm"
                        variant={productType === option ? 'default' : 'outline'}
                        className="h-7 px-2 text-xs"
                        onClick={() => {
                          setProductType(option)
                          if (option !== 'ALL') {
                            setShowFilterOptions(false)
                          }
                        }}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                )}

                {productType !== 'ALL' && (
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setProductType('ALL')}
                      className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/10 px-2 py-1 text-xs text-primary hover:bg-primary/20"
                    >
                      <Filter className="h-3 w-3" />
                      {productType}
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          )}

          {/* Results Container - Separate card */}
          {!selectedItem && (loading || suggestions.length > 0) && (
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-border shadow-sm p-4 min-h-[100px]">
              {/* Loading indicator */}
              {loading && (
                <div className="flex items-center justify-center gap-0.5 text-sm text-muted-foreground">
                  <span className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }}></span>
                    <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "450ms" }}></span>
                  </span>
                </div>
              )}

              {/* Results List */}
              {!loading && suggestions.length > 0 && (
                <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1" onScroll={handleSuggestionsScroll}>
                  {suggestions.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSelectItem(item)}
                      onMouseEnter={() => setHoveredItemId(item.id)}
                      onMouseLeave={() => setHoveredItemId((prev) => (prev === item.id ? null : prev))}
                      className="p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 bg-background border-border/40 hover:border-primary/50 hover:shadow-sm hover:scale-[1.01]"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {item.privatePrice.toLocaleString()} RWF
                          </div>
                          {hoveredItemId === item.id && (
                            <div className="mt-2 rounded-md border border-border/50 bg-muted/30 p-2 text-xs text-muted-foreground">
                              {item.description?.trim() || 'No description available'}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {loadingMore && <div className="text-center text-xs text-muted-foreground py-1">Loading more...</div>}
                  {!loadingMore && hasMore && <div className="text-center text-xs text-muted-foreground py-1">Scroll to load more</div>}
                </div>
              )}
            </div>
          )}

          {/* Configuration Section - Only when item selected */}
          {selectedItem && (
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-border shadow-sm p-4 space-y-4">
              {/* Selected Item Summary */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Pill className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Selected Product</span>
                </div>
                <div className="text-sm text-muted-foreground mb-2">{selectedItem.name}</div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Unit Price:</span>
                  <span className="font-semibold">{selectedItem.privatePrice.toLocaleString()} RWF</span>
                </div>
              </div>

              {/* Quantity Input (if quantifiable) */}
              {selectedItem.isQuantifiable !== false && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Quantity</Label>
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Enter quantity"
                    className="h-10"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Total:</span>
                    <span className="font-semibold text-foreground">
                      {(selectedItem.privatePrice * (parseInt(quantity, 10) || 1)).toLocaleString()} RWF
                    </span>
                  </div>
                </div>
              )}

              {/* Department Selection (all-items view) */}
              {(viewMode === 'all' || !currentDepartmentId) && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Target Department</Label>
                  <Select
                    value={selectedDepartmentId}
                    onValueChange={setSelectedDepartmentId}
                    disabled={Boolean(currentDepartmentId)}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Choose department..." />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}
        </div>

        {selectedItem && (
        <DialogFooter className="gap-2 mt-4 justify-center">
          <Button variant="outline" onClick={handleClose} className="rounded-full">
            Cancel
          </Button>
          <Button
            onClick={handleAddItem}
            disabled={!selectedItem || !selectedDepartmentId || loading || isSubmitting}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
          >
            Add to Billing
          </Button>
        </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
