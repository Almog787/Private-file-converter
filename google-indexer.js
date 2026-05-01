const fs = require('fs');
const { google } = require('googleapis');

async function run() {
  console.log('🚀 Starting Instant Indexing process...');
  
  try {
    // 1. שולף את המפתח הסודי מהכספת של גיטהאב
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
    
    // 2. מתחבר לשרתים של גוגל
    const jwtClient = new google.auth.JWT(
      credentials.client_email,
      null,
      credentials.private_key,['https://www.googleapis.com/auth/indexing'],
      null
    );

    await jwtClient.authorize();
    console.log('✅ Successfully authenticated with Google API');

    // 3. קורא את מפת האתר ש-Jekyll יצר הרגע
    const sitemap = fs.readFileSync('./_site/sitemap.xml', 'utf8');
    
    // 4. מחלץ את כל הכתובות מהמפה
    const urls =[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
    
    // גוגל מאשר לשלוח עד 200 בקשות ביום. אנחנו נשלח את 20 הכתובות הראשונות (שהן החדשות ביותר)
    const targetUrls = urls.slice(0, 20);

    // 5. שולח כל כתובת לגוגל
    for (const url of targetUrls) {
      await google.indexing('v3').urlNotifications.publish({
        auth: jwtClient,
        requestBody: {
          url: url,
          type: 'URL_UPDATED' // אומר לגוגל: "הדף הזה חדש או עודכן, תסרוק עכשיו"
        }
      });
      console.log(`📡 Pinged Google to index: ${url}`);
    }
    
    console.log('🎉 Instant Indexing Complete! Google is on its way.');
  } catch (error) {
    console.error('❌ Error during indexing API call:', error.message);
  }
}

run();
