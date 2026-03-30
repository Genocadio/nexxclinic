"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Search, X, Pill } from "lucide-react"

interface ActionOrConsumable {
  id: string
  name: string
  privatePrice: number
  isQuantifiable?: boolean
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
  const [type, setType] = useState<'action' | 'consumable'>('action')
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<ActionOrConsumable[]>([])
  const [selectedItem, setSelectedItem] = useState<ActionOrConsumable | null>(null)
  const [quantity, setQuantity] = useState('1')
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(currentDepartmentId || '')
  const [loading, setLoading] = useState(false)

  // Keep department selection in sync with the view's current department
  useEffect(() => {
    if (currentDepartmentId) {
      setSelectedDepartmentId(currentDepartmentId)
    }
  }, [currentDepartmentId, isOpen])

  // Search function - call backend API
  const handleSearch = useCallback(async (query: string) => {
    if (query.trim().length < 2) {
      setSuggestions([])
      return
    }

    setLoading(true)
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') || '' : ''
      const isAction = type === 'action'
      const gqlQuery = isAction
        ? `query SearchActions($name: String, $page: Int, $size: Int) { getActions(name: $name, page: $page, size: $size) { data { content { id name quantifiable privatePrice } } } }`
        : `query SearchConsumables($name: String, $page: Int, $size: Int) { getConsumables(name: $name, page: $page, size: $size) { data { content { id name quantifiable privatePrice } } } }`
      const variables = { name: query, page: 0, size: 10 }

      const response = await fetch(`${baseUrl}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ query: gqlQuery, variables }),
      })
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      
      const data = await response.json()
      const items = isAction
        ? data?.data?.getActions?.data?.content || []
        : data?.data?.getConsumables?.data?.content || []
      const results = items.map((item: any) => ({
        id: String(item.id), // Preserve search result ID (used for addActionToVisitDepartment)
        name: item.name,
        privatePrice: item.privatePrice || 0,
        isQuantifiable: item.quantifiable !== false,
        // Preserve complete item data for later reference
        ...item, // Include all fields from backend response
      }))
      
      console.log('Search results:', results)
      setSuggestions(results)
    } catch (err) {
      console.error('Search error:', err)
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }, [type])

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchQuery)
    }, 300) // Wait 300ms after user stops typing

    return () => clearTimeout(timer)
  }, [searchQuery, type, handleSearch])

  const handleSelectItem = (item: ActionOrConsumable) => {
    setSelectedItem(item)
  }

  const handleAddItem = () => {
    if (!selectedItem || !selectedDepartmentId) return

    const qty = parseInt(quantity, 10) || 1
    onAdd(type, selectedItem, qty, selectedDepartmentId)

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
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) handleClose()
    }}>
      <DialogContent showCloseButton={false} className="sm:max-w-[600px] backdrop-blur-xl bg-white/10 dark:bg-black/20 rounded-3xl border border-white/20 shadow-2xl">
        <DialogHeader className="text-center space-y-2">
          <DialogTitle className="text-center">Add {type === 'action' ? 'Action' : 'Consumable'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Spotlight-style Search Box - Hidden when item selected */}
          {!selectedItem && (
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl border border-border shadow-md overflow-hidden">
            {/* Type Selection Pills - Replaces filter pills */}
            <div className="px-4 pt-3 pb-2 border-b border-border/30 transition-opacity opacity-60 hover:opacity-100">
              <div className="flex gap-2 items-center justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setType('action')
                    setSearchQuery('')
                    setSuggestions([])
                    setSelectedItem(null)
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                    type === 'action'
                      ? "bg-primary text-primary-foreground shadow-md scale-105"
                      : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Action
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setType('consumable')
                    setSearchQuery('')
                    setSuggestions([])
                    setSelectedItem(null)
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                    type === 'consumable'
                      ? "bg-primary text-primary-foreground shadow-md scale-105"
                      : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Consumable
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative px-4 py-3">
              <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-10 h-12 text-base bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-7 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
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
                <div className="space-y-2">
                  {suggestions.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSelectItem(item)}
                      className="p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 bg-background border-border/40 hover:border-primary/50 hover:shadow-sm hover:scale-[1.01]"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {item.privatePrice.toLocaleString()} RWF
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
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
                  <span className="text-sm font-medium">Selected Item</span>
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
