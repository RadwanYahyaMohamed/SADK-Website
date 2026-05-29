// questions.js - بنك الأسئلة الكامل لمستويات A1, A2, B1

export const LEVELS_DB = {
    A1: { id: "A1", name: "A1 - Beginner", requires: null, xpPerExam: 50 },
    A2: { id: "A2", name: "A2 - Elementary", requires: "A1", xpPerExam: 50 },
    B1: { id: "B1", name: "B1 - Intermediate", requires: "A2", xpPerExam: 50 }
  };
  
  export const EXAMS_POOL = {
    A1: [
      // Exam 1
      [
        { q: "Wie heißt du?", o: ["Ich heiße Ahmet.", "Ich bin 20 Jahre alt.", "Aus Ägypten.", "Guten Tag."], c: 0 },
        { q: "Wie geht es dir?", o: ["Ich wohne hier.", "Gut, danke!", "Ich bin Lehrer.", "Auf Wiedersehen."], c: 1 },
        { q: "Woher kommst du?", o: ["Nach Berlin.", "In Kairo.", "Aus Ägypten.", "Seit gestern."], c: 2 },
        { q: "Was spielst du?", o: ["Ich spiele Fußball.", "Ich spiele Apfel.", "Ich spiele Deutsch.", "Ich spiele Auto."], c: 0 },
        { q: "Sprechen Sie Deutsch?", o: ["Nein, Brot.", "Ja, ein bisschen.", "Ich wohne in Asyut.", "Guten Morgen."], c: 1 }
      ],
      // Exam 2
      [
        { q: "Welche Farbe hat die Banane?", o: ["Rot", "Blau", "Gelb", "Grün"], c: 2 },
        { q: "Was ist ein Apfel?", o: ["Ein Obst", "Ein Gemüse", "Ein Auto", "Ein Tier"], c: 0 },
        { q: "Wie spät ist es? (14:00)", o: ["Es ist zwei Uhr.", "Es ist vier Uhr.", "Es ist zehn Uhr.", "Es ist zwölf Uhr."], c: 0 },
        { q: "Was trinkst du gerne?", o: ["Ich trinke Pizza.", "Ich trinke Wasser.", "Ich trinke Brot.", "Ich trinke Fleisch."], c: 1 },
        { q: "Der Vater von meinem Vater ist mein...", o: ["Bruder", "Onkel", "Großvater", "Cousin"], c: 2 }
      ],
      // Exam 3
      [
        { q: "Ich ___ aus Ägypten.", o: ["bin", "komme", "wohne", "heiße"], c: 1 },
        { q: "Das ___ mein Freund.", o: ["ist", "sind", "bist", "habe"], c: 0 },
        { q: "Wo ___ du?", o: ["wohnt", "wohnst", "wohnen", "wohne"], c: 1 },
        { q: "Wir ___ Deutsch lernen.", o: ["wollen", "will", "wollst", "wollt"], c: 0 },
        { q: "___ du ein Auto?", o: ["Hast", "Bist", "Hat", "Habt"], c: 0 }
      ],
      // Exam 4
      [
        { q: "Das Auto ist ___ (السيارة سريعة).", o: ["langsam", "schnell", "schön", "alt"], c: 1 },
        { q: "Mein Bruder hat ___ Hund.", o: ["einen", "ein", "eine", "einem"], c: 0 },
        { q: "Hier darf man nicht rauchen. Es ist ___.", o: ["erlaubt", "verboten", "gut", "wichtig"], c: 1 },
        { q: "Ich gehe ___ Bett.", o: ["in", "zu", "ins", "nach"], c: 2 },
        { q: "___ Buch ist sehr interessant.", o: ["Das", "Der", "Die", "Den"], c: 0 }
      ],
      // Exam 5
      [
        { q: "Was ist das Gegenteil von 'groß'?", o: ["klein", "lang", "breit", "hoch"], c: 0 },
        { q: "Ich kaufe ___ Tomaten.", o: ["einen", "eine", "---", "ein"], c: 2 },
        { q: "Wir fahren ___ Berlin.", o: ["nach", "in", "zu", "aus"], c: 0 },
        { q: "Am Sonntag ___ ich nicht.", o: ["arbeite", "arbeitest", "arbeiten", "arbeitet"], c: 0 },
        { q: "Die Frau gibt ___ Kind einen Apfel.", o: ["dem", "der", "das", "den"], c: 0 }
      ],
      // Exam 6
      [
        { q: "Wie alt bist du?", o: ["Ich bin Schüler.", "Ich bin 17 Jahre alt.", "Ich komme aus Asyut.", "Mir geht's gut."], c: 1 },
        { q: "Kommst du mit?", o: ["Ja, ich komme mit.", "Nein, ich wohne hier.", "Ich bin müde.", "Gute Nacht."], c: 0 },
        { q: "Ich habe Hunger. Ich möchte etwas ___.", o: ["trinken", "essen", "schlafen", "spielen"], c: 1 },
        { q: "Wo ist die Milch? Im ___.", o: ["Kühlschrank", "Bett", "Auto", "Garten"], c: 0 },
        { q: "Das Wetter ist heute sehr schön, die ___ scheint.", o: ["Regen", "Sonne", "Mond", "Wolke"], c: 1 }
      ],
      // Exam 7
      [
        { q: "___ Tasche ist das?", o: ["Wessen", "Wer", "Was", "Wie"], c: 0 },
        { q: "Ich trinke Kaffee ___ Milch.", o: ["mit", "ohne", "gegen", "für"], c: 0 },
        { q: "Er ___ jeden Tag Fußball.", o: ["spielst", "spielt", "spielen", "gespielt"], c: 1 },
        { q: "Gestern ___ ich im Kino.", o: ["war", "bin", "habe", "wurde"], c: 0 },
        { q: "Ich muss morgen früh ___.", o: ["aufstehen", "aufsteht", "aufgestanden", "stehe auf"], c: 0 }
      ],
      // Exam 8
      [
        { q: "Welcher Monat kommt nach Januar?", o: ["März", "Februar", "April", "Mai"], c: 1 },
        { q: "Das Hemd kostet 20 ___.", o: ["Euro", "Kilo", "Meter", "Uhr"], c: 0 },
        { q: "Ich verstehe das Wort ___.", o: ["nicht", "kein", "nein", "nichts"], c: 0 },
        { q: "Können Sie mir bitte ___?", o: ["helfen", "hilft", "helft", "geholfen"], c: 0 },
        { q: "Ich wohne ___ einem Haus.", o: ["in", "bei", "zu", "an"], c: 0 }
      ],
      // Exam 9
      [
        { q: "Was macht ein Lehrer?", o: ["Er unterrichtet.", "Er kocht.", "Er repariert Autos.", "Er verkauft Brot."], c: 0 },
        { q: "Ich habe zwei ___.", o: ["Bruder", "Brüder", "Schwester", "Kind"], c: 1 },
        { q: "Die Schule beginnt ___ 8 Uhr.", o: ["um", "am", "im", "von"], c: 0 },
        { q: "Er lernt Deutsch, ___ er in Deutschland studieren will.", o: ["weil", "aber", "oder", "und"], c: 0 },
        { q: "Gute Nacht! Schlaf ___.", o: ["gut", "schön", "langsam", "schnell"], c: 0 }
      ],
      // Exam 10
      [
        { q: "Mein Hobby ist ___.", o: ["Lesen", "Liest", "Lese", "Gelesen"], c: 0 },
        { q: "Wir haben ein ___ Haus.", o: ["schönes", "schöne", "schönen", "schöner"], c: 0 },
        { q: "Nimmst du den Bus? Ja, ich fahre ___ dem Bus.", o: ["mit", "in", "auf", "zu"], c: 0 },
        { q: "Ich möchte einen Saft ___ (من فضلك).", o: ["bitte", "danke", "tschüss", "hallo"], c: 0 },
        { q: "Herzlichen ___ zum Geburtstag!", o: ["Glückwunsch", "Dank", "Gruß", "Tag"], c: 0 }
      ]
    ],
    A2: [
      // Exam 1
      [
        { q: "Als ich ein Kind war, ___ ich viel draußen gespielt.", o: ["habe", "bin", "war", "wurde"], c: 0 },
        { q: "Wenn es regnet, ___ wir zu Hause.", o: ["bleiben", "geblieben", "blieben", "bleibt"], c: 0 },
        { q: "Ich interessiere mich ___ diesen Sprachkurs.", o: ["für", "über", "an", "auf"], c: 0 },
        { q: "Das ist der Mann, ___ gestern hier war.", o: ["der", "den", "dem", "dessen"], c: 0 },
        { q: "Ich fahre mit dem Auto, ___ es schneller ist.", o: ["weil", "denn", "deshalb", "obwohl"], c: 0 }
      ],
      // Exam 2
      [
        { q: "Morgen ___ ich meine Großeltern besuchen.", o: ["werde", "wird", "wollen", "habe"], c: 0 },
        { q: "Ich habe mein Buch im Bus ___.", o: ["vergessen", "vergesst", "verlieren", "verpasst"], c: 0 },
        { q: "Könntest du mir bitte das Salz ___?", o: ["geben", "gibst", "gegeben", "gab"], c: 0 },
        { q: "Der Kaffee ist mir zu heiß, ich warte ein ___.", o: ["wenig", "viel", "ganz", "schnell"], c: 0 },
        { q: "Trotz ___ Regens sind wir spazieren gegangen.", o: ["des", "dem", "den", "der"], c: 0 }
      ],
      // Exam 3
      [
        { q: "Ich freue mich ___ den Urlaub nächste Woche.", o: ["auf", "über", "an", "für"], c: 0 },
        { q: "Hier ist das Geld, ___ du mir geliehen hast.", o: ["das", "die", "den", "dem"], c: 1 },
        { q: "Er hat angerufen, ___ mich einzuladen.", o: ["um", "ohne", "statt", "weil"], c: 0 },
        { q: "Je mehr ich lerne, ___ besser verstehe ich.", o: ["desto", "um", "wie", "als"], c: 0 },
        { q: "Ich weiß nicht, ___ er heute kommt.", o: ["ob", "dass", "weil", "wenn"], c: 0 }
      ],
      // Exam 4
      [
        { q: "Das Zimmer wird vom Vater ___.", o: ["aufgeräumt", "aufräumen", "aufzuräumen", "räumt auf"], c: 0 },
        { q: "Ich danke dir ___ deine Hilfe.", o: ["für", "von", "zu", "über"], c: 0 },
        { q: "Wir wohnen seit ___ Jahr in dieser Wohnung.", o: ["einem", "eines", "einen", "ein"], c: 0 },
        { q: "Können wir den Termin ___ nächsten Dienstag verschieben?", o: ["auf", "an", "zu", "in"], c: 0 },
        { q: "Das Kleid passt ___ gut.", o: ["mir", "mich", "mein", "meine"], c: 0 }
      ],
      // Exam 5
      [
        { q: "Er spricht besser Deutsch ___ sein Bruder.", o: ["als", "wie", "denn", "so"], c: 0 },
        { q: "Ich erinnere mich nicht ___ unseren letzten Urlaub.", o: ["an", "auf", "über", "von"], c: 0 },
        { q: "Komm bitte pünktlich, ___ wir den Zug nicht verpassen.", o: ["damit", "weil", "um", "dass"], c: 0 },
        { q: "Die Kinder spielen ___ dem Garten.", o: ["in", "auf", "an", "zu"], c: 0 },
        { q: "Frau Müller, dürfen wir ___ etwas fragen?", o: ["Sie", "Ihnen", "du", "ihr"], c: 0 }
      ],
      // Exam 6
      [
        { q: "Er ist gestern spät ___.", o: ["angekommen", "ankommen", "ankommt", "kam an"], c: 0 },
        { q: "Ich denke oft ___ meine Familie in der Heimat.", o: ["an", "über", "auf", "nach"], c: 0 },
        { q: "Das Kind läuft ___ die Straße.", o: ["über", "durch", "an", "bei"], c: 0 },
        { q: "Entschuldigung, wie komme ich ___ Bahnhof?", o: ["zum", "zur", "nach", "in"], c: 0 },
        { q: "Er arbeitet als Ingenieur ___ einer großen Firma.", o: ["bei", "in", "zu", "an"], c: 0 }
      ],
      // Exam 7
      [
        { q: "Ich habe mir den Fuß ___ beim Fußballspielen.", o: ["verletzt", "wehgetan", "gebrochen", "krank"], c: 0 },
        { q: "Wir haben uns lange nicht mehr ___.", o: ["gesehen", "sehen", "sieht", "sah"], c: 0 },
        { q: "Sie können entweder bar ___ mit Karte zahlen.", o: ["oder", "und", "aber", "sondern"], c: 0 },
        { q: "Der Film war so langweilig, dass ich ___ bin.", o: ["eingeschlafen", "aufgewacht", "gegangen", "müde"], c: 0 },
        { q: "Ich würde gerne ein Auto kaufen, aber ich habe kein Geld ___.", o: ["dafür", "damit", "darüber", "davon"], c: 0 }
      ],
      // Exam 8
      [
        { q: "Gefällt dir das rote Kleid? - Nein, das blaue ist ___.", o: ["schöner", "schön", "am schönsten", "schöne"], c: 0 },
        { q: "Ich bringe dir morgen das Buch ___.", o: ["mit", "nach", "zu", "an"], c: 0 },
        { q: "Er hat mir ___ (وعد) morgen zu helfen.", o: ["versprochen", "gesagt", "gefragt", "erklärt"], c: 0 },
        { q: "Wir müssen uns beeilen, ___ schließt das Geschäft.", o: ["sonst", "dann", "deshalb", "weil"], c: 1 },
        { q: "Darf ich mein Fahrrad ___ die Wand stellen?", o: ["an", "auf", "in", "über"], c: 0 }
      ],
      // Exam 9
      [
        { q: "Ich habe den Bus verpasst, ___ musste ich zu Fuß gehen.", o: ["deshalb", "weil", "obwohl", "trotzdem"], c: 0 },
        { q: "Möchtest du ein Stück Kuchen? - Nein danke, ich bin ___.", o: ["satt", "voll", "hungrig", "müde"], c: 0 },
        { q: "Er wohnt im ___ Stock dieses Hauses.", o: ["dritten", "drei", "dreimal", "dritter"], c: 0 },
        { q: "Meine Schwester interessiert sich sehr ___ Kunst.", o: ["für", "an", "über", "auf"], c: 0 },
        { q: "Wir haben beschlossen, am Wochenende ___ Meer zu fahren.", o: ["ans", "zum", "nach", "ins"], c: 0 }
      ],
      // Exam 10
      [
        { q: "Er lernt sehr fleißig, ___ die Prüfung zu bestehen.", o: ["um", "damit", "weil", "dass"], c: 0 },
        { q: "Ich habe meine Brille überall gesucht, aber ich kann sie nicht ___.", o: ["finden", "suchen", "sehen", "verlieren"], c: 0 },
        { q: "Das Restaurant, ___ wir gestern gegessen haben, war ausgezeichnet.", o: ["in dem", "wo", "das", "da"], c: 0 },
        { q: "Können Sie mir sagen, wo die Post ___?", o: ["ist", "liegt", "befindet", "wohnt"], c: 0 },
        { q: "Ich wünsche dir viel ___ bei der Arbeit!", o: ["Erfolg", "Glück", "Spaß", "Freude"], c: 0 }
      ]
    ],
    B1: [
      // Exam 1
      [
        { q: "Obwohl das Wetter schlecht war, ___ wir wandern gegangen.", o: ["sind", "haben", "wurden", "waren"], c: 0 },
        { q: "Er tut so, als ob er alles ___.", o: ["wüsste", "weiß", "wissen", "gewusst hätte"], c: 0 },
        { q: "Es wäre schön, wenn du morgen kommen ___.", o: ["könntest", "kannst", "konntest", "gekonnt hättest"], c: 0 },
        { q: "Die Entscheidung hängt ___ den finanziellen Mitteln ab.", o: ["von", "an", "auf", "über"], c: 0 },
        { q: "Nachdem er das Studium beendet ___, fand er schnell einen Job.", o: ["hatte", "hat", "wurde", "war"], c: 0 }
      ],
      // Exam 2
      [
        { q: "Ich freue mich schon darauf, dich bald wieder ___.", o: ["zusehen", "zu sehen", "sehen", "gesehen zu haben"], c: 1 },
        { q: "Das Haus, dessen Dach kaputt ist, gehört ___ Onkel.", o: ["meinem", "meinen", "meiner", "mein"], c: 0 },
        { q: "Je intensiver wir das Problem diskutieren, ___ klarer wird die Lösung.", o: ["desto", "umso", "je", "wie"], c: 0 },
        { q: "Wir sollten alternative Energien nutzen, ___ die Umwelt zu schonen.", o: ["um", "damit", "weil", "ohne"], c: 0 },
        { q: "Er hat die Prüfung bestanden, ohne viel gelernt zu ___.", o: ["haben", "sein", "werden", "tun"], c: 0 }
      ],
      // Exam 3
      [
        { q: "Das Auto, ___ ich mir letzte Woche gekauft habe, verbraucht sehr wenig Benzin.", o: ["das", "welches", "was", "womit"], c: 0 },
        { q: "Ich kann mich einfach nicht ___ das neue Klima gewöhnen.", o: ["an", "auf", "über", "zu"], c: 0 },
        { q: "Sie hat mir versprochen, mir bei den Hausaufgaben zu ___.", o: ["helfen", "hilft", "geholfen", "helft"], c: 0 },
        { q: "Es ist wichtig, dass wir uns rechtzeitig über die Bedingungen ___.", o: ["informieren", "informiert", "zu informieren", "informieren zu müssen"], c: 0 },
        { q: "Trotz ___ starken Regens fand das Fußballspiel statt.", o: ["des", "dem", "den", "der"], c: 0 }
      ],
      // Exam 4
      [
        { q: "Die Stadt, in ___ ich aufgewachsen bin, hat sich sehr verändert.", o: ["der", "die", "den", "dem"], c: 0 },
        { q: "Wenn ich mehr Zeit gehabt hätte, ___ ich dich besucht.", o: ["hätte", "wäre", "habe", "bin"], c: 0 },
        { q: "Es wird erwartet, dass die Preise im nächsten Jahr weiter ___.", o: ["steigen", "steigt", "gestiegen", "zu steigen"], c: 0 },
        { q: "Er hat sich ___ den angebotenen Arbeitsplatz entschieden.", o: ["für", "gegen", "über", "an"], c: 0 },
        { q: "Wir haben uns darauf geeinigt, das Treffen auf nächsten Monat zu ___.", o: ["verschieben", "verschoben", "verschiebt", "zu verschieben"], c: 0 }
      ],
      // Exam 5
      [
        { q: "Er hat das Rätsel gelöst, ___ er lange nachgedacht hat.", o: ["indem", "dadurch", "weil", "obwohl"], c: 0 },
        { q: "Das ist die beste Lösung, ___ ich je gehört habe.", o: ["die", "das", "von der", "worüber"], c: 0 },
        { q: "Ich schlage vor, dass wir eine Pause ___.", o: ["machen", "macht", "gemacht", "zu machen"], c: 0 },
        { q: "Er ist stolz ___ seine sportlichen Erfolge.", o: ["auf", "über", "für", "von"], c: 0 },
        { q: "Es ist unhöflich, andere Leute beim Sprechen zu ___.", o: ["unterbrechen", "stören", "nerven", "beenden"], c: 0 }
      ],
      // Exam 6
      [
        { q: "Es ist noch unsicher, ___ das Projekt finanziert werden kann.", o: ["wie", "dass", "obwohl", "damit"], c: 0 },
        { q: "Sie hat sich sehr ___ das schöne Geschenk gefreut.", o: ["über", "auf", "für", "von"], c: 0 },
        { q: "Das neue Gesetz tritt ab ___ nächsten Monat in Kraft.", o: ["dem", "des", "den", "der"], c: 0 },
        { q: "Ich bin fest davon überzeugt, dass wir unser Ziel ___ werden.", o: ["erreichen", "erreicht", "erreicht haben", "zu erreichen"], c: 0 },
        { q: "Er hat die Arbeit rechtzeitig fertiggestellt, ___ er krank war.", o: ["obwohl", "weil", "trotzdem", "denn"], c: 0 }
      ],
      // Exam 7
      [
        { q: "Das Gemälde wurde von einem berühmten Künstler ___.", o: ["gemalt", "malen", "gemalt werden", "malt"], c: 0 },
        { q: "Ich habe mich dazu entschlossen, einen Fortsetzungskurs zu ___.", o: ["belegen", "belegt", "zu belegen", "belegen zu wollen"], c: 0 },
        { q: "Wir bedanken uns bei Ihnen ___ das entgegengebrachte Vertrauen.", o: ["für", "von", "wegen", "über"], c: 0 },
        { q: "Je früher wir aufbrechen, ___ weniger Stau werden wir haben.", o: ["desto", "umso", "je", "wie"], c: 0 },
        { q: "Er spricht fließend Englisch, als ob es seine Muttersprache ___.", o: ["wäre", "ist", "sei", "wird"], c: 0 }
      ],
      // Exam 8
      [
        { q: "Es handelt sich ___ ein Missverständnis, das schnell geklärt werden kann.", o: ["um", "von", "über", "an"], c: 0 },
        { q: "Ich erinnere mich gerne ___ meine Schulzeit zurück.", o: ["an", "auf", "über", "von"], c: 0 },
        { q: "Das Buch war so fesselnd, dass ich es nicht mehr aus der Hand ___ konnte.", o: ["legen", "legen konnte", "gelegt", "legt"], c: 0 },
        { q: "Wir haben vereinbart, die Aufgaben gerecht unter uns zu ___.", o: ["teilen", "verteilen", "zu teilen", "aufzuteilen"], c: 1 },
        { q: "Trotz ___ Bemühungen konnte das Ziel nicht erreicht werden.", o: ["aller", "allen", "allem", "alle"], c: 0 }
      ],
      // Exam 9
      [
        { q: "Es ist ratsam, vor einer langen Reise das Auto gründlich ___ zu lassen.", o: ["überprüfen", "überprüft", "zu überprüfen", "überprüfen zu müssen"], c: 0 },
        { q: "Er hat sich ___ die neue Stelle beworben, die in der Zeitung ausgeschrieben war.", o: ["um", "für", "auf", "an"], c: 0 },
        { q: "Die Firma legt großen Wert ___ die Zufriedenheit ihrer Kunden.", o: ["auf", "für", "an", "über"], c: 0 },
        { q: "Ich bedauere es sehr, dir bei dieser Angelegenheit nicht helfen zu ___.", o: ["können", "gekonnt", "kannst", "zu können"], c: 0 },
        { q: "Nachdem das Problem gelöst ___ war, konnten wir beruhigt nach Hause gehen.", o: ["worden", "gewesen", "wurde", "war"], c: 0 }
      ],
      // Exam 10
      [
        { q: "Es ist offensichtlich, dass das System dringend ___ werden muss.", o: ["verbessert", "verbessern", "verbessert zu werden", "verbessert werden"], c: 3 },
        { q: "Ich bin mir nicht ganz sicher, ___ dieses Wort in diesem Kontext richtig verwendet wird.", o: ["ob", "dass", "wie", "weil"], c: 0 },
        { q: "Wir freuen uns schon sehr ___ die bevorstehenden Feiertage.", o: ["auf", "über", "für", "von"], c: 0 },
        { q: "Er hat die schwierige Aufgabe gelöst, ___ er alle Anweisungen genau befolgt hat.", o: ["indem", "dadurch", "weil", "obwohl"], c: 0 },
        { q: "Ich möchte mich bei Ihnen ___ die freundliche Unterstützung bedanken.", o: ["für", "von", "wegen", "über"], c: 0 }
      ]
    ]
  };