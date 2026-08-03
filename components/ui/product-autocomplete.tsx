'use client'

import * as React from 'react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Check, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Product as ApiProduct } from '@/lib/api-types'
import { useProductSearch } from '@/hooks/auth-hooks'

interface ProductAutocompleteProps {
  products: ApiProduct[]
  selectedProductId: string
  /** Called with the id and the full picked product (may come from backend search results). */
  onProductSelect: (productId: string, product?: ApiProduct) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function ProductAutocomplete({
  products,
  selectedProductId,
  onProductSelect,
  placeholder = 'Search products...',
  disabled = false,
  className,
}: ProductAutocompleteProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')
  // Keep the full picked product locally so the selection stays visible even
  // when it came from backend search results (not present in the `products` prop).
  const [selectedProduct, setSelectedProduct] = React.useState<ApiProduct | null>(null)

  // Use backend search when user types, otherwise use provided products
  const { products: searchResults, loading: searchLoading } = useProductSearch(inputValue)

  const isSearching = inputValue.trim().length >= 2

  const displayProducts = React.useMemo(() => {
    // If we have a search query (2+ chars), use backend results
    // Otherwise, use the provided products list
    if (isSearching) {
      return searchResults
    }
    return products
  }, [isSearching, searchResults, products])

  // Keep the local selection in sync with the prop (including when it is cleared).
  React.useEffect(() => {
    if (!selectedProductId) {
      setSelectedProduct(null)
      return
    }
    const found =
      products.find((p: ApiProduct) => String(p.id) === selectedProductId) ||
      searchResults.find((p: ApiProduct) => String(p.id) === selectedProductId)
    if (found) {
      setSelectedProduct(found)
    }
  }, [products, searchResults, selectedProductId])

  const handleSelect = (product: ApiProduct) => {
    setSelectedProduct(product)
    onProductSelect(String(product.id), product)
    setOpen(false)
    setInputValue('')
  }

  const handleInputChange = (value: string) => {
    setInputValue(value)
    if (!open && value.length > 0) {
      setOpen(true)
    }
  }

  const handleClearSelection = () => {
    setSelectedProduct(null)
    onProductSelect('')
    setInputValue('')
  }

  // If a product is selected, show a cleaner UI with just the name and clear button
  if (selectedProduct) {
    return (
      <div className={cn('flex items-center gap-2 w-full', className)}>
        <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg border">
          <span className="text-sm font-medium truncate">{selectedProduct.name}</span>
          {selectedProduct.code && (
            <span className="text-xs text-muted-foreground truncate shrink-0">{selectedProduct.code}</span>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearSelection}
            className="h-6 w-6 p-0 rounded-full hover:bg-muted-foreground/20 ml-auto shrink-0"
            type="button"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) setInputValue('')
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between rounded-lg', className)}
          disabled={disabled}
        >
          <span className="truncate">{inputValue || placeholder}</span>
          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 rounded-lg" align="start">
        <Command shouldFilter={!isSearching}>
          <CommandInput
            placeholder={placeholder}
            value={inputValue}
            onValueChange={handleInputChange}
          />
          <CommandList>
            <CommandEmpty>
              {searchLoading ? 'Searching...' : 'No products found.'}
            </CommandEmpty>
            <CommandGroup>
              {displayProducts.map((product: ApiProduct) => (
                <CommandItem
                  key={product.id}
                  value={product.name}
                  onSelect={() => handleSelect(product)}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      String(product.id) === selectedProductId ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="truncate">{product.name}</span>
                    {product.code && (
                      <span className="text-xs text-muted-foreground truncate">{product.code}</span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
