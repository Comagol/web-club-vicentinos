import React from 'react';
import { User } from 'lucide-react';

interface ProfileAvatarProps {
  name?: string;
  email?: string;
  imageUrl?: string | null;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  name,
  email,
  imageUrl,
}) => {
  // Extract initials from name or email
  const getInitials = (): string => {
    if (name) {
      return name
        .split(' ')
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('');
    }
    if (email) {
      return email.charAt(0).toUpperCase();
    }
    return '?';
  };

  const initials = getInitials();

  return (
    <div className="flex flex-col items-center">
      <div className="w-20 h-20 rounded-full bg-neutral-200 flex items-center justify-center overflow-hidden border-2 border-neutral-300">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name || 'User avatar'}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-navy-100 to-navy-50">
            {initials.length > 0 && initials !== '?' ? (
              <span className="text-lg font-700 text-navy-800">{initials}</span>
            ) : (
              <User size={32} className="text-navy-400" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
