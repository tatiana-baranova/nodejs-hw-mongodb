const parseContactType = (type) => {
    if (['work', 'home', 'personal'].includes(type)) return type;

};
const parseIsFavourite = (isFavourite) => {
    if (!['true', 'false'].includes(isFavourite)) return undefined;

    return isFavourite === 'true' ? true : false;
};

export const parseFilterParams = (query) => {
    const { type, isFavourite } = query;
    
    const parsedContactType = parseContactType(type);
    const parsedIsFavourite = parseIsFavourite(isFavourite);
    return {
        type: parsedContactType,
        isFavourite: parsedIsFavourite,
    };
    };

