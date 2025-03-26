
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import type { TeamMember } from "@/hooks/useTeamMembers";

interface TeamMemberCardProps {
  member: TeamMember;
  isActive: boolean;
}

export const TeamMemberCard = ({ member, isActive }: TeamMemberCardProps) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.03 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        transition: { delay: 0.1, duration: 0.3 } 
      }}
    >
      <Card className={`shadow-lg hover:shadow-xl transition-all duration-300 h-full ${isActive ? 'ring-2 ring-primary/30' : ''}`}>
        <CardContent className="p-6">
          <div className="aspect-square mb-4 overflow-hidden rounded-full">
            <ResponsiveImage
              src={member.image || '/placeholder.svg'}
              alt={member.name || 'Team member'}
              aspectRatio="1/1"
              objectFit="cover"
              fallback="/placeholder.svg"
            />
          </div>
          <h3 className="text-xl font-semibold mb-2">{member.name || 'Team Member'}</h3>
          {member.role && (
            <p className="text-primary font-medium mb-2">{member.role}</p>
          )}
          {member.expertise && (
            <p className="text-sm text-muted-foreground mb-4">{member.expertise}</p>
          )}
          
          {member.specialties && member.specialties.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {member.specialties.map((specialty, i) => (
                <Badge key={i} variant="secondary">
                  {specialty}
                </Badge>
              ))}
            </div>
          )}
          
          {member.email && (
            <div className="mt-4 text-sm">
              <a 
                href={`mailto:${member.email}`}
                className="text-primary hover:underline"
              >
                {member.email}
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TeamMemberCard;
