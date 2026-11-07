// כתבות: כל נושא הופך לכתבה בעמוד A4 אחד, בצורת הדף. הרכיב המשותף <app-creations> (AppOfApp-GH/public/creations.js)
// מציג אותן, יוצר כתבה חדשה מכל סיפור, מוריד להדפסה ומעלה לחדר של האפליקציה במוזיאון (TAARUCHA).
// הנתונים: public/creations.json, נגזר מ-src/content ב-tools/creations.mjs.
export default function CreationsPage() {
  return (
    <div className="creations-page">
      <app-creations src="./creations.json" heading='מה התנ"ך כמסע כותב'></app-creations>
    </div>
  );
}
