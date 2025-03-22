
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import { ApiContentWrapper } from '@/components/ApiContentWrapper';
import { ResponsiveTeamMember } from '@/components/ResponsiveTeamMember';
import { FormattedMessage } from 'react-intl';

const TeamPage: React.FC = () => {
  const { data, isLoading, error, refetch } = useTeamMembers();

  return (
    <div className="container py-8 md:py-12 px-4 md:px-6">
      <Helmet>
        <title>Notre Équipe | TopCenter</title>
        <meta name="description" content="Rencontrez notre équipe d'experts passionnés" />
      </Helmet>

      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          <FormattedMessage id="team.title" defaultMessage="Notre Équipe" />
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          <FormattedMessage 
            id="team.subtitle" 
            defaultMessage="Des experts passionnés à votre service" 
          />
        </p>
      </div>

      <ApiContentWrapper
        data={data}
        isLoading={isLoading}
        error={error}
        refetch={refetch}
        fallback={<div>Aucun membre d'équipe disponible</div>}
        loadingFallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="h-80 bg-muted rounded-lg"></div>
            ))}
          </div>
        }
      >
        {(teamMembers) => (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <ResponsiveTeamMember
                key={member.id}
                name={member.name}
                role={member.role}
                expertise={member.expertise}
                image={member.image}
                specialties={member.specialties}
                email={member.email}
                linkedin={member.linkedin}
                bio={member.bio}
              />
            ))}
          </div>
        )}
      </ApiContentWrapper>
    </div>
  );
};

export default TeamPage;
