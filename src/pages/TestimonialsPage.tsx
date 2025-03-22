
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTestimonials } from '@/hooks/useTestimonials';
import { ApiContentWrapper } from '@/components/ApiContentWrapper';
import { ResponsiveTestimonialCard } from '@/components/ResponsiveTestimonialCard';
import { FormattedMessage } from 'react-intl';
import { useIsMobile } from '@/hooks/use-mobile';

const TestimonialsPage: React.FC = () => {
  const { data, isLoading, error, refetch } = useTestimonials();
  const isMobile = useIsMobile();

  return (
    <div className="container py-8 md:py-12 px-4 md:px-6">
      <Helmet>
        <title>Témoignages | TopCenter</title>
        <meta name="description" content="Découvrez ce que nos clients disent de nos services" />
      </Helmet>

      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          <FormattedMessage id="testimonials.title" defaultMessage="Ce que nos clients disent" />
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          <FormattedMessage 
            id="testimonials.subtitle" 
            defaultMessage="Découvrez pourquoi les entreprises nous font confiance" 
          />
        </p>
      </div>

      <ApiContentWrapper
        data={data}
        isLoading={isLoading}
        error={error}
        refetch={refetch}
        fallback={<div>Aucun témoignage disponible</div>}
        loadingFallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-64 bg-muted rounded-lg"></div>
            ))}
          </div>
        }
      >
        {(testimonials) => (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <ResponsiveTestimonialCard
                key={testimonial.id}
                name={testimonial.name}
                role={testimonial.role}
                company={testimonial.company}
                content={testimonial.content}
                rating={testimonial.rating}
                avatarUrl={testimonial.avatar_url}
              />
            ))}
          </div>
        )}
      </ApiContentWrapper>
    </div>
  );
};

export default TestimonialsPage;
