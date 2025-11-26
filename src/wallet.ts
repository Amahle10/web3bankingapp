// src/wallet.ts
export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  walletAddress: string;
  balance: number;
}

export const fetchProfile = async (token: string): Promise<UserProfile> => {
  const res = await fetch("http://localhost:5000/api/users/profile", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch profile");
  }

  const data = await res.json();
  return data.user; // matches backend { success, user }
};
