import type { ChatDialogueConfig } from "@/types/exerciseContent";

export const LOD_CHAT_DIALOGUES: Record<string, ChatDialogueConfig[]> = {
  "lu-lesson-6": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Äppeltäsch.", translation: "It is apple turnover." }, { id: "b", text: "Et ass Baguette.", translation: "It is baguette." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Äppeltäsch",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Äppeltäsch (apple turnover).",
        examples: ["Wat ass dat?", "Et ass Äppeltäsch."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Baguette.", translation: "It is baguette." }, { id: "b", text: "Et ass Äppeltäsch.", translation: "It is apple turnover." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Baguette",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Baguette (baguette).",
        examples: ["Wat ass dat?", "Et ass Baguette."],
      },
    }
  ],

  "lu-lesson-7": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Ee.", translation: "It is egg." }, { id: "b", text: "Et ass Fastfood.", translation: "It is fast food." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Ee",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Ee (egg).",
        examples: ["Wat ass dat?", "Et ass Ee."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Fastfood.", translation: "It is fast food." }, { id: "b", text: "Et ass Ee.", translation: "It is egg." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Fastfood",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Fastfood (fast food).",
        examples: ["Wat ass dat?", "Et ass Fastfood."],
      },
    }
  ],

  "lu-lesson-8": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Hamburger.", translation: "It is hamburger." }, { id: "b", text: "Et ass Hunneg.", translation: "It is honey." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Hamburger",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Hamburger (hamburger).",
        examples: ["Wat ass dat?", "Et ass Hamburger."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Hunneg.", translation: "It is honey." }, { id: "b", text: "Et ass Hamburger.", translation: "It is hamburger." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Hunneg",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Hunneg (honey).",
        examples: ["Wat ass dat?", "Et ass Hunneg."],
      },
    }
  ],

  "lu-lesson-9": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Knätsch.", translation: "It is chewing gum." }, { id: "b", text: "Et ass Kuch.", translation: "It is cake." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Knätsch",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Knätsch (chewing gum).",
        examples: ["Wat ass dat?", "Et ass Knätsch."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Kuch.", translation: "It is cake." }, { id: "b", text: "Et ass Knätsch.", translation: "It is chewing gum." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Kuch",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Kuch (cake).",
        examples: ["Wat ass dat?", "Et ass Kuch."],
      },
    }
  ],

  "lu-lesson-10": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Müüsli.", translation: "It is muesli." }, { id: "b", text: "Et ass Nuddel.", translation: "It is pasta." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Müüsli",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Müüsli (muesli).",
        examples: ["Wat ass dat?", "Et ass Müüsli."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Nuddel.", translation: "It is pasta." }, { id: "b", text: "Et ass Müüsli.", translation: "It is muesli." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Nuddel",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Nuddel (pasta).",
        examples: ["Wat ass dat?", "Et ass Nuddel."],
      },
    }
  ],

  "lu-lesson-11": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Scampi.", translation: "It is scampi." }, { id: "b", text: "Et ass Schmier.", translation: "It is slice of bread." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Scampi",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Scampi (scampi).",
        examples: ["Wat ass dat?", "Et ass Scampi."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Schmier.", translation: "It is slice of bread." }, { id: "b", text: "Et ass Scampi.", translation: "It is scampi." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Schmier",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Schmier (slice of bread).",
        examples: ["Wat ass dat?", "Et ass Schmier."],
      },
    }
  ],

  "lu-lesson-12": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Tomatenzopp.", translation: "It is tomato soup." }, { id: "b", text: "Et ass Uebst.", translation: "It is fruit." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Tomatenzopp",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Tomatenzopp (tomato soup).",
        examples: ["Wat ass dat?", "Et ass Tomatenzopp."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Uebst.", translation: "It is fruit." }, { id: "b", text: "Et ass Tomatenzopp.", translation: "It is tomato soup." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Uebst",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Uebst (fruit).",
        examples: ["Wat ass dat?", "Et ass Uebst."],
      },
    }
  ],

  "lu-lesson-13": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Gedrénks.", translation: "It is drinks." }, { id: "b", text: "Et ass Jus.", translation: "It is juice." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Gedrénks",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Gedrénks (drinks).",
        examples: ["Wat ass dat?", "Et ass Gedrénks."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Jus.", translation: "It is juice." }, { id: "b", text: "Et ass Gedrénks.", translation: "It is drinks." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Jus",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Jus (juice).",
        examples: ["Wat ass dat?", "Et ass Jus."],
      },
    }
  ],

  "lu-lesson-14": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Boma.", translation: "It is grandma." }, { id: "b", text: "Et ass Bomi.", translation: "It is grandma." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Boma",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Boma (grandma).",
        examples: ["Wat ass dat?", "Et ass Boma."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Bomi.", translation: "It is grandma." }, { id: "b", text: "Et ass Boma.", translation: "It is grandma." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Bomi",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Bomi (grandma).",
        examples: ["Wat ass dat?", "Et ass Bomi."],
      },
    }
  ],

  "lu-lesson-15": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Duechter.", translation: "It is daughter." }, { id: "b", text: "Et ass Elteren.", translation: "It is parents." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Duechter",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Duechter (daughter).",
        examples: ["Wat ass dat?", "Et ass Duechter."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Elteren.", translation: "It is parents." }, { id: "b", text: "Et ass Duechter.", translation: "It is daughter." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Elteren",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Elteren (parents).",
        examples: ["Wat ass dat?", "Et ass Elteren."],
      },
    }
  ],

  "lu-lesson-16": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Groussmamm.", translation: "It is grandmother." }, { id: "b", text: "Et ass Grousspapp.", translation: "It is grandfather." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Groussmamm",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Groussmamm (grandmother).",
        examples: ["Wat ass dat?", "Et ass Groussmamm."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Grousspapp.", translation: "It is grandfather." }, { id: "b", text: "Et ass Groussmamm.", translation: "It is grandmother." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Grousspapp",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Grousspapp (grandfather).",
        examples: ["Wat ass dat?", "Et ass Grousspapp."],
      },
    }
  ],

  "lu-lesson-17": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Mann.", translation: "It is man." }, { id: "b", text: "Et ass Meedchen.", translation: "It is girl." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Mann",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Mann (man).",
        examples: ["Wat ass dat?", "Et ass Mann."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Meedchen.", translation: "It is girl." }, { id: "b", text: "Et ass Mann.", translation: "It is man." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Meedchen",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Meedchen (girl).",
        examples: ["Wat ass dat?", "Et ass Meedchen."],
      },
    }
  ],

  "lu-lesson-18": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Aarbechter.", translation: "It is aarbechter." }, { id: "b", text: "Et ass Aarbechterin.", translation: "It is aarbechterin." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Aarbechter",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Aarbechter (Aarbechter).",
        examples: ["Wat ass dat?", "Et ass Aarbechter."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Aarbechterin.", translation: "It is aarbechterin." }, { id: "b", text: "Et ass Aarbechter.", translation: "It is aarbechter." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Aarbechterin",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Aarbechterin (Aarbechterin).",
        examples: ["Wat ass dat?", "Et ass Aarbechterin."],
      },
    }
  ],

  "lu-lesson-19": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Architekt.", translation: "It is architect." }, { id: "b", text: "Et ass Architektin.", translation: "It is architect." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Architekt",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Architekt (architect).",
        examples: ["Wat ass dat?", "Et ass Architekt."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Architektin.", translation: "It is architect." }, { id: "b", text: "Et ass Architekt.", translation: "It is architect." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Architektin",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Architektin (architect).",
        examples: ["Wat ass dat?", "Et ass Architektin."],
      },
    }
  ],

  "lu-lesson-20": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Bauer.", translation: "It is farmer." }, { id: "b", text: "Et ass Bauerefra.", translation: "It is farmer." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Bauer",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Bauer (farmer).",
        examples: ["Wat ass dat?", "Et ass Bauer."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Bauerefra.", translation: "It is farmer." }, { id: "b", text: "Et ass Bauer.", translation: "It is farmer." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Bauerefra",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Bauerefra (farmer).",
        examples: ["Wat ass dat?", "Et ass Bauerefra."],
      },
    }
  ],

  "lu-lesson-21": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Client.", translation: "It is customer." }, { id: "b", text: "Et ass Cliente.", translation: "It is customer." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Client",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Client (customer).",
        examples: ["Wat ass dat?", "Et ass Client."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Cliente.", translation: "It is customer." }, { id: "b", text: "Et ass Client.", translation: "It is customer." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Cliente",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Cliente (customer).",
        examples: ["Wat ass dat?", "Et ass Cliente."],
      },
    }
  ],

  "lu-lesson-22": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Déierendoktesch.", translation: "It is vet." }, { id: "b", text: "Et ass Direkter.", translation: "It is headmaster." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Déierendoktesch",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Déierendoktesch (vet).",
        examples: ["Wat ass dat?", "Et ass Déierendoktesch."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Direkter.", translation: "It is headmaster." }, { id: "b", text: "Et ass Déierendoktesch.", translation: "It is vet." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Direkter",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Direkter (headmaster).",
        examples: ["Wat ass dat?", "Et ass Direkter."],
      },
    }
  ],

  "lu-lesson-23": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Elektrikerin.", translation: "It is electrician." }, { id: "b", text: "Et ass Employé.", translation: "It is employee." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Elektrikerin",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Elektrikerin (electrician).",
        examples: ["Wat ass dat?", "Et ass Elektrikerin."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Employé.", translation: "It is employee." }, { id: "b", text: "Et ass Elektrikerin.", translation: "It is electrician." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Employé",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Employé (employee).",
        examples: ["Wat ass dat?", "Et ass Employé."],
      },
    }
  ],

  "lu-lesson-24": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Groussherzog.", translation: "It is grand duke." }, { id: "b", text: "Et ass Groussherzogin.", translation: "It is groussherzogin." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Groussherzog",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Groussherzog (grand duke).",
        examples: ["Wat ass dat?", "Et ass Groussherzog."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Groussherzogin.", translation: "It is groussherzogin." }, { id: "b", text: "Et ass Groussherzog.", translation: "It is grand duke." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Groussherzogin",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Groussherzogin (Groussherzogin).",
        examples: ["Wat ass dat?", "Et ass Groussherzogin."],
      },
    }
  ],

  "lu-lesson-25": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Informatikerin.", translation: "It is computer specialist." }, { id: "b", text: "Et ass Iwwersetzer.", translation: "It is translator." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Informatikerin",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Informatikerin (computer specialist).",
        examples: ["Wat ass dat?", "Et ass Informatikerin."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Iwwersetzer.", translation: "It is translator." }, { id: "b", text: "Et ass Informatikerin.", translation: "It is computer specialist." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Iwwersetzer",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Iwwersetzer (translator).",
        examples: ["Wat ass dat?", "Et ass Iwwersetzer."],
      },
    }
  ],

  "lu-lesson-26": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Kächen.", translation: "It is chef." }, { id: "b", text: "Et ass Kächin.", translation: "It is kächin." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Kächen",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Kächen (chef).",
        examples: ["Wat ass dat?", "Et ass Kächen."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Kächin.", translation: "It is kächin." }, { id: "b", text: "Et ass Kächen.", translation: "It is chef." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Kächin",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Kächin (Kächin).",
        examples: ["Wat ass dat?", "Et ass Kächin."],
      },
    }
  ],

  "lu-lesson-27": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Metzlesch.", translation: "It is butcher." }, { id: "b", text: "Et ass Moniteur.", translation: "It is group leader." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Metzlesch",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Metzlesch (butcher).",
        examples: ["Wat ass dat?", "Et ass Metzlesch."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Moniteur.", translation: "It is group leader." }, { id: "b", text: "Et ass Metzlesch.", translation: "It is butcher." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Moniteur",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Moniteur (group leader).",
        examples: ["Wat ass dat?", "Et ass Moniteur."],
      },
    }
  ],

  "lu-lesson-28": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Patient.", translation: "It is patient." }, { id: "b", text: "Et ass Patientin.", translation: "It is patient." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Patient",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Patient (patient).",
        examples: ["Wat ass dat?", "Et ass Patient."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Patientin.", translation: "It is patient." }, { id: "b", text: "Et ass Patient.", translation: "It is patient." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Patientin",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Patientin (patient).",
        examples: ["Wat ass dat?", "Et ass Patientin."],
      },
    }
  ],

  "lu-lesson-29": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Riichter.", translation: "It is judge." }, { id: "b", text: "Et ass Riichterin.", translation: "It is (female) judge." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Riichter",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Riichter (judge).",
        examples: ["Wat ass dat?", "Et ass Riichter."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Riichterin.", translation: "It is (female) judge." }, { id: "b", text: "Et ass Riichter.", translation: "It is judge." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Riichterin",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Riichterin ((female) judge).",
        examples: ["Wat ass dat?", "Et ass Riichterin."],
      },
    }
  ],

  "lu-lesson-30": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Sportler.", translation: "It is sportsman." }, { id: "b", text: "Et ass Sportlerin.", translation: "It is sportswoman." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Sportler",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Sportler (sportsman).",
        examples: ["Wat ass dat?", "Et ass Sportler."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Sportlerin.", translation: "It is sportswoman." }, { id: "b", text: "Et ass Sportler.", translation: "It is sportsman." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Sportlerin",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Sportlerin (sportswoman).",
        examples: ["Wat ass dat?", "Et ass Sportlerin."],
      },
    }
  ],

  "lu-lesson-31": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Usträicher.", translation: "It is painter." }, { id: "b", text: "Et ass Usträicherin.", translation: "It is (female) painter." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Usträicher",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Usträicher (painter).",
        examples: ["Wat ass dat?", "Et ass Usträicher."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Usträicherin.", translation: "It is (female) painter." }, { id: "b", text: "Et ass Usträicher.", translation: "It is painter." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Usträicherin",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Usträicherin ((female) painter).",
        examples: ["Wat ass dat?", "Et ass Usträicherin."],
      },
    }
  ],

  "lu-lesson-32": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass blo.", translation: "It is blue." }, { id: "b", text: "Et ass blond.", translation: "It is blond." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "blo",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass blo (blue).",
        examples: ["Wat ass dat?", "Et ass blo."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass blond.", translation: "It is blond." }, { id: "b", text: "Et ass blo.", translation: "It is blue." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "blond",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass blond (blond).",
        examples: ["Wat ass dat?", "Et ass blond."],
      },
    }
  ],

  "lu-lesson-33": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Abrëll.", translation: "It is april." }, { id: "b", text: "Et ass August.", translation: "It is august." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Abrëll",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Abrëll (April).",
        examples: ["Wat ass dat?", "Et ass Abrëll."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass August.", translation: "It is august." }, { id: "b", text: "Et ass Abrëll.", translation: "It is april." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "August",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass August (August).",
        examples: ["Wat ass dat?", "Et ass August."],
      },
    }
  ],

  "lu-lesson-34": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Mee.", translation: "It is may." }, { id: "b", text: "Et ass November.", translation: "It is november." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Mee",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Mee (May).",
        examples: ["Wat ass dat?", "Et ass Mee."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass November.", translation: "It is november." }, { id: "b", text: "Et ass Mee.", translation: "It is may." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "November",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass November (November).",
        examples: ["Wat ass dat?", "Et ass November."],
      },
    }
  ],

  "lu-lesson-35": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass bedeckt.", translation: "It is overcast." }, { id: "b", text: "Et ass Grad.", translation: "It is degree." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "bedeckt",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass bedeckt (overcast).",
        examples: ["Wat ass dat?", "Et ass bedeckt."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Grad.", translation: "It is degree." }, { id: "b", text: "Et ass bedeckt.", translation: "It is overcast." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Grad",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Grad (degree).",
        examples: ["Wat ass dat?", "Et ass Grad."],
      },
    }
  ],

  "lu-lesson-36": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass schneien.", translation: "It is to snow." }, { id: "b", text: "Et ass sonneg.", translation: "It is sunny." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "schneien",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass schneien (to snow).",
        examples: ["Wat ass dat?", "Et ass schneien."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass sonneg.", translation: "It is sunny." }, { id: "b", text: "Et ass schneien.", translation: "It is to snow." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "sonneg",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass sonneg (sunny).",
        examples: ["Wat ass dat?", "Et ass sonneg."],
      },
    }
  ],

  "lu-lesson-37": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Bläistëft.", translation: "It is pencil." }, { id: "b", text: "Et ass Buch.", translation: "It is book." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Bläistëft",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Bläistëft (pencil).",
        examples: ["Wat ass dat?", "Et ass Bläistëft."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Buch.", translation: "It is book." }, { id: "b", text: "Et ass Bläistëft.", translation: "It is pencil." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Buch",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Buch (book).",
        examples: ["Wat ass dat?", "Et ass Buch."],
      },
    }
  ],

  "lu-lesson-38": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Kantin.", translation: "It is canteen." }, { id: "b", text: "Et ass léieren.", translation: "It is to learn." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Kantin",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Kantin (canteen).",
        examples: ["Wat ass dat?", "Et ass Kantin."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass léieren.", translation: "It is to learn." }, { id: "b", text: "Et ass Kantin.", translation: "It is canteen." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "léieren",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass léieren (to learn).",
        examples: ["Wat ass dat?", "Et ass léieren."],
      },
    }
  ],

  "lu-lesson-39": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Äerdbier.", translation: "It is strawberry." }, { id: "b", text: "Et ass Ananas.", translation: "It is pineapple." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Äerdbier",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Äerdbier (strawberry).",
        examples: ["Wat ass dat?", "Et ass Äerdbier."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Äerdbier.", translation: "It is strawberries." }, { id: "b", text: "Et ass Ananas.", translation: "It is pineapple." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Äerdbier",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Äerdbier (strawberries).",
        examples: ["Wat ass dat?", "Et ass Äerdbier."],
      },
    }
  ],

  "lu-lesson-40": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Kiischt.", translation: "It is cherry." }, { id: "b", text: "Et ass Kiwi.", translation: "It is kiwi." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Kiischt",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Kiischt (cherry).",
        examples: ["Wat ass dat?", "Et ass Kiischt."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Kiwi.", translation: "It is kiwi." }, { id: "b", text: "Et ass Kiischt.", translation: "It is cherry." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Kiwi",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Kiwi (kiwi).",
        examples: ["Wat ass dat?", "Et ass Kiwi."],
      },
    }
  ],

  "lu-lesson-41": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Aubergine.", translation: "It is aubergine." }, { id: "b", text: "Et ass Boun.", translation: "It is (green) bean." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Aubergine",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Aubergine (aubergine).",
        examples: ["Wat ass dat?", "Et ass Aubergine."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Boun.", translation: "It is (green) bean." }, { id: "b", text: "Et ass Aubergine.", translation: "It is aubergine." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Boun",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Boun ((green) bean).",
        examples: ["Wat ass dat?", "Et ass Boun."],
      },
    }
  ],

  "lu-lesson-42": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Kürbis.", translation: "It is pumpkin." }, { id: "b", text: "Et ass Muert.", translation: "It is carrot." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Kürbis",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Kürbis (pumpkin).",
        examples: ["Wat ass dat?", "Et ass Kürbis."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Muert.", translation: "It is carrot." }, { id: "b", text: "Et ass Kürbis.", translation: "It is pumpkin." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Muert",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Muert (carrot).",
        examples: ["Wat ass dat?", "Et ass Muert."],
      },
    }
  ],

  "lu-lesson-43": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Fësch.", translation: "It is fish." }, { id: "b", text: "Et ass Hond.", translation: "It is dog." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Fësch",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Fësch (fish).",
        examples: ["Wat ass dat?", "Et ass Fësch."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Hond.", translation: "It is dog." }, { id: "b", text: "Et ass Fësch.", translation: "It is fish." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Hond",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Hond (dog).",
        examples: ["Wat ass dat?", "Et ass Hond."],
      },
    }
  ],

  "lu-lesson-44": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass A.", translation: "It is eye." }, { id: "b", text: "Et ass Bauch.", translation: "It is stomach." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "A",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass A (eye).",
        examples: ["Wat ass dat?", "Et ass A."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Bauch.", translation: "It is stomach." }, { id: "b", text: "Et ass A.", translation: "It is eye." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Bauch",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Bauch (stomach).",
        examples: ["Wat ass dat?", "Et ass Bauch."],
      },
    }
  ],

  "lu-lesson-45": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Auto.", translation: "It is car." }, { id: "b", text: "Et ass Bus.", translation: "It is bus." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Auto",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Auto (car).",
        examples: ["Wat ass dat?", "Et ass Auto."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Bus.", translation: "It is bus." }, { id: "b", text: "Et ass Auto.", translation: "It is car." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Bus",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Bus (bus).",
        examples: ["Wat ass dat?", "Et ass Bus."],
      },
    }
  ],

  "lu-lesson-46": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Aerobic.", translation: "It is aerobics." }, { id: "b", text: "Et ass decken.", translation: "It is to cover." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Aerobic",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Aerobic (aerobics).",
        examples: ["Wat ass dat?", "Et ass Aerobic."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass decken.", translation: "It is to cover." }, { id: "b", text: "Et ass Aerobic.", translation: "It is aerobics." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "decken",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass decken (to cover).",
        examples: ["Wat ass dat?", "Et ass decken."],
      },
    }
  ],

  "lu-lesson-47": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Chrëschtbeemchen.", translation: "It is christmas tree." }, { id: "b", text: "Et ass Chrëschtdag.", translation: "It is christmas day." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Chrëschtbeemchen",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Chrëschtbeemchen (Christmas tree).",
        examples: ["Wat ass dat?", "Et ass Chrëschtbeemchen."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Chrëschtdag.", translation: "It is christmas day." }, { id: "b", text: "Et ass Chrëschtbeemchen.", translation: "It is christmas tree." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Chrëschtdag",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Chrëschtdag (Christmas Day).",
        examples: ["Wat ass dat?", "Et ass Chrëschtdag."],
      },
    }
  ],

  "lu-lesson-48": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Aarbecht.", translation: "It is work." }, { id: "b", text: "Et ass Kleeserchersdag.", translation: "It is st nicholas' day." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Aarbecht",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Aarbecht (work).",
        examples: ["Wat ass dat?", "Et ass Aarbecht."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Kleeserchersdag.", translation: "It is st nicholas' day." }, { id: "b", text: "Et ass Aarbecht.", translation: "It is work." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Kleeserchersdag",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Kleeserchersdag (St Nicholas' day).",
        examples: ["Wat ass dat?", "Et ass Kleeserchersdag."],
      },
    }
  ],

  "lu-lesson-49": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Gramm.", translation: "It is gram." }, { id: "b", text: "Et ass Kilo.", translation: "It is kilo." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Gramm",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Gramm (gram).",
        examples: ["Wat ass dat?", "Et ass Gramm."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Kilo.", translation: "It is kilo." }, { id: "b", text: "Et ass Gramm.", translation: "It is gram." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Kilo",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Kilo (kilo).",
        examples: ["Wat ass dat?", "Et ass Kilo."],
      },
    }
  ],

  "lu-lesson-50": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Sport.", translation: "It is sport." }, { id: "b", text: "Et ass sportlech.", translation: "It is sporting." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Sport",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Sport (sport).",
        examples: ["Wat ass dat?", "Et ass Sport."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass sportlech.", translation: "It is sporting." }, { id: "b", text: "Et ass Sport.", translation: "It is sport." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "sportlech",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass sportlech (sporting).",
        examples: ["Wat ass dat?", "Et ass sportlech."],
      },
    }
  ],

  "lu-lesson-51": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Basket.", translation: "It is basketball." }, { id: "b", text: "Et ass goen.", translation: "It is to go." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Basket",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Basket (basketball).",
        examples: ["Wat ass dat?", "Et ass Basket."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass goen.", translation: "It is to go." }, { id: "b", text: "Et ass Basket.", translation: "It is basketball." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "goen",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass goen (to go).",
        examples: ["Wat ass dat?", "Et ass goen."],
      },
    }
  ],

  "lu-lesson-52": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass ellen.", translation: "It is ugly." }, { id: "b", text: "Et ass sauer.", translation: "It is sour." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "ellen",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass ellen (ugly).",
        examples: ["Wat ass dat?", "Et ass ellen."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass sauer.", translation: "It is sour." }, { id: "b", text: "Et ass ellen.", translation: "It is ugly." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "sauer",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass sauer (sour).",
        examples: ["Wat ass dat?", "Et ass sauer."],
      },
    }
  ],

  "lu-lesson-53": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Botzfra.", translation: "It is cleaner." }, { id: "b", text: "Et ass Estheticienne.", translation: "It is beautician." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Botzfra",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Botzfra (cleaner).",
        examples: ["Wat ass dat?", "Et ass Botzfra."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Estheticienne.", translation: "It is beautician." }, { id: "b", text: "Et ass Botzfra.", translation: "It is cleaner." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Estheticienne",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Estheticienne (beautician).",
        examples: ["Wat ass dat?", "Et ass Estheticienne."],
      },
    }
  ],

  "lu-lesson-54": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Apdikt.", translation: "It is chemist's." }, { id: "b", text: "Et ass Besserung.", translation: "It is improvement." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Apdikt",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Apdikt (chemist's).",
        examples: ["Wat ass dat?", "Et ass Apdikt."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Besserung.", translation: "It is improvement." }, { id: "b", text: "Et ass Apdikt.", translation: "It is chemist's." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Besserung",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Besserung (improvement).",
        examples: ["Wat ass dat?", "Et ass Besserung."],
      },
    }
  ],

  "lu-lesson-55": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass huelen.", translation: "It is to take." }, { id: "b", text: "Et ass Klinick.", translation: "It is hospital." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "huelen",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass huelen (to take).",
        examples: ["Wat ass dat?", "Et ass huelen."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Klinick.", translation: "It is hospital." }, { id: "b", text: "Et ass huelen.", translation: "It is to take." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Klinick",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Klinick (hospital).",
        examples: ["Wat ass dat?", "Et ass Klinick."],
      },
    }
  ],

  "lu-lesson-56": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Baart.", translation: "It is beard." }, { id: "b", text: "Et ass baken.", translation: "It is to bake." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Baart",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Baart (beard).",
        examples: ["Wat ass dat?", "Et ass Baart."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass baken.", translation: "It is to bake." }, { id: "b", text: "Et ass Baart.", translation: "It is beard." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "baken",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass baken (to bake).",
        examples: ["Wat ass dat?", "Et ass baken."],
      },
    }
  ],

  "lu-lesson-57": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Kleeschen.", translation: "It is st nicholas." }, { id: "b", text: "Et ass Lidd.", translation: "It is song." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Kleeschen",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Kleeschen (St Nicholas).",
        examples: ["Wat ass dat?", "Et ass Kleeschen."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Lidd.", translation: "It is song." }, { id: "b", text: "Et ass Kleeschen.", translation: "It is st nicholas." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Lidd",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Lidd (song).",
        examples: ["Wat ass dat?", "Et ass Lidd."],
      },
    }
  ],

  "lu-lesson-60": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass äddi.", translation: "It is goodbye." }, { id: "b", text: "Et ass bonjour.", translation: "It is hello." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "äddi",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass äddi (goodbye).",
        examples: ["Wat ass dat?", "Et ass äddi."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass bonjour.", translation: "It is hello." }, { id: "b", text: "Et ass äddi.", translation: "It is goodbye." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "bonjour",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass bonjour (hello).",
        examples: ["Wat ass dat?", "Et ass bonjour."],
      },
    }
  ],

  "lu-lesson-61": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Muskat.", translation: "It is muskat." }, { id: "b", text: "Et ass Muskot.", translation: "It is nutmeg." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Muskat",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Muskat (Muskat).",
        examples: ["Wat ass dat?", "Et ass Muskat."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Muskot.", translation: "It is nutmeg." }, { id: "b", text: "Et ass Muskat.", translation: "It is muskat." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Muskot",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Muskot (nutmeg).",
        examples: ["Wat ass dat?", "Et ass Muskot."],
      },
    }
  ],

  "lu-lesson-65": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass administrativ.", translation: "It is administrative." }, { id: "b", text: "Et ass Adress.", translation: "It is address." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "administrativ",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass administrativ (administrative).",
        examples: ["Wat ass dat?", "Et ass administrativ."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Adress.", translation: "It is address." }, { id: "b", text: "Et ass administrativ.", translation: "It is administrative." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Adress",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Adress (address).",
        examples: ["Wat ass dat?", "Et ass Adress."],
      },
    }
  ],

  "lu-lesson-66": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass als.", translation: "It is as." }, { id: "b", text: "Et ass also.", translation: "It is so." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "als",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass als (as).",
        examples: ["Wat ass dat?", "Et ass als."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass also.", translation: "It is so." }, { id: "b", text: "Et ass als.", translation: "It is as." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "also",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass also (so).",
        examples: ["Wat ass dat?", "Et ass also."],
      },
    }
  ],

  "lu-lesson-67": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass aner.", translation: "It is other." }, { id: "b", text: "Et ass aneren.", translation: "It is other." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "aner",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass aner (other).",
        examples: ["Wat ass dat?", "Et ass aner."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass aneren.", translation: "It is other." }, { id: "b", text: "Et ass aner.", translation: "It is other." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "aneren",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass aneren (other).",
        examples: ["Wat ass dat?", "Et ass aneren."],
      },
    }
  ],

  "lu-lesson-68": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Ausland.", translation: "It is abroad." }, { id: "b", text: "Et ass ausser.", translation: "It is unless." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Ausland",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Ausland (abroad).",
        examples: ["Wat ass dat?", "Et ass Ausland."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass ausser.", translation: "It is unless." }, { id: "b", text: "Et ass Ausland.", translation: "It is abroad." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "ausser",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass ausser (unless).",
        examples: ["Wat ass dat?", "Et ass ausser."],
      },
    }
  ],

  "lu-lesson-69": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Bäckerei.", translation: "It is bakery." }, { id: "b", text: "Et ass Band.", translation: "It is band." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Bäckerei",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Bäckerei (bakery).",
        examples: ["Wat ass dat?", "Et ass Bäckerei."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Band.", translation: "It is band." }, { id: "b", text: "Et ass Bäckerei.", translation: "It is bakery." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Band",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Band (band).",
        examples: ["Wat ass dat?", "Et ass Band."],
      },
    }
  ],

  "lu-lesson-70": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass béis.", translation: "It is mean." }, { id: "b", text: "Et ass Beispill.", translation: "It is example." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "béis",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass béis (mean).",
        examples: ["Wat ass dat?", "Et ass béis."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Beispill.", translation: "It is example." }, { id: "b", text: "Et ass béis.", translation: "It is mean." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Beispill",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Beispill (example).",
        examples: ["Wat ass dat?", "Et ass Beispill."],
      },
    }
  ],

  "lu-lesson-71": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass bestuet.", translation: "It is married." }, { id: "b", text: "Et ass Bett.", translation: "It is bed." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "bestuet",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass bestuet (married).",
        examples: ["Wat ass dat?", "Et ass bestuet."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Bett.", translation: "It is bed." }, { id: "b", text: "Et ass bestuet.", translation: "It is married." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Bett",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Bett (bed).",
        examples: ["Wat ass dat?", "Et ass Bett."],
      },
    }
  ],

  "lu-lesson-72": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Brasserie.", translation: "It is brasserie." }, { id: "b", text: "Et ass brauchen.", translation: "It is to need." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Brasserie",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Brasserie (brasserie).",
        examples: ["Wat ass dat?", "Et ass Brasserie."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass brauchen.", translation: "It is to need." }, { id: "b", text: "Et ass Brasserie.", translation: "It is brasserie." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "brauchen",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass brauchen (to need).",
        examples: ["Wat ass dat?", "Et ass brauchen."],
      },
    }
  ],

  "lu-lesson-73": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Certificat.", translation: "It is certificate." }, { id: "b", text: "Et ass Chômage.", translation: "It is unemployment." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Certificat",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Certificat (certificate).",
        examples: ["Wat ass dat?", "Et ass Certificat."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Chômage.", translation: "It is unemployment." }, { id: "b", text: "Et ass Certificat.", translation: "It is certificate." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Chômage",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Chômage (unemployment).",
        examples: ["Wat ass dat?", "Et ass Chômage."],
      },
    }
  ],

  "lu-lesson-74": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass däerfen.", translation: "It is can." }, { id: "b", text: "Et ass Dag.", translation: "It is day." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "däerfen",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass däerfen (can).",
        examples: ["Wat ass dat?", "Et ass däerfen."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Dag.", translation: "It is day." }, { id: "b", text: "Et ass däerfen.", translation: "It is can." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Dag",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Dag (day).",
        examples: ["Wat ass dat?", "Et ass Dag."],
      },
    }
  ],

  "lu-lesson-75": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Dënschdeg.", translation: "It is tuesday." }, { id: "b", text: "Et ass dënschdes.", translation: "It is (on) tuesday(s)." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Dënschdeg",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Dënschdeg (Tuesday).",
        examples: ["Wat ass dat?", "Et ass Dënschdeg."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass dënschdes.", translation: "It is (on) tuesday(s)." }, { id: "b", text: "Et ass Dënschdeg.", translation: "It is tuesday." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "dënschdes",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass dënschdes ((on) Tuesday(s)).",
        examples: ["Wat ass dat?", "Et ass dënschdes."],
      },
    }
  ],

  "lu-lesson-76": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Do.", translation: "It is in plain daylight." }, { id: "b", text: "Et ass dobäi.", translation: "It is dobäi." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Do",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Do (in plain daylight).",
        examples: ["Wat ass dat?", "Et ass Do."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass dobäi.", translation: "It is dobäi." }, { id: "b", text: "Et ass Do.", translation: "It is in plain daylight." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "dobäi",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass dobäi (dobäi).",
        examples: ["Wat ass dat?", "Et ass dobäi."],
      },
    }
  ],

  "lu-lesson-77": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass drénken.", translation: "It is to drink." }, { id: "b", text: "Et ass du.", translation: "It is du." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "drénken",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass drénken (to drink).",
        examples: ["Wat ass dat?", "Et ass drénken."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass du.", translation: "It is du." }, { id: "b", text: "Et ass drénken.", translation: "It is to drink." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "du",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass du (du).",
        examples: ["Wat ass dat?", "Et ass du."],
      },
    }
  ],

  "lu-lesson-78": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass eleng.", translation: "It is alone." }, { id: "b", text: "Et ass elo.", translation: "It is now." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "eleng",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass eleng (alone).",
        examples: ["Wat ass dat?", "Et ass eleng."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass elo.", translation: "It is now." }, { id: "b", text: "Et ass eleng.", translation: "It is alone." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "elo",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass elo (now).",
        examples: ["Wat ass dat?", "Et ass elo."],
      },
    }
  ],

  "lu-lesson-79": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass erwächen.", translation: "It is to wake (up)." }, { id: "b", text: "Et ass esou.", translation: "It is so." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "erwächen",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass erwächen (to wake (up)).",
        examples: ["Wat ass dat?", "Et ass erwächen."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass esou.", translation: "It is so." }, { id: "b", text: "Et ass erwächen.", translation: "It is to wake (up)." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "esou",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass esou (so).",
        examples: ["Wat ass dat?", "Et ass esou."],
      },
    }
  ],

  "lu-lesson-80": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Fiche.", translation: "It is form." }, { id: "b", text: "Et ass fierwen.", translation: "It is to colour." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Fiche",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Fiche (form).",
        examples: ["Wat ass dat?", "Et ass Fiche."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass fierwen.", translation: "It is to colour." }, { id: "b", text: "Et ass Fiche.", translation: "It is form." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "fierwen",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass fierwen (to colour).",
        examples: ["Wat ass dat?", "Et ass fierwen."],
      },
    }
  ],

  "lu-lesson-81": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass fix.", translation: "It is fixed." }, { id: "b", text: "Et ass Fläsch.", translation: "It is bottle." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "fix",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass fix (fixed).",
        examples: ["Wat ass dat?", "Et ass fix."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Fläsch.", translation: "It is bottle." }, { id: "b", text: "Et ass fix.", translation: "It is fixed." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Fläsch",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Fläsch (bottle).",
        examples: ["Wat ass dat?", "Et ass Fläsch."],
      },
    }
  ],

  "lu-lesson-82": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Freideg.", translation: "It is friday." }, { id: "b", text: "Et ass freides.", translation: "It is (on) friday(s)." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Freideg",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Freideg (Friday).",
        examples: ["Wat ass dat?", "Et ass Freideg."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass freides.", translation: "It is (on) friday(s)." }, { id: "b", text: "Et ass Freideg.", translation: "It is friday." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "freides",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass freides ((on) Friday(s)).",
        examples: ["Wat ass dat?", "Et ass freides."],
      },
    }
  ],

  "lu-lesson-83": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass gebieren.", translation: "It is to be born." }, { id: "b", text: "Et ass Gebuertsdag.", translation: "It is birthday." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "gebieren",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass gebieren (to be born).",
        examples: ["Wat ass dat?", "Et ass gebieren."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Gebuertsdag.", translation: "It is birthday." }, { id: "b", text: "Et ass gebieren.", translation: "It is to be born." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Gebuertsdag",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Gebuertsdag (birthday).",
        examples: ["Wat ass dat?", "Et ass Gebuertsdag."],
      },
    }
  ],

  "lu-lesson-84": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass geografesch.", translation: "It is geographical." }, { id: "b", text: "Et ass geschéien.", translation: "It is to happen." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "geografesch",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass geografesch (geographical).",
        examples: ["Wat ass dat?", "Et ass geografesch."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass geschéien.", translation: "It is to happen." }, { id: "b", text: "Et ass geografesch.", translation: "It is geographical." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "geschéien",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass geschéien (to happen).",
        examples: ["Wat ass dat?", "Et ass geschéien."],
      },
    }
  ],

  "lu-lesson-85": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass graff.", translation: "It is rough." }, { id: "b", text: "Et ass grouss.", translation: "It is big." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "graff",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass graff (rough).",
        examples: ["Wat ass dat?", "Et ass graff."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass grouss.", translation: "It is big." }, { id: "b", text: "Et ass graff.", translation: "It is rough." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "grouss",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass grouss (big).",
        examples: ["Wat ass dat?", "Et ass grouss."],
      },
    }
  ],

  "lu-lesson-86": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Haaptstad.", translation: "It is capital." }, { id: "b", text: "Et ass hallef.", translation: "It is half." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Haaptstad",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Haaptstad (capital).",
        examples: ["Wat ass dat?", "Et ass Haaptstad."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass hallef.", translation: "It is half." }, { id: "b", text: "Et ass Haaptstad.", translation: "It is capital." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "hallef",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass hallef (half).",
        examples: ["Wat ass dat?", "Et ass hallef."],
      },
    }
  ],

  "lu-lesson-87": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass hei.", translation: "It is here." }, { id: "b", text: "Et ass heiansdo.", translation: "It is sometimes." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "hei",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass hei (here).",
        examples: ["Wat ass dat?", "Et ass hei."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass heiansdo.", translation: "It is sometimes." }, { id: "b", text: "Et ass hei.", translation: "It is here." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "heiansdo",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass heiansdo (sometimes).",
        examples: ["Wat ass dat?", "Et ass heiansdo."],
      },
    }
  ],

  "lu-lesson-88": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Iddi.", translation: "It is idea." }, { id: "b", text: "Et ass iessen.", translation: "It is to eat." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Iddi",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Iddi (idea).",
        examples: ["Wat ass dat?", "Et ass Iddi."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass iessen.", translation: "It is to eat." }, { id: "b", text: "Et ass Iddi.", translation: "It is idea." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "iessen",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass iessen (to eat).",
        examples: ["Wat ass dat?", "Et ass iessen."],
      },
    }
  ],

  "lu-lesson-89": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Joer.", translation: "It is year." }, { id: "b", text: "Et ass jonk.", translation: "It is young." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Joer",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Joer (year).",
        examples: ["Wat ass dat?", "Et ass Joer."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass jonk.", translation: "It is young." }, { id: "b", text: "Et ass Joer.", translation: "It is year." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "jonk",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass jonk (young).",
        examples: ["Wat ass dat?", "Et ass jonk."],
      },
    }
  ],

  "lu-lesson-90": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass keen.", translation: "It is no." }, { id: "b", text: "Et ass Keess.", translation: "It is till." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "keen",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass keen (no).",
        examples: ["Wat ass dat?", "Et ass keen."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Keess.", translation: "It is till." }, { id: "b", text: "Et ass keen.", translation: "It is no." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Keess",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Keess (till).",
        examples: ["Wat ass dat?", "Et ass Keess."],
      },
    }
  ],

  "lu-lesson-91": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass kleng.", translation: "It is small." }, { id: "b", text: "Et ass kommen.", translation: "It is to come." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "kleng",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass kleng (small).",
        examples: ["Wat ass dat?", "Et ass kleng."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass kommen.", translation: "It is to come." }, { id: "b", text: "Et ass kleng.", translation: "It is small." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "kommen",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass kommen (to come).",
        examples: ["Wat ass dat?", "Et ass kommen."],
      },
    }
  ],

  "lu-lesson-92": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Kraut.", translation: "It is herb." }, { id: "b", text: "Et ass kréien.", translation: "It is to get." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Kraut",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Kraut (herb).",
        examples: ["Wat ass dat?", "Et ass Kraut."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass kréien.", translation: "It is to get." }, { id: "b", text: "Et ass Kraut.", translation: "It is herb." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "kréien",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass kréien (to get).",
        examples: ["Wat ass dat?", "Et ass kréien."],
      },
    }
  ],

  "lu-lesson-93": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Lampion.", translation: "It is paper lantern." }, { id: "b", text: "Et ass langweileg.", translation: "It is boring." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Lampion",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Lampion (paper lantern).",
        examples: ["Wat ass dat?", "Et ass Lampion."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass langweileg.", translation: "It is boring." }, { id: "b", text: "Et ass Lampion.", translation: "It is paper lantern." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "langweileg",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass langweileg (boring).",
        examples: ["Wat ass dat?", "Et ass langweileg."],
      },
    }
  ],

  "lu-lesson-94": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Lëtzebuergesch.", translation: "It is luxemburgish." }, { id: "b", text: "Et ass Liblingsiessen.", translation: "It is favourite food." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Lëtzebuergesch",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Lëtzebuergesch (Luxemburgish).",
        examples: ["Wat ass dat?", "Et ass Lëtzebuergesch."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Liblingsiessen.", translation: "It is favourite food." }, { id: "b", text: "Et ass Lëtzebuergesch.", translation: "It is luxemburgish." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Liblingsiessen",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Liblingsiessen (favourite food).",
        examples: ["Wat ass dat?", "Et ass Liblingsiessen."],
      },
    }
  ],

  "lu-lesson-95": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Lutsch.", translation: "It is lolly." }, { id: "b", text: "Et ass mä.", translation: "It is mä." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Lutsch",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Lutsch (lolly).",
        examples: ["Wat ass dat?", "Et ass Lutsch."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass mä.", translation: "It is mä." }, { id: "b", text: "Et ass Lutsch.", translation: "It is lolly." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "mä",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass mä (mä).",
        examples: ["Wat ass dat?", "Et ass mä."],
      },
    }
  ],

  "lu-lesson-96": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass mat.", translation: "It is with." }, { id: "b", text: "Et ass matgoen.", translation: "It is to go along." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "mat",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass mat (with).",
        examples: ["Wat ass dat?", "Et ass mat."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass matgoen.", translation: "It is to go along." }, { id: "b", text: "Et ass mat.", translation: "It is with." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "matgoen",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass matgoen (to go along).",
        examples: ["Wat ass dat?", "Et ass matgoen."],
      },
    }
  ],

  "lu-lesson-97": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass mengen.", translation: "It is to think." }, { id: "b", text: "Et ass mëschen.", translation: "It is to mix." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "mengen",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass mengen (to think).",
        examples: ["Wat ass dat?", "Et ass mengen."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass mëschen.", translation: "It is to mix." }, { id: "b", text: "Et ass mengen.", translation: "It is to think." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "mëschen",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass mëschen (to mix).",
        examples: ["Wat ass dat?", "Et ass mëschen."],
      },
    }
  ],

  "lu-lesson-98": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass mëttwochs.", translation: "It is (on) wednesday(s)." }, { id: "b", text: "Et ass Mickymaus.", translation: "It is cartoon." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "mëttwochs",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass mëttwochs ((on) Wednesday(s)).",
        examples: ["Wat ass dat?", "Et ass mëttwochs."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Mickymaus.", translation: "It is cartoon." }, { id: "b", text: "Et ass mëttwochs.", translation: "It is (on) wednesday(s)." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Mickymaus",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Mickymaus (cartoon).",
        examples: ["Wat ass dat?", "Et ass Mickymaus."],
      },
    }
  ],

  "lu-lesson-99": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Moien.", translation: "It is morning." }, { id: "b", text: "Et ass moies.", translation: "It is in the morning." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Moien",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Moien (morning).",
        examples: ["Wat ass dat?", "Et ass Moien."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass moies.", translation: "It is in the morning." }, { id: "b", text: "Et ass Moien.", translation: "It is morning." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "moies",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass moies (in the morning).",
        examples: ["Wat ass dat?", "Et ass moies."],
      },
    }
  ],

  "lu-lesson-100": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass muer.", translation: "It is tomorrow." }, { id: "b", text: "Et ass Musée.", translation: "It is museum." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "muer",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass muer (tomorrow).",
        examples: ["Wat ass dat?", "Et ass muer."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Musée.", translation: "It is museum." }, { id: "b", text: "Et ass muer.", translation: "It is tomorrow." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Musée",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Musée (museum).",
        examples: ["Wat ass dat?", "Et ass Musée."],
      },
    }
  ],

  "lu-lesson-101": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass nëmmen.", translation: "It is only." }, { id: "b", text: "Et ass net.", translation: "It is not." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "nëmmen",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass nëmmen (only).",
        examples: ["Wat ass dat?", "Et ass nëmmen."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass net.", translation: "It is not." }, { id: "b", text: "Et ass nëmmen.", translation: "It is only." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "net",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass net (not).",
        examples: ["Wat ass dat?", "Et ass net."],
      },
    }
  ],

  "lu-lesson-102": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Numm.", translation: "It is name." }, { id: "b", text: "Et ass Nummer.", translation: "It is number." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Numm",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Numm (name).",
        examples: ["Wat ass dat?", "Et ass Numm."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Nummer.", translation: "It is number." }, { id: "b", text: "Et ass Numm.", translation: "It is name." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Nummer",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Nummer (number).",
        examples: ["Wat ass dat?", "Et ass Nummer."],
      },
    }
  ],

  "lu-lesson-103": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass onseriö.", translation: "It is unreliable." }, { id: "b", text: "Et ass onsportlech.", translation: "It is unathletic." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "onseriö",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass onseriö (unreliable).",
        examples: ["Wat ass dat?", "Et ass onseriö."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass onsportlech.", translation: "It is unathletic." }, { id: "b", text: "Et ass onseriö.", translation: "It is unreliable." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "onsportlech",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass onsportlech (unathletic).",
        examples: ["Wat ass dat?", "Et ass onsportlech."],
      },
    }
  ],

  "lu-lesson-104": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass pacsen.", translation: "It is to register as civil partners." }, { id: "b", text: "Et ass Pak.", translation: "It is packet." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "pacsen",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass pacsen (to register as Civil Partners).",
        examples: ["Wat ass dat?", "Et ass pacsen."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Pak.", translation: "It is packet." }, { id: "b", text: "Et ass pacsen.", translation: "It is to register as civil partners." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Pak",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Pak (packet).",
        examples: ["Wat ass dat?", "Et ass Pak."],
      },
    }
  ],

  "lu-lesson-105": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Plat.", translation: "It is (serving) plate." }, { id: "b", text: "Et ass plattdrécken.", translation: "It is to flatten." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Plat",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Plat ((serving) plate).",
        examples: ["Wat ass dat?", "Et ass Plat."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass plattdrécken.", translation: "It is to flatten." }, { id: "b", text: "Et ass Plat.", translation: "It is (serving) plate." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "plattdrécken",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass plattdrécken (to flatten).",
        examples: ["Wat ass dat?", "Et ass plattdrécken."],
      },
    }
  ],

  "lu-lesson-106": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass presentéieren.", translation: "It is to present." }, { id: "b", text: "Et ass pro.", translation: "It is per." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "presentéieren",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass presentéieren (to present).",
        examples: ["Wat ass dat?", "Et ass presentéieren."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass pro.", translation: "It is per." }, { id: "b", text: "Et ass presentéieren.", translation: "It is to present." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "pro",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass pro (per).",
        examples: ["Wat ass dat?", "Et ass pro."],
      },
    }
  ],

  "lu-lesson-107": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Reklamm.", translation: "It is advertisement." }, { id: "b", text: "Et ass relativ.", translation: "It is relatively." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Reklamm",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Reklamm (advertisement).",
        examples: ["Wat ass dat?", "Et ass Reklamm."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass relativ.", translation: "It is relatively." }, { id: "b", text: "Et ass Reklamm.", translation: "It is advertisement." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "relativ",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass relativ (relatively).",
        examples: ["Wat ass dat?", "Et ass relativ."],
      },
    }
  ],

  "lu-lesson-108": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass richteg.", translation: "It is correct." }, { id: "b", text: "Et ass Saach.", translation: "It is thing." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "richteg",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass richteg (correct).",
        examples: ["Wat ass dat?", "Et ass richteg."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Saach.", translation: "It is thing." }, { id: "b", text: "Et ass richteg.", translation: "It is correct." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Saach",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Saach (thing).",
        examples: ["Wat ass dat?", "Et ass Saach."],
      },
    }
  ],

  "lu-lesson-109": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass schéin.", translation: "It is beautiful." }, { id: "b", text: "Et ass schick.", translation: "It is chic." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "schéin",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass schéin (beautiful).",
        examples: ["Wat ass dat?", "Et ass schéin."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass schick.", translation: "It is chic." }, { id: "b", text: "Et ass schéin.", translation: "It is beautiful." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "schick",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass schick (chic).",
        examples: ["Wat ass dat?", "Et ass schick."],
      },
    }
  ],

  "lu-lesson-110": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Schwämm.", translation: "It is swimming pool." }, { id: "b", text: "Et ass schwätzen.", translation: "It is to speak." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Schwämm",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Schwämm (swimming pool).",
        examples: ["Wat ass dat?", "Et ass Schwämm."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass schwätzen.", translation: "It is to speak." }, { id: "b", text: "Et ass Schwämm.", translation: "It is swimming pool." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "schwätzen",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass schwätzen (to speak).",
        examples: ["Wat ass dat?", "Et ass schwätzen."],
      },
    }
  ],

  "lu-lesson-111": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass sinn.", translation: "It is to be." }, { id: "b", text: "Et ass sollen.", translation: "It is should." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "sinn",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass sinn (to be).",
        examples: ["Wat ass dat?", "Et ass sinn."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass sollen.", translation: "It is should." }, { id: "b", text: "Et ass sinn.", translation: "It is to be." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "sollen",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass sollen (should).",
        examples: ["Wat ass dat?", "Et ass sollen."],
      },
    }
  ],

  "lu-lesson-112": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass sprangen.", translation: "It is to jump." }, { id: "b", text: "Et ass Sprooch.", translation: "It is speech." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "sprangen",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass sprangen (to jump).",
        examples: ["Wat ass dat?", "Et ass sprangen."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Sprooch.", translation: "It is speech." }, { id: "b", text: "Et ass sprangen.", translation: "It is to jump." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Sprooch",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Sprooch (speech).",
        examples: ["Wat ass dat?", "Et ass Sprooch."],
      },
    }
  ],

  "lu-lesson-113": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass stoen.", translation: "It is to stand." }, { id: "b", text: "Et ass Stot.", translation: "It is household." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "stoen",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass stoen (to stand).",
        examples: ["Wat ass dat?", "Et ass stoen."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Stot.", translation: "It is household." }, { id: "b", text: "Et ass stoen.", translation: "It is to stand." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Stot",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Stot (household).",
        examples: ["Wat ass dat?", "Et ass Stot."],
      },
    }
  ],

  "lu-lesson-114": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Taass.", translation: "It is cup." }, { id: "b", text: "Et ass tanken.", translation: "It is to fill up with." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Taass",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Taass (cup).",
        examples: ["Wat ass dat?", "Et ass Taass."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass tanken.", translation: "It is to fill up with." }, { id: "b", text: "Et ass Taass.", translation: "It is cup." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "tanken",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass tanken (to fill up with).",
        examples: ["Wat ass dat?", "Et ass tanken."],
      },
    }
  ],

  "lu-lesson-115": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Thermometer.", translation: "It is thermometer." }, { id: "b", text: "Et ass Timber.", translation: "It is (postage) stamp." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Thermometer",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Thermometer (thermometer).",
        examples: ["Wat ass dat?", "Et ass Thermometer."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Timber.", translation: "It is (postage) stamp." }, { id: "b", text: "Et ass Thermometer.", translation: "It is thermometer." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Timber",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Timber ((postage) stamp).",
        examples: ["Wat ass dat?", "Et ass Timber."],
      },
    }
  ],

  "lu-lesson-116": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Tut.", translation: "It is bag." }, { id: "b", text: "Et ass Ueleg.", translation: "It is oil." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Tut",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Tut (bag).",
        examples: ["Wat ass dat?", "Et ass Tut."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Ueleg.", translation: "It is oil." }, { id: "b", text: "Et ass Tut.", translation: "It is bag." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Ueleg",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Ueleg (oil).",
        examples: ["Wat ass dat?", "Et ass Ueleg."],
      },
    }
  ],

  "lu-lesson-117": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Vakanz.", translation: "It is holiday(s)." }, { id: "b", text: "Et ass Véierel.", translation: "It is quarter." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Vakanz",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Vakanz (holiday(s)).",
        examples: ["Wat ass dat?", "Et ass Vakanz."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass Véierel.", translation: "It is quarter." }, { id: "b", text: "Et ass Vakanz.", translation: "It is holiday(s)." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "Véierel",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass Véierel (quarter).",
        examples: ["Wat ass dat?", "Et ass Véierel."],
      },
    }
  ],

  "lu-lesson-118": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass vir.", translation: "It is to." }, { id: "b", text: "Et ass virdrun.", translation: "It is in front." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "vir",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass vir (to).",
        examples: ["Wat ass dat?", "Et ass vir."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass virdrun.", translation: "It is in front." }, { id: "b", text: "Et ass vir.", translation: "It is to." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "virdrun",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass virdrun (in front).",
        examples: ["Wat ass dat?", "Et ass virdrun."],
      },
    }
  ],

  "lu-lesson-119": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass wäit.", translation: "It is long." }, { id: "b", text: "Et ass wannechgelift.", translation: "It is please." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "wäit",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass wäit (long).",
        examples: ["Wat ass dat?", "Et ass wäit."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass wannechgelift.", translation: "It is please." }, { id: "b", text: "Et ass wäit.", translation: "It is long." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "wannechgelift",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass wannechgelift (please).",
        examples: ["Wat ass dat?", "Et ass wannechgelift."],
      },
    }
  ],

  "lu-lesson-120": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass wéi.", translation: "It is how." }, { id: "b", text: "Et ass wéini.", translation: "It is when." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "wéi",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass wéi (how).",
        examples: ["Wat ass dat?", "Et ass wéi."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass wéi.", translation: "It is wéi." }, { id: "b", text: "Et ass wéini.", translation: "It is when." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "wéi",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass wéi (wéi).",
        examples: ["Wat ass dat?", "Et ass wéi."],
      },
    }
  ],

  "lu-lesson-121": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass wiem.", translation: "It is who." }, { id: "b", text: "Et ass wien.", translation: "It is who." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "wiem",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass wiem (who).",
        examples: ["Wat ass dat?", "Et ass wiem."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass wien.", translation: "It is who." }, { id: "b", text: "Et ass wiem.", translation: "It is who." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "wien",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass wien (who).",
        examples: ["Wat ass dat?", "Et ass wien."],
      },
    }
  ],

  "lu-lesson-122": [
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass zanter.", translation: "It is zanter." }, { id: "b", text: "Et ass zeideg.", translation: "It is ripe." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "zanter",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass zanter (zanter).",
        examples: ["Wat ass dat?", "Et ass zanter."],
      },
    },
    {
      prompt: "Wat ass dat?",
      promptTranslation: "What is that?",
      options: [{ id: "a", text: "Et ass zeideg.", translation: "It is ripe." }, { id: "b", text: "Et ass zanter.", translation: "It is zanter." }],
      correctOptionId: "a",
      explain: {
        highlightWord: "zeideg",
        meaning: "When asked \"Wat ass dat?\", answer with Et ass zeideg (ripe).",
        examples: ["Wat ass dat?", "Et ass zeideg."],
      },
    }
  ]
};
