import React from 'react';
import { Shield, User, Eye, Syringe } from 'lucide-react';

interface RoleAssignmentProps {
  role: string;
}

const RoleAssignment: React.FC<RoleAssignmentProps> = ({ role }) => {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'werewolf':
        return <Shield className="text-red-500" />;
      case 'seer':
        return <Eye className="text-purple-500" />;
      case 'doctor':
        return <Syringe className="text-green-500" />;
      default:
        return <User className="text-blue-500" />;
    }
  };

  return (
    <div className="mb-4">
      <h3 className="text-xl font-semibold mb-2">Your Role</h3>
      <div className="flex items-center">
        {getRoleIcon(role)}
        <span className="ml-2 capitalize">{role}</span>
      </div>
    </div>
  );
};

export default RoleAssignment;