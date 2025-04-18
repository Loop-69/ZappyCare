
import { useState, useRef, useEffect } from "react";
import { CheckIcon, ChevronDownIcon, X } from "lucide-react";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Option {
  value: string;
  label: string;
}

interface CheckboxMultiSelectProps {
  options: Option[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export const CheckboxMultiSelect = ({
  options,
  selectedValues,
  onChange,
  placeholder = "Select options..."
}: CheckboxMultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [internalSelectedValues, setInternalSelectedValues] = useState<string[]>(selectedValues || []);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync internal state with prop
  useEffect(() => {
    setInternalSelectedValues(selectedValues || []);
  }, [selectedValues]);

  // Focus the search input when the popover opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (value: string) => {
    let newSelectedValues;
    
    if (internalSelectedValues.includes(value)) {
      newSelectedValues = internalSelectedValues.filter(v => v !== value);
    } else {
      newSelectedValues = [...internalSelectedValues, value];
    }
    
    setInternalSelectedValues(newSelectedValues);
    onChange(newSelectedValues);
  };

  const handleRemove = (value: string) => {
    const newValues = internalSelectedValues.filter((v) => v !== value);
    setInternalSelectedValues(newValues);
    onChange(newValues);
  };

  const clearAll = () => {
    setInternalSelectedValues([]);
    onChange([]);
  };

  const selectAll = () => {
    const allValues = filteredOptions.map(option => option.value);
    setInternalSelectedValues(allValues);
    onChange(allValues);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className="w-full justify-between h-auto min-h-10"
          onClick={() => setIsOpen(true)}
        >
          <div className="flex flex-wrap gap-1 items-center">
            {internalSelectedValues.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              <>
                {internalSelectedValues.length <= 2 ? (
                  internalSelectedValues.map((value) => {
                    const option = options.find((o) => o.value === value);
                    return (
                      <Badge 
                        key={value} 
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {option?.label}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemove(value);
                          }}
                        />
                      </Badge>
                    );
                  })
                ) : (
                  <span>{internalSelectedValues.length} selected</span>
                )}
              </>
            )}
          </div>
          <ChevronDownIcon className="h-4 w-4 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 bg-background z-50 pointer-events-auto" align="start">
        <div className="p-2">
          <Input
            ref={searchInputRef}
            placeholder="Search states..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-2"
          />
          <div className="flex justify-between mb-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={selectAll}
              className="text-xs h-7"
            >
              Select All
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearAll}
              className="text-xs h-7"
            >
              Clear All
            </Button>
          </div>
        </div>
        <ScrollArea className="h-[300px] pointer-events-auto">
          <div className="p-2">
            {filteredOptions.map((option) => (
              <div
                key={option.value}
                className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md cursor-pointer"
                onClick={() => handleSelect(option.value)}
              >
                <Checkbox
                  id={`option-${option.value}`}
                  checked={internalSelectedValues.includes(option.value)}
                  onCheckedChange={() => handleSelect(option.value)}
                />
                <label
                  htmlFor={`option-${option.value}`}
                  className="flex-1 cursor-pointer text-sm"
                >
                  {option.label}
                </label>
                {internalSelectedValues.includes(option.value) && (
                  <CheckIcon className="h-4 w-4 text-primary" />
                )}
              </div>
            ))}
            {filteredOptions.length === 0 && (
              <div className="text-center py-4 text-sm text-muted-foreground">
                No states found
              </div>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
