
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import RichTextEditor from '@/components/RichTextEditor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArticleFormValues } from '../articleSchema';

interface MainArticleFieldsProps {
  form: UseFormReturn<ArticleFormValues>;
  generateSlug: () => void;
}

export const MainArticleFields: React.FC<MainArticleFieldsProps> = ({ form, generateSlug }) => {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Article Content</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter article title" {...field} />
              </FormControl>
              <FormMessage />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generateSlug}
                className="mt-2"
              >
                Generate Slug
              </Button>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="article-slug" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Excerpt</FormLabel>
              <FormControl>
                <Textarea placeholder="Brief description of the article" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <RichTextEditor value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};
