const words = [{
    "infinitive": "inventar",
    "infinitive_english": "to invent",
    "mood": "Indicativo",
    "mood_english": "Indicative",
    "tense": "Presente",
    "tense_english": "Present",
    "verb_english": "I invent, am inventing",
    "form_1s": "invento",
    "form_2s": "inventas",
    "form_3s": "inventa",
    "form_1p": "inventamos",
    "form_2p": "inventáis",
    "form_3p": "inventan",
    "gerund": "inventando",
    "gerund_english": "inventing",
    "pastparticiple": "inventado",
    "pastparticiple_english": "invented"
  },
  {
    "infinitive": "despertarse",
    "infinitive_english": "to wake up, lie down",
    "mood": "Indicativo",
    "mood_english": "Indicative",
    "tense": "Presente",
    "tense_english": "Present",
    "verb_english": "I wake up, am waking up",
    "form_1s": "me despierto",
    "form_2s": "te despiertas",
    "form_3s": "se despierta",
    "form_1p": "nos despertamos",
    "form_2p": "os despertáis",
    "form_3p": "se despiertan",
    "gerund": "despertándose",
    "gerund_english": "waking up",
    "pastparticiple": "despertado",
    "pastparticiple_english": "waken up"
  },
  {
    "infinitive": "lamentar",
    "infinitive_english": "to lament, regret, feel sorry about",
    "mood": "Indicativo",
    "mood_english": "Indicative",
    "tense": "Presente",
    "tense_english": "Present",
    "verb_english": "I lament, am lamenting",
    "form_1s": "lamento",
    "form_2s": "lamentas",
    "form_3s": "lamenta",
    "form_1p": "lamentamos",
    "form_2p": "lamentáis",
    "form_3p": "lamentan",
    "gerund": "lamentando",
    "gerund_english": "lamenting",
    "pastparticiple": "lamentado",
    "pastparticiple_english": "lamented"
  },
  {
    "infinitive": "aceptar",
    "infinitive_english": "to accept, approve; to agree to",
    "mood": "Indicativo",
    "mood_english": "Indicative",
    "tense": "Presente",
    "tense_english": "Present",
    "verb_english": "I accept, am accepting",
    "form_1s": "acepto",
    "form_2s": "aceptas",
    "form_3s": "acepta",
    "form_1p": "aceptamos",
    "form_2p": "aceptáis",
    "form_3p": "aceptan",
    "gerund": "aceptando",
    "gerund_english": "accepting",
    "pastparticiple": "aceptado",
    "pastparticiple_english": "accepted"
  },
  {
    "infinitive": "callar",
    "infinitive_english": "to keep quiet about, pass over in silence; to hush",
    "mood": "Indicativo",
    "mood_english": "Indicative",
    "tense": "Presente",
    "tense_english": "Present",
    "verb_english": "I keep quiet about, am keeping quiet about",
    "form_1s": "callo",
    "form_2s": "callas",
    "form_3s": "calla",
    "form_1p": "callamos",
    "form_2p": "calláis",
    "form_3p": "callan",
    "gerund": "callando",
    "gerund_english": "keeping quiet about",
    "pastparticiple": "callado",
    "pastparticiple_english": "kept quiet about"
  }]
// 5 initial words^


db.createUser({
    user: 'the_username',
    pwd: 'the_password',
    roles: [
        {
            role: 'dbOwner',
            db: 'the_database'
        }
    ]
})

db.createCollection('jehle_verb_mongo');

words.forEach(w => db.jehle_verb_mongo.insert(w))

db.createCollection('users');

