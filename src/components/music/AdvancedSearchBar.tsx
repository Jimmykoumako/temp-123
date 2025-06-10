
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, X, Clock } from 'lucide-react';

interface SearchFilters {
  type: 'all' | 'tracks' | 'albums' | 'artists';
  genre?: string;
  duration?: 'short' | 'medium' | 'long';
  recent?: boolean;
}

interface AdvancedSearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  suggestions: string[];
  searchHistory: string[];
  onClearHistory: () => void;
  onSearch: (query: string) => void;
}

const AdvancedSearchBar = ({
  query,
  onQueryChange,
  filters,
  onFiltersChange,
  suggestions,
  searchHistory,
  onClearHistory,
  onSearch
}: AdvancedSearchBarProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearch = (searchQuery: string) => {
    onSearch(searchQuery);
    setShowSuggestions(false);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search songs, albums, artists..."
                  value={query}
                  onChange={(e) => onQueryChange(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch(query);
                    }
                  }}
                  className="pl-10"
                />
                
                {showSuggestions && (query || searchHistory.length > 0) && (
                  <Card className="absolute top-full left-0 right-0 z-50 mt-1">
                    <CardContent className="p-2">
                      {query && suggestions.length > 0 && (
                        <div className="mb-2">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Suggestions</p>
                          {suggestions.map((suggestion, index) => (
                            <Button
                              key={index}
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start text-left"
                              onClick={() => {
                                onQueryChange(suggestion);
                                handleSearch(suggestion);
                              }}
                            >
                              <Search className="h-3 w-3 mr-2" />
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      )}
                      
                      {!query && searchHistory.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs font-medium text-muted-foreground">Recent Searches</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={onClearHistory}
                              className="text-xs"
                            >
                              Clear
                            </Button>
                          </div>
                          {searchHistory.map((historyItem, index) => (
                            <Button
                              key={index}
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start text-left"
                              onClick={() => {
                                onQueryChange(historyItem);
                                handleSearch(historyItem);
                              }}
                            >
                              <Clock className="h-3 w-3 mr-2" />
                              {historyItem}
                            </Button>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
              
              <Button onClick={() => setShowFilters(!showFilters)} variant="outline">
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            {(filters.type !== 'all' || filters.genre || filters.duration || filters.recent) && (
              <div className="flex flex-wrap gap-2 mt-3">
                {filters.type !== 'all' && (
                  <Badge variant="secondary" className="capitalize">
                    {filters.type}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => onFiltersChange({ ...filters, type: 'all' })}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {filters.genre && (
                  <Badge variant="secondary">
                    {filters.genre}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => onFiltersChange({ ...filters, genre: undefined })}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {filters.duration && (
                  <Badge variant="secondary" className="capitalize">
                    {filters.duration} duration
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => onFiltersChange({ ...filters, duration: undefined })}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {filters.recent && (
                  <Badge variant="secondary">
                    Recent
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => onFiltersChange({ ...filters, recent: false })}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {showFilters && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Content Type</label>
                <Select value={filters.type} onValueChange={(value) => onFiltersChange({ ...filters, type: value as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="tracks">Tracks</SelectItem>
                    <SelectItem value="albums">Albums</SelectItem>
                    <SelectItem value="artists">Artists</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Genre</label>
                <Select value={filters.genre || 'all'} onValueChange={(value) => onFiltersChange({ ...filters, genre: value === 'all' ? undefined : value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All genres" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genres</SelectItem>
                    <SelectItem value="hymns">Hymns</SelectItem>
                    <SelectItem value="worship">Worship</SelectItem>
                    <SelectItem value="classical">Classical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Duration</label>
                <Select value={filters.duration || 'all'} onValueChange={(value) => onFiltersChange({ ...filters, duration: value === 'all' ? undefined : value as any })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any length" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Length</SelectItem>
                    <SelectItem value="short">Short (&lt; 3 min)</SelectItem>
                    <SelectItem value="medium">Medium (3-5 min)</SelectItem>
                    <SelectItem value="long">Long (&gt; 5 min)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  variant={filters.recent ? "default" : "outline"}
                  onClick={() => onFiltersChange({ ...filters, recent: !filters.recent })}
                  className="w-full"
                >
                  Recently Added
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdvancedSearchBar;
