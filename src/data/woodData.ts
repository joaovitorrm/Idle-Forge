const woods = 
    {
    "oak": {
        "head": {
            "name": "Oak",
            "damageCut": 4,
            "damageImpact": 3,
            "durability": 150,
            "weight": 1.2,
            "special": "Resistente e equilibrada; madeira tradicional usada em armas e estruturas sólidas"
        },
        "handle": {
            "name": "Oak",
            "damageCutMultiplier": 1.0,
            "damageImpactMultiplier": 1.1,
            "durabilityMultiplier": 1.2,
            "weight": 1.0,
            "special": "Boa pegada e absorve bem impactos"
        },
        "union": {
            "name": "Oak",
            "damageCutMultiplier": 1.0,
            "damageImpactMultiplier": 1.0,
            "durabilityMultiplier": 1.1,
            "weight": 0.4,
            "special": "Adere bem a colas e ligas naturais"
        }
    },

    "cedar": {
        "head": {
            "name": "Cedro",
            "damageCut": 3,
            "damageImpact": 2,
            "durability": 100,
            "weight": 0.9,
            "special": "Aromática e resistente à umidade, mas não muito densa"
        },
        "handle": {
            "name": "Cedro",
            "damageCutMultiplier": 0.9,
            "damageImpactMultiplier": 1.0,
            "durabilityMultiplier": 1.3,
            "weight": 0.8,
            "special": "Leve e confortável; reduz fadiga do uso"
        },
        "union": {
            "name": "Cedro",
            "damageCutMultiplier": 1.0,
            "damageImpactMultiplier": 0.9,
            "durabilityMultiplier": 1.1,
            "weight": 0.3,
            "special": "Boa fixação com metais leves"
        }
    },

    "jade": {
        "head": {
            "name": "Jade",
            "damageCut": 7,
            "damageImpact": 6,
            "durability": 180,
            "weight": 1.6,
            "special": "Canaliza energia espiritual; vibra em sintonia com magia elemental"
        },
        "handle": {
            "name": "Jade",
            "damageCutMultiplier": 1.2,
            "damageImpactMultiplier": 1.1,
            "durabilityMultiplier": 1.2,
            "weight": 1.1,
            "special": "Reforça o fluxo mágico do portador"
        },
        "union": {
            "name": "Jade",
            "damageCutMultiplier": 1.1,
            "damageImpactMultiplier": 1.0,
            "durabilityMultiplier": 1.3,
            "weight": 0.5,
            "special": "Une-se harmonicamente a materiais mágicos"
        }
    },

    "bloodwood": {
        "head": {
            "name": "Sangue",
            "damageCut": 8,
            "damageImpact": 5,
            "durability": 200,
            "weight": 1.4,
            "special": "Parece viva; regenera lentamente fissuras e lascas"
        },
        "handle": {
            "name": "Sangue",
            "damageCutMultiplier": 1.1,
            "damageImpactMultiplier": 1.2,
            "durabilityMultiplier": 1.4,
            "weight": 1.0,
            "special": "Transmite vitalidade; aumenta a regeneração do usuário"
        },
        "union": {
            "name": "Sangue",
            "damageCutMultiplier": 1.0,
            "damageImpactMultiplier": 1.0,
            "durabilityMultiplier": 1.5,
            "weight": 0.4,
            "special": "Une-se organicamente, quase como tecido vivo"
        }
    },

    "celestial": {
        "head": {
            "name": "Celestial",
            "damageCut": 9,
            "damageImpact": 7,
            "durability": 250,
            "weight": 1.3,
            "special": "Imbuída de luz divina; causa dano sagrado e repele corrupção"
        },
        "handle": {
            "name": "Celestial",
            "damageCutMultiplier": 1.3,
            "damageImpactMultiplier": 1.1,
            "durabilityMultiplier": 1.5,
            "weight": 1.0,
            "special": "Leve e equilibrada, perfeita para portadores abençoados"
        },
        "union": {
            "name": "Celestial",
            "damageCutMultiplier": 1.2,
            "damageImpactMultiplier": 1.0,
            "durabilityMultiplier": 1.4,
            "weight": 0.4,
            "special": "Reflete magia sombria; une-se com pureza"
        }
    },

    "worldwood": {
        "head": {
            "name": "Madeira do Mundo",
            "damageCut": 10,
            "damageImpact": 9,
            "durability": 300,
            "weight": 1.5,
            "special": "Fonte de toda vida vegetal; indestrutível e autorregenerativa"
        },
        "handle": {
            "name": "Madeira do Mundo",
            "damageCutMultiplier": 1.4,
            "damageImpactMultiplier": 1.4,
            "durabilityMultiplier": 1.8,
            "weight": 1.1,
            "special": "Equilibra perfeitamente força e harmonia"
        },
        "union": {
            "name": "Madeira do Mundo",
            "damageCutMultiplier": 1.5,
            "damageImpactMultiplier": 1.3,
            "durabilityMultiplier": 2.0,
            "weight": 0.5,
            "special": "Liga-se a qualquer material com perfeição natural"
        }
    },

    "stellar": {
        "head": {
            "name": "Estelar",
            "damageCut": 11,
            "damageImpact": 8,
            "durability": 320,
            "weight": 1.0,
            "special": "Brilha com energia cósmica; corta até matéria etérea"
        },
        "handle": {
            "name": "Estelar",
            "damageCutMultiplier": 1.6,
            "damageImpactMultiplier": 1.2,
            "durabilityMultiplier": 1.7,
            "weight": 0.9,
            "special": "Canaliza poder astral, leve como o ar"
        },
        "union": {
            "name": "Estelar",
            "damageCutMultiplier": 1.5,
            "damageImpactMultiplier": 1.2,
            "durabilityMultiplier": 1.8,
            "weight": 0.4,
            "special": "Funde-se através de energia gravitacional, sem cola ou solda"
        }
    }
}

export default woods;