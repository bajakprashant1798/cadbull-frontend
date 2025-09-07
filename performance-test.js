// Quick performance test for homepage
const startTime = Date.now();
console.log(`🚀 Test started at: ${new Date().toISOString()}`);

// Test API endpoints directly first
const testAPI = async () => {
  console.log(`🔍 Testing API endpoints directly...`);
  
  try {
    // Test projects API
    const projectsStart = Date.now();
    const projectsResponse = await fetch('http://localhost:5001/api/projects?page=1&pageSize=9');
    const projectsEnd = Date.now();
    console.log(`📊 Projects API: ${projectsEnd - projectsStart}ms - Status: ${projectsResponse.status}`);
    
    // Test categories API
    const categoriesStart = Date.now();
    const categoriesResponse = await fetch('http://localhost:5001/api/categories');
    const categoriesEnd = Date.now();
    console.log(`📁 Categories API: ${categoriesEnd - categoriesStart}ms - Status: ${categoriesResponse.status}`);
    
    const totalAPITime = Math.max(projectsEnd, categoriesEnd) - Math.min(projectsStart, categoriesStart);
    console.log(`⏱️  Total API Time: ${totalAPITime}ms`);
    
  } catch (error) {
    console.error(`❌ API Test Error:`, error.message);
  }
};

// Test homepage SSR
const testHomepage = async () => {
  console.log(`🏠 Testing homepage SSR...`);
  
  try {
    const homepageStart = Date.now();
    const homepageResponse = await fetch('http://localhost:3000/');
    const homepageEnd = Date.now();
    console.log(`🏠 Homepage SSR: ${homepageEnd - homepageStart}ms - Status: ${homepageResponse.status}`);
    
  } catch (error) {
    console.error(`❌ Homepage Test Error:`, error.message);
  }
};

// Run tests
testAPI().then(() => {
  return testHomepage();
}).then(() => {
  const totalTime = Date.now() - startTime;
  console.log(`🏁 All tests completed in: ${totalTime}ms`);
}).catch(console.error);
