'use client';

import { cn } from '@/utils';
import { X } from 'lucide-react';
import { KeyboardEvent, useCallback } from 'react';

// Constants
export const METADATA_LIMITS = {
  TITLE_MAX: 200,
  DESCRIPTION_MAX: 1000,
  TAGS_MAX: 10
} as const;

export type MetadataInputsProps = {
  title: string;
  description: string;
  tags: string[];
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onTagsChange: (tags: string[]) => void;
  disabled?: boolean;
  className?: string;
};

export const MetadataInputs = ({
  title,
  description,
  tags,
  onTitleChange,
  onDescriptionChange,
  onTagsChange,
  disabled = false,
  className
}: MetadataInputsProps) => {
  const handleTagInput = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        const input = e.currentTarget;
        const value = input.value.trim();

        if (value && !tags.includes(value) && tags.length < METADATA_LIMITS.TAGS_MAX) {
          onTagsChange([...tags, value]);
          input.value = '';
        }
      }

      if (e.key === 'Backspace' && !e.currentTarget.value && tags.length > 0) {
        onTagsChange(tags.slice(0, -1));
      }
    },
    [tags, onTagsChange]
  );

  const removeTag = useCallback(
    (tagToRemove: string) => {
      onTagsChange(tags.filter((tag) => tag !== tagToRemove));
    },
    [tags, onTagsChange]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pastedText = e.clipboardData.getData('text').trim();
      const newTags = pastedText
        .split(/[,,\n]+/)
        .map((t) => t.trim())
        .filter((t) => t && !tags.includes(t));

      const availableSlots = METADATA_LIMITS.TAGS_MAX - tags.length;
      const tagsToAdd = newTags.slice(0, availableSlots);

      if (tagsToAdd.length > 0) {
        onTagsChange([...tags, ...tagsToAdd]);
      }
    },
    [tags, onTagsChange]
  );

  return (
    <div className={cn('space-y-5', className)}>
      {/* Title Input */}
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Title <span className="text-destructive">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => {
            const value = e.target.value;
            if (value.length <= METADATA_LIMITS.TITLE_MAX) {
              onTitleChange(value);
            }
          }}
          disabled={disabled}
          placeholder="Enter pitch deck title..."
          maxLength={METADATA_LIMITS.TITLE_MAX}
          className={cn(
            'w-full px-3 py-2 text-sm rounded-md border border-input',
            'bg-background ring-offset-background',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'placeholder:text-muted-foreground'
          )}
          required
        />
        <div className="flex justify-end">
          <span
            className={cn(
              'text-xs',
              title.length > METADATA_LIMITS.TITLE_MAX * 0.9
                ? 'text-destructive'
                : 'text-muted-foreground'
            )}
          >
            {title.length}/{METADATA_LIMITS.TITLE_MAX}
          </span>
        </div>
      </div>

      {/* Description Textarea */}
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => {
            const value = e.target.value;
            if (value.length <= METADATA_LIMITS.DESCRIPTION_MAX) {
              onDescriptionChange(value);
            }
          }}
          disabled={disabled}
          placeholder="Add a brief description of your pitch deck..."
          rows={4}
          maxLength={METADATA_LIMITS.DESCRIPTION_MAX}
          className={cn(
            'w-full px-3 py-2 text-sm rounded-md border border-input',
            'bg-background ring-offset-background',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'placeholder:text-muted-foreground',
            'resize-y min-h-[100px] max-h-[200px]'
          )}
        />
        <div className="flex justify-end">
          <span
            className={cn(
              'text-xs',
              description.length > METADATA_LIMITS.DESCRIPTION_MAX * 0.9
                ? 'text-destructive'
                : 'text-muted-foreground'
            )}
          >
            {description.length}/{METADATA_LIMITS.DESCRIPTION_MAX}
          </span>
        </div>
      </div>

      {/* Tags Input */}
      <div className="space-y-2">
        <label htmlFor="tags" className="text-sm font-medium">
          Tags
        </label>
        <div
          className={cn(
            'w-full px-3 py-2 min-h-[42px] rounded-md border border-input',
            'bg-background flex flex-wrap gap-2 items-center',
            'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          {tags.map((tag) => (
            <span
              key={tag}
              className={cn(
                'inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full',
                'bg-primary/10 text-primary',
                'group'
              )}
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                disabled={disabled}
                className={cn(
                  'rounded-full p-0.5 hover:bg-primary/20',
                  'transition-colors',
                  disabled && 'cursor-not-allowed opacity-50'
                )}
                aria-label={`Remove ${tag} tag`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {tags.length < METADATA_LIMITS.TAGS_MAX && (
            <input
              id="tags"
              type="text"
              disabled={disabled}
              placeholder={tags.length === 0 ? 'Add tags (press Enter or comma)' : ''}
              onKeyDown={handleTagInput}
              onPaste={handlePaste}
              className={cn(
                'flex-1 min-w-[120px] text-sm outline-none bg-transparent',
                'placeholder:text-muted-foreground',
                disabled && 'cursor-not-allowed'
              )}
            />
          )}
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Press Enter or comma to add tags</span>
          <span className="text-xs text-muted-foreground">
            {tags.length}/{METADATA_LIMITS.TAGS_MAX}
          </span>
        </div>
      </div>
    </div>
  );
};
