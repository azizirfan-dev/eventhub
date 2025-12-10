// src/components/profile/profile-client.tsx
"use client";

import ProfileAvatarCard from "./sections/profile-avatar-card";
import ProfileInfoCard from "./sections/profile-info-card";
import ProfilePointsCard from "./sections/profile-points-card";
import ProfileReferralCard from "./sections/prodile-referral-card";
import ProfileCouponsCard from "./sections/profile-coupons-card";
import ChangePasswordModal from "./sections/change-password-dialog";

export default function ProfileClient() {
  return (
    <div className="space-y-6">
      <ProfileAvatarCard />
      <ProfileInfoCard />
      <ProfilePointsCard />
      <ProfileReferralCard />
      <ProfileCouponsCard />
      <ChangePasswordModal />
    </div>
  );
}
