import React, { useState, useEffect } from 'react';
import { PortalLayout } from '../../components/portal/PortalLayout';
import { ProfileAvatar } from '../../components/portal/ProfileAvatar';
import { ProfileForm, ProfileData } from '../../components/portal/ProfileForm';
import { useAuth } from '../../hooks/useAuth';

// Mock profile data - will be replaced with real API in Task 2.5
const getMockProfile = (email: string): ProfileData => {
  const displayName = email.split('@')[0];
  const capitalizedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);

  return {
    id: '1',
    nombre: capitalizedName,
    email: email,
    telefono: '+549876543210',
    categoria: 'adulto',
    disciplina: 'rugby',
    numeroSocio: 'SOC-2024-0001',
    avatar: null,
    fechaAlta: '2024-01-15',
  };
};

export const ProfilePage: React.FC = () => {
  const { usuario } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  useEffect(() => {
    // Initialize profile data from usuario or mock data
    if (usuario?.email) {
      const mockProfile = getMockProfile(usuario.email);
      setProfileData(mockProfile);
    }
  }, [usuario]);

  const handleSaveProfile = async (updatedData: ProfileData): Promise<void> => {
    // Mock save - will be replaced with real API call in Task 2.5
    return new Promise((resolve) => {
      // Simulate API call delay
      setTimeout(() => {
        setProfileData(updatedData);
        resolve();
      }, 500);
    });
  };

  if (!profileData) {
    return (
      <PortalLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-600">Cargando perfil...</p>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-3xl font-700 text-navy-800 mb-2">Mi Perfil</h1>
          <p className="text-neutral-600">
            Visualiza y edita tu información de perfil
          </p>
        </div>

        {/* Avatar Section */}
        <div className="bg-white border-[0.5px] border-neutral-300 rounded-lg p-6 md:p-8">
          <ProfileAvatar
            name={profileData.nombre}
            email={profileData.email}
            imageUrl={profileData.avatar}
          />
        </div>

        {/* Profile Form Section */}
        <ProfileForm
          profileData={profileData}
          onSave={handleSaveProfile}
        />
      </div>
    </PortalLayout>
  );
};
