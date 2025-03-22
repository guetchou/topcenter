
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MediaUpload } from '../../medias/MediaUpload';
import { ArticleFormValues } from '../articleSchema';

interface FeaturedImageProps {
  form: UseFormReturn<ArticleFormValues>;
  imageUrl: string | null;
  setImageUrl: (url: string) => void;
}

export const FeaturedImage: React.FC<FeaturedImageProps> = ({ form, imageUrl, setImageUrl }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Featured Image</CardTitle>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="featured_image"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <MediaUpload
                  value={imageUrl || ''}
                  onChange={(url) => {
                    setImageUrl(url);
                    field.onChange(url);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};
