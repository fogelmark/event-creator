## 🚀 Git Cheat Sheet för projektet

En steg-för-steg guide för hur vi hanterar kod och branches.

---

### 🔄 1. Hämta senaste koden
Innan du börjar koda för dagen, eller innan du skapar en ny branch, är det viktigt att ha den senaste versionen.

* **Kolla efter uppdateringar på GitHub (utan att ändra din lokala kod):**
  `git fetch`

* **Hämta och ladda ner de senaste ändringarna till din dator:**
  `git pull`

---

### 🔍 2. Kolla dina ändringar
Innan du sparar kan det vara bra att se vad du faktiskt har ändrat.

* **Se exakt vilka kodrader som lagts till eller tagits bort:**
  `git diff`

---

### 📦 3. Spara och skicka ändringar (Standard flow)
När du har gjort ändringar i koden och vill skicka upp dem till GitHub:

1. **Välj vilka filer som ska med:**
   - För specifika filer: `git add filnamn.js`
   - För ALLA ändrade filer: `git add .`

2. **Skapa en commit (en sparfil):**
   `git commit -m "Kort beskrivning av vad du ändrat"`

3. **Skicka upp till GitHub:**
   `git push`

---

### 🌿 4. Jobba med Branches
Vi skapar alltid en ny branch när vi bygger nya funktioner för att inte riskera att förstöra huvudkoden.

* **Se en lista på alla dina lokala branches:**
  `git branch`

* **Skapa och byt till en ny branch direkt:**
  `git checkout -b <branch-namn>`

* **Byt till en befintlig branch:**
  `git checkout <branch-namn>`

* **Publicera din nya branch på GitHub (första gången):**
  `git push -u origin <branch-namn>`


### 🛠 6. Justera och Städa

* **Glömt något? Bygg på senaste commiten:**
  Om du precis gjort en commit men glömde en fil eller vill ändra meddelandet:
  `git commit --amend --no-edit`

* **Ta bort en branch (när den är mergad och klar):**
  `git branch -d <branch-namn>`

* **Tvinga borttagning (om branchen inte är mergad):**
  `git branch -D <branch-namn>`

---

> **Pro-tip:** Kör `git status` ofta för att se vilka filer som är "trackade" och vilken branch du befinner dig på just nu.