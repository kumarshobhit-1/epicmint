'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { Filter, X, Calendar, DollarSign, Tag as TagIcon, TrendingUp, Sparkles } from 'lucide-react';
import { NFT_CATEGORIES, SORT_OPTIONS } from '@/lib/constants';
import type { SearchFilters } from '@/lib/types';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';

interface AdvancedFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
}

// Popular tags
const POPULAR_TAGS = [
  'Fantasy', 'Sci-Fi', 'Romance', 'Mystery', 'Adventure',
  'Horror', 'Comedy', 'Drama', 'Action', 'Thriller'
];

export function AdvancedFilters({ filters, onFiltersChange }: AdvancedFiltersProps) {
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    localFilters.minPrice || 0,
    localFilters.maxPrice || 10
  ]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();

  const handleApplyFilters = () => {
    const updatedFilters = {
      ...localFilters,
      minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
      maxPrice: priceRange[1] < 10 ? priceRange[1] : undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      dateFrom: dateFrom?.getTime(),
      dateTo: dateTo?.getTime(),
    };
    onFiltersChange(updatedFilters);
  };

  const handleResetFilters = () => {
    const emptyFilters: SearchFilters = {};
    setLocalFilters(emptyFilters);
    setPriceRange([0, 10]);
    setSelectedTags([]);
    setDateFrom(undefined);
    setDateTo(undefined);
    onFiltersChange(emptyFilters);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const hasActiveFilters = 
    Object.keys(localFilters).some(key => {
      const value = localFilters[key as keyof SearchFilters];
      return value !== undefined && value !== null;
    }) || 
    selectedTags.length > 0 ||
    dateFrom !== undefined ||
    dateTo !== undefined ||
    priceRange[0] > 0 ||
    priceRange[1] < 10;

  const activeFilterCount = [
    localFilters.category,
    localFilters.isListed !== undefined,
    priceRange[0] > 0 || priceRange[1] < 10,
    selectedTags.length > 0,
    dateFrom || dateTo,
  ].filter(Boolean).length;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative border-2 gap-2">
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline">Filters</span>
          {activeFilterCount > 0 && (
            <Badge variant="default" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Advanced Filters
          </SheetTitle>
          <SheetDescription>
            Refine your search with powerful filtering options
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6 pb-6">
          {/* Category Filter */}
          <Card className="p-4">
            <Label className="text-sm font-semibold mb-3 flex items-center gap-2">
              <TagIcon className="w-4 h-4 text-primary" />
              Category
            </Label>
            <Select
              value={localFilters.category || 'all'}
              onValueChange={(value) =>
                setLocalFilters({ 
                  ...localFilters, 
                  category: value === 'all' ? undefined : (value as any)
                })
              }
            >
              <SelectTrigger className="border-2">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {NFT_CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Card>

          {/* Sort By */}
          <Card className="p-4">
            <Label className="text-sm font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Sort By
            </Label>
            <Select
              value={localFilters.sortBy || 'recent'}
              onValueChange={(value) =>
                setLocalFilters({ ...localFilters, sortBy: value as any })
              }
            >
              <SelectTrigger className="border-2">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Card>

          {/* Price Range Slider */}
          <Card className="p-4">
            <Label className="text-sm font-semibold mb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" />
              Price Range (ETH)
            </Label>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-mono bg-secondary px-2 py-1 rounded">
                  {priceRange[0].toFixed(2)} ETH
                </span>
                <span className="text-muted-foreground">to</span>
                <span className="font-mono bg-secondary px-2 py-1 rounded">
                  {priceRange[1] >= 10 ? '10+ ETH' : `${priceRange[1].toFixed(2)} ETH`}
                </span>
              </div>
              <Slider
                min={0}
                max={10}
                step={0.1}
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as [number, number])}
                className="py-4"
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  step="0.01"
                  min="0"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseFloat(e.target.value) || 0, priceRange[1]])}
                  className="border-2"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  step="0.01"
                  min="0"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseFloat(e.target.value) || 10])}
                  className="border-2"
                />
              </div>
            </div>
          </Card>

          {/* Date Range Picker */}
          <Card className="p-4">
            <Label className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Date Range
            </Label>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start text-left border-2">
                      {dateFrom ? format(dateFrom, 'PP') : 'From date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={dateFrom}
                      onSelect={setDateFrom}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start text-left border-2">
                      {dateTo ? format(dateTo, 'PP') : 'To date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={dateTo}
                      onSelect={setDateTo}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              {(dateFrom || dateTo) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setDateFrom(undefined);
                    setDateTo(undefined);
                  }}
                  className="w-full"
                >
                  <X className="w-3 h-3 mr-1" />
                  Clear dates
                </Button>
              )}
            </div>
          </Card>

          {/* Tags */}
          <Card className="p-4">
            <Label className="text-sm font-semibold mb-3 flex items-center gap-2">
              <TagIcon className="w-4 h-4 text-primary" />
              Tags
            </Label>
            <div className="flex flex-wrap gap-2">
              {POPULAR_TAGS.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                  className="cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
            {selectedTags.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTags([])}
                className="w-full mt-2"
              >
                <X className="w-3 h-3 mr-1" />
                Clear tags
              </Button>
            )}
          </Card>

          {/* Listed Status */}
          <Card className="p-4">
            <Label className="text-sm font-semibold mb-3">Listing Status</Label>
            <Select
              value={
                localFilters.isListed === undefined
                  ? 'all'
                  : localFilters.isListed
                  ? 'listed'
                  : 'unlisted'
              }
              onValueChange={(value) =>
                setLocalFilters({
                  ...localFilters,
                  isListed:
                    value === 'all' ? undefined : value === 'listed',
                })
              }
            >
              <SelectTrigger className="border-2">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All NFTs</SelectItem>
                <SelectItem value="listed">Listed for Sale</SelectItem>
                <SelectItem value="unlisted">Not Listed</SelectItem>
              </SelectContent>
            </Select>
          </Card>
        </div>

        <Separator />

        {/* Action Buttons */}
        <SheetFooter className="flex-row gap-2 pt-6">
          <Button
            onClick={handleResetFilters}
            variant="outline"
            className="flex-1 border-2"
            disabled={!hasActiveFilters}
          >
            <X className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleApplyFilters} className="flex-1">
            Apply Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
