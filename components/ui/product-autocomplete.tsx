'use client'

import * as React from 'react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Check, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useProductSearch } from '@/hooks/auth-hooks'

interface Product {
  id: string | number
  name: string
}

interface ProductAutocompleteProps {
  products: Product[]
  selectedProductId: string
  onProductSelect: (productId: string) => void
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
  
  // Use backend search when user types, otherwise use provided products
  const { products: searchResults, loading: searchLoading } = useProductSearch(inputValue)
  
  const displayProducts = React.useMemo(() => {
    // If we have a search query (2+ chars), use backend results
    // Otherwise, use the provided products list
    if (inputValue.length >= 2) {
      return searchResults
    }
    return products
  }, [inputValue, searchResults, products])

  const selectedProduct = React.useMemo(() => {
    // First try to find in the original products list
    let product = products.find(p => String(p.id) === selectedProductId)
    
    // If not found and we have search results, try to find there
    if (!product && searchResults.length > 0) {
      product = searchResults.find(p => String(p.id) === selectedProductId)
    }
    
    return product
  }, [products, searchResults, selectedProductId])

  const handleSelect = (productId: string) => {
    onProductSelect(productId)
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
    onProductSelect('')
    setInputValue('')
  }

  // If a product is selected, show a cleaner UI with just the name and clear button
  if (selectedProduct) {
    return (
      <div className={cn('flex items-center gap-2 w-full', className)}>
        <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg border">
          <span className="text-sm font-medium">{selectedProduct.name}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearSelection}
            className="h-6 w-6 p-0 rounded-full hover:bg-muted-foreground/20"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between rounded-lg', className)}
          disabled={disabled}
        >
          {placeholder}
          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 rounded-lg" align="start">
        <Command>
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
              {displayProducts.map((product) => (
                <CommandItem
                  key={product.id}
                  value={product.name}
                  onSelect={() => handleSelect(String(product.id))}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      String(product.id) === selectedProductId ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {product.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
