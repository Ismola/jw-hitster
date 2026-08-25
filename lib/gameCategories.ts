export type GameCategory = 'all' | 'people' | 'kings' | 'bibleBooks' | 'worldPowers';

interface CategorizedItem {
    event: { es: string; en: string };
}

const categoryPatterns: Record<Exclude<GameCategory, 'all'>, RegExp> = {
    people: /nacimiento|muerte|birth|death|decapitado|beheaded|resurrección|resurrection/i,
    kings: /\brey\b|\breina\b|\breino\b|trono|ungimiento|toma el lugar|\bking\b|\bqueen\b|\bkingdom\b|throne|anointing|succeeds/i,
    bibleBooks: /escri(?:be|tura)|completa.*(?:génesis|éxodo|levítico|números|deuteronomio|job|josué|jueces|rut|samuel|reyes|cantares|eclesiastés|proverbios|jonás|joel|amós|oseas|isaías|miqueas|sofonías|nahúm|habacuc|lamentaciones|abdías|ezequiel|jeremías|daniel|ageo|zacarías|ester|crónicas|esdras|salmos|nehemías|malaquías|mateo|tesalonicenses|gálatas|corintios|romanos|lucas|efesios|filipenses|colosenses|filemón|santiago|marcos|hebreos|hechos|timoteo|tito|pedro|judas|revelación|juan)|writes?|writing|completes? writing|bible is completed/i,
    worldPowers: /potencia mundial|world power|imperio|empire/i,
};

export function matchesGameCategory(item: CategorizedItem, category: GameCategory) {
    if (category === 'all') return true;
    const searchableText = `${item.event.es} ${item.event.en}`;
    return categoryPatterns[category].test(searchableText);
}
