const prompt = `
A bankszámlakivonat szöveges tartalma a következő:

${docContent.text}

Kérlek, gyűjtsd ki a bankszámlakivonat szövegéből az összes tranzakció részleteit az alábbi mezők szerint:
- Értéknap (dátum)
- Kedvezményezett neve
- Kedvezményezett bankszámlaszáma
- Megjegyzés
- Összeg (HUF)

Figyelj a tranzakció típusára:
- Ha a tranzakció "jóváírás" (pl. GIRO átutalás jóváírása), akkor az összeg legyen pozitív.
- Ha a tranzakció "terhelés" (pl. bankkártyás vásárlás vagy átutalás terhelése), akkor az összeg legyen negatív.

Az eredményt struktúrált formában add vissza, például egy JSON objektumként, ahol minden tranzakció egy külön elem a következő formátumban:
[
  {
    "datum": "2024-09-05",
    "kedvezmenyezett": "FAKÉP BT",
    "bankszamlaszam": "HU07117050082042865900000000",
    "megjegyzes": "E-Trium-2024-247",
    "osszeg": 130510
  },
  {
    "datum": "2024-09-05",
    "kedvezmenyezett": "GEO-LOG KÖRNYEZETVÉD. ÉS GEOFIZ.KFT",
    "bankszamlaszam": "HU73117140062024733900000000",
    "megjegyzes": "E-TRIUM-2024-203 szla",
    "osszeg": 327919
  }
]

Ha egy tranzakciónál nem található meg minden adat (pl. kedvezményezett bankszámlaszám), hagyd üresen az adott mezőt. Az eredményben minden tranzakció szerepeljen!`;

const systemContent = `
Te egy mesterséges intelligenciával működő asszisztens vagy, amely segít a bankszámlakivonatokról a tranzakciókat kigyűjteni dátum, kedvezményezett neve, bankszámlaszáma, megjegyzés és összeg alapján. Az összeg legyen pozitív, ha jóváírás történt, és negatív, ha terhelés.`;

//  Figyelj a tranzakció típusára:
// - Ha a tranzakció "jóváírás", akkor az összeg legyen pozitív.
//     - Ha a tranzakció "terhelés", akkor az összeg legyen negatív.