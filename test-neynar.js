// Simple test script to verify Neynar integration
import { getFarcasterUser, verifyFarcasterFid } from './src/lib/neynar.js';

async function testNeynar() {
  console.log('🧪 Testing Neynar Integration...\n');
  
  try {
    // Test with a known Farcaster user (FID 3 is dwr.eth, one of the Farcaster founders)
    const testFid = 3;
    
    console.log(`1. Testing verifyFarcasterFid with FID ${testFid}...`);
    const userExists = await verifyFarcasterFid(testFid);
    console.log(`   ✅ User exists: ${userExists}\n`);
    
    if (userExists) {
      console.log(`2. Testing getFarcasterUser with FID ${testFid}...`);
      const user = await getFarcasterUser(testFid);
      console.log('   ✅ User data retrieved:');
      console.log(`   - FID: ${user.fid}`);
      console.log(`   - Username: ${user.username}`);
      console.log(`   - Display Name: ${user.displayName}`);
      console.log(`   - Followers: ${user.followerCount}`);
      console.log(`   - Following: ${user.followingCount}`);
      console.log(`   - Bio: ${user.bio || 'No bio'}`);
      console.log(`   - Profile Picture: ${user.pfpUrl ? 'Yes' : 'No'}\n`);
    }
    
    console.log('3. Testing with invalid FID...');
    const invalidExists = await verifyFarcasterFid(999999999);
    console.log(`   ✅ Invalid user exists: ${invalidExists}\n`);
    
    console.log('🎉 All Neynar tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testNeynar();