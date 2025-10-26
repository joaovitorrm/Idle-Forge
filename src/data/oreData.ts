const oreTypes = {
    "copper": {
        head: {
            name: "Copper",
            damageCut: 6,
            damageImpact: 5,
            durability: 120,
            weight: 1.5,
            special: "Maleável, fácil de moldar, não muito resistente"
        },
        handle: {
            name: "Copper",
            damageCutMultiplier: 1.0,
            damageImpactMultiplier: 1.0,
            durabilityMultiplier: 1.0,
            weight: 1,
            special: "Conduz eletricidade, não muito leve"
        },
        union: {
            name: "Copper",
            damageCutMultiplier: 1.0,
            damageImpactMultiplier: 1.0,
            durabilityMultiplier: 0.9,
            weight: 0.5,
            special: "Solda bem com outros metais"
        }
    },
    "iron": {
        head: {
            name: "Iron",
            damageCut: 8,
            damageImpact: 10,
            durability: 250,
            weight: 2,
            special: "Versátil, confiável para lâminas e pontas"
        },
        handle: {
            name: "Iron",
            damageCutMultiplier: 1.05,
            damageImpactMultiplier: 1.1,
            durabilityMultiplier: 1.1,
            weight: 1.8,
            special: "Mais pesado, resistente a impacto"
        },
        union: {
            name: "Iron",
            damageCutMultiplier: 1.0,
            damageImpactMultiplier: 1.05,
            durabilityMultiplier: 1.05,
            weight: 1,
            special: "Fácil de forjar e soldar"
        }
    },
    "gold": {
        head: {
            name: "Gold",
            damageCut: 6,
            damageImpact: 5,
            durability: 150,
            weight: 2,
            special: "Maleável, não enferruja, aumenta valor"
        },
        handle: {
            name: "Gold",
            damageCutMultiplier: 1.0,
            damageImpactMultiplier: 1.0,
            durabilityMultiplier: 1.0,
            weight: 1.5,
            special: "Luxuoso, condução de magia"
        },
        union: {
            name: "Gold",
            damageCutMultiplier: 1.0,
            damageImpactMultiplier: 1.0,
            durabilityMultiplier: 1.0,
            weight: 0.5,
            special: "Excelente para ornamentos"
        }
    },
    "bronze": {
        head: {
            name: "Bronze",
            damageCut: 7,
            damageImpact: 6,
            durability: 200,
            weight: 1.8,
            special: "Mais resistente que cobre, fácil de moldar"
        },
        handle: {
            name: "Bronze",
            damageCutMultiplier: 1.0,
            damageImpactMultiplier: 1.0,
            durabilityMultiplier: 1.05,
            weight: 1.2,
            special: "Leve, resistente a desgaste"
        },
        union: {
            name: "Bronze",
            damageCutMultiplier: 1.0,
            damageImpactMultiplier: 1.0,
            durabilityMultiplier: 1.05,
            weight: 0.5,
            special: "Boa ligação entre partes"
        }
    },
    "steel": {
        head: {
            name: "Steel",
            damageCut: 12,
            damageImpact: 15,
            durability: 400,
            weight: 2.2,
            special: "Muito versátil, ótimo equilíbrio"
        },
        handle: {
            name: "Steel",
            damageCutMultiplier: 1.05,
            damageImpactMultiplier: 1.05,
            durabilityMultiplier: 1.1,
            weight: 2,
            special: "Resistente e firme"
        },
        union: {
            name: "Steel",
            damageCutMultiplier: 1.0,
            damageImpactMultiplier: 1.05,
            durabilityMultiplier: 1.1,
            weight: 1,
            special: "Alta durabilidade"
        }
    },
    "quartz": {
        head: { name: "Quartz", damageCut: 5, damageImpact: 4, durability: 80, weight: 1, special: "Pode formar lâminas afiadas, frágil" },
        handle: { name: "Quartz", damageCutMultiplier: 0.95, damageImpactMultiplier: 0.95, durabilityMultiplier: 0.9, weight: 0.8, special: "Frágil, decorativo" },
        union: { name: "Quartz", damageCutMultiplier: 0.9, damageImpactMultiplier: 0.9, durabilityMultiplier: 0.85, weight: 0.5, special: "Frágil, apenas para encaixe leve" }
    },
    "topaz": {
        head: { name: "Topaz", damageCut: 12, damageImpact: 10, durability: 300, weight: 1.5, special: "Resistente ao desgaste, bom para armas afiadas" },
        handle: { name: "Topaz", damageCutMultiplier: 1.05, damageImpactMultiplier: 1.05, durabilityMultiplier: 1.05, weight: 1.2, special: "Leve e resistente" },
        union: { name: "Topaz", damageCutMultiplier: 1.0, damageImpactMultiplier: 1.0, durabilityMultiplier: 1.0, weight: 0.5, special: "Mantém estabilidade" }
    },
    "ruby": {
        head: { name: "Ruby", damageCut: 15, damageImpact: 12, durability: 350, weight: 1.5, special: "Perfura armaduras leves" },
        handle: { name: "Ruby", damageCutMultiplier: 1.05, damageImpactMultiplier: 1.05, durabilityMultiplier: 1.05, weight: 1.2, special: "Resistente a impactos" },
        union: { name: "Ruby", damageCutMultiplier: 1.0, damageImpactMultiplier: 1.0, durabilityMultiplier: 1.0, weight: 0.5, special: "Mantém a arma firme" }
    },
    "emerald": {
        head: { name: "Emerald", damageCut: 14, damageImpact: 11, durability: 320, weight: 1.5, special: "Dano extra contra criaturas místicas" },
        handle: { name: "Emerald", damageCutMultiplier: 1.05, damageImpactMultiplier: 1.05, durabilityMultiplier: 1.05, weight: 1.2, special: "Boa empunhadura" },
        union: { name: "Emerald", damageCutMultiplier: 1.0, damageImpactMultiplier: 1.0, durabilityMultiplier: 1.0, weight: 0.5, special: "Estável" }
    },
    "sapphire": {
        head: { name: "Sapphire", damageCut: 16, damageImpact: 13, durability: 370, weight: 1.5, special: "Resistente ao calor e fogo" },
        handle: { name: "Sapphire", damageCutMultiplier: 1.05, damageImpactMultiplier: 1.05, durabilityMultiplier: 1.05, weight: 1.2, special: "Leve e resistente" },
        union: { name: "Sapphire", damageCutMultiplier: 1.0, damageImpactMultiplier: 1.0, durabilityMultiplier: 1.0, weight: 0.5, special: "Mantém firme, resistente ao calor" }
    },
    "diamond": {
        head: { name: "Diamond", damageCut: 25, damageImpact: 20, durability: 1000, weight: 1, special: "O mais duro, corta quase tudo" },
        handle: { name: "Diamond", damageCutMultiplier: 1.05, damageImpactMultiplier: 1.05, durabilityMultiplier: 1.05, weight: 1, special: "Muito resistente, mas frágil lateralmente" },
        union: { name: "Diamond", damageCutMultiplier: 1.0, damageImpactMultiplier: 1.0, durabilityMultiplier: 1.0, weight: 0.5, special: "Difícil de unir, mas extremamente forte" }
    },
    "mithril": {
        head: { name: "Mithril", damageCut: 20, damageImpact: 18, durability: 800, weight: 0.8, special: "Leve e resistente, lendário" },
        handle: { name: "Mithril", damageCutMultiplier: 1.05, damageImpactMultiplier: 1.05, durabilityMultiplier: 1.1, weight: 0.7, special: "Melhora manuseio e durabilidade" },
        union: { name: "Mithril", damageCutMultiplier: 1.0, damageImpactMultiplier: 1.0, durabilityMultiplier: 1.05, weight: 0.3, special: "Mantém firme e leve" }
    },
    "adamantium": {
        head: { name: "Adamantium", damageCut: 30, damageImpact: 28, durability: 1200, weight: 1.5, special: "Extremamente resistente, lendário" },
        handle: { name: "Adamantium", damageCutMultiplier: 1.05, damageImpactMultiplier: 1.05, durabilityMultiplier: 1.05, weight: 1.2, special: "Firme e estável" },
        union: { name: "Adamantium", damageCutMultiplier: 1.0, damageImpactMultiplier: 1.0, durabilityMultiplier: 1.0, weight: 0.5, special: "Mantém força máxima" }
    },
    "obsidian": {
        head: { name: "Obsidian", damageCut: 18, damageImpact: 10, durability: 70, weight: 1, special: "Muito afiado, mas frágil" },
        handle: { name: "Obsidian", damageCutMultiplier: 0.95, damageImpactMultiplier: 0.95, durabilityMultiplier: 0.9, weight: 0.8, special: "Decorativo, empunhadura frágil" },
        union: { name: "Obsidian", damageCutMultiplier: 0.9, damageImpactMultiplier: 0.9, durabilityMultiplier: 0.85, weight: 0.5, special: "Frágil, apenas para encaixe leve" }
    },
    "amethyst": {
        head: { name: "Amethyst", damageCut: 14, damageImpact: 12, durability: 200, weight: 1.3, special: "Raro, Head mágico" },
        handle: { name: "Amethyst", damageCutMultiplier: 1.05, damageImpactMultiplier: 1.05, durabilityMultiplier: 1.05, weight: 1, special: "Bônus mágico leve" },
        union: { name: "Amethyst", damageCutMultiplier: 1.0, damageImpactMultiplier: 1.0, durabilityMultiplier: 1.0, weight: 0.5, special: "Mantém estabilidade e magia" }
    },
    "garnet": {
        head: { name: "Garnet", damageCut: 12, damageImpact: 10, durability: 220, weight: 1.3, special: "Duro, mas não tão resistente quanto Ruby" },
        handle: { name: "Garnet", damageCutMultiplier: 1.05, damageImpactMultiplier: 1.05, durabilityMultiplier: 1.05, weight: 1, special: "Empunhadura estável" },
        union: { name: "Garnet", damageCutMultiplier: 1.0, damageImpactMultiplier: 1.0, durabilityMultiplier: 1.0, weight: 0.5, special: "Mantém firme" }
    },
    "dragonbone": {
        head: { name: "Dragonbone", damageCut: 18, damageImpact: 20, durability: 500, weight: 1, special: "Leve, resistente, lendário" },
        handle: { name: "Dragonbone", damageCutMultiplier: 1.05, damageImpactMultiplier: 1.05, durabilityMultiplier: 1.05, weight: 0.8, special: "Melhora manuseio e durabilidade" },
        union: { name: "Dragonbone", damageCutMultiplier: 1.0, damageImpactMultiplier: 1.0, durabilityMultiplier: 1.05, weight: 0.3, special: "Firme e leve" }
    },
    "soulstone": {
        head: { name: "Soulstone", damageCut: 16, damageImpact: 14, durability: 400, weight: 1.2, special: "Aplica efeitos mágicos" },
        handle: { name: "Soulstone", damageCutMultiplier: 1.05, damageImpactMultiplier: 1.05, durabilityMultiplier: 1.05, weight: 1, special: "Amplifica magia da Head" },
        union: { name: "Soulstone", damageCutMultiplier: 1.0, damageImpactMultiplier: 1.0, durabilityMultiplier: 1.0, weight: 0.5, special: "Mantém conexão mágica estável" }
    },
    "voidmetal": {
        head: { name: "Voidmetal", damageCut: 28, damageImpact: 25, durability: 1000, weight: 1.5, special: "Resistente a magia, lendário" },
        handle: { name: "Voidmetal", damageCutMultiplier: 1.05, damageImpactMultiplier: 1.05, durabilityMultiplier: 1.05, weight: 1.2, special: "Estável, resistente" },
        union: { name: "Voidmetal", damageCutMultiplier: 1.0, damageImpactMultiplier: 1.0, durabilityMultiplier: 1.0, weight: 0.5, special: "Mantém força máxima e magia" }
    }
}

export default oreTypes;