
import { useMemo } from "react";
import { ApiContentWrapper } from "@/components/ApiContentWrapper";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { 
  TeamSectionHeader,
  TeamCarousel,
  TeamViewAllLink,
  TeamLoadingFallback
} from "@/components/team";

export const TeamSection = () => {
  // Récupération des membres de l'équipe depuis Supabase
  const { data: teamMembers, isLoading, error, refetch } = useTeamMembers();

  // Make a memoized version of the team members to avoid unnecessary re-renders
  const processedTeamMembers = useMemo(() => {
    if (!teamMembers || teamMembers.length === 0) return [];
    
    return teamMembers.map(member => ({
      ...member,
      // Ensure specialties is always an array
      specialties: Array.isArray(member.specialties) ? member.specialties : [],
      // Ensure there's always an image
      image: member.image || '/placeholder.svg'
    }));
  }, [teamMembers]);

  return (
    <section
      id="equipe"
      className="py-16 bg-muted/30"
    >
      <div className="container">
        <TeamSectionHeader 
          title="Notre Équipe d'Experts"
          subtitle="Des professionnels passionnés au service de votre satisfaction"
        />

        <ApiContentWrapper
          data={processedTeamMembers}
          isLoading={isLoading}
          error={error}
          refetch={refetch}
          emptyMessage="Aucun membre d'équipe disponible pour le moment."
          loadingFallback={<TeamLoadingFallback />}
          fallback={<div className="text-center text-muted-foreground">Aucune information sur l'équipe disponible.</div>}
        >
          {(members) => (
            <div className="relative">
              {members && members.length > 0 ? (
                <>
                  <TeamCarousel members={members} />
                  <TeamViewAllLink />
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun membre d'équipe disponible pour le moment.
                </div>
              )}
            </div>
          )}
        </ApiContentWrapper>
      </div>
    </section>
  );
};
