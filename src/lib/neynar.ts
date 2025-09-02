import { NeynarAPIClient } from "@neynar/nodejs-sdk";

if (!process.env.NEYNAR_API_KEY) {
  throw new Error('NEYNAR_API_KEY is required');
}

export const neynar = new NeynarAPIClient(process.env.NEYNAR_API_KEY);

// Tipos para la respuesta de Neynar
export interface FarcasterUser {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl: string;
  followerCount: number;
  followingCount: number;
  bio?: string;
}

// Función para obtener datos de usuario por FID
export async function getFarcasterUser(fid: number): Promise<FarcasterUser> {
  try {
    const response = await neynar.lookupUserByFid(fid);
    const user = response.result.user;
    
    return {
      fid: user.fid,
      username: user.username,
      displayName: user.displayName,
      pfpUrl: user.pfp?.url || '',
      followerCount: user.followerCount,
      followingCount: user.followingCount,
      bio: user.profile?.bio?.text,
    };
  } catch (error) {
    console.error('Error fetching Farcaster user:', error);
    throw new Error('Failed to fetch user from Farcaster');
  }
}

// Función para verificar si un FID existe
export async function verifyFarcasterFid(fid: number): Promise<boolean> {
  try {
    await neynar.lookupUserByFid(fid);
    return true;
  } catch {
    return false;
  }
}

// Función para obtener casts recientes de un usuario
export async function getUserCasts(_fid: number, _limit: number = 10) {
  try {
    // Note: This function might need adjustment based on available API methods
    // For now, return empty array as the exact method might be different
    return [];
  } catch (error) {
    console.error('Error fetching user casts:', error);
    throw new Error('Failed to fetch user casts');
  }
}